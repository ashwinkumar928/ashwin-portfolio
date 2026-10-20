# Ashwin Kumar — Portfolio

A cinematic, responsive portfolio built with React, TypeScript, Vite, Tailwind CSS, GSAP, Motion for React, and Lucide.

## Run locally

Prerequisite: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Deploy to Vercel with build command `npm run build` and output directory `dist`.

## Content and assets

- Original photos remain unchanged in `assets/photos/`: `IMG_20251127_141419530.jpg` supplies the hero portrait, and `WhatsApp Image 2026-10-20 at 5.22.56 PM.jpeg` supplies the About portrait.
- Finished transparent, monochrome halftone images are `public/images/ashwin-hero-cutout.png` and `public/images/ashwin-about-cutout.png`.
- Rerun `npm run process:portraits` to regenerate the finished PNGs from the transparent inputs in `assets/portrait-cutouts/`. Processing uses Node's built-in modules; see `scripts/README.md`.
- GSAP ScrollTrigger animates each single portrait image as its section scrolls into view. Reduced-motion preferences disable scroll animation.
- Project content and URLs are defined in `src/App.tsx`.
- Only Karviam has a verified public destination in the supplied information. Other projects are shown without demo links.
- No LinkedIn URL or production domain was supplied, so neither is published.
- The original resume PDF remains in `resume/`.

## Contact form

The form validates its fields in the browser and opens a pre-filled email using `mailto:`. No delivery service or credentials are configured. The visitor sees a note that their email app will open.
