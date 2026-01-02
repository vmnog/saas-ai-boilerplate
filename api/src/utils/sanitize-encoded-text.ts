export function sanitizeEncodedText(str: string): string {
  try {
    // Use NFKD normalization which is better for composed characters like á, é, ñ
    return str.normalize("NFKD");
  } catch (error) {
    console.error("Error sanitizing text:", error);
    // Return a cleaned version of the string by removing problematic characters
    // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
    return str.replace(/[\u0000-\u001F\u007F-\u009F\u{FFFF}]/gu, "");
  }
}
