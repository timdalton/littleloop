---
project: littleloop-site
task: littleloop.co.uk in the SkyReady 3 / TideReady 2 language — live sky hero
phase: climbing
progress: 12/15
iteration: 1
principal_stated_goal: "Now we've got a new design for SkyReady, we need to do the same for both TideReady and the littleloop website."
principal_decisions: "3. Live sky 4. Agreed" (2026-10-27, review https://claude.ai/artifact/HJh2fHNYxqErf3XgPvULdH)
branch: design/live-sky
---

# littleloop.co.uk — live sky

## Goal

Tim, verbatim: "Now we've got a new design for SkyReady, we need to do the same for both TideReady and the littleloop website." Decisions: live sky hero; site after TideReady so it can show real recordings of both apps.

## Vision

A visitor lands and the page is painted for their own hour: sky and sea, a serif headline sitting on it, a small glass band they can drag through the day. It feels like opening one of the apps. Below, the three apps sit as glass cards, and each app page opens on a real recording of the app being dragged.

## Out of Scope

- Frameworks, build steps, new hosting. Static HTML + `styles.css` stays.
- Privacy/terms/support content changes (restyle only).

## Claims

- [x] S1: Homepage hero is a canvas sky + sea painted from the visitor's local hour (sun position, dusk, night with stars), with the serif headline and lede on it. Probe: Interceptor screenshots at three hours (forced via `?h=` debug param).
- [x] S2: A glass band 06:00–22:00 under the hero is draggable (pointer + keyboard, labelled range) and repaints the sky for that hour; label reads "now" at the real time. Probe: Interceptor drag/eval + screenshot.
- [x] S3: Three app cards (SkyReady, TideReady, Frame) on glass, with the current icons (SkyReady needle, TideReady needle-at-waterline from `~/Projects/TideReady/TideReady/Assets.xcassets/AppIcon.appiconset`). Probe: screenshot + asset diff.
- [x] S4: Typography: serif `ui-serif, "New York", "Newsreader", Georgia` for display; system sans for body; Inter removed. Probe: grep + computed-style eval.
- [x] S5: SkyReady and TideReady pages open on a looping, muted, inline recording of the real app (simulator capture of the drag/glide), with poster frame. Probe: file exists, plays in Interceptor (eval `video.readyState`, `currentTime` advancing via VerifyViewport).
- [x] S6: App pages, privacy, terms and support share the same type, palette and glass chrome. Probe: screenshot of each.
- [x] S7: Phone width (≈390px) has no horizontal scroll and a 16px gutter. Probe: VerifyViewport probe at 390/820/1440 (`scrollWidth <= clientWidth`).
- [x] S8: Scene animates only while dragging; one still frame otherwise; respects `prefers-reduced-motion` and Save-Data. Probe: code read + VerifyViewport rAF count at rest.
- [x] S9: White text over the sky holds ≥4.5:1 at night, dawn and midday. Probe: eval sampling canvas pixels behind the headline box.
- [x] S10: Existing SEO/meta preserved, including the uncommitted `tideready.html` edits (Open Graph, Smart App Banner, "Is TideReady for me?") present in the working tree at branch time. Probe: grep for `apple-itunes-app`, `og:url`, "Is TideReady for me?".
- [ ] S11: All internal links and App Store links resolve; no console errors. Probe: Interceptor net log + console capture on every page.
- [ ] S12: Live on littleloop.co.uk after Tim approves screenshots. Probe: live fetch + Interceptor screenshot. (after: S1..S11)

## Anti-claims

- [x] A1: Nothing pushed to `main` (the live site) before Tim sees screenshots.
- [x] A2: No API keys or private data in any page (the NIWA key leak was fixed in e347a79; keep it that way). Probe: grep for key-like strings.

## Decisions

- 2026-10-27: Branch `design/live-sky` carries the pre-existing uncommitted `tideready.html` SEO edits as its first commit, attributed in the message as found in the working tree.

- 2026-10-27: Midday sky is held darker than the app's (veil .60 at noon, .40 at night) so white text clears 4.5:1 at every hour. Brighter needs dark glass behind the headline.
- 2026-10-27: No first-run glide on the site; the page shows a "Drag to see the sky at another hour" hint instead, so nothing animates unless dragged (S8).
- 2026-10-27: Band is a native range input (keyboard and labelled by default) with a daylight bar from computed sunrise/sunset for lat 52.2.
- 2026-10-27: SkyReady loop is forward then reversed (the app's glide ends at 3pm, not at now); SkyReady needed a signed Debug build for WeatherKit. Recordings come from `main` builds, which may be ahead of the App Store versions.
- 2026-10-27: Old SkyReady/TideReady screenshots are no longer used by any page but remain in `images/`. Frame's App Store link is the existing placeholder id0000000000 (404), untouched.
- 2026-10-27: Wordmark is "littleloop" (as in the mock); meta titles still say "Little Loop".

## Verification

- S1: evidence/home-day-1440.png, home-dawn-1440.png, home-night-1440.png, home-dusk-390.png (VerifyViewport shots, ?h=12/8/23/17).
- S2: evidence/now-probe.txt (label "now" / "Your sky, right now" with no ?h); probe-motion.js drag 12 to 17, 9, 6 changed canvas pixels and label. Native `<input type=range>` for keyboard, not key-tested.
- S3: home-day-1440.png; icons are `sips -Z 256` copies of the app icon PNGs, Frame icon kept.
- S4: grep finds no Inter in html/css/js; computed h1 font-family `ui-serif, "New York", Newsreader, Georgia` (now-probe.txt).
- S5: evidence/video-probe.txt (readyState 4, muted, loop, playsInline, currentTime advancing, poster set); skyready.mp4 176 KB, tideready.mp4 121 KB.
- S6: tideready-1440.png, tideready-390.png, privacy-1440.png; support/terms/frame share the same chrome (width-probe.txt loads all).
- S7: evidence/width-probe.txt, 21/21 page x width (390/820/1440) with scrollWidth <= clientWidth, gutter 16px.
- S8: probe-motion.js: 0 rAF calls over 1.5 s at rest, canvas unchanged; 0 after a drag settles. Code read: reduce-motion paints directly, Save-Data repaints on release only and stops video autoplay.
- S9: evidence/contrast-sweep.txt (probe-contrast.js): worst white-text contrast over the canvas, 17 hours x 1440/390, min 5.12.
- S10: grep `apple-itunes-app`, `og:url`, "Is TideReady for me" present; `git diff ef7dd72 HEAD -- tideready.html` removes no meta lines.
- S11 (open): resource-probe.txt shows no failed requests or broken images on all 7 pages and links.txt shows 200 for every internal and App Store link except Frame's placeholder (404, pre-existing). Console errors not captured.
- A1: branch is design/live-sky, nothing pushed.
- A2: grep for key-like strings in html/js/css finds none.
