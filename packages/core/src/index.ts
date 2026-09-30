/**
 * A3MK-UI — Main Entry Point
 */

/* ═══ Config ═══ */
export {
  A3MK,
  configure,
  getConfig,
  reset,
  isReady,
  setLanguage,
  getLanguage,
  setLabels,
  setLabel,
  getLabels,
  getLabel,
  setIcons,
  setIcon,
  getIcons,
  getIcon,
  resolvePhosphorIcon,
  getResolvedIcon,
  resolveIconSet,
  subscribe,
  isAnimationEnabled,
  getAnimationMultiplier,
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
  A3MKPhosphorWeight,
  A3MKPhosphorIcon,
  A3MKResolvedIcon,
  A3MKIcon,
  A3MKLabels,
  A3MKIcons,
  DeepPartial,
} from './config/a3mk.config';

/* ═══ Tokens ═══ */
export {
  A3MKT,
  tokens,
  generateCSSVariables,
  generateCSSString,
  injectTokens,
  removeTokens,
  getCSSVar,
  lightThemeColors,
} from './tokens/tokens';

export type {
  A3MKTokens,
} from './tokens/tokens';

/* ═══ Button ═══ */
export {
  A3MKButton,
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

/* ═══ Version ═══ */
export const VERSION = '1.0.0';
export const PACKAGE_NAME = '@a3mk-ui/core';

export const A3MK_INFO = {
  name: PACKAGE_NAME,
  version: VERSION,
  description: 'Framework-agnostic Glassmorphism component library',
  author: 'essam664',
  license: 'MIT',
  repository: 'https://github.com/essam664/a3mk-ui1',
} as const;
