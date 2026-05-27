# Dynamic Tags

<img src="https://img.shields.io/github/v/release/sujit-waghmare/dynamic-tags?color=blue&style=flat-square" /><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" /><br><img src="https://img.shields.io/github/release-date/sujit-waghmare/dynamic-tags?style=flat-square" />
<img src="https://img.shields.io/badge/Author-Waghmare-orange?style=flat-square" /><br>
<img src="https://img.shields.io/badge/Plugin%20ID-dynamic--tags-lightgrey?style=flat-square" /><br><img src="https://img.shields.io/badge/Mobile%20Friendly-Yes-brightgreen?style=flat-square" />

Dynamically strips priority prefixes, formats multi-word tags, and customizes base tag styling for Obsidian.

| Tag Showcase | Tag Nesting |
| :--- | :--- |
| ![Tag Showcase](https://github.com/sujit-waghmare/dynamic-tags/blob/48936e05a13990119345cc5c37dd75d71ad97ecc/assets/tags-showcase.gif) | ![Tag Nesting](https://github.com/sujit-waghmare/dynamic-tags/blob/48936e05a13990119345cc5c37dd75d71ad97ecc/assets/tags-nesting.gif) |

---

## Installation

You only need **3 files**. No build tools, no terminal.

**Step 1** — Open your vault folder and navigate to:
```
YourVault/.obsidian/plugins/
```

**Step 2** — Create a new folder named exactly:
```
dynamic-tags
```

**Step 3** — Paste these files inside it:
```
YourVault/
  └── .obsidian/
      └── plugins/
          └── dynamic-tags/
              ├── main.js
              ├── manifest.json
              └── styles.css
```

**Step 4** — Open Obsidian → Settings → Community Plugins → Turn off Restricted Mode.

**Step 5** — Find **Dynamic Tags** in the installed plugins list and toggle it **ON**.

> [!warning] After updating `main.js` or `styles.css`, always **toggle the plugin OFF → ON** in settings. Obsidian caches the old version in memory until you do this.

---

## Plugin Settings

Go to `Settings → Dynamic Tags` to configure.

### Visuals & Colors

| Setting | Description |
|---|---|
| **Background Color** | Hex or RGBA color for standard tag backgrounds. Priority tags ignore this. |
| **Text Color** | Hex or RGBA color for the tag text. |

### Typography

| Setting | Description |
|---|---|
| **Custom Google Fonts URL** | Paste a Google Fonts URL, `<link>` embed, or `@import`. The plugin extracts the raw CSS link automatically. |
| **Font Family** | Dropdown with standard web-safe fonts, built-in Google fonts, and any custom fonts you added. |
| **Font Styles** | Toggles for **Bold**, **Italic**, and **Underline**. All three can be active simultaneously. |

### Font Preview

At the bottom of the settings tab, the plugin renders a live preview of every font in your dropdown so you can verify they work on your device before applying.

---

## How to Use

### Priority Tags

Type the tag normally. The plugin hides the `#` and turns it into a colored pill.

| Tag | Result |
|---|---|
| `#High` | Red pill |
| `#Medium` / `#Mid` | Purple pill |
| `#Low` | Blue pill |

### Nested Priority Tags

Use a forward slash `/` to categorize.

- `#High/Work` → renders as **Work** in a red priority pill
- `#Mid/Physics` → renders inside a purple priority pill

> The priority level (`#High`, `#Medium`, `#Low`) **must** be the first word. Case does not matter — `#high/work` works perfectly, but `#Work/high` does not.

### Status Tags

| Tag | Color |
|---|---|
| `#Pending` | Orange/Brown |
| `#In-progress` | Blue |
| `#Submitted` | Purple |
| `#In-review` | Yellow/Olive |
| `#Success` | Green |
| `#Failed` | Dark Red |
| `#Expired` | Grey |

### Normal Multi-Word Tags

Use hyphens for multi-word tags. The plugin formats them into clean, readable text.

- `#Personal-Development` → renders as **Personal Development**
- `#Philosophical-Fiction` → renders as **Philosophical Fiction**

These standard tags inherit your custom background color, text color, and font from the plugin settings.

---

## Troubleshooting

**My custom Google Font isn't working on mobile**
Ensure you pasted the Google Fonts URL into the plugin settings. Web-safe fonts like Arial do not exist natively on Android. The plugin must inject the CSS link from Google Fonts to force the mobile app to display them.

**Priority tags look messy in Source Mode**
Source Mode disables the CodeMirror widget so your cursor doesn't break while editing raw text. Tags will display with their `#` prefix intact, but retain a faint background highlight for visual scanning.

**I updated `main.js` but it's running the old code**
Toggle the plugin **OFF → ON** in Settings → Community Plugins after replacing any file.

---

## FAQ

**Q: Can I change the priority colors?**
Yes, but you must manually edit the RGBA values inside `styles.css` under the "Colors and Icons" section. The settings tab background color only applies to standard tags.

**Q: Does this break standard Obsidian search?**
No. The plugin only alters the *visual output* on your screen using JavaScript widgets and CSS. The raw text inside your `.md` files remains completely untouched.

**Q: Why do I see a flash of the old tag when switching modes?**
CodeMirror takes a fraction of a millisecond to apply the visual widget when swapping from Reading View to Live Preview. This brief flash is a normal limitation of Obsidian's text engine.

---

## ☕ Support
Building and maintaining these tools takes significant time and energy. Your tips keep the caffeine flowing and helps me stay focused on delivering high-quality, reliable products for the community. 

<p align="left">
  <a href="https://paypal.me/waghmaresujit">
    <img src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" height="36" />
  </a>
  <a href="https://ko-fi.com/sujitwaghmare">
    <img src="https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white" height="36" />
  </a>
  <img src="https://img.shields.io/badge/UPI_(_Scan_Below_)-122E31?style=for-the-badge&logo=upi&logoColor=white" height="36" />
</p>

<details>
<summary><b>Donate via UPI (QR Code)</b></summary>
<br>
<p align="left">
<img src="https://img.shields.io/badge/exotic.sus@axl-122E31?style=for-the-badge&logo=upi&logoColor=white" />
</p>
<img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=exotic.sus@axl&pn=Sujit%20Rajabhau%20Waghmare&cu=INR" alt="UPI QR Code" />
</details>
