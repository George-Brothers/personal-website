# georgeellisbrothers.com

A hand-built, editorial portfolio site for myself... designed, developed, and deployed by me.

Live: **[georgeellisbrothers.com](https://georgeellisbrothers.com)**.

## What it is

A plain static site: HTML, CSS, and a little vanilla JavaScript. **No framework, no
build step, no npm dependencies.** Each page is one `.html` file at the repo root; shared
chrome lives in `css/site.css` and `js/site.js`, and each page carries its own inline
`<style>` block. JavaScript is plain ES2017 loaded with `<script defer>`.

## Pages

| File | Route | What it is |
|---|---|---|
| `index.html` | `/` | Home — hero and animated scene cards |
| `work.html` | `/work` | Project case studies (data-driven modal) |
| `about.html` | `/about` | About |
| `now.html` | `/now` | What I'm working on now |
| `connect.html` | `/connect` | Links and a contact form |
| `404.html` | — | Not-found page |

Clean URLs are served without the `.html` extension (e.g. `/work`).

## Layout

```
├── *.html            one page per file at the root
├── css/              site.css (shared chrome) + scenes.css (animated scenes)
├── js/               site.js (shared) + per-page scripts (home, work, about, connect, scenes)
├── assets/           fonts, images (immutable, versioned filenames), résumé PDF, OG card
├── docs/             before/after screenshots and design notes (not deployed)
├── robots.txt, sitemap.xml
└── vercel.json       hosting config (clean URLs, redirects, cache + security headers)
```

Assets use versioned, immutable-cached filenames (e.g. `hero-desk.v2.webp`); references are
bumped rather than overwritten.

## Running it locally

There is no build. Serve the folder with any small static server that maps clean URLs to
`.html` files (plain `file://` breaks root-relative URLs), for example:

```bash
npx serve .
```

Then open the routes above.

## Deploying

Hosted on [Vercel](https://vercel.com) as a static site (`framework: null`). Hosting
behavior — clean URLs, redirects, and cache/security headers — is configured in
`vercel.json`.

## License

[MIT](LICENSE).
