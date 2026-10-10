# XYZ Company — Static Marketing Site

A front-end only recruitment/staffing company website. No build step, no backend, no dependencies — plain HTML, CSS and vanilla JavaScript.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```bash
# Python
python -m http.server 5173

# or Node
npx serve .
```

Then visit <http://localhost:5173>.

## Structure

```
index.html          single page, anchor-linked sections
css/styles.css      all styles (design tokens at the top of the file)
js/main.js          nav, scroll reveal, counters, job filter, form validation
assets/             inline SVG illustration + favicon
```

## Sections

Top bar · Header/nav · Hero · Marquee · About + Why Choose Us · Services · How We Work · Current Openings · Testimonials · CTA · Contact · Footer

## Interactions

- Sticky header with scroll shadow, scroll-spy active nav link
- Slide-in mobile drawer menu with backdrop (Esc to close)
- `IntersectionObserver` scroll-reveal animations and animated stat counters
- Job category filter chips with an empty state
- Contact form with inline validation and real email delivery (see below)

## Contact form email delivery

GitHub Pages serves static files only — it cannot send mail. The form posts
directly from the browser to a form-to-email service, which forwards the
submission to an inbox. Configure it in the `FORM` object at the top of
[`js/main.js`](js/main.js).

Until a key is filled in, the form validates normally but shows a
"not configured" notice instead of sending.

### Option A — Web3Forms (keeps your address out of the page source)

1. Go to <https://web3forms.com>, enter the destination email, and the access
   key is emailed to you. No account needed. Free tier: 250 submissions/month.
2. Set it in `js/main.js`:

   ```js
   var FORM = {
     provider:  'web3forms',
     accessKey: 'paste-your-access-key-here',
     ...
   };
   ```

The key is a public, write-only submission token — safe to commit. It can only
post to the form; it cannot read past submissions.

### Option B — FormSubmit (no signup at all)

1. Set it in `js/main.js`:

   ```js
   var FORM = {
     provider: 'formsubmit',
     email:    'you@example.com',
     ...
   };
   ```
2. Submit the form once. FormSubmit emails you a one-time activation link —
   click it and delivery is live from then on.

Trade-off: the address sits in the page source where scrapers can find it.
To avoid that, take the random alias from your FormSubmit dashboard and use it
in place of the email.

### Spam handling

The form includes an off-screen honeypot field (`botcheck`). Bots that fill
every field trip it and the submission is dropped client-side without a
network call. Both providers also run their own spam filtering.

## Customising

Colors, radii, shadows and fonts are CSS custom properties in `:root` at the top of `css/styles.css`. Change `--brand` to re-theme the whole site.

Placeholder content to replace before any real use: phone number, email address, office addresses, social links, testimonials and job listings.
