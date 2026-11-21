# Puts the LFC Foundry notice (lfc-header.txt, exactly as supplied) at the top of a built page, right after <head>
# (or, with "doctype", right after the doctype line). Does nothing if the page already carries it.
import sys, re
path = sys.argv[1]; mode = sys.argv[2] if len(sys.argv) > 2 else 'head'
hdr = open(__file__.rsplit('/', 1)[0] + '/lfc-header.txt', encoding='utf-8').read().rstrip('\n')
s = open(path, encoding='utf-8').read()
if 'FORGED BY : LFC Foundry' in s:
    sys.exit(0)
if mode == 'doctype':
    m = re.match(r'\s*<!doctype html>', s, re.I)
else:
    m = re.search(r'<head[^>]*>', s, re.I)
if not m:
    sys.exit('lfc_inject: no place to put the notice in ' + path)
s = s[:m.end()] + '\n' + hdr + '\n' + s[m.end():]
open(path, 'w', encoding='utf-8').write(s)
