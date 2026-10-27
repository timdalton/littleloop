(async () => {
  let raf = 0; const orig = window.requestAnimationFrame; window.requestAnimationFrame = f => { raf++; return orig.call(window, f); };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const cv = document.getElementById('sky'), cx = cv.getContext('2d');
  const sig = () => { const d = cx.getImageData(Math.floor(cv.width * .5), Math.floor(cv.height * .1), 1, 1).data; return [...d].join(','); };
  const s0 = sig(); await sleep(1500); const restRaf = raf, restSig = sig();
  const r = document.getElementById('srange'); const before = { v: r.value, t: document.getElementById('stime').textContent, k: document.getElementById('sk').textContent };
  r.value = 17; r.dispatchEvent(new Event('input', { bubbles: true })); await sleep(300);
  const afterDrag = { v: r.value, t: document.getElementById('stime').textContent, k: document.getElementById('sk').textContent, sig: sig(), raf };
  await sleep(1000); const rafAfterIdle = raf;
  r.value = 9; r.dispatchEvent(new Event('input', { bubbles: true })); await sleep(300); const sig9 = sig();
  r.value = 6; r.dispatchEvent(new Event('input', { bubbles: true })); await sleep(300); const sig6 = sig();
  return JSON.stringify({ hidden: document.visibilityState, restRaf, restStill: s0 === restSig, before, afterDrag, rafAfterIdleDelta: rafAfter(rafAfterIdle, afterDrag.raf), sig9, sig6, valuetext: r.getAttribute('aria-valuetext'), label: r.getAttribute('aria-label') });
  function rafAfter(a, b) { return a - b; }
})()
