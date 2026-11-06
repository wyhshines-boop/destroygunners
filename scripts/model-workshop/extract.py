"""Build static multipart GLBs from captured PSCa transforms, preserving every visible face."""
from pathlib import Path
import struct,json,math,io
from collections import Counter
from PIL import Image
WEB=Path(__file__).resolve().parents[2];D=WEB.parent/'dgzz_model_research';OUT=WEB/'public/workshop';OUT.mkdir(exist_ok=True)
CATALOG=json.loads((WEB/'src/data/models.json').read_text())
BATCH=json.loads((D/'batch_validated/index.json').read_text())
SOURCES=[('rd10','rd10',CATALOG[0]['name'],D/'pose_20261104_100831/pose_0.json',CATALOG[0]['id'])]
for number,item in enumerate(BATCH,2):
 asset='rd04' if number==2 else 'rd12' if number==3 else CATALOG[number-1]['id']
 SOURCES.append((asset,item['model'],CATALOG[number-1]['name'],Path(item['folder'])/('pose_'+str(item['index'])+'.json'),CATALOG[number-1]['id']))

def category(n):
 if '頭' in n:return 'head'
 if any(k in n for k in ['腕','ブレード','肩武装']):return 'leftArm' if '左' in n else 'rightArm'
 if any(k in n for k in ['股','歩行','脚','足']):return 'leftLeg' if '左' in n else 'rightLeg'
 if any(k in n for k in ['背','バック','ブースタ','スラスター','跳躍','キャノン','ミサイル','レーザー','ライフル']):return 'back'
 return 'torso'
def inverse(a):
 a,b,c,d,e,f,g,h,i=a[0],a[4],a[8],a[1],a[5],a[9],a[2],a[6],a[10]
 co=[e*i-f*h,c*h-b*i,b*f-c*e,f*g-d*i,a*i-c*g,c*d-a*f,d*h-e*g,b*g-a*h,a*e-b*d];det=a*co[0]+b*co[3]+c*co[6];assert abs(det)>1e-8
 return [x/det for x in co]
