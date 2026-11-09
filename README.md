# Manikanta & Anusha: Digital Wedding Invitation

A mobile-first digital wedding invitation built from the family's printed gate-fold card. Guests only
need the link: no login, registration or reply is involved.
React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide, Vercel.

**Thursday, 19 November 2026, 9:46 AM IST. Sri Maharaja Function Hall, Hyderabad.**

## Run it locally

Requires Node 22.12 or newer.

```bash
npm install
npm run dev     # http://localhost:5173
```

Other commands: `npm run typecheck`, `npm run build`, `npm run preview`.

## Change wedding details

Everything lives in one file: **`src/config/weddingConfig.ts`**. That covers names, date and time,
venue, families, wording, invitation photographs, music and the sharing messages. The page title,
preview tags and no-script fallback are generated from the same file at build time.

### Replace a couple photograph

1. Add the new file to `src/assets/images/couple/`. WebP or JPEG, about 800 px wide and under 200 KB.
2. In `weddingConfig.ts`, change the file name in `new URL('../assets/images/couple/...')` and update
   `width` and `height` to match. Each person has an `archPhoto` (hero) and a `portrait` (couple section).

### Replace the invitation photographs

The two official photographs live in `public/` and are served byte for byte:

- `public/wedding-invitation-cover.jpg`
- `public/wedding-invitation-inside.jpg`

Beside them are smaller copies with the same content, which keep the page fast on phones:
`wedding-invitation-cover-preview.webp` and `wedding-invitation-inside-preview.webp`. Guests see these
first, and the viewer switches to the original as soon as it has loaded.

To replace a photograph:

1. Overwrite the `.jpg` and its `-preview.webp`, keeping the file names.
2. Update `width`, `height` and `previewWidth` in `invitation.pages` in `weddingConfig.ts`.
3. If the cover changes, also set `invitation.gateFold.seam` to `[[50, 0], [50, 100]]`, because the
   seam is traced around the current photograph's die-cut doors.

### Add music

The music button stays hidden until a file is set.

1. Put a licensed file in `src/assets/audio/`, for example `wedding-music.mp3`.
2. In `weddingConfig.ts`, set:
   ```ts
   src: new URL('../assets/audio/wedding-music.mp3', import.meta.url).href,
   ```

Music never autoplays. It starts when a guest taps the button.

### Pin the exact venue location

Directions currently search by venue name and address. Once you have confirmed the location on
Google Maps, set `venue.coordinates` to `{ lat: ..., lng: ... }`.

### Replace the sharing preview image

Overwrite `public/og-image.jpg`, 1200 x 630 px and under 300 KB. WhatsApp caches previews per link, so
a change can take a while to appear on links already shared.

## Push to GitHub

```bash
git add .
git commit -m "Wedding invitation website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

`.gitignore` already excludes `.env` files, `node_modules` and `dist`. Consider making the repository
**private**, since it contains family photographs.

## Deploy to Vercel

1. At [vercel.com/new](https://vercel.com/new), import the GitHub repository. Vercel reads the build
   settings from `vercel.json`.
2. Click **Deploy**. You get a free address such as `your-project.vercel.app`.

No environment variables are needed. Vercel provides the production address to the build automatically,
so sharing links and preview images just work. Set `VITE_SITE_URL` only if you add a custom domain.

`vercel.json` also sets a strict Content Security Policy.

## Check after deploying

- Open the live link on a phone. Open the envelope, then the card, and pinch to zoom into the inner invitation.
- Send the link to yourself on WhatsApp and check the preview.
- Tap **Get Directions** and confirm Google Maps finds the correct hall.

## Project layout

```
public/                      Invitation photographs, preview image, icons
src/
  config/weddingConfig.ts    All wedding details
  components/                One component per section, plus shared parts
  hooks/                     useCountdown, useAudioPlayer, useScrollSpy
  lib/share.ts               WhatsApp, copy link and Google Maps links
  pages/Home.tsx             The page, and the opening sequence
  assets/                    Couple photographs, ornaments, fonts, audio
  styles/index.css           Design tokens and styles
vercel.json                  Build, routing and security headers
```

Fonts: Cormorant Upright and Mukta, both under the SIL Open Font License (`src/assets/fonts/LICENSE.txt`).
