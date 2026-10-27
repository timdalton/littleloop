(async () => { const v = document.querySelector('video'); const sleep = ms => new Promise(r => setTimeout(r, ms));
 const t0 = v.currentTime; await sleep(1200); const t1 = v.currentTime;
 return JSON.stringify({ src: v.currentSrc.split('/').pop(), poster: v.poster.split('/').pop(), readyState: v.readyState, paused: v.paused, muted: v.muted, loop: v.loop, playsInline: v.playsInline, t0: +t0.toFixed(2), t1: +t1.toFixed(2), advancing: t1 !== t0, vw: v.videoWidth, vh: v.videoHeight, dur: +v.duration.toFixed(2) }); })()
