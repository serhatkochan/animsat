export const MIN_GRADIENT_STOPS = 2;
export const MAX_GRADIENT_STOPS = 5;

export const DEFAULT_GRADIENT_COLORS = ['#C45C4A', '#E08B62', '#F0D0B8'];

type GradientSource = {
  gradientColors?: string[];
  color: string;
  colorSecondary?: string;
};

function normalizeHex(color: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  if (/^[0-9A-Fa-f]{6}$/.test(color)) return `#${color}`;
  return DEFAULT_GRADIENT_COLORS[0];
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = normalizeHex(hex).slice(1);
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

/** HSV: h 0–360, s/v 0–100. Panel3 tekerleğindeki konum için. */
export function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const { r, g, b } = hexToRgb(hex);
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }
  if (hue < 0) hue += 360;

  return {
    h: hue,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (channel: number) => Math.max(0, Math.min(255, Math.round(channel)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}

export function interpolateHex(from: string, to: string, amount: number): string {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  const ratio = Math.max(0, Math.min(1, amount));

  return rgbToHex(
    start.r + (end.r - start.r) * ratio,
    start.g + (end.g - start.g) * ratio,
    start.b + (end.b - start.b) * ratio,
  );
}

export function resolveGradientColors(source: GradientSource): string[] {
  if (source.gradientColors?.length) {
    return clampGradientColors(source.gradientColors);
  }

  if (source.colorSecondary) {
    return clampGradientColors([source.color, source.colorSecondary]);
  }

  return clampGradientColors([source.color, source.color]);
}

export function clampGradientColors(colors: string[]): string[] {
  const normalized = colors.map(normalizeHex).filter(Boolean);
  if (normalized.length >= MIN_GRADIENT_STOPS) {
    return normalized.slice(0, MAX_GRADIENT_STOPS);
  }

  if (normalized.length === 1) {
    return [normalized[0], normalized[0]];
  }

  return [...DEFAULT_GRADIENT_COLORS];
}

export function getGradientLocations(colors: string[]): [number, number, ...number[]] {
  if (colors.length <= 1) return [0, 1];
  return colors.map((_, index) => index / (colors.length - 1)) as [number, number, ...number[]];
}

export function addGradientStop(colors: string[], activeIndex: number): string[] {
  if (colors.length >= MAX_GRADIENT_STOPS) return colors;

  const safeIndex = Math.max(0, Math.min(activeIndex, colors.length - 1));
  const left = colors[safeIndex];
  const right = colors[safeIndex + 1] ?? colors[safeIndex];
  const newColor = interpolateHex(left, right, 0.5);
  const next = [...colors];
  next.splice(safeIndex + 1, 0, newColor);
  return clampGradientColors(next);
}

export function removeGradientStop(colors: string[], index: number): string[] {
  if (colors.length <= MIN_GRADIENT_STOPS) return colors;
  return clampGradientColors(colors.filter((_, itemIndex) => itemIndex !== index));
}

export function syncGradientLegacyFields(colors: string[]): {
  color: string;
  colorSecondary: string;
  gradientColors: string[];
} {
  const gradientColors = clampGradientColors(colors);
  return {
    gradientColors,
    color: gradientColors[0],
    colorSecondary: gradientColors[gradientColors.length - 1],
  };
}
