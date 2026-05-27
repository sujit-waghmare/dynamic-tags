import { App, PluginSettingTab, Setting } from "obsidian";
import type DynamicTags from "./main";
import {
  extractCleanUrl,
  extractGoogleFonts,
  CustomFont,
} from "./utils/font-extractor";

export interface DynamicTagSettings {
  defaultTagColor: string;
  textColor: string;
  fontFamily: string;
  customFontUrl: string;
  customFonts: CustomFont[];
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
}

export const DEFAULT_SETTINGS: DynamicTagSettings = {
  defaultTagColor: "rgba(255, 255, 255, 0.1)",
  textColor: "",
  fontFamily: "",
  customFontUrl: "",
  customFonts: [],
  isBold: false,
  isItalic: false,
  isUnderline: false,
};

const BUILT_IN_FONTS = [
  { name: "Roboto", css: "'Roboto', sans-serif" },
  { name: "Open Sans", css: "'Open Sans', sans-serif" },
  { name: "Montserrat", css: "'Montserrat', sans-serif" },
  { name: "Lora", css: "'Lora', serif" },
  { name: "Merriweather", css: "'Merriweather', serif" },
  { name: "Playfair Display", css: "'Playfair Display', serif" },
  { name: "Courier Prime", css: "'Courier Prime', monospace" },
  { name: "Space Mono", css: "'Space Mono', monospace" },
  { name: "Comic Neue", css: "'Comic Neue', cursive" },
];

export class DynamicTagSettingTab extends PluginSettingTab {
  plugin: DynamicTags;

  constructor(app: App, plugin: DynamicTags) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Dynamic Tag Styling" });

    new Setting(containerEl)
      .setName("Background Color")
      .setDesc("Hex or RGBA color for the tag background.")
      .addText((text) =>
        text
          .setPlaceholder("rgba(255, 255, 255, 0.1)")
          .setValue(this.plugin.settings.defaultTagColor)
          .onChange(async (value) => {
            this.plugin.settings.defaultTagColor = value;
            await this.plugin.saveSettings();
            this.plugin.updateStyle();
          })
      );

    new Setting(containerEl)
      .setName("Text Color")
      .setDesc("Hex or RGBA color for the text. Leave empty for theme default.")
      .addText((text) =>
        text
          .setPlaceholder("#ffffff")
          .setValue(this.plugin.settings.textColor)
          .onChange(async (value) => {
            this.plugin.settings.textColor = value;
            await this.plugin.saveSettings();
            this.plugin.updateStyle();
          })
      );

    new Setting(containerEl)
      .setName("Custom Google Fonts URL")
      .setDesc(
        "Paste the full HTML embed snippet or raw URL. The plugin will automatically extract the correct link."
      )
      .addText((text) =>
        text
          .setPlaceholder('<link href="https://fonts.googleapis.com...">')
          .setValue(this.plugin.settings.customFontUrl)
          .onChange(async (value) => {
            const cleanUrl = extractCleanUrl(value);
            this.plugin.settings.customFontUrl = cleanUrl;
            this.plugin.settings.customFonts = extractGoogleFonts(cleanUrl);
            await this.plugin.saveSettings();
            injectWebFontsRefresh(this.plugin);
            if (value !== cleanUrl || this.plugin.settings.customFonts.length > 0) {
              this.display();            }
          })
      );

    const fontDropdown = new Setting(containerEl)
      .setName("Font Family")
      .setDesc("Select a font for your tags.");

    fontDropdown.addDropdown((dropdown) => {
      dropdown.addOption("", "Theme Default");
      BUILT_IN_FONTS.forEach((f) => dropdown.addOption(f.css, f.name));

      if (
        this.plugin.settings.customFonts &&
        this.plugin.settings.customFonts.length > 0
      ) {
        this.plugin.settings.customFonts.forEach((font) => {
          dropdown.addOption(font.css, `${font.name} (Custom)`);
        });
      }

      dropdown.setValue(this.plugin.settings.fontFamily);
      dropdown.onChange(async (value) => {
        this.plugin.settings.fontFamily = value;
        await this.plugin.saveSettings();
        this.plugin.updateStyle();
      });
    });

    new Setting(containerEl)
      .setName("Bold Text")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.isBold)
          .onChange(async (value) => {
            this.plugin.settings.isBold = value;
            await this.plugin.saveSettings();
            this.plugin.updateStyle();
          })
      );

    new Setting(containerEl)
      .setName("Italic Text")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.isItalic)
          .onChange(async (value) => {
            this.plugin.settings.isItalic = value;
            await this.plugin.saveSettings();
            this.plugin.updateStyle();          })
      );

    new Setting(containerEl)
      .setName("Underline Text")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.isUnderline)
          .onChange(async (value) => {
            this.plugin.settings.isUnderline = value;
            await this.plugin.saveSettings();
            this.plugin.updateStyle();
          })
      );

    containerEl.createEl("hr");
    containerEl.createEl("h2", { text: "Font Preview" });

    let fontsToPreview = [...BUILT_IN_FONTS];
    if (
      this.plugin.settings.customFonts &&
      this.plugin.settings.customFonts.length > 0
    ) {
      fontsToPreview = fontsToPreview.concat(this.plugin.settings.customFonts);
    }

    fontsToPreview.forEach((font) => {
      containerEl.createEl("h3", { text: font.name, cls: "font-preview-heading" });
      const previewBox = containerEl.createEl("div");
      previewBox.style.fontFamily = font.css;
      previewBox.style.marginBottom = "20px";
      previewBox.style.padding = "10px";
      previewBox.style.backgroundColor = "var(--background-secondary)";
      previewBox.style.borderRadius = "5px";
      previewBox.style.color = "var(--text-normal)";
      previewBox.createEl("div", {
        text: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.",
      });
      previewBox.createEl("div", {
        text: "the quick brown fox jumps over the lazy dog.",
      });
    });
  }
}

function injectWebFontsRefresh(plugin: DynamicTags): void {
  const customLink = document.getElementById(
    "dynamic-tags-custom-fonts"
  ) as HTMLLinkElement | null;
  if (plugin.settings.customFontUrl) {    if (customLink) {
      customLink.href = plugin.settings.customFontUrl;
    } else {
      injectWebFonts(plugin.settings.customFontUrl);
    }
  } else if (customLink) {
    customLink.remove();
  }
  plugin.updateStyle();
}