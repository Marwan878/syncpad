export default function hexToRgba(hex: string, alpha = 1) {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Convert shorthand (e.g. #f00) to full form (e.g. #ff0000)
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse r, g, b
  const bigint = parseInt(hex, 16);

  // Consider the first 8 bits and discard the rest
  const r = (bigint >> 16) & 255;
  // Consider the next 8 bits and discard the rest
  const g = (bigint >> 8) & 255;
  // Consider the last 8 bits and discard the rest
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
