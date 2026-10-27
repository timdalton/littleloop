(() => {
  const cv = document.getElementById('sky'), cx = cv.getContext('2d');
  const sx = cv.width / cv.clientWidth, sy = cv.height / cv.clientHeight;
  const lum = (r, g, b) => { const f = c => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
  let worst = 99, where = '';
  for (const sel of ['.hero h1', '.hero .lede', '.hero .kicker', '.nav nav', '.brand']) {
    const el = document.querySelector(sel); if (!el) continue;
    const r = el.getBoundingClientRect();
    const x = Math.max(0, Math.floor(r.left * sx)), y = Math.max(0, Math.floor(r.top * sy));
    const w = Math.max(1, Math.min(cv.width - x, Math.floor(r.width * sx))), h = Math.max(1, Math.min(cv.height - y, Math.floor(r.height * sy)));
    const d = cx.getImageData(x, y, w, h).data;
    for (let i = 0; i < d.length; i += 4 * 7) {
      const L = lum(d[i], d[i + 1], d[i + 2]), c = 1.05 / (L + .05);
      if (c < worst) { worst = c; where = sel; }
    }
  }
  return JSON.stringify({ h: new URLSearchParams(location.search).get('h'), w: innerWidth, worst: +worst.toFixed(2), where });
})()
