// Makes the slimmed-down player copy from the full working copy: removes comments and extra spacing only.
// Also (since Oct 7): fonts cut to the characters the game can show (optfonts.py), inline SVGs tightened (optsvg.js), the game script shortened (terser). NOOPT=fonts,svg,js turns steps off.
const fs = require('fs');
const { minify } = require('html-minifier-terser');
const css = require('lightningcss');
const [src, dst] = process.argv.slice(2);
(async () => {
  const { execFileSync } = require('child_process');
const { minify: terserMin } = require('terser');
const tmp = '/tmp/claude-0/slim-' + process.pid;
const NOOPT = process.env.NOOPT || '';   // e.g. NOOPT=fonts,svg,js turns steps off (for finding which step broke something)
let pre = fs.readFileSync(src, 'utf8').replace(/\/\*TESTREC-START\*\/[\s\S]*?\/\*TESTREC-END\*\//g, '');
if (!/fonts/.test(NOOPT)) { fs.writeFileSync(tmp + 'a.html', pre); console.log(execFileSync('python3', ['optfonts.py', tmp + 'a.html', tmp + 'b.html']).toString().trim()); pre = fs.readFileSync(tmp + 'b.html', 'utf8'); }
if (!/svg/.test(NOOPT)) { fs.writeFileSync(tmp + 'a.html', pre); console.log(execFileSync('node', ['optsvg.js', tmp + 'a.html', tmp + 'b.html']).toString().trim()); pre = fs.readFileSync(tmp + 'b.html', 'utf8'); }
try { fs.unlinkSync(tmp + 'a.html'); fs.unlinkSync(tmp + 'b.html'); } catch (e) {}
// the game's own script (the longest one): names that only live inside it are shortened; nothing else is touched
if (!/js/.test(NOOPT)) {
  let best = null; for (const m of pre.matchAll(/<script>([\s\S]*?)<\/script>/g)) if (!best || m[1].length > best[1].length) best = m;
  const r = await terserMin(best[1], { compress: { passes: 1 }, mangle: true, format: { comments: false }, ecma: 2015 });
  if (r.error) throw r.error;
  console.log('js: ' + best[1].length + ' -> ' + r.code.length + ' bytes');
  pre = pre.slice(0, best.index) + '<script>' + r.code + '</script>' + pre.slice(best.index + best[0].length);
}
const html = pre;
  const out = await minify(html, {
    collapseWhitespace: true, conservativeCollapse: true, removeComments: true,
    // (since Oct 8) tidier tags: quotes dropped where not needed, default/empty attributes dropped, short doctype. NOOPT=attrs turns it off
    ...(/attrs/.test(NOOPT) ? {} : { removeAttributeQuotes: true, removeRedundantAttributes: true, removeEmptyAttributes: true, collapseBooleanAttributes: true, useShortDoctype: true }),
    minifyCSS: (text, type) => {
      try {
        const wrap = type === 'inline' ? 'a{' + text + '}' : text;
        let r = css.transform({ code: Buffer.from(wrap), minify: true, errorRecovery: false }).code.toString();
        if (type === 'inline') r = r.slice(2, -1);
        return r;
      } catch (e) { console.error('css kept as is:', e.message.slice(0, 80)); return text; }
    },
    minifyJS: { compress: false, mangle: false, format: { comments: false } },
  });
  fs.writeFileSync(dst, out);
  console.log('full', html.length, '-> slim', out.length, '(' + Math.round(100 - out.length / html.length * 100) + '% smaller)');
})();
