# Thamar Zananiri

A dependency-free static artist site with a personalized encouragement-card maker. Published from the repository root through GitHub Pages; no build step, accounts, or secrets required.

## Run locally

```sh
python3 -m http.server 8000 --directory /workspace/Thinking
node --check script.js
```

## Send a little light

The hero record opens a form for a recipient, feeling, optional note, and sender. Five feelings each have two curated King James Version verses with references and editorial encouragement. Repeated spins avoid selecting the current verse. The recommended song is a curated pairing rather than an artist endorsement.

WhatsApp sharing includes the verse, note, song-search URL, and a dedication link. Dedications use a versioned, UTF-8/base64url JSON payload in the URL fragment, preserving the exact card. Names and notes are not stored in a database or local storage. Anyone with the link can read its contents; the form explains this before sharing. Incoming links are length-limited, validated against known verse IDs, and rendered with textContent. Personal notes are kept separate from scripture.

Download Story card renders a 1080 × 1920 PNG locally with Canvas and the self-hosted fonts. It contains the dedication, scripture reference, song title, and channel handle. Add the copied dedication link separately in a social Story; PNG images do not contain clickable links or audio. Clipboard-denied browsers receive a selectable link.

Browser checks covered all five feelings, nonrepeating verses, Unicode/Arabic input, live note edits, WhatsApp text encoding, shared-link round trips, clipboard success/fallback, long-text PNG export, invalid links, HTML injection as plain text, and six viewport widths from 320 to 1440 pixels. Other site checks cover reduced motion, title search, random song selection, and alignment through 1920 pixels.

## Design and sources

The blue, orange, teal, and botanical motifs follow artist-channel screenshots supplied by the user. The wordmark and SVG/card illustrations are original interpretations rather than extracted official logo or release-art files. Song titles and durations come from the screenshot. The official channel was supplied by the user. Individual video IDs are not available, so song links open searches within that channel. Unverified Instagram/CD Baby links are omitted.

Current typography uses self-hosted variable Space Grotesk and Manrope with Noto Sans Arabic. Fontsource SIL Open Font License texts are included in assets/fonts. Earlier font files remain available but are not loaded by the current stylesheet. All motion respects reduced-motion preferences; core music links remain usable without JavaScript. The dedication maker requires JavaScript.
