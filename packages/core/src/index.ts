/**
 * ═══════════════════════════════════════════════════════════════════════
 *  A3MK-UI — Main Entry Point
 *  نقطة التصدير الرئيسية للمكتبة
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  @file    index.ts
 *  @package @a3mk-ui/core
 *  @version 1.0.0-a3mk-ui1
 *  @author  A3MK
 *  @license MIT
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  نظرة عامة:
 *  ─────────────────────────────────────────────────────────────────────
 *  هذا الملف هو البوابة الرئيسية للمكتبة. كل ما يحتاجه المستخدم
 *  يمكن استيراده من هنا بـ **named exports فقط**:
 *
 *    import { Button, A3MK, tokens } from '@a3mk-ui/core';
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  ⚠️ ملاحظة مهمة — لا يوجد default export:
 *  ─────────────────────────────────────────────────────────────────────
 *  تم **تجنّب** `export default` في هذا الملف عن قصد.
 *
 *  السبب:
 *    • الـ default export من barrel files يكسر Tree-Shaking
 *      في بعض الـ bundlers (خاصة Webpack)
 *    • الـ bundler يُجبر على استيراد الملف كامل حتى لو استخدمت
 *      named export فقط.
 *
 *  إذا كنت تحتاج `A3MK`:
 *    ✅ import { A3MK } from '@a3mk-ui/core';
 *
 *  إذا كنت تحتاج الـ default مباشرة:
 *    ✅ import A3MK from '@a3mk-ui/core/config';
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  Tree-Shaking Friendly:
 *  ─────────────────────────────────────────────────────────────────────
 *  كل شيء مُصدَّر بشكل **named exports** حتى يتمكن Bundlers
 *  (Vite / Rollup / Webpack) من حذف ما لا يُستخدم:
 *
 *    import { Button } from '@a3mk-ui/core';
 *    // لن يتم تضمين tokens أو A3MK في الـ bundle النهائي
 *    // إلا إذا استخدمتها فعليًا.
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  Sub-path Exports:
 *  ─────────────────────────────────────────────────────────────────────
 *  يمكنك أيضًا الاستيراد من مسارات فرعية:
 *
 *    import { Button } from '@a3mk-ui/core/button';
 *    import { A3MK }   from '@a3mk-ui/core/config';
 *    import { tokens } from '@a3mk-ui/core/tokens';
 *    import '@a3mk-ui/core/auto'; // لتسجيل كل الـ components تلقائيًا
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
  resolvePhosphorIcon,
  getResolvedIcon,
  resolveIconSet,
  getDefaultIconWeight,
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
} from './config/a3mk.config.js';

export type {
  A3MKConfig,
  A3MKState,
  A3MKTheme,
  A3MKDirection,
  A3MKSpeed,
  A3MKLanguage,
  A3MKPhosphorWeight,
  A3MKPhosphorIcon,
  A3MKResolvedIcon,
  A3MKIcon,
  A3MKLabels,
  A3MKIcons,
  DeepPartial,
} from './config/a3mk.config.js';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 2 — Design Tokens
 * ═══════════════════════════════════════════════════════════════════════ */

export {
  // الكائن الموحد
  A3MKT,
  A3MKT as Tokens,

  // الأقسام منفصلة
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
} from './tokens/tokens.js';

export type {
  A3MKTokens,
  A3MKLightThemeColors,
  TokenValue,
  TokenSet,
} from './tokens/tokens.js';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 3 — Button Component
 * ═══════════════════════════════════════════════════════════════════════ */

export {
  // Web Component
  A3MKButton,

  // Fluent API
  Button,
  ButtonBuilder,
} from './components/button/a3mk-button.js';

export type {
  ButtonVariant,
  ButtonColor,
  ButtonSize,
  ButtonType,
  ButtonOptions,
} from './components/button/a3mk-button.js';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 4 — Version Info
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * إصدار المكتبة
 */
export const VERSION = '1.0.0-a3mk-ui1';

/**
 * اسم المكتبة
 */
export const PACKAGE_NAME = '@a3mk-ui/core';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 5 — Convenience Re-exports (Aliases)
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * مرادفات قصيرة للاستخدام السريع
 */

/** Alias لـ `A3MKButton` */
export { A3MKButton as Btn } from './components/button/a3mk-button.js';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 6 — Package Info
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * معلومات الحزمة الكاملة
 * مفيدة للـ debug و console
 *
 * @example
 *   console.log(A3MK_INFO);
 *   // => { name: '@a3mk-ui/core', version: '1.0.0-a3mk-ui1', ... }
 */
export const A3MK_INFO = {
  name: PACKAGE_NAME,
  version: VERSION,
  description: 'Framework-agnostic Glassmorphism component library',
  author: 'A3MK',
  license: 'MIT',
  homepage: 'https://a3mk-ui.dev',
  repository: 'https://github.com/a3mk/ui',
  documentation: 'https://docs.a3mk-ui.dev',
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  ⚠️ ملاحظات مهمة للقارئ:
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  1) لا يوجد `export default` هنا عن قصد (Tree-Shaking friendly).
 *
 *     للحصول على `A3MK`:
 *       ✅ import { A3MK } from '@a3mk-ui/core';
 *
 *     للحصول على الـ default من ملف الـ config مباشرة:
 *       ✅ import A3MK from '@a3mk-ui/core/config';
 *
 *  2) نوع `a3mk-button` في `HTMLElementTagNameMap` مُسجّل
 *     تلقائيًا من ملف `a3mk-button.ts` نفسه (SECTION 6).
 *     عند استيراد الزر من هذا الملف، TypeScript يدمج
 *     الـ augmentation تلقائيًا.
 *
 *     لا حاجة لتكراره هنا.
 *
 * ═══════════════════════════════════════════════════════════════════════
 */
