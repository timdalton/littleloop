/* Paints the sky and sea on #sky for the visitor's own hour.
   One still frame at load. It repaints only while the band is dragged:
   no timers, no loop at rest. Honours prefers-reduced-motion and Save-Data.
   ?h=HH (or HH.5) forces the hour, for screenshots. */
(function () {
    'use strict';

    var cv = document.getElementById('sky');
    if (!cv || !cv.getContext) return;
    var cx = cv.getContext('2d');

    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var conn = navigator.connection || {};
    var saveData = conn.saveData === true;

    // ── Sun times for Cambridgeshire (lat 52.2), in local clock hours
    function sunTimes(d) {
        var y = d.getFullYear();
        var n = Math.floor((d - new Date(y, 0, 0)) / 864e5);
        var rad = Math.PI / 180;
        var dec = 23.44 * Math.sin(2 * Math.PI * (284 + n) / 365) * rad;
        var lat = 52.2 * rad;
        var cosH = (Math.sin(-0.833 * rad) - Math.sin(lat) * Math.sin(dec)) / (Math.cos(lat) * Math.cos(dec));
        var H = Math.acos(Math.max(-1, Math.min(1, cosH))) / rad / 15;
        var b = 2 * Math.PI * (n - 81) / 364;
        var eot = 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
        var std = Math.max(new Date(y, 0, 1).getTimezoneOffset(), new Date(y, 6, 1).getTimezoneOffset());
        var dst = d.getTimezoneOffset() < std ? 1 : 0;
        var noon = 12 + dst - eot / 60;
        return { rise: noon - H, set: noon + H };
    }

    var today = new Date();
    var sun = sunTimes(today);

    function sunAt(t) {
        var f = (t - sun.rise) / (sun.set - sun.rise);
        var c = Math.min(1, Math.max(0, f));
        return { up: f > 0 && f < 1, elev: Math.sin(Math.PI * c), x: c };
    }
    function mix(a, b, f) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * f); }); }
    function rgb(a) { return 'rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')'; }

    var NIGHT = [[10, 16, 34], [22, 32, 58]];
    var DUSK = [[44, 58, 104], [226, 150, 112]];
    var DAY = [[86, 150, 204], [196, 222, 240]];

    function skyCols(t) {
        var s = sunAt(t);
        if (!s.up) {
            var d = Math.min(1, Math.min(Math.abs(t - sun.rise), Math.abs(t - sun.set)) / 0.9);
            return [mix(DUSK[0], NIGHT[0], d), mix(DUSK[1], NIGHT[1], d)];
        }
        var e = Math.min(1, s.elev * 2.2);
        return [mix(DUSK[0], DAY[0], e), mix(DUSK[1], DAY[1], e)];
    }

    function fmt(t) {
        var m = Math.round(t * 60 / 5) * 5;
        var h = Math.floor(m / 60) % 24, mm = m % 60;
        return (h < 10 ? '0' : '') + h + ':' + (mm < 10 ? '0' : '') + mm;
    }

    // ── Paint
    var dpr = Math.min(saveData ? 1 : 2, window.devicePixelRatio || 1);
    var kicker = document.getElementById('sk');
    var stime = document.getElementById('stime');
    var realNow = today.getHours() + today.getMinutes() / 60;
    var current = realNow;
    var lastDrawn = null;

    function paint(t) {
        current = t;
        var w = cv.clientWidth, h = cv.clientHeight;
        var W = Math.round(w * dpr), H = Math.round(h * dpr);
        if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
        var cols = skyCols(t), top = cols[0], hor = cols[1], s = sunAt(t);
        var horizon = H * 0.72;
        var g = cx.createLinearGradient(0, 0, 0, horizon);
        g.addColorStop(0, rgb(mix(top, [0, 0, 0], 0.15)));
        g.addColorStop(1, rgb(hor));
        cx.fillStyle = g;
        cx.fillRect(0, 0, W, horizon + 1);

        if (s.up) {
            var px = W * (0.12 + 0.76 * s.x), py = horizon - horizon * 0.8 * s.elev;
            var sg = cx.createRadialGradient(px, py, 0, px, py, Math.max(W, H) * 0.3);
            sg.addColorStop(0, 'rgba(255,240,210,.9)');
            sg.addColorStop(0.05, 'rgba(255,228,180,.7)');
            sg.addColorStop(0.35, 'rgba(255,210,160,.1)');
            sg.addColorStop(1, 'rgba(255,210,160,0)');
            cx.fillStyle = sg;
            cx.fillRect(0, 0, W, horizon);
        } else {
            cx.fillStyle = 'rgba(255,255,255,.6)';
            for (var i = 0; i < 70; i++) {
                cx.fillRect((i * 97 % 100) / 100 * W, (i * 53 % 100) / 100 * horizon * 0.7, dpr, dpr);
            }
        }

        // Sea
        g = cx.createLinearGradient(0, horizon, 0, H);
        g.addColorStop(0, rgb(mix(hor, [20, 70, 100], 0.6)));
        g.addColorStop(1, rgb(mix(top, [8, 34, 56], 0.75)));
        cx.fillStyle = g;
        cx.fillRect(0, horizon, W, H - horizon);

        // Faint swell lines; their phase follows the hour, so they only move on a drag
        cx.strokeStyle = 'rgba(255,255,255,.12)';
        cx.lineWidth = dpr;
        for (var k = 1; k < 6; k++) {
            cx.beginPath();
            var yy = horizon + (H - horizon) * (k / 6) * (k / 6 + 0.4) / 1.4;
            for (var x = 0; x <= W; x += W / 30) {
                var y = yy + Math.sin(x / W * 9 + t * 1.7 + k) * H * 0.003;
                if (x) cx.lineTo(x, y); else cx.moveTo(x, y);
            }
            cx.stroke();
        }

        // Veil: keeps white text above 4.5:1 at every hour
        g = cx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, 'rgba(3,12,24,.58)');
        g.addColorStop(0.72, 'rgba(3,12,24,.5)');
        g.addColorStop(1, 'rgba(3,12,24,.42)');
        cx.fillStyle = g;
        cx.fillRect(0, 0, W, H);

        var atNow = Math.abs(t - realNow) < 0.13;
        if (stime) stime.textContent = atNow ? 'now' : fmt(t);
        if (kicker) kicker.textContent = atNow ? 'Your sky, right now' : 'Your sky at ' + fmt(t);
        lastDrawn = t;
    }

    // Coalesce drag events into at most one paint per frame. No loop: it ends with each paint.
    var pending = null, queued = false;
    function schedule(t) {
        if (reduce) { paint(t); return; }
        pending = t;
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { queued = false; paint(pending); });
    }

    // ── Start hour: ?h= wins, else the visitor's own clock
    var forced = parseFloat(new URLSearchParams(location.search).get('h'));
    var start = isNaN(forced) ? realNow : ((forced % 24) + 24) % 24;
    paint(start);

    // ── Band
    var rng = document.getElementById('srange');
    if (rng) {
        var day = document.getElementById('sday');
        var tick = document.getElementById('snow');
        var pos = function (t) { return (Math.min(22, Math.max(6, t)) - 6) / 16 * 100; };
        if (day) {
            var a = pos(sun.rise), b = pos(sun.set);
            day.style.left = a + '%';
            day.style.width = Math.max(0, b - a) + '%';
        }
        if (tick) tick.style.left = pos(realNow) + '%';
        var set = function () {
            var t = parseFloat(rng.value);
            rng.setAttribute('aria-valuetext', Math.abs(t - realNow) < 0.13 ? 'now, ' + fmt(t) : fmt(t));
        };
        rng.value = Math.min(22, Math.max(6, start));
        set();
        rng.addEventListener('input', function () {
            set();
            if (saveData) return; // repaint once, on release
            schedule(parseFloat(rng.value));
        });
        rng.addEventListener('change', function () { paint(parseFloat(rng.value)); });
        var home = document.getElementById('shome');
        if (home) home.addEventListener('click', function () {
            rng.value = Math.min(22, Math.max(6, realNow));
            set();
            paint(realNow);
        });
    }

    var rt;
    addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () { paint(current); }, 120);
    });

    // ── Recordings: a short muted loop, unless motion or data is being saved
    var vids = document.querySelectorAll('video[data-loop]');
    for (var v = 0; v < vids.length; v++) {
        if (reduce || saveData) {
            vids[v].removeAttribute('autoplay');
            vids[v].preload = 'none';
            vids[v].controls = true;
            vids[v].pause();
        }
    }
})();