def run(asset,id,label,path,original_id):
 pose=json.loads(path.read_text());header=path.with_name('header_'+str(pose['index'])+'.bin').read_bytes()
 candidates=[p for p in (D/'psca').glob('*.bin') if p.read_bytes()[:0x3c]==header[:0x3c]]
 data=next(p.read_bytes() for p in candidates if p.read_bytes()[struct.unpack_from('<I',p.read_bytes(),0x44)[0]:].split(b'\0')[0].decode()==id)
 u32=lambda at:struct.unpack_from('<I',data,at)[0];base=u32(0x40);table=u32(0x3c)
 names=[data[u32(table+4*i):].split(b'\0')[0].decode('cp932','replace') for i in range(data[4])]
 mats=[x['matrix'] for x in pose['parts']];root=mats[0];inv=inverse(root)
 def to_local(v):
  a=[sum(inv[r*3+j]*v[j] for j in range(3)) for r in range(3)];return [a[0],a[2],-a[1]]
 def position(bone,v):
  m=mats[bone];return to_local([sum(m[j*4+i]*v[j] for j in range(3))+m[12+i]-root[12+i] for i in range(3)])
 def normal(bone,v):
  m=mats[bone];a=to_local([sum(m[j*4+i]*v[j] for j in range(3)) for i in range(3)]);l=math.sqrt(sum(x*x for x in a));return [x/l for x in a] if l else [0,1,0]
 part=u32(0x48+4*pose.get('mesh_slot',0));nv,nf=struct.unpack_from('<HH',data,part);vo=base+u32(part+0x18);fo=base+u32(part+0x20);uo=base+u32(part+0x28);no=base+u32(part+0x2c)
 groups={};visible=0;mixed=0
 for face in range(nf):
  row=struct.unpack_from('<15H',data,fo+30*face);idx=row[:4];count=3 if idx[2]==idx[3] else 4;mat=row[7]
  if row[4]&0x20 or len(set(idx[:count]))<3 or mat>=32768:continue
  desc=struct.unpack_from('<10H',data,uo+20*mat);slot=desc[9]>>14
  vertices=[struct.unpack_from('<BB3h',data,vo+idx[j]*8) for j in range(count)];cats=[category(names[v[1]]) for v in vertices];cat=Counter(cats).most_common(1)[0][0];mixed+=int(len(set(cats))>1)
  g=groups.setdefault((cat,slot),{'p':[],'n':[],'uv':[],'bones':set()})
  for tri in [(0,1,2)]+([(0,2,3)] if count==4 else []):
   for j in tri:
    v=vertices[j];bone=v[1];assert bone<len(mats);g['bones'].add(bone);g['p']+=position(bone,[x/4096 for x in v[2:]]);g['n']+=normal(bone,struct.unpack_from('<3f',data,no+row[11+j]*12));g['uv']+=[desc[j*2]/16384,desc[j*2+1]/16384]
   visible+=1
 # Common scale, preserving proportions and native local joint coordinates.
 ys=[g['p'][i] for g in groups.values() for i in range(1,len(g['p']),3)];scale=3/(max(ys)-min(ys));anchors={}
 for cat in ['head','torso','leftArm','rightArm','leftLeg','rightLeg','back']:
  bone=next((i for i,n in enumerate(names[:len(mats)]) if i>0 and category(n)==cat),0)
  anchors[cat]=[x*scale for x in position(bone,[0,0,0])] if cat!='torso' else [0,0,0]
 gltf={'asset':{'version':'2.0','generator':'DGZZ multipart workshop prototype'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':[{'name':label,'children':[],'extras':{'anchors':anchors,'source':id}}],'meshes':[],'accessors':[],'bufferViews':[],'buffers':[{'byteLength':0}],'images':[],'textures':[],'materials':[],'samplers':[{'magFilter':9729,'minFilter':9987,'wrapS':10497,'wrapT':10497}]};blob=bytearray()
 def view(raw,target=None):
  while len(blob)%4:blob.append(0)
  i=len(gltf['bufferViews']);d={'buffer':0,'byteOffset':len(blob),'byteLength':len(raw)}
  if target:d['target']=target
  gltf['bufferViews'].append(d);blob.extend(raw);return i
 def accessor(values,size):
  assert all(math.isfinite(x) for x in values);v=view(struct.pack('<'+'f'*len(values),*values),34962);a={'bufferView':v,'componentType':5126,'count':len(values)//size,'type':{2:'VEC2',3:'VEC3'}[size]};a['min']=[min(values[j::size]) for j in range(size)];a['max']=[max(values[j::size]) for j in range(size)];gltf['accessors'].append(a);return len(gltf['accessors'])-1
 slots=sorted(set(slot for _,slot in groups));slotmaterials={}
 for slot in slots:
  tex=next(t for t in pose['textures'] if t['slot']==slot)
  # Unbound secondary slots use the captured body atlas, matching published models.
  if tex.get('internal',0)<0:tex=next(t for t in pose['textures'] if t['slot']==0)
  texdir=path.parent/'textures';raw=texdir/f'texture_{tex["id"]}.rgba'
  if raw.exists():
   meta=json.loads(raw.with_suffix('.json').read_text());im=Image.frombytes('RGBA',(meta['width'],meta['height']),raw.read_bytes())
  else:
   candidates=list((path.parent/('export_'+id)).glob(f'texture_slot{tex["slot"]}.png'));assert candidates,(path,slot);im=Image.open(candidates[0])
  out=io.BytesIO();im.save(out,format='PNG');iv=view(out.getvalue());tid=len(gltf['textures']);gltf['images'].append({'bufferView':iv,'mimeType':'image/png'});gltf['textures'].append({'sampler':0,'source':tid});slotmaterials[slot]=len(gltf['materials']);gltf['materials'].append({'name':id+'_texture'+str(slot),'pbrMetallicRoughness':{'baseColorTexture':{'index':tid},'metallicFactor':0,'roughnessFactor':.82},'doubleSided':False})
 for (cat,slot),g in groups.items():
  anchor=anchors[cat];positions=[v*scale-anchor[i%3] for i,v in enumerate(g['p'])];mesh={'name':cat,'primitives':[{'attributes':{'POSITION':accessor(positions,3),'NORMAL':accessor(g['n'],3),'TEXCOORD_0':accessor(g['uv'],2)},'material':slotmaterials[slot]}]};gltf['meshes'].append(mesh);gltf['nodes'][0]['children'].append(len(gltf['nodes']));gltf['nodes'].append({'name':cat,'mesh':len(gltf['meshes'])-1,'translation':anchor,'extras':{'part':cat,'sourceBones':[names[i] for i in sorted(g['bones'])]}})
 gltf['buffers'][0]['byteLength']=len(blob);j=json.dumps(gltf,separators=(',',':'),ensure_ascii=False).encode();j+=b' '*((-len(j))%4);blob+=b'\0'*((-len(blob))%4)
 result=struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(blob))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(blob),0x004e4942)+blob
 (OUT/(asset+'.glb')).write_bytes(result);assert set(c for c,_ in groups)>={'head','torso','leftArm','rightArm','leftLeg','rightLeg'}, (asset,names,sorted(groups))
 print(id,label,visible,'triangles',len(groups),'groups','cross-part faces',mixed)
 return {'id':asset,'originalId':original_id,'name':label,'url':'/workshop/'+asset+'.glb','triangles':visible,'anchors':anchors,'parts':sorted(set(c for c,_ in groups))}
models=[run(*s) for s in SOURCES];(WEB/'src/data/workshop.json').write_text(json.dumps(models,ensure_ascii=False,indent=2)+'\n')
