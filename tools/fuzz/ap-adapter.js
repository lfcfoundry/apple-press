/* Game-rule fuzz test for Apple Press (test copy only: needs the test handle window.__apt, see README.md). Operations: tap the apple, buy upgrades, add apples,
   jump stages, let time pass, press the save button, make a save code and read it back. Rules checked after every operation. */
window.__fuzzConfig = function (seed) {
  var T = window.__apt, I = Fuzzer.Input, lastSi = -1, lastRuns = 0;
  function nums(o, path, out) {
    Object.keys(o).forEach(function (k) {
      var v = o[k];
      if (typeof v === 'number') out.push([path + k, v]);
      else if (v && typeof v === 'object') nums(v, path + k + '.', out);
    });
    return out;
  }
  function tapApple() {
    var a = document.getElementById('apple'), r = a.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    ['pointerdown', 'pointerup'].forEach(function (t) {
      a.dispatchEvent(new PointerEvent(t, { bubbles: true, cancelable: true, clientX: x, clientY: y, pointerType: 'mouse', button: 0, isPrimary: true, pointerId: 1 }));
    });
  }
  return {
    seed: seed,
    ops: [
      { name: 'tap-apple', weight: 12, run: tapApple },
      { name: 'tap-burst', weight: 3, run: function (c) { for (var i = 0; i < 5 + c.int(20); i++) tapApple(); } },
      { name: 'give-small', weight: 4, run: function (c) { T.give(c.int(5000)); } },
      { name: 'give-big', weight: 0.4, run: function (c) { T.give(Math.pow(10, 6 + c.int(14))); } },
      { name: 'buy-upgrade', weight: 10, run: function (c) { T.buyU(c.int(T.nups())); } },
      { name: 'buy-cheapest-affordable', weight: 4, run: function () { for (var i = 0; i < T.nups(); i++) if (T.cost(i) <= T.st().count) { T.buyU(i); return; } } },
      { name: 'stage-jump', weight: 0.4, run: function (c) { T.stage(T.si() + c.int(T.nstages() - T.si())); } },
      { name: 'time-passes', weight: 6, run: function (c) { T.tick(1 + c.int(3600)); } },
      { name: 'click-visible-button', weight: 3, run: function (c) { var e = I.pickVisible(c); if (e && !/restart|start over|reset|clear/i.test((e.textContent || '') + (e.id || ''))) e.click(); } },
      { name: 'key', weight: 2, run: function (c) { I.key(c.pick(['Enter', ' ', 'Escape', 'ArrowDown', 'Tab']), true); } },
      { name: 'stage-walk', weight: 2, run: function () { if (T.si() < T.nstages() - 1) T.stage(T.si() + 1); } },
      { name: 'give-credits', weight: 1, run: function (c) { T.credits(1 + c.int(500)); } },
      { name: 'restart-from-ending', weight: 6, run: function (c) {
        if (!T.finaleOpen()) return;
        var keep = c.chance(0.5), b = JSON.parse(T.snap()), bad = [];
        T.restart(keep);
        var s = T.st();
        if (s.runs !== (b.runs || 0) + 1) bad.push('runs ' + b.runs + ' -> ' + s.runs);
        if (s.short) bad.push('short adventure mark still set after a restart');
        if (Object.keys(s.owned).length) bad.push('upgrades survived the restart');
        if (!keep && s.credits) bad.push('bonus credits survived a fresh start: ' + s.credits);
        if (keep && s.credits !== b.credits) bad.push('credits changed on keep: ' + b.credits + ' -> ' + s.credits);
        if (keep && s.keeps !== (b.keeps || 0) + 1) bad.push('keeps ' + b.keeps + ' -> ' + s.keeps);
        if (!keep && s.keeps) bad.push('keeps set on a fresh start: ' + s.keeps);
        if (!(s.count >= 0) || (!s.head && s.count !== 0)) bad.push('apples after restart: ' + s.count);
        lastSi = -1;
        if (bad.length) throw new Error('restart: ' + bad.join('; '));
      } },
      { name: 'save-code-round-trip', weight: 2, run: function () {
        var before = T.snap();
        return T.code().then(function (code) { return T.read(code); }).then(function (back) {
          var a = JSON.parse(before), b = JSON.parse(JSON.stringify(back)), bad = [];
          ['count', 'total', 'credits', 'taps'].forEach(function (k) { if (Math.abs(a[k] - b[k]) > Math.abs(a[k]) * 1e-9 + 1e-6) bad.push(k + ' ' + a[k] + ' -> ' + b[k]); });
          var ownedKeys = Object.assign({}, a.owned || {}, b.owned || {});
          Object.keys(ownedKeys).forEach(function (k) {
            var before = (a.owned || {})[k] || 0,
              after = (b.owned || {})[k] || 0;
            if (before !== after) bad.push('owned ' + k + ' ' + before + ' -> ' + after);
          });
          if (bad.length) throw new Error('save code round trip changed: ' + bad.slice(0, 4).join('; '));
        });
      } }
    ],
    invariants: [
      function () {
        var bad = nums(T.st(), '', []).filter(function (p) { return !isFinite(p[1]) || p[1] < 0; });
        return bad.length ? 'bad number in the saved progress: ' + bad.slice(0, 3).map(function (p) { return p[0] + '=' + p[1]; }).join(', ') : '';
      },
      function () { var s = T.st(); return s.total + 1e-6 >= s.count - Math.abs(s.count) * 1e-9 ? '' : 'apples in hand exceed the lifetime total: ' + s.count + ' > ' + s.total; },
      function () { var r = T.rates(); return isFinite(r.pc) && isFinite(r.ps) && r.pc >= 0 && r.ps >= 0 ? '' : 'rates not finite: ' + JSON.stringify(r); },
      function () { var runs = T.st().runs || 0; if (runs !== lastRuns) { lastRuns = runs; lastSi = -1; } var si = T.si(); var m = si < lastSi ? 'stage went backward: ' + lastSi + ' -> ' + si : ''; lastSi = Math.max(lastSi, si); return m; },
      function () { var s = T.st(), bad = Object.keys(s.owned).filter(function (k) { return s.owned[k] < 0 || s.owned[k] !== Math.floor(s.owned[k]); }); return bad.length ? 'upgrade count not a whole number: ' + bad[0] + '=' + s.owned[bad[0]] : ''; },
      Fuzzer.Invariants.noJunkText()
    ],
    state: function () { return 'stage ' + T.si(); }
  };
};
