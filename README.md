# Easy BPM Public Docs

This site is built with [Docusaurus](https://docusaurus.io/).

## Install

```bash
npm ci
```

## Development

```bash
npm run start
```

This starts the Docusaurus development server with live reload.

## Search

The docs use local/offline search. The search index is generated only during production build, so the search box is limited in `npm run start`.

Use this command when you need to test search locally:

```bash
npm run serve:search
```

That script runs `npm run build` first, then serves the generated static site with the search index available.

## Build

```bash
npm run build
```

The generated static site is written to `build`.

## Versioning

Documentation versions are created from the current `docs` snapshot with Docusaurus.

```bash
npm run docusaurus docs:version v0.1.5-beta.2
```

This creates:

- `versions.json`
- `versioned_docs/version-v0.1.5-beta.2`
- `versioned_sidebars/version-v0.1.5-beta.2-sidebars.json`

The default version is `v0.1.5-beta.2`, at `/docs`. The version selector also includes `Next`, at `/docs/next`, built from the current `docs` directory, and `v0.1.4-beta.2`, at `/docs/v0.1.4-beta.2`. The `v0.1.5-beta.2` snapshot corresponds to the [backend release commit](https://github.com/Easy-BPM/easyBPM/commit/cddfe694924777da13d917506534863a5cb137d0).

Keep `docs` as the source for the next release. Changes there appear in `Next`; they do not change the frozen release snapshot. Create each new snapshot after updating that source.
