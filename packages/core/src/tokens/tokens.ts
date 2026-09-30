/**
 * ═══════════════════════════════════════════════════════════════════════
 *  A3MK-UI — Design Tokens System
 *  نظام التوكنز التصميمية
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  @file    tokens.ts
 *  @package @a3mk-ui/core
 *  @version 1.0.0
 *  @author  essam664
 *  @license MIT
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  ⚠️ ملاحظة معمارية:
 *  ─────────────────────────────────────────────────────────────────────
 *  هذا الملف Pure 100% — لا يستورد أي شيء من a3mk.config.ts
 *
 *  السبب:
 *    • تجنّب Circular Dependency بين config و tokens
 *    • الـ prefix يُمرَّر كـ parameter لكل دالة
 *    • الاتجاه: config → tokens (One-way فقط)
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 0 — Utilities
 * ═══════════════════════════════════════════════════════════════════════ */

function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.documentElement !== 'undefined'
  );
}

function kebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 1 — Core Types
 * ═══════════════════════════════════════════════════════════════════════ */

export type TokenValue = string | number;

export type TokenSet = {
  readonly [key: string]: TokenValue | TokenSet;
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 2 — Colors (Dark Theme - Glassmorphism)
 * ═══════════════════════════════════════════════════════════════════════ */

export const colors = {
  /* ── الخلفيات ── */
  bg: {
    1: '#0a0a0a',
    2: '#141418',
    3: '#1c1c22',
    overlay: 'rgba(0, 0, 0, 0.6)',
    backdrop: 'rgba(0, 0, 0, 0.85)',
  },

  /* ── الزجاج (Glass) ── */
  glass: {
    bg: 'rgba(25, 25, 30, 0.55)',
    border: 'rgba(255, 255, 255, 0.07)',
    highlight: 'rgba(255, 255, 255, 0.22)',
    shadow: 'rgba(0, 0, 0, 0.5)',
    inset: 'rgba(255, 255, 255, 0.06)',
    press: 'rgba(0, 0, 0, 0.3)',
  },

  /* ── النصوص ── */
  text: {
    primary: '#eaeaf0',
    secondary: 'rgba(255, 255, 255, 0.7)',
    dim: 'rgba(255, 255, 255, 0.4)',
    disabled: 'rgba(255, 255, 255, 0.25)',
    inverse: '#0a0a0a',
  },

  /* ── الألوان الدلالية ── */
  semantic: {
    primary: '#7c3aed',
    secondary: '#3b82f6',
    success: '#86efac',
    warning: '#fbbf24',
    danger: '#ef4444',
    error: '#ef4444',
    info: '#60a5fa',
  },

  /* ── الحدود ── */
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.15)',
    strong: 'rgba(255, 255, 255, 0.25)',
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 3 — Radius
 * ═══════════════════════════════════════════════════════════════════════ */

export const radius = {
  none: '0',
  xs: '6px',
  sm: '8px',
  md: '12px',
  lg: '18px',
  xl: '24px',
  xxl: '32px',
  pill: '999px',
  circle: '50%',
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 4 — Blur
 * ═══════════════════════════════════════════════════════════════════════ */

export const blur = {
  none: '0',
  xs: '4px',
  sm: '8px',
  md: '14px',
  lg: '20px',
  xl: '30px',
  xxl: '40px',
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 5 — Shadows
 * ═══════════════════════════════════════════════════════════════════════ */

export const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.2)',
  sm: '0 2px 6px rgba(0, 0, 0, 0.3)',
  md: '0 4px 14px rgba(0, 0, 0, 0.4)',
  lg: '0 12px 40px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 60px rgba(0, 0, 0, 0.7)',
  xxl: '0 30px 80px rgba(0, 0, 0, 0.8)',
  insetTop: 'inset 0 1px 0 rgba(255, 255, 255, 0.22)',
  insetBottom: 'inset 0 -1px 0 rgba(0, 0, 0, 0.15)',
  insetDeep: 'inset 0 2px 8px rgba(0, 0, 0, 0.45)',
  insetGlow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3)',
  glowPrimary: '0 0 20px rgba(124, 58, 237, 0.3)',
  glowSuccess: '0 0 20px rgba(134, 239, 172, 0.3)',
  glowDanger: '0 0 20px rgba(239, 68, 68, 0.3)',
  glowInfo: '0 0 20px rgba(96, 165, 250, 0.3)',
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 6 — Easing
 * ═══════════════════════════════════════════════════════════════════════ */

export const easing = {
  linear: 'linear',
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  soft: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  inExpo: 'cubic-bezier(0.7, 0, 0.84, 0)',
  default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 7 — Duration
 * ═══════════════════════════════════════════════════════════════════════ */

export const duration = {
  instant: '0.05s',
  fastest: '0.1s',
  faster: '0.15s',
  fast: '0.2s',
  normal: '0.3s',
  slow: '0.4s',
  slower: '0.5s',
  slowest: '0.8s',
  long: '1s',
  extraLong: '2s',
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 8 — Spacing (4pt Grid)
 * ═══════════════════════════════════════════════════════════════════════ */

export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 9 — Typography
 * ═══════════════════════════════════════════════════════════════════════ */

export const typography = {
  fontFamily: {
    sans: "'Segoe UI', Tahoma, system-ui, -apple-system, sans-serif",
    mono: "'Courier New', 'SF Mono', Monaco, monospace",
    arabic: "'Cairo', 'Tajawal', 'Segoe UI', Tahoma, sans-serif",
  },
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    md: '14px',
    lg: '15px',
    xl: '16px',
    xxl: '18px',
    h6: '20px',
    h5: '24px',
    h4: '28px',
    h3: '32px',
    h2: '40px',
    h1: '48px',
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 10 — Z-Index
 * ═══════════════════════════════════════════════════════════════════════ */

export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
  max: 9999,
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 11 — Breakpoints
 * ═══════════════════════════════════════════════════════════════════════ */

export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '900px',
  lg: '1200px',
  xl: '1536px',
  xxl: '1920px',
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 12 — Transitions
 * ═══════════════════════════════════════════════════════════════════════ */

export const transitions = {
  button: `background ${duration.normal} ${easing.smooth},
           border-color ${duration.normal} ${easing.smooth},
           box-shadow ${duration.normal} ${easing.smooth},
           color ${duration.normal} ${easing.smooth}`,
  input: `background ${duration.fast} ${easing.smooth},
          border-color ${duration.fast} ${easing.smooth},
          box-shadow ${duration.fast} ${easing.smooth}`,
  card: `transform ${duration.normal} ${easing.out},
         box-shadow ${duration.normal} ${easing.smooth}`,
  modal: `opacity ${duration.slow} ${easing.out},
          transform ${duration.slow} ${easing.outBack}`,
  tooltip: `opacity ${duration.fast} ${easing.out},
            transform ${duration.fast} ${easing.out}`,
  dropdown: `opacity ${duration.fast} ${easing.out},
             transform ${duration.fast} ${easing.out}`,
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 13 — All Tokens (Unified)
 * ═══════════════════════════════════════════════════════════════════════ */

export const tokens = {
  colors,
  radius,
  blur,
  shadows,
  easing,
  duration,
  spacing,
  typography,
  zIndex,
  breakpoints,
  transitions,
} as const;

export type A3MKTokens = typeof tokens;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 14 — Flatten to CSS Variables (Pure)
 * ═══════════════════════════════════════════════════════════════════════ */

function flattenTokens(
  obj: Record<string, unknown>,
  prefix = ''
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}-${kebab(key)}` : kebab(key);

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenTokens(value as Record<string, unknown>, newKey));
    } else if (value !== undefined && value !== null) {
      result[newKey] = String(value);
    }
  }

  return result;
}

/**
 * توليد كل الـ CSS Variables
 *
 * ✅ Pure Function — لا تعتمد على أي import خارجي
 * الـ prefix يُمرَّر كـ parameter من الـ Config
 *
 * @example
 *   const vars = generateCSSVariables('a3mk');
 *   // => { '--a3mk-color-bg-1': '#0a0a0a', ... }
 */
export function generateCSSVariables(prefix = 'a3mk'): Record<string, string> {
  const flat = flattenTokens(tokens as unknown as Record<string, unknown>);
  const variables: Record<string, string> = {};

  for (const [key, value] of Object.entries(flat)) {
    variables[`--${prefix}-${key}`] = value;
  }

  return variables;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 15 — Generate CSS String (Pure)
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * توليد سلسلة CSS كاملة
 *
 * @example
 *   generateCSSString('a3mk', ':root')
 *   // => ':root {\n  --a3mk-color-bg-1: #0a0a0a;\n  ...\n}'
 */
export function generateCSSString(prefix = 'a3mk', selector = ':root'): string {
  const variables = generateCSSVariables(prefix);
  const lines: string[] = [`${selector} {`];

  for (const [key, value] of Object.entries(variables)) {
    lines.push(`  ${key}: ${value};`);
  }

  lines.push('}');
  return lines.join('\n');
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 16 — Inject to DOM (SSR-Safe)
 * ═══════════════════════════════════════════════════════════════════════ */

const STYLE_ELEMENT_ID = 'a3mk-tokens';

/**
 * حقن التوكنز في DOM (في <head>)
 *
 * ✅ Pure Signature — الـ prefix يُمرَّر من الـ Config
 * ✅ SSR-Safe — محمي بـ isBrowser()
 */
export function injectTokens(prefix = 'a3mk', selector = ':root'): void {
  if (!isBrowser()) return;

  try {
    const existing = document.getElementById(STYLE_ELEMENT_ID);
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = STYLE_ELEMENT_ID;
    style.textContent = generateCSSString(prefix, selector);

    document.head.appendChild(style);
  } catch (err) {
    console.error('[A3MK-UI] Error injecting tokens:', err);
  }
}

/**
 * إزالة التوكنز من DOM
 */
export function removeTokens(): void {
  if (!isBrowser()) return;
  const existing = document.getElementById(STYLE_ELEMENT_ID);
  if (existing) existing.remove();
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 17 — Direct Access (Pure)
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * الحصول على CSS Variable محدد
 */
export function getCSSVar(name: string, prefix = 'a3mk'): string {
  return `var(--${prefix}-${name})`;
}

/**
 * الحصول على قيمة توكن معين
 *
 * @example
 *   getToken('colors.bg.1')
 *   // => '#0a0a0a'
 */
export function getToken(path: string): TokenValue | undefined {
  const keys = path.split('.').filter(Boolean);
  let current: unknown = tokens;

  for (const key of keys) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }

  if (typeof current === 'string' || typeof current === 'number') {
    return current;
  }

  return undefined;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 18 — Light Theme (Complete)
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * ثيم فاتح (Light Mode) — مكتمل
 */
export const lightThemeColors = {
  bg: {
    1: '#ffffff',
    2: '#f5f5f7',
    3: '#eaeaf0',
    overlay: 'rgba(0, 0, 0, 0.4)',
    backdrop: 'rgba(255, 255, 255, 0.85)',
  },
  glass: {
    bg: 'rgba(255, 255, 255, 0.65)',
    border: 'rgba(0, 0, 0, 0.08)',
    highlight: 'rgba(255, 255, 255, 0.9)',
    shadow: 'rgba(0, 0, 0, 0.15)',
    inset: 'rgba(255, 255, 255, 0.9)',
    press: 'rgba(0, 0, 0, 0.08)',
  },
  text: {
    primary: '#1a1a1f',
    secondary: 'rgba(0, 0, 0, 0.7)',
    dim: 'rgba(0, 0, 0, 0.5)',
    disabled: 'rgba(0, 0, 0, 0.3)',
    inverse: '#ffffff',
  },
  semantic: {
    primary: '#7c3aed',
    secondary: '#3b82f6',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    error: '#dc2626',
    info: '#2563eb',
  },
  border: {
    subtle: 'rgba(0, 0, 0, 0.05)',
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.15)',
    strong: 'rgba(0, 0, 0, 0.25)',
  },
} as const;

export type A3MKLightThemeColors = typeof lightThemeColors;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 19 — Unified Export
 * ═══════════════════════════════════════════════════════════════════════ */

export const A3MKT = {
  tokens,
  colors,
  radius,
  blur,
  shadows,
  easing,
  duration,
  spacing,
  typography,
  zIndex,
  breakpoints,
  transitions,
  generateCSSVariables,
  generateCSSString,
  injectTokens,
  removeTokens,
  getCSSVar,
  getToken,
  lightThemeColors,
} as const;

export default A3MKT;
