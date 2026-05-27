# Changelog

All notable changes to the **Dynamic Tags** Obsidian plugin are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.5.5] — 2026-05-28

### Added
- Official documentation for **Nested Status Tags**.
- Nested tags like `#Success/To-Do` now render as "To Do" inside their respective status color pills with icons.

## [1.5.0] — 2026-03-12

### Added
- 7 new status tags with Lucide icons:
  - `#Pending` (orange)
  - `#In-progress` (blue)
  - `#Submitted` (purple)
  - `#In-review` (yellow/olive)
  - `#Success` (green)
  - `#Failed` (dark red)
  - `#Expired` (grey)
- Each status tag ships with background color, border, and inline SVG icon.

### Fixed
- Plugin's universal `.tag` rule no longer overrides status tag styles.

## [1.4.1] — 2025-11-04

### Fixed
- URL extractor bug: plugin now safely rips the raw `css2` Google Fonts URL directly out of full HTML embed blocks or `@import` snippets.

## [1.4.0] — 2025-09-22

### Added
- Dynamic Google Fonts URL parser. Custom fonts automatically inject into the stylesheet and appear in the dropdown/preview list.

## [1.3.0] — 2025-07-10

### Added
- Font style modifiers: **bold**, *italic*, <u>underline</u>.
- Standard web-safe font selection with live UI preview.

## [1.2.0] — 2025-05-01

### Added
- Customizable background color and text color for standard tags.

### Fixed
- Isolated priority tag styling to prevent visual conflicts with themes.

## [1.1.0] — 2025-02-14

### Added
- Support for nested priority tags (e.g. `#high/work`).
- Dynamic string formatting (removed hyphens, injected spaces, title-cased words).

## [1.0.0] — 2024-12-01

### Added
- Initial release: base priority tags (`#high`, `#low`, `#mid`, `#medium`).