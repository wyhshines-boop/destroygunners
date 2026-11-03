#!/usr/bin/env python3
"""Upload one test APK to R2 and replace the fixed admin download entry."""
import argparse,hashlib,json,subprocess
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo

ROOT=Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser(description=__doc__)
p.add_argument('--apk',required=True,type=Path)
p.add_argument('--build',required=True,type=int)
p.add_argument('--title',required=True)
p.add_argument('--notes',required=True)
p.add_argument('--version',default='3.0.0c')
a=p.parse_args();file=a.apk.resolve()
if not file.is_file() or file.suffix.lower()!='.apk':p.error('Expected an APK file')
blob=file.read_bytes()
if blob[:4]!=b'PK\x03\x04':p.error('Expected an APK/ZIP archive')
sha=hashlib.sha256(blob).hexdigest();path='/downloads/'+file.name;key='apk/'+sha+'/'+file.name
m=json.loads((ROOT/'src/data/r2-downloads.json').read_text());destination=m['public_url']+'/'+key
upload=['npx','wrangler','r2','object','put',m['bucket']+'/'+key,'--remote','--file',str(file),'--content-type','application/vnd.android.package-archive','--content-disposition','attachment; filename="'+file.name+'"','--cache-control','public, max-age=31536000, immutable']
for attempt in range(2):
 result=subprocess.run(upload,cwd=ROOT)
 if result.returncode==0:break
 if attempt==1:raise SystemExit('R2 upload failed; release entry was not changed')
 print('Retrying the same immutable APK upload…',flush=True)
h=subprocess.run(['curl','-sSI','--max-time','20',destination],capture_output=True,text=True,check=True).stdout.lower()
if 'content-length: '+str(len(blob)) not in h or 'content-type: application/vnd.android.package-archive' not in h:raise SystemExit('Upload metadata check failed; release entry was not changed')
record={'path':path,'key':key,'bytes':len(blob),'sha256':sha}
m['files']=[f for f in m['files'] if f['path']!=path]+[record]
(ROOT/'src/data/r2-downloads.json').write_text(json.dumps(m,indent=2)+'\n')
release={'build':a.build,'version':a.version,'title':a.title,'date':datetime.now(ZoneInfo('Asia/Shanghai')).date().isoformat(),'apk_path':path,'notes':a.notes}
(ROOT/'src/data/test-release.json').write_text(json.dumps(release,ensure_ascii=False,indent=2)+'\n')
fixed='/downloads/DGZZ_test_latest.apk';v=json.loads((ROOT/'vercel.json').read_text())
v['redirects']=[r for r in v['redirects'] if r['source'] not in [path,fixed]]+[{'source':x,'destination':destination,'permanent':False} for x in [path,fixed]]
(ROOT/'vercel.json').write_text(json.dumps(v,indent=2)+'\n')
cf=ROOT/'public/_redirects';lines=[line for line in cf.read_text().splitlines() if line.split(' ',1)[0] not in [path,fixed]]
cf.write_text('\n'.join(lines+[x+' '+destination+' 302' for x in [path,fixed]])+'\n')
print('Latest test entry replaced:',a.build,destination)
print('Run npm run build, then commit and push the release files.')
