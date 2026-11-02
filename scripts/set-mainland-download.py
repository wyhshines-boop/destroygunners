#!/usr/bin/env python3
"""Register a public APK's 123 direct URL, checking size and ZIP header without downloading it."""
import argparse
import hashlib
import json
import re
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--apk', required=True, help='Published site URL, e.g. /downloads/DGunsZZ_3.0.0c.apk?build=118')
p.add_argument('--url', required=True, help='Permanent HTTPS direct link copied from 123 Cloud Drive')
a = p.parse_args()
if not re.fullmatch(r'/downloads/[A-Za-z0-9_.-]+\.apk(?:\?build=\d+)?', a.apk):
    p.error('Expected a public /downloads/*.apk URL with optional ?build=N')
u = urlsplit(a.url)
if u.scheme != 'https' or not u.hostname or u.username or u.password or u.fragment:
    p.error('Expected a public HTTPS direct download URL')
apk = ROOT / 'public' / a.apk.split('?', 1)[0].lstrip('/')
if not apk.is_file():
    p.error('Publish the matching APK in public/downloads first')
size = apk.stat().st_size
with tempfile.TemporaryDirectory() as tmp:
    headers, body = Path(tmp) / 'headers', Path(tmp) / 'body'
    subprocess.run(['curl', '--fail', '--silent', '--show-error', '--location',
        '--proto', '=https', '--proto-redir', '=https', '--max-time', '20',
        '--range', '0-3', '--max-filesize', '4', '-D', str(headers), '-o', str(body), a.url], check=True)
    raw = headers.read_text()
    totals = re.findall(r'(?im)^content-range:\s*bytes 0-3/(\d+)', raw)
    if body.read_bytes() != b'PK\x03\x04':
        raise SystemExit('The link did not return an APK/ZIP file')
    if not totals or int(totals[-1]) != size:
        raise SystemExit('Remote size does not match the published APK')
record = {'apk': a.apk, 'url': a.url, 'sha256': hashlib.sha256(apk.read_bytes()).hexdigest(), 'bytes': size}
path = ROOT / 'src/data/mainland-downloads.json'
entries = json.loads(path.read_text())
entries = [e for e in entries if e['apk'] != a.apk] + [record]
path.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + '\n')
print('Registered China mainland mirror for ' + a.apk)
