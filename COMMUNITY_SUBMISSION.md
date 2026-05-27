# Obsidian Community Plugin Submission

This document contains the information required to submit **Dynamic Tags** to the
[Obsidian Community Plugins repository](https://github.com/obsidianmd/obsidian-releases).

## Submission Checklist

- [x] Plugin ID matches folder name: `dynamic-tags`
- [x] `manifest.json` contains valid `id`, `name`, `version`, `minAppVersion`, `description`, `author`, `authorUrl`
- [x] `versions.json` maps plugin version → minimum Obsidian version
- [x] `main.js` is the compiled CommonJS bundle
- [x] `styles.css` contains only plugin-specific styles (no global overrides)
- [x] Plugin does not modify user files on disk
- [x] Plugin does not make network requests outside of Google Fonts (user-provided)
- [x] Plugin works on both Desktop and Mobile
- [x] MIT license included

## Pull Request Template

When opening the PR to `obsidian-releases`, add this entry to `community-plugin-stats.json`:

```json
{
  "id": "dynamic-tags",
  "name": "Dynamic Tags",
  "author": "Waghmare",
  "description": "Dynamically strips priority prefixes, formats multi-word tags, and customizes base tag styling. Adds 7 status tags with Lucide icons.",
  "repo": "sujit-waghmare/dynamic-tags"
}
```

And to `community-plugins.json`:

```json
{
  "id": "dynamic-tags",
  "name": "Dynamic Tags",
  "author": "Waghmare",
  "description": "Priority tags, status tags, nested tags, and custom tag styling with Google Fonts support.",
  "repo": "sujit-waghmare/dynamic-tags"
}
```

## Release Process

1. Bump version in `manifest.json`, `package.json`, and `versions.json`:
```bash
   npm run version -- 1.5.6
```
2. Build:
```bash
   npm run build
```
3. Commit and tag:
```bash
   git tag -a 1.5.6 -m "1.5.6"
   git push origin 1.5.6
```
4. GitHub Actions automatically creates a draft release with `main.js`, `manifest.json`, and `styles.css`.
5. Publish the release, then open a PR to `obsidian-releases` updating `community-plugin-versions.json`.

## Security & Privacy Notes

- The plugin injects Google Fonts `<link>` tags into the document head. Only fonts explicitly chosen by the user (or the built-in safe-list) are loaded.
- No user content is transmitted to any external server.
- All tag transformations are visual-only (CSS + DOM decoration); markdown source files are never modified.