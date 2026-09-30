/**
 * ═══════════════════════════════════════════════════════════════════════
 *  A3MK-UI — Main Entry Point
 *  نقطة التصدير الرئيسية للمكتبة
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  @file    index.ts
 *  @package @a3mk-ui/core
 *  @version 1.0.0
 *  @author  essam664
 *  @license MIT
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  ملاحظات:
 *  ─────────────────────────────────────────────────────────────────────
 *  • لا يوجد `export default` (لتجنّب كسر Tree-Shaking)
 *  • كل التصديرات named exports
 *  • Sub-path exports مدعومة
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 1 — Configuration System
 * ═══════════════════════════════════════════════════════════════════════ */

export {
  // الكائن الموحد
  A3MK,

  // التهيئة
  configure,
  getConfig,
  reset,
  isReady,

  // اللغة
  setLanguage,
  getLanguage,

  // النصوص
  setLabels,
  setLabel,
  getLabels,
  getLabel,

  // الأيقونات
  setIcons,
  setIcon,
  getIcons,
  getIcon,
  resolveIcon,
  getResolvedIcon,
  resolveIconSet,
  getDefaultIconSize,
  getDefaultIconColor,

  // الحالة
  subscribe,
  isAnimationEnabled,
  getAnimationMultiplier,

  // Constants
  AR_LABELS,
  EN_LABELS,
  DEFAULT_ICONS,
  DEFAULT_CONFIG,
} from './config/a3mk.config';

export type {
  A3MKConfig,
  A3MKState,
  A3MKTheme,
  A3MKDirection,
  A3MKSpeed,
  A3MKLanguage,
  A3MKIcon,
  A3MKResolvedIcon,
  A3MKLabels,
  A3MKIcons,
  DeepPartial,
} from './config/a3mk.config';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 2 — Design Tokens
 * ═══════════════════════════════════════════════════════════════════════ */

export {
  // الكائن الموحد
  A3MKT,
  A3MKT as Tokens,

  // الأقسام
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

  // توليد CSS
  generateCSSVariables,
  generateCSSString,
  injectTokens,
  removeTokens,

  // الوصول المباشر
  getCSSVar,
  getToken,

  // الثيمات
  lightThemeColors,
} from './tokens/tokens';

export type {
  A3MKTokens,
  A3MKLightThemeColors,
  TokenValue,
  TokenSet,
} from './tokens/tokens';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 3 — Button Component
 * ═══════════════════════════════════════════════════════════════════════ */

export {
  // Web Component
  A3MKButton,

  // Fluent API
  Button,
  ButtonBuilder,
} from './components/button/a3mk-button';

export type {
  ButtonVariant,
  ButtonColor,
  ButtonSize,
  ButtonType,
  ButtonOptions,
} from './components/button/a3mk-button';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 4 — Version Info
 * ═══════════════════════════════════════════════════════════════════════ */

export const VERSION = '1.0.0';
export const PACKAGE_NAME = '@a3mk-ui/core';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 5 — Package Info
 * ═══════════════════════════════════════════════════════════════════════ */

export const A3MK_INFO = {
  name: PACKAGE_NAME,
  version: VERSION,
  description: 'Framework-agnostic Glassmorphism component library',
  author: 'essam664',
  license: 'MIT',
  repository: 'https://github.com/essam664/a3mk-ui1',
} as const;
