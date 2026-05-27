export interface CustomFont {
  name: string;
  css: string;
}

/**
 * Rips ONLY the correct css2 URL from raw HTML/CSS blocks.
 */
export function extractCleanUrl(input: string): string {
  if (!input) return "";
  const css2Match = input.match(
    /(https:\/\/fonts\.googleapis\.com\/css2\?[^"'\s\)]+)/
  );
  if (css2Match) {
    return css2Match[1].replace(/&/g, "&");
  }
  return input.trim();
}

export function extractGoogleFonts(cleanUrl: string): CustomFont[] {
  if (!cleanUrl) return [];
  try {
    const url = new URL(cleanUrl);
    const families = url.searchParams.getAll("family");
    return families.map((f) => {
      const name = f.split(":")[0].replace(/\+/g, " ");
      return { name, css: `"${name}", sans-serif` };
    });
  } catch {
    return [];
  }
}

export function injectWebFonts(customFontUrl?: string): void {
  if (!document.getElementById("dynamic-tags-google-fonts")) {
    const link = document.createElement("link");
    link.id = "dynamic-tags-google-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Montserrat:ital,wght@0,400;0,700;1,400&family=Open+Sans:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Roboto:ital,wght@0,400;0,700;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap";
    document.head.appendChild(link);
  }

  let customLink = document.getElementById(
    "dynamic-tags-custom-fonts"
  ) as HTMLLinkElement | null;
  if (customFontUrl) {
    if (!customLink) {
      customLink = document.createElement("link");
      customLink.id = "dynamic-tags-custom-fonts";
      customLink.rel = "stylesheet";
      document.head.appendChild(customLink);
    }
    customLink.href = customFontUrl;
  } else if (customLink) {
    customLink.remove();
  }
}