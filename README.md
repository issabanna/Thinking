# Thamar Zananiri

Minimal blue artist landing page and a separate contact form. Static site published from the repository root through GitHub Pages.

Run locally: `python3 -m http.server 8000 --directory /workspace/Thinking`.

The home page contains only the blue hero, the artist's official YouTube links, and a visual record-spin toggle. The contact page uses FormSubmit to route messages to the configured recipient. The recipient email is not rendered visibly, but the FormSubmit URL is readable in the HTML source. An opaque service endpoint or backend is required to hide the address from source. FormSubmit requires recipient confirmation before mail delivery works. CAPTCHA remains enabled, with a honeypot and native field validation. The confirmation page indicates submission, not verified email delivery. Actual email delivery has not been verified.

The custom domain thamarzananiri.com is declared in CNAME. The owner reports configuring the GitHub Pages DNS records in GoDaddy. Direct Pages settings updates were denied by the GitHub integration; inspect Pages settings if the deployment does not apply the domain automatically. DNS and HTTPS availability remain to be verified. The contact form redirects successful submissions to the custom domain.

Typography uses self-hosted Space Grotesk, Manrope, and Noto Sans Arabic. Licenses are in assets/fonts. Channel-inspired artwork is original SVG artwork, not an extracted official logo. The record animation respects reduced-motion preferences.

Validation: home/contact/thanks pages, 320–1440px responsive widths, hero-only content, recipient absent from visible text, record toggle, required/email field validation, and a mocked FormSubmit POST. No test email was sent.
