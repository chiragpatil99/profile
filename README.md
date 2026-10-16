# Chirag Patil — Interactive Portfolio

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Motion · GSAP + ScrollTrigger · React Three Fiber · Radix UI primitives (shadcn-style) · Lucide

## Run locally

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Customize content

Everything personal lives in **`content/site.ts`** (types in `content/types.ts`):

| What | Where in `content/site.ts` |
| --- | --- |
| Name, title, intro, rotating headline lines, resume path | `site` |
| Email, GitHub, LinkedIn | `socials` |
| About text and engineering journey | `about`, `journey` |
| Jobs / timeline | `experience` |
| Projects and case studies | `projects` |
| Skills and descriptions | `skillCategories` |
| Education | `education` |
| "Currently exploring" cards | `exploring` |

Anything in `[brackets]` or marked `TODO` is a **placeholder**. Replace it, or delete the entry. No dates, metrics or achievements are filled in for you; only add ones you can verify. Don't include confidential employer details in the AWS entries.

**Resume:** replace `public/resume.pdf` (currently a one-line placeholder PDF) with your real file.

**Colors / theme:** design tokens are CSS variables at the top of `app/globals.css`.

## Replace project images

The project previews are code-drawn mockups in `components/project-visual.tsx` (labelled "illustrative"). To use real screenshots:

1. Put images in `public/projects/` (e.g. `public/projects/analytics.png`).
2. Add an optional `image?: string` field to the `Project` type in `content/types.ts` and set it in `content/site.ts`.
3. In `components/project-visual.tsx`, render `<Image src={image} alt="…" fill className="object-cover" />` (from `next/image`) when `image` is present, falling back to the mockup.

## Add a project

Add an object to the `projects` array in `content/site.ts` with a unique `slug`. The card on the home page, the case-study page (`/projects/<slug>`), the sitemap and the command palette all update automatically. `kind` (`streaming`, `vision`, `infra`) picks which mockup is shown.

## Contact form

`POST /api/contact` validates input (plus a honeypot) and sends through [Resend](https://resend.com) **only when configured**:

```
RESEND_API_KEY=...
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Portfolio <you@your-verified-domain.com>
```

If those variables are missing the endpoint returns `501` and the UI says plainly that nothing was sent (and offers a `mailto:` link). It never shows a fake success. For production, consider adding rate limiting (e.g. Vercel WAF or Upstash).

## Features at a glance

- Three.js network hero (pauses off-screen, simplified on mobile, static-friendly with reduced motion)
- Floating glass nav with active-section pill and scroll progress; `⌘/Ctrl + K` command palette
- Experience timeline, tilt/gradient-border project cards, case-study pages with route transitions
- Architecture playground: in-browser simulation of client → gateway → service → queue → workers → DB (clearly labelled as simulated)
- Interactive skills map with filters, a working terminal (`help`, `about`, `skills`, `experience`, `projects`, `education`, `contact`, `resume`, `clear`, plus `theme`, `goto`, `open`)
- Light/dark theme, custom 404, sitemap, robots, Open Graph image, JSON-LD

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel: **Add New → Project**, import the repo (framework is auto-detected as Next.js).
3. Add the environment variables from `.env.example` (at minimum `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, and the Resend keys if you want the form live).
4. Deploy. Then set `NEXT_PUBLIC_SITE_URL` to your final domain and redeploy so the sitemap/OG URLs are correct.

## Accessibility & performance notes

Semantic landmarks and a skip link, keyboard-operable everything (including the playground and terminal), visible focus rings, `prefers-reduced-motion` respected (Motion `MotionConfig`, GSAP `matchMedia`, CSS), hover-only UI hidden on touch devices, 44px+ touch targets, heavy 3D code-split with `next/dynamic`. Run Lighthouse against `npm run build && npm run start` for real numbers.
