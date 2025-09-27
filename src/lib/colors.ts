/**
 * Converts a hex color string to an HSL color object.
 * @param hex - The hex color string (e.g., "#RRGGBB").
 * @returns An object with h, s, and l properties.
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

type HslAdjustments = {
    hue?: (h: number) => number;
    saturation?: (s: number) => number;
    lightness?: (l: number) => number;
};

/**
 * Converts a hex color to an HSL string for use in CSS variables.
 * @param hex - The hex color string.
 * @param adjustments - Optional functions to adjust H, S, or L values.
 * @returns A string in the format "H S% L%".
 */
export function hexToHslString(hex: string, adjustments: HslAdjustments = {}): string {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    return '0 0% 0%';
  }
  
  let { h, s, l } = hexToHsl(hex);

  if (adjustments.hue) h = adjustments.hue(h);
  if (adjustments.saturation) s = adjustments.saturation(s);
  if (adjustments.lightness) l = adjustments.lightness(l);

  h = Math.round(h);
  s = Math.round(s);
  l = Math.round(l);

  return `${h} ${s}% ${l}%`;
}
