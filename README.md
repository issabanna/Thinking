# Thamar Zananiri

A dependency-free static landing page using the deep blue, orange, teal, cream, and botanical design language visible in the artist's YouTube channel screenshots supplied by the user.

Serve locally with `python3 -m http.server 8000 --directory /workspace/Thinking`.

Publish the repository root through GitHub Pages. No build step or secrets required.

The typographic wordmark and SVG illustrations are new interpretations of the channel branding, not extracted official logo files. Song titles and durations come from the supplied channel screenshot. Song cards open searches within the official channel because individual video IDs were unavailable. Card artwork is newly drawn, not official release artwork. The official channel was provided by the user. Unverified Instagram and CD Baby search links have been removed.

Typography uses self-hosted Fraunces, Nunito Sans, and Noto Sans Arabic from Fontsource (SIL Open Font License; license texts in assets/fonts). Fraunces approximates the channel wordmark; the exact custom lettering is not identified.

Interactive edition: illustrated vinyl toggle (visual only), bilingual title search, random song recommendation with focus management, pointer-based card tilt, scroll reveals, and reading progress. All animations respect reduced-motion preferences. The page remains readable and song links work without JavaScript. Run `node --check script.js` for a syntax check. Browser validation covered keyboard record toggling, English/Arabic searches, empty results, nonrepeating picks, focus, five viewport widths (320–1440px), and reduced motion.

Current typography: self-hosted variable Space Grotesk for display headings and Manrope for body/navigation, plus Noto Sans Arabic. Font licenses are included beside the assets. The oversized type and shared page gutters were verified at 320, 390, 760, 768, 900, 1024, 1440, and 1920 pixels. Asset query versions refresh cached stylesheet/script references after deployment.
