const fs = require('fs');
const vm = require('vm');
for (const f of ['apple-press.body.html', 'keepers-light.body.html']) {
  const html = fs.readFileSync(f, 'utf8');
  const scripts = [...html.matchAll(/<script(?![^>]*type=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  scripts.forEach(code => { new vm.Script(code); });
  console.log(f, 'script syntax OK (' + scripts.length + ' script)');
}
// Story graph: every link resolves, every ending reachable with item logic
const html = fs.readFileSync('keepers-light.body.html', 'utf8');
const raw = /<script type="text\/plain" id="story">([\s\S]*?)<\/script>/.exec(html)[1];
const P = {}; let cur = null;
raw.split('\n').forEach(l => {
  const t = l.trim(); if (!t) return;
  const h = /^\[\[(.+?)\]\]$/.exec(t);
  if (h) { cur = P[h[1]] = { choices: [] }; return; }
  if (!cur || !t.startsWith('->')) return;
  const [label, rest] = t.slice(2).split('=>'); const r = rest.split('|').map(s => s.trim());
  const c = { target: r[0], needs: [], unless: [], gives: [] };
  r.slice(1).forEach(o => { const m = /^(needs|unless|gives)\s*:\s*(.+)$/.exec(o); c[m[1]].push(m[2]); });
  cur.choices.push(c);
});
let missing = 0;
Object.entries(P).forEach(([n, p]) => p.choices.forEach(c => { if (!P[c.target]) { console.log('MISSING', n, '->', c.target); missing++; } }));
const seen = new Set(), q = [['start', '']];
while (q.length) {
  const [at, items] = q.pop(); const key = at + '|' + items; if (seen.has(key)) continue; seen.add(key);
  const have = items ? items.split(',') : [];
  P[at].choices.forEach(c => {
    if (!c.needs.every(n => have.includes(n)) || c.unless.some(n => have.includes(n))) return;
    const next = [...new Set([...have, ...c.gives])].sort().join(',');
    q.push([c.target, next]);
  });
}
const reached = new Set([...seen].map(k => k.split('|')[0]));
const endings = Object.keys(P).filter(n => !P[n].choices.length);
console.log('passages:', Object.keys(P).length, 'missing links:', missing);
console.log('unreachable:', Object.keys(P).filter(n => !reached.has(n)));
console.log('endings reachable:', endings.map(e => e + ':' + reached.has(e)).join(' '));
// Stuck check: any reachable state with passages whose visible choices are empty but not an ending
let stuck = 0;
seen.forEach(k => { const [at, items] = k.split('|'); const have = items ? items.split(',') : [];
  if (P[at].choices.length && !P[at].choices.some(c => c.needs.every(n => have.includes(n)) && !c.unless.some(n => have.includes(n)))) { console.log('STUCK', k); stuck++; } });
console.log('stuck states:', stuck);
