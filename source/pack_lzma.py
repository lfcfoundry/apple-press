# Makes the second self-extracting copy of the player file: the whole game is squeezed with LZMA (smaller than the gzip small copy) and
# unpacked by the lzma-pack loader, using the 4,087-byte WebAssembly decoder where the browser allows it and the JavaScript decoder otherwise.
# The page's own security rules carry 'wasm-unsafe-eval' (allowed by the owner on 2026-10-17) and worker-src blob: (allowed on 2026-10-19) so the decoder may run.
# The LFC Foundry notice (lfc-header.txt) is put in the stub byte for byte, as UTF-8, after the doctype line.   Usage: pack_lzma.py in.html out.html
import sys, subprocess, os
HERE = os.path.dirname(os.path.abspath(__file__))
src, dst = sys.argv[1], sys.argv[2]
csp = ('<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\' \'wasm-unsafe-eval\'; worker-src blob:; '
       'style-src \'unsafe-inline\'; font-src data:; img-src data:; base-uri \'none\'; form-action \'none\'">')
r = subprocess.run([sys.executable, HERE + '/vendor/lzma-pack/tools/lzma-pack/pack.py', src, dst, '--title', 'Apple Press', '--tune', '--wasm', '--head', csp],
                   capture_output=True, text=True)
if r.returncode: sys.exit(r.stderr or r.stdout)
data = open(dst, 'rb').read()
hdr = open(HERE + '/lfc-header.txt', encoding='utf-8').read().rstrip('\n').encode('utf-8')
tag = b'<!doctype html>'
i = data.lower().find(tag)
if i < 0: sys.exit('pack_lzma: no doctype in the packed page')
i += len(tag)
if b'FORGED BY : LFC Foundry' not in data[:i + len(hdr) + 10]:
    data = data[:i] + b'\n' + hdr + data[i:]
open(dst, 'wb').write(data)
raw = os.path.getsize(src)
print('smallest copy (LZMA + WebAssembly): %d -> %d bytes (%d%% of the player copy)' % (raw, len(data), round(100 * len(data) / raw)))
