# Sanatan Knowledge Archive

Premium, immersive digital library prototype for the 4 Vedas and 18 Mahapuranas.

## Stack

- Next.js 16 + TypeScript + Tailwind CSS 4
- Framer Motion + GSAP + Three.js (installed)
- Express.js + PostgreSQL
- NextAuth with credentials + GitHub provider support
- API routes for search, verse generation, resources, auth, and signed uploads
- PWA manifest support

## Implemented Experience

- Cinematic dark-luxury visual style with gold accents
- Animated sacred background: stars, lotus petals, mandalas, smoke, gradient sky cycle
- Custom glowing golden cursor with trail and occasional ॐ glyph particles
- Landing hero with animated CTA actions
- Full Veda and Mahapurana catalogs with interactive cards
- Scripture reader overlay with:
	- Table of contents and chapter filtering
	- Reading mode toggle (dark/light)
	- Font size controls
	- Bookmarking workflow
	- Reading progress bar
	- Fullscreen mode
	- Download cards (PDF, EPUB, audio, translation)
- Global instant search powered by API route
- Sanskrit quote widget, daily wisdom widget, random verse generator
- Admin panel UI wired to signed upload flow + metadata persistence
- User account creation and sign-in panel
- Three.js cosmic sacred geometry layer
- GSAP timeline and scroll-triggered cinematic motion

## Environment Setup

1. Copy `.env.example` to `.env.local` for Next.js and `.env` for API/server usage.
2. Fill database and auth keys.
3. Optional: fill AWS and/or Cloudinary credentials to enable real signed uploads.

## Database Setup

```bash
npm run db:migrate
```

This applies [db/migrations/001_init.sql](db/migrations/001_init.sql) and creates:

- `users`
- `user_favorites`
- `reading_history`
- `chapter_notes`
- `resource_uploads`

## Run

```bash
npm install
npm run dev
```

Frontend runs at http://localhost:3000

## Run Express API Scaffold

```bash
npm run dev:api
```

Express API runs at http://localhost:8080

## Auth Endpoints

- `POST /api/auth/register`
- `GET|POST /api/auth/[...nextauth]`

## Upload Pipeline Endpoints

- `POST /api/admin/upload/sign` for S3 or Cloudinary signature payload
- `POST /api/admin/upload/complete` to persist upload metadata

## Build And Lint

```bash
npm run lint
npm run build
```

## Notes

- If cloud credentials are missing, upload routes run in mock-safe mode for local demos.
- For production, set strong `NEXTAUTH_SECRET` and configure OAuth credentials.
