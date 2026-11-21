# Makes the self-extracting small copy of the player file: the whole game is squeezed with Zopfli (a slower, tighter
# gzip squeezer), stored inside a tiny page as text, and the browser's own built-in unzipper (DecompressionStream)
# unpacks it the moment the page opens. Usage: pack.py in.html out.html
import sys, base64, zopfli.gzip
src, dst = sys.argv[1], sys.argv[2]
raw = open(src, 'rb').read()
gz = zopfli.gzip.compress(raw, numiterations=60)
b64 = base64.b64encode(gz).decode()
load = ('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Apple Press</title>'
        '<body style="margin:0;background:#fff7f0;font:16px system-ui,sans-serif"><p id=m style="padding:24px">Opening Apple Press…</p>'
        '<script>(async()=>{try{var a=atob("' + b64 + '"),u=new Uint8Array(a.length);for(var i=0;i<a.length;i++)u[i]=a.charCodeAt(i);'
        'var t=await new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("gzip"))).text();document.open();document.write(t);document.close()}'
        'catch(e){document.getElementById("m").textContent="This small copy needs a browser updated since 2023. Please use the regular apple-press.html file instead."}})()</script>')
hdr = open(__file__.rsplit('/', 1)[0] + '/lfc-header.txt', encoding='utf-8').read().rstrip('\n')
load = load.replace('<!doctype html>', '<!doctype html>\n' + hdr + '\n', 1)   # (the notice sits in the stub, outside the squeezed game)
open(dst, 'w', encoding='utf-8').write(load)
print('small copy: %d -> %d bytes (%d%% of the player copy)' % (len(raw), len(load), round(100 * len(load) / len(raw))))
