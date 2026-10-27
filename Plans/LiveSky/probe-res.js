(() => { const bad = performance.getEntriesByType('resource').filter(e => e.responseStatus >= 400 || (e.responseStatus === 0 && e.transferSize === 0 && e.decodedBodySize === 0 && !/googleapis|gstatic/.test(e.name))).map(e => e.name + ' ' + e.responseStatus);
 const imgs = [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src);
 return JSON.stringify({ p: location.pathname, n: performance.getEntriesByType('resource').length, bad, brokenImgs: imgs }); })()
