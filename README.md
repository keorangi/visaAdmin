# aewvcompliance.co.nz

Landing site for AEWV Compliance. Static Hugo site deployed to GitHub Pages.

Form submissions are handled by a separate service in [`aewvcompliance-forms`](https://github.com/prasanthabr/aewvcompliance-forms) (sister repo), deployed on the droplet via Kamal.

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

The site is static. Form endpoints are configured to point at the production API in `hugo.toml` (set via GitHub Actions on deploy). Locally, the `#` endpoints cause the JS to show a local-only thank-you for submissions.

To test the real round-trip locally, run the form service from the separate [`aewvcompliance-forms`](https://github.com/prasanthabr/aewvcompliance-forms) repo and override:

```sh
HUGO_PARAMS_FORMS_EMAILENDPOINT=http://localhost:8080/api/email \
HUGO_PARAMS_FORMS_SURVEYENDPOINT=http://localhost:8080/api/survey \
hugo server
```

Optional — self-host Inter (otherwise system stack renders):

```sh
curl -L -o themes/aewv-compliance/static/fonts/InterVariable.woff2 \
  https://github.com/rsms/inter/raw/master/docs/font-files/InterVariable.woff2
```

CI fetches it automatically; locally it's optional.

## Deploy

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes to GitHub Pages on every push to `main`. The workflow injects production form endpoints via `HUGO_PARAMS_*` env vars, so the committed `hugo.toml` keeps local defaults.

### One-time setup

1. **GitHub Pages** — repo → Settings → Pages → Source: "GitHub Actions".
2. **Custom domain** — Pages settings, then DNS:
   - A records → GitHub Pages IPs (185.199.108-111.153)
   - `www` → `<gh-user>.github.io`
   - Tick "Enforce HTTPS" once cert provisions
3. **Form service** — deploy separately. See [aewvcompliance-forms](https://github.com/prasanthabr/aewvcompliance-forms). It needs `api.aewvcompliance.co.nz` pointing at your droplet IP.

## Editing the design

- **Tokens** — [`themes/aewv-compliance/data/design_tokens.yaml`](themes/aewv-compliance/data/design_tokens.yaml). The CSS reads from these via `resources.ExecuteAsTemplate`, so editing the YAML and rebuilding propagates everywhere.
- **Survey questions** — [`themes/aewv-compliance/data/survey.yaml`](themes/aewv-compliance/data/survey.yaml). Field types: `text`, `email`, `textarea`, `select`, `radio`. The Go service only enforces `company_name`, `email`, `accreditation` as required; everything else is forwarded as-is.
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

**Done (forms service):** Go HTTP service with JSONL storage, honeypot + rate limit, Kamal deployment config. Deployed separately at [aewvcompliance-forms](https://github.com/prasanthabr/aewvcompliance-forms).

**Next (iteration 2, when content needs them):** status badge component, table component, FAQ accordion, timeline, document checklist, pagination, breadcrumbs in UI, FAQ page type, compliance-process page type. Possibly Umami analytics (rentRant droplet has it at `analytics.rentrant.nz` — could share).

**End state:** once the AEWV product itself launches, the marketing site collapses to a blog. The form service evolves into the product's submission API.
