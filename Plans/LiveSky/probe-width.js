(() => { const d = document.documentElement; const m = parseFloat(getComputedStyle(document.querySelector('.wrap, .nav-in')).paddingLeft);
 return JSON.stringify({ p: location.pathname, w: innerWidth, sw: d.scrollWidth, cw: d.clientWidth, ok: d.scrollWidth <= d.clientWidth, gutter: m, bodySW: document.body.scrollWidth }); })()
