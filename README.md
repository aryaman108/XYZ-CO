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
- Contact form with inline validation — **front-end only**, nothing is submitted anywhere

## Customising

Colors, radii, shadows and fonts are CSS custom properties in `:root` at the top of `css/styles.css`. Change `--brand` to re-theme the whole site.

Placeholder content to replace before any real use: phone number, email address, office addresses, social links, testimonials and job listings.
