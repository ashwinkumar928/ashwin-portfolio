# Portrait processing

Run `npm run process:portraits` to regenerate both final portrait PNGs. The script uses only Node's built-in modules; no image-processing package install is required.

It trims transparent padding from the subject, then applies independent monochrome contrast, a fine halftone screen, silhouette-following cool and warm edge light, and sparse deterministic particles before writing:

- `public/images/ashwin-hero-cutout.png`
- `public/images/ashwin-about-cutout.png`

The photographic originals remain unchanged in `assets/photos/`: `IMG_20251127_141419530.jpg` is the hero source and `WhatsApp Image 2026-10-20 at 5.22.56 PM.jpeg` is the About source. Their segmented cutouts are retained in `assets/portrait-cutouts/`. The script reruns the visual treatment from those alpha cutouts; the segmentation itself is already baked into those inputs. It expects non-interlaced, 8-bit RGB or RGBA PNGs.
