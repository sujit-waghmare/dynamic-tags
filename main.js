const { Plugin, PluginSettingTab, Setting, editorLivePreviewField } = require('obsidian');
const { Decoration, ViewPlugin, MatchDecorator } = require('@codemirror/view');

const DEFAULT_SETTINGS = {
    defaultTagColor: 'rgba(255, 255, 255, 0.1)',
    textColor: '',
    fontFamily: '',
    customFontUrl: '',
    customFonts: [],
    isBold: false,
    isItalic: false,
    isUnderline: false
};

function formatTagString(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// ── SMART EXTRACTOR: Rips out ONLY the correct css2 URL from raw HTML/CSS blocks ──
function extractCleanUrl(input) {
    if (!input) return '';
    
    // specifically hunt for the Google Fonts css2 endpoint and stop at quotes or spaces
    const css2Match = input.match(/(https:\/\/fonts\.googleapis\.com\/css2\?[^"'\s\)]+)/);
    
    if (css2Match) {
        // Return the clean URL and fix any HTML-encoded ampersands
        return css2Match[1].replace(/&amp;/g, '&');
    }
    
    return input.trim();
}

// Parses the clean URL to get the font family names
function extractGoogleFonts(cleanUrl) {
    if (!cleanUrl) return [];
    try {
        const url = new URL(cleanUrl);
        const families = url.searchParams.getAll('family');
        return families.map(f => {
            const name = f.split(':')[0].replace(/\+/g, ' ');
            return { name: name, css: `"${name}", sans-serif` };
        });
    } catch (e) {
        return []; 
    }
}

const prefixMatcher = new MatchDecorator({
    regexp: /#(High|Medium|Mid|Low)[\/\-]/ig,
    decoration: match => Decoration.replace({})
});

const livePreviewPlugin = ViewPlugin.fromClass(class {
    constructor(view) { this.decorations = this.buildDecorations(view); }
    update(update) {
        if (update.docChanged || update.viewportChanged || update.state.field(editorLivePreviewField) !== update.startState.field(editorLivePreviewField)) {
            this.decorations = this.buildDecorations(update.view);
        }
    }
    buildDecorations(view) {
        return view.state.field(editorLivePreviewField) ? prefixMatcher.createDeco(view) : Decoration.none;
    }
}, { decorations: v => v.decorations });

class DynamicPriorityTags extends Plugin {
    async onload() {
        await this.loadSettings();
        this.addSettingTab(new DynamicTagSettingTab(this.app, this));
        
        this.injectWebFonts();
        this.updateStyle();

        this.registerMarkdownPostProcessor((element, context) => {
            const tags = element.querySelectorAll("a.tag");
            tags.forEach(tag => {
                const priorityMatch = tag.innerText.match(/^#(High|Medium|Mid|Low)[\/\-](.+)$/i);
                if (priorityMatch) {
                    tag.innerText = formatTagString(priorityMatch[2]);
                } else {
                    const rawText = tag.innerText.replace(/^#/, '');
                    tag.innerText = formatTagString(rawText);
                }
            });
        });

        this.registerEditorExtension(livePreviewPlugin);
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    injectWebFonts() {
        if (!document.getElementById('dynamic-tags-google-fonts')) {
            const link = document.createElement('link');
            link.id = 'dynamic-tags-google-fonts';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,700;1,400&family=Open+Sans:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:ital,wght@0,400;0,700;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap';
            document.head.appendChild(link);
        }

        let customLink = document.getElementById('dynamic-tags-custom-fonts');
        if (this.settings.customFontUrl) {
            if (!customLink) {
                customLink = document.createElement('link');
                customLink.id = 'dynamic-tags-custom-fonts';
                customLink.rel = 'stylesheet';
                document.head.appendChild(customLink);
            }
            customLink.href = this.settings.customFontUrl;
        } else if (customLink) {
            customLink.remove();
        }
    }

    updateStyle() {
        const body = document.body.style;
        body.setProperty('--dynamic-tag-bg', this.settings.defaultTagColor || 'rgba(255, 255, 255, 0.1)');
        body.setProperty('--dynamic-tag-color', this.settings.textColor || 'inherit');
        body.setProperty('--dynamic-tag-font', this.settings.fontFamily || 'inherit');
        body.setProperty('--dynamic-tag-weight', this.settings.isBold ? 'bold' : 'normal');
        body.setProperty('--dynamic-tag-style', this.settings.isItalic ? 'italic' : 'normal');
        body.setProperty('--dynamic-tag-decoration', this.settings.isUnderline ? 'underline' : 'none');
    }
}

class DynamicTagSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const {containerEl} = this;
        containerEl.empty();
        containerEl.createEl('h2', {text: 'Dynamic Tag Styling'});

        new Setting(containerEl)
            .setName('Background Color')
            .setDesc('Hex or RGBA color for the tag background.')
            .addText(text => text
                .setPlaceholder('rgba(255, 255, 255, 0.1)')
                .setValue(this.plugin.settings.defaultTagColor)
                .onChange(async (value) => {
                    this.plugin.settings.defaultTagColor = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateStyle();
                }));

        new Setting(containerEl)
            .setName('Text Color')
            .setDesc('Hex or RGBA color for the text. Leave empty for theme default.')
            .addText(text => text
                .setPlaceholder('#ffffff')
                .setValue(this.plugin.settings.textColor)
                .onChange(async (value) => {
                    this.plugin.settings.textColor = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateStyle();
                }));

        new Setting(containerEl)
            .setName('Custom Google Fonts URL')
            .setDesc('Paste the full HTML embed snippet or raw URL. The plugin will automatically extract the correct link.')
            .addText(text => text
                .setPlaceholder('<link href="https://fonts.googleapis.com...">')
                .setValue(this.plugin.settings.customFontUrl)
                .onChange(async (value) => {
                    const cleanUrl = extractCleanUrl(value);
                    this.plugin.settings.customFontUrl = cleanUrl;
                    this.plugin.settings.customFonts = extractGoogleFonts(cleanUrl);
                    await this.plugin.saveSettings();
                    this.plugin.injectWebFonts();
                    this.plugin.updateStyle();
                    
                    // If the plugin cleaned up HTML tags, instantly refresh the UI to show the clean URL
                    if (value !== cleanUrl || this.plugin.settings.customFonts.length > 0) {
                        this.display(); 
                    }
                }));

        const fontDropdown = new Setting(containerEl)
            .setName('Font Family')
            .setDesc('Select a font for your tags.');

        fontDropdown.addDropdown(dropdown => {
            dropdown.addOption('', 'Theme Default');
            dropdown.addOption("'Roboto', sans-serif", 'Roboto');
            dropdown.addOption("'Open Sans', sans-serif", 'Open Sans');
            dropdown.addOption("'Montserrat', sans-serif", 'Montserrat');
            dropdown.addOption("'Lora', serif", 'Lora');
            dropdown.addOption("'Merriweather', serif", 'Merriweather');
            dropdown.addOption("'Playfair Display', serif", 'Playfair Display');
            dropdown.addOption("'Courier Prime', monospace", 'Courier Prime');
            dropdown.addOption("'Space Mono', monospace", 'Space Mono');
            dropdown.addOption("'Comic Neue', cursive", 'Comic Neue');

            if (this.plugin.settings.customFonts && this.plugin.settings.customFonts.length > 0) {
                this.plugin.settings.customFonts.forEach(font => {
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
            .setName('Bold Text')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.isBold)
                .onChange(async (value) => {
                    this.plugin.settings.isBold = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateStyle();
                }));

        new Setting(containerEl)
            .setName('Italic Text')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.isItalic)
                .onChange(async (value) => {
                    this.plugin.settings.isItalic = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateStyle();
                }));

        new Setting(containerEl)
            .setName('Underline Text')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.isUnderline)
                .onChange(async (value) => {
                    this.plugin.settings.isUnderline = value;
                    await this.plugin.saveSettings();
                    this.plugin.updateStyle();
                }));

        // ── FONT PREVIEW SECTION ──
        containerEl.createEl('hr');
        containerEl.createEl('h2', {text: 'Font Preview'});

        let fontsToPreview = [
            { name: 'Roboto', css: "'Roboto', sans-serif" },
            { name: 'Open Sans', css: "'Open Sans', sans-serif" },
            { name: 'Montserrat', css: "'Montserrat', sans-serif" },
            { name: 'Lora', css: "'Lora', serif" },
            { name: 'Merriweather', css: "'Merriweather', serif" },
            { name: 'Playfair Display', css: "'Playfair Display', serif" },
            { name: 'Courier Prime', css: "'Courier Prime', monospace" },
            { name: 'Space Mono', css: "'Space Mono', monospace" },
            { name: 'Comic Neue', css: "'Comic Neue', cursive" }
        ];

        if (this.plugin.settings.customFonts && this.plugin.settings.customFonts.length > 0) {
            fontsToPreview = fontsToPreview.concat(this.plugin.settings.customFonts);
        }

        fontsToPreview.forEach(font => {
            containerEl.createEl('h3', {text: font.name, cls: 'font-preview-heading'});
            
            const previewBox = containerEl.createEl('div');
            previewBox.style.fontFamily = font.css;
            previewBox.style.marginBottom = '20px';
            previewBox.style.padding = '10px';
            previewBox.style.backgroundColor = 'var(--background-secondary)';
            previewBox.style.borderRadius = '5px';
            previewBox.style.color = 'var(--text-normal)';

            previewBox.createEl('div', {text: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG.'});
            previewBox.createEl('div', {text: 'the quick brown fox jumps over the lazy dog.'});
        });
    }
}

module.exports = DynamicPriorityTags;