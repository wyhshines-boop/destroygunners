from pathlib import Path
import json
web=Path(__file__).resolve().parents[2];source=web/'../dgzz_model_research/pose_20261104_100831/export_rd10/rd10.obj'
base=json.loads((web/'src/data/da01-parts.json').read_text());bybone={int(p['file'][:2]):p for p in base}
# These groups are external-shape references, not engineered assembly boundaries.
spec=[('head','头部','Head','頭部',[3,4]),('torso','胸腹','Torso','胴体',[2]),('pelvis','腰胯','Pelvis','腰部',[1,29]),('left-upper-arm','左上臂','Left upper arm','左上腕',[5,6]),('left-forearm','左前臂与手部','Left forearm and hand','左前腕・手',[7,8,9]),('right-upper-arm','右上臂','Right upper arm','右上腕',[10,11]),('right-forearm','右前臂与武器','Right forearm and weapon','右前腕・武器',[12,13,14]),('left-thigh','左大腿','Left thigh','左大腿',[19,20]),('left-shin','左小腿','Left shin','左下腿',[21,22]),('left-foot','左脚','Left foot','左足',[23]),('right-thigh','右大腿','Right thigh','右大腿',[24,25]),('right-shin','右小腿','Right shin','右下腿',[26,27]),('right-foot','右脚','Right foot','右足',[28]),('backpack','背包','Backpack','バックパック',[30,31,32,33,34,35]),('cannon','炮组','Cannon','キャノン',[15,16,17])]
verts=[];faces={};bone=0
for line in source.read_text().splitlines():
 p=line.split()
 if not p:continue
 if p[0]=='v':verts.append(list(map(float,p[1:4])))
 elif p[0]=='g':bone=int(p[1].rsplit('_',1)[1])
 elif p[0]=='f':faces.setdefault(bone,[]).append([int(x.split('/')[0])-1 for x in p[1:]])
lo=[min(v[i] for v in verts) for i in range(3)];hi=[max(v[i] for v in verts) for i in range(3)];factor=120/(hi[2]-lo[2]);vs=[[v*factor for v in xyz] for xyz in verts]
rows=[]
for id,zh,en,ja,bones in spec:
 fs=[f for b in bones for f in faces[b]];points=[vs[i] for f in fs for i in f];low=[min(v[i] for v in points) for i in range(3)];high=[max(v[i] for v in points) for i in range(3)];mid=[(a+b)/2 for a,b in zip(low,high)]
 paths={}
 for name,axis,sign,depth in [('front',0,-1,1),('side',1,1,0)]:
  # Back-to-front orthographic surface projection; no perspective distortion.
  order=sorted(fs,key=lambda f:sum(vs[i][depth] for i in f)/len(f))
  paths[name]=['M'+' L'.join(f'{(vs[i][axis]-mid[axis])*sign*1.5:.3f},{(high[2]-vs[i][2])*1.5:.3f}' for i in f)+' Z' for f in order]
 rows.append({'file':id,'zh':zh,'en':en,'original_name':ja,'files':[bybone[b]['file'] for b in bones],'size_mm':[round(b-a,2) for a,b in zip(low,high)],'non_manifold_edges':0,'paths':paths})
assert sorted(x for r in rows for x in r['files'])==sorted(p['file'] for p in base)
(web/'src/data/da01-handcraft.json').write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':'))+'\n')
print('Built',len(rows),'modules covering all',len(base),'source parts')
