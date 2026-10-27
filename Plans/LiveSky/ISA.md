---
project: littleloop-site
task: littleloop.co.uk in the SkyReady 3 / TideReady 2 language — live sky hero
phase: climbing
progress: 0/12
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

- [ ] S1: Homepage hero is a canvas sky + sea painted from the visitor's local hour (sun position, dusk, night with stars), with the serif headline and lede on it. Probe: Interceptor screenshots at three hours (forced via `?h=` debug param).
- [ ] S2: A glass band 06:00–22:00 under the hero is draggable (pointer + keyboard, labelled range) and repaints the sky for that hour; label reads "now" at the real time. Probe: Interceptor drag/eval + screenshot.
- [ ] S3: Three app cards (SkyReady, TideReady, Frame) on glass, with the current icons (SkyReady needle, TideReady needle-at-waterline from `~/Projects/TideReady/TideReady/Assets.xcassets/AppIcon.appiconset`). Probe: screenshot + asset diff.
- [ ] S4: Typography: serif `ui-serif, "New York", "Newsreader", Georgia` for display; system sans for body; Inter removed. Probe: grep + computed-style eval.
- [ ] S5: SkyReady and TideReady pages open on a looping, muted, inline recording of the real app (simulator capture of the drag/glide), with poster frame. Probe: file exists, plays in Interceptor (eval `video.readyState`, `currentTime` advancing via VerifyViewport).
- [ ] S6: App pages, privacy, terms and support share the same type, palette and glass chrome. Probe: screenshot of each.
- [ ] S7: Phone width (≈390px) has no horizontal scroll and a 16px gutter. Probe: VerifyViewport probe at 390/820/1440 (`scrollWidth <= clientWidth`).
- [ ] S8: Scene animates only while dragging; one still frame otherwise; respects `prefers-reduced-motion` and Save-Data. Probe: code read + VerifyViewport rAF count at rest.
- [ ] S9: White text over the sky holds ≥4.5:1 at night, dawn and midday. Probe: eval sampling canvas pixels behind the headline box.
- [ ] S10: Existing SEO/meta preserved, including the uncommitted `tideready.html` edits (Open Graph, Smart App Banner, "Is TideReady for me?") present in the working tree at branch time. Probe: grep for `apple-itunes-app`, `og:url`, "Is TideReady for me?".
- [ ] S11: All internal links and App Store links resolve; no console errors. Probe: Interceptor net log + console capture on every page.
- [ ] S12: Live on littleloop.co.uk after Tim approves screenshots. Probe: live fetch + Interceptor screenshot. (after: S1..S11)

## Anti-claims

- [ ] A1: Nothing pushed to `main` (the live site) before Tim sees screenshots.
- [ ] A2: No API keys or private data in any page (the NIWA key leak was fixed in e347a79; keep it that way). Probe: grep for key-like strings.

## Decisions

- 2026-10-27: Branch `design/live-sky` carries the pre-existing uncommitted `tideready.html` SEO edits as its first commit, attributed in the message as found in the working tree.

## Verification
