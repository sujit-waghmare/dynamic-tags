/**
 * Converts hyphenated tag strings into readable title-case.
 * e.g. "personal-development" → "Personal Development"
 */
export function formatTagString(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
