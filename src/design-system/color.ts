export interface Rgb {
  r: number;
  g: number;
  b: number;
}

const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));

export function hexToRgb(hex: string): Rgb | null {
  let clean = String(hex).replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
  }
  if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

export function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const a = clamp(alpha * 255) / 255;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Number(a.toFixed(3))})`;
}

export function toRgbTuple(hex: string): [number, number, number] {
  const rgb = hexToRgb(hex);
  return rgb ? [rgb.r, rgb.g, rgb.b] : [0, 0, 0];
}

export function mix(c1: string, c2: string, ratio: number): string {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  if (!a || !b) return c1;
  const t = Math.max(0, Math.min(1, ratio));
  return rgbToHex(
    a.r * (1 - t) + b.r * t,
    a.g * (1 - t) + b.g * t,
    a.b * (1 - t) + b.b * t,
  );
}

export function lighten(hex: string, amount: number): string {
  const c = hexToRgb(hex);
  if (!c) return hex;
  return rgbToHex(
    c.r + (255 - c.r) * amount,
    c.g + (255 - c.g) * amount,
    c.b + (255 - c.b) * amount,
  );
}

export function darken(hex: string, amount: number): string {
  const c = hexToRgb(hex);
  if (!c) return hex;
  return rgbToHex(
    c.r * (1 - amount),
    c.g * (1 - amount),
    c.b * (1 - amount),
  );
}

export function luminance(hex: string): number {
  const c = hexToRgb(hex);
  if (!c) return 0;
  return (c.r * 299 + c.g * 587 + c.b * 114) / 255000;
}

export function readableOn(bgHex: string, darkText = "#0f172a", lightText = "#ffffff"): string {
  return luminance(bgHex) > 0.5 ? darkText : lightText;
}

export function adjustForMode(hex: string, mode: "dark" | "light", hover = 0.08, active = 0.14): { hover: string; active: string } {
  return mode === "dark"
    ? { hover: lighten(hex, hover), active: lighten(hex, active) }
    : { hover: darken(hex, hover), active: darken(hex, active) };
}
