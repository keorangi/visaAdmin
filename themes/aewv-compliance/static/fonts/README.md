# Fonts

This theme self-hosts Inter for performance (one CSS request, no third-party DNS / TLS round trip, no external tracking).

To enable Inter, drop `InterVariable.woff2` into this directory:

```sh
curl -L -o themes/aewv-compliance/static/fonts/InterVariable.woff2 \
  https://github.com/rsms/inter/raw/master/docs/font-files/InterVariable.woff2
```

Until the file is present, the system-font stack defined in `data/design_tokens.yaml` (`-apple-system`, `Segoe UI`, `Roboto`, …) renders the site. The page will not error.

## Adding a mono font (optional)

If you want JetBrains Mono for code blocks, add `JetBrainsMono-Variable.woff2` here and add a matching `@font-face` to `assets/css/main.css`.
