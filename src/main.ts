import { Plugin } from "obsidian";
import {
  DynamicTagSettingTab,
  DynamicTagSettings,
  DEFAULT_SETTINGS,
} from "./settings";
import { livePreviewPlugin } from "./live-preview";
import { injectWebFonts } from "./utils/font-extractor";
import { formatTagString } from "./utils/tag-formatter";

export default class DynamicTags extends Plugin {
  settings!: DynamicTagSettings;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new DynamicTagSettingTab(this.app, this));

    injectWebFonts(this.settings.customFontUrl);
    this.updateStyle();

    this.registerMarkdownPostProcessor((element, _context) => {
      const tags = element.querySelectorAll<HTMLAnchorElement>("a.tag");
      tags.forEach((tag) => {
        const priorityMatch = tag.innerText.match(
          /^#(High|Medium|Mid|Low|Pending|In-progress|Submitted|In-review|Success|Failed|Expired|Re-schedule)[\/\-](.+)$/i
        );
        if (priorityMatch) {
          tag.innerText = formatTagString(priorityMatch[2]);
        } else {
          const rawText = tag.innerText.replace(/^#/, "");
          tag.innerText = formatTagString(rawText);
        }
      });
    });

    this.registerEditorExtension(livePreviewPlugin);
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      await this.loadData()
    );
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  updateStyle(): void {
    const body = document.body.style;
    body.setProperty(
      "--dynamic-tag-bg",
      this.settings.defaultTagColor || "rgba(255, 255, 255, 0.1)"
    );
    body.setProperty(
      "--dynamic-tag-color",
      this.settings.textColor || "inherit"
    );
    body.setProperty(
      "--dynamic-tag-font",
      this.settings.fontFamily || "inherit"
    );
    body.setProperty(
      "--dynamic-tag-weight",
      this.settings.isBold ? "bold" : "normal"
    );
    body.setProperty(
      "--dynamic-tag-style",
      this.settings.isItalic ? "italic" : "normal"
    );
    body.setProperty(
      "--dynamic-tag-decoration",
      this.settings.isUnderline ? "underline" : "none"
    );
  }
}