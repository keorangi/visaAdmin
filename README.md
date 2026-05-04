# aewvcompliance.co.nz

Landing site for AEWV Compliance. Static Hugo site deployed to GitHub Pages.

Form submissions go to a third-party form-forwarding provider configured in `hugo.toml`. No backend is hosted in this repo.

```
.
├── hugo.toml                  # site config (params drive everything)
├── content/                   # markdown pages
├── archetypes/                # `hugo new` templates
├── static/                    # site-level static (CNAME, og image, etc.)
├── themes/aewv-compliance/    # theme — see themes/aewv-compliance/theme.toml
├── .github/workflows/deploy.yml   # GitHub Pages build + deploy
└── docs/
    ├── prompt.md              # original brief
    └── styleguide.md          # design system + content rules
```

## Run locally

```sh
hugo server -D                 # http://localhost:1313
```

The site is static. Form endpoints in `hugo.toml` apply in both local and production builds. If the access key is empty, the JS falls back to a local-only thank-you message instead of POSTing.

Optional — self-host Inter (otherwise system stack renders):

```sh
curl -L -o themes/aewv-compliance/static/fonts/InterVariable.woff2 \
  https://github.com/rsms/inter/raw/master/docs/font-files/InterVariable.woff2
```

CI fetches it automatically; locally it's optional.

## Deploy

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes to GitHub Pages on every push to `main`.

### One-time setup

1. **GitHub Pages** — repo → Settings → Pages → Source: "GitHub Actions".
2. **Custom domain** — Pages settings, then DNS:
   - A records → GitHub Pages IPs (185.199.108-111.153)
   - `www` → `<gh-user>.github.io`
   - Tick "Enforce HTTPS" once cert provisions

## Editing the design

- **Tokens** — [`themes/aewv-compliance/data/design_tokens.yaml`](themes/aewv-compliance/data/design_tokens.yaml). The CSS reads from these via `resources.ExecuteAsTemplate`, so editing the YAML and rebuilding propagates everywhere.
- **Survey questions** — [`themes/aewv-compliance/data/survey.yaml`](themes/aewv-compliance/data/survey.yaml). Field types: `text`, `email`, `textarea`, `select`, `radio`.
- **Nav, footer, CTA labels, brand** — [`hugo.toml`](hugo.toml) under `[params]`.
- **Style rules** — [`docs/styleguide.md`](docs/styleguide.md).

## SEO

- Per-page `description` and `keywords` in front matter; falls back to site defaults.
- OpenGraph + Twitter card on every page.
- JSON-LD: `Organization` + `WebSite` on home, `Article` on blog posts, `WebPage` + `BreadcrumbList` elsewhere.
- Canonical URL on every page.
- `robots.txt` + `sitemap.xml` generated automatically. Dev builds emit `noindex,nofollow`.
- RSS feed at `/index.xml` (and per-section).
- All markdown images get `loading="lazy" decoding="async"` via render hooks; external markdown links get `rel="nofollow noopener" target="_blank"`.

Drop a 1200×630 PNG at [`themes/aewv-compliance/static/og-default.png`](themes/aewv-compliance/static/) for OpenGraph previews.

## Iteration plan

**Done (iteration 1):** design tokens, theme architecture, layout (hero / cards / sections / footer), all partials (header, footer, forms, etc.), home page, About / Contact / Terms / Privacy / Blog list + post, 404, full SEO (OpenGraph, JSON-LD, robots, sitemap), GitHub Pages workflow, styleguide.

**Next (iteration 2, when content needs them):** status badge component, table component, FAQ accordion, timeline, document checklist, pagination, breadcrumbs in UI, FAQ page type, compliance-process page type.

**End state:** once the AEWV product itself launches, the marketing site collapses to a blog.
