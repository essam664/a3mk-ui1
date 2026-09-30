/**
 * ═══════════════════════════════════════════════════════════════════════
 *  A3MK-UI — Button Component
 *  زر A3MK — Web Component خالص (بدون Lit)
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  @file    a3mk-button.ts
 *  @package @a3mk-ui/core
 *  @version 1.0.0
 *  @author  essam664
 *  @license MIT
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  الإصلاحات:
 *  ─────────────────────────────────────────────────────────────────────
 *  ✅ يستخدم <slot> بدل textContent (يدعم التحديث الديناميكي للنص)
 *  ✅ subscribe() تنادي _render() (يتحدث عند تغير config)
 *  ✅ SVG بدون width/height + CSS يتحكم في الحجم
 *  ✅ RTL تلقائي عبر Flexbox (بدون كود إضافي)
 *  ✅ يدعم الأيقونات المملوءة (fill)
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

import {
  getConfig,
  resolveIcon,
  subscribe,
  getAnimationMultiplier,
  type A3MKIcon,
  type A3MKResolvedIcon,
} from '../../config/a3mk.config';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 1 — Types
 * ═══════════════════════════════════════════════════════════════════════ */

export type ButtonVariant = 'contained' | 'outlined' | 'text';
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonOptions {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  icon?: A3MKIcon;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rounded?: boolean;
  noAnimation?: boolean;
  type?: ButtonType;
  id?: string;
  className?: string;
  title?: string;
  ariaLabel?: string;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 2 — Icon Paths (SVG مدمجة)
 * ═══════════════════════════════════════════════════════════════════════ */

interface IconDefinition {
  path: string;
  fill?: boolean;
}

const ICON_PATHS: Record<string, IconDefinition> = {
  'credit-card': {
    path: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>',
  },
  'floppy-disk': {
    path: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>',
  },
  trash: {
    path: '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  },
  refresh: {
    path: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  },
  'arrow-left': {
    path: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
  },
  'arrow-right': {
    path: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  },
  send: {
    path: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  },
  plus: {
    path: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  },
  minus: {
    path: '<line x1="5" y1="12" x2="19" y2="12"/>',
  },
  'check-circle': {
    path: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  },
  check: {
    path: '<polyline points="20 6 9 17 4 12"/>',
  },
  heart: {
    path: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  },
  'heart-fill': {
    path: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
    fill: true,
  },
  info: {
    path: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  },
  gear: {
    path: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  },
  bell: {
    path: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  },
  star: {
    path: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  },
  'star-fill': {
    path: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    fill: true,
  },
  x: {
    path: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  },
  'x-circle': {
    path: '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>',
  },
  warning: {
    path: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  },
  house: {
    path: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  },
  user: {
    path: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  },
  list: {
    path: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  },
  chat: {
    path: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  },
  search: {
    path: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  },
  download: {
    path: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  },
  upload: {
    path: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  },
  share: {
    path: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
  },
  link: {
    path: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  },
  phone: {
    path: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  },
  envelope: {
    path: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  },
  video: {
    path: '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>',
  },
  mic: {
    path: '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>',
  },
  play: {
    path: '<polygon points="5 3 19 12 5 21 5 3"/>',
  },
  pause: {
    path: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
  },
  cart: {
    path: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  },
  receipt: {
    path: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/>',
  },
  gift: {
    path: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>',
  },
  rocket: {
    path: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  },
  sparkle: {
    path: '<path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"/>',
  },
  lock: {
    path: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  },
  unlock: {
    path: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  },
  sun: {
    path: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  },
  moon: {
    path: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  },
  menu: {
    path: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  },
  edit: {
    path: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
  },
  undo: {
    path: '<polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>',
  },
  redo: {
    path: '<polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>',
  },
  copy: {
    path: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  },
  print: {
    path: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  },
  attach: {
    path: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  },
  chart: {
    path: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  },
  compass: {
    path: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  },
  eye: {
    path: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  },
  'folder-open': {
    path: '<path d="M6 14l1.45-2.9A2 2 0 0 1 9.24 10H22a2 2 0 0 1 1.94 2.5l-1.55 6A2 2 0 0 1 20.45 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/>',
  },
  'skip-forward': {
    path: '<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>',
  },
  'skip-back': {
    path: '<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>',
  },
  'volume-high': {
    path: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>',
  },
  'volume-slash': {
    path: '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>',
  },
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 3 — Icon Renderer
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * توليد HTML للأيقونة
 *
 * ✅ بدون width/height ثابتين — CSS هو المسؤول عن الحجم
 */
function renderIconHTML(icon: A3MKResolvedIcon | null): string {
  if (!icon) return '';

  const iconDef = ICON_PATHS[icon.name];
  if (!iconDef) {
    return `<span class="a3mk-icon-fallback">${icon.name}</span>`;
  }

  const isFill = iconDef.fill === true;
  const color = icon.color || 'currentColor';
  const fillAttr = isFill ? color : 'none';
  const strokeWidth = isFill ? 0 : 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fillAttr}" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconDef.path}</svg>`;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 4 — Styles
 * ═══════════════════════════════════════════════════════════════════════ */

const BUTTON_STYLES = `
  :host {
    display: inline-block;
    --_accent: #7c3aed;
    --_text: #eaeaf0;
    --_multiplier: 1;
    --_icon-size: 20px;
  }

  :host([full-width]) { display: block; width: 100%; }
  :host([hidden]) { display: none; }

  /* ═══ الألوان ═══ */
  :host([color="primary"])   { --_accent: #7c3aed; }
  :host([color="secondary"]) { --_accent: #3b82f6; }
  :host([color="success"])   { --_accent: #86efac; }
  :host([color="warning"])   { --_accent: #fbbf24; }
  :host([color="danger"])    { --_accent: #ef4444; }
  :host([color="info"])      { --_accent: #60a5fa; }

  /* ═══ الزر الأساسي ═══ */
  .a3mk-btn {
    position: relative;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, sans-serif;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: var(--_text);
    white-space: nowrap;
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.03) 50%,
      rgba(255, 255, 255, 0.06) 100%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    cursor: pointer;
    outline: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.22),
      inset 0 -1px 0 rgba(0, 0, 0, 0.15),
      0 2px 6px rgba(0, 0, 0, 0.3);
    transition:
      background calc(0.3s * var(--_multiplier)) cubic-bezier(0.25, 0.1, 0.25, 1),
      border-color calc(0.3s * var(--_multiplier)) cubic-bezier(0.25, 0.1, 0.25, 1),
      box-shadow calc(0.3s * var(--_multiplier)) cubic-bezier(0.25, 0.1, 0.25, 1),
      color calc(0.3s * var(--_multiplier)) cubic-bezier(0.25, 0.1, 0.25, 1);
  }

  /* ═══ الأحجام ═══ */
  :host([size="xs"]) .a3mk-btn { padding: 6px 14px; font-size: 11px; min-width: 80px; --_icon-size: 14px; }
  :host([size="sm"]) .a3mk-btn { padding: 8px 18px; font-size: 12px; min-width: 95px; --_icon-size: 16px; }
  :host([size="md"]) .a3mk-btn { padding: 11px 22px; font-size: 13px; min-width: 110px; --_icon-size: 20px; }
  :host([size="lg"]) .a3mk-btn { padding: 15px 34px; font-size: 15px; font-weight: 600; min-width: 140px; --_icon-size: 22px; }
  :host([size="xl"]) .a3mk-btn { padding: 18px 44px; font-size: 17px; font-weight: 700; min-width: 170px; --_icon-size: 24px; }

  :host([full-width]) .a3mk-btn { width: 100%; min-width: 0; }

  /* ═══ دائري ═══ */
  :host([rounded]) .a3mk-btn {
    border-radius: 50%;
    padding: 0;
    width: 44px;
    height: 44px;
    min-width: 0;
    --_icon-size: 20px;
  }
  :host([rounded][size="xs"]) .a3mk-btn { width: 32px; height: 32px; --_icon-size: 14px; }
  :host([rounded][size="sm"]) .a3mk-btn { width: 38px; height: 38px; --_icon-size: 16px; }
  :host([rounded][size="lg"]) .a3mk-btn { width: 54px; height: 54px; --_icon-size: 22px; }
  :host([rounded][size="xl"]) .a3mk-btn { width: 64px; height: 64px; --_icon-size: 26px; }

  /* ═══ الأنواع ═══ */
  :host([variant="outlined"]) .a3mk-btn {
    background: transparent;
    border-color: var(--_accent);
    color: var(--_accent);
    box-shadow: none;
  }

  :host([variant="text"]) .a3mk-btn {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    padding: 11px 16px;
    min-width: 0;
  }

  /* ═══ Hover ═══ */
  .a3mk-btn:hover:not(:disabled) {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.13) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.1) 100%);
    border-color: rgba(255, 255, 255, 0.22);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.18),
      0 4px 14px rgba(0, 0, 0, 0.4);
  }

  :host([variant="outlined"]) .a3mk-btn:hover:not(:disabled) {
    background: rgba(124, 58, 237, 0.12);
    box-shadow: none;
  }

  :host([variant="text"]) .a3mk-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.06);
    box-shadow: none;
  }

  /* ═══ Active ═══ */
  .a3mk-btn:active:not(:disabled) {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.15);
    box-shadow:
      inset 0 2px 8px rgba(0, 0, 0, 0.4),
      0 1px 2px rgba(0, 0, 0, 0.3);
  }

  /* ═══ Disabled ═══ */
  .a3mk-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ═══ أيقونة ═══ */
  .a3mk-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    z-index: 1;
  }

  .a3mk-icon svg {
    width: var(--_icon-size);
    height: var(--_icon-size);
  }

  .a3mk-icon-fallback {
    font-size: 0.85em;
    opacity: 0.6;
    z-index: 1;
  }

  /* ═══ النص (Slot) ═══ */
  .a3mk-label {
    display: inline-flex;
    align-items: center;
    z-index: 1;
    position: relative;
  }

  /* ═══ Spinner ═══ */
  .a3mk-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: a3mk-spin calc(0.7s * var(--_multiplier)) linear infinite;
    z-index: 1;
    flex-shrink: 0;
  }

  @keyframes a3mk-spin {
    to { transform: rotate(360deg); }
  }

  :host([loading]) .a3mk-btn {
    pointer-events: none;
    cursor: wait;
  }

  :host([loading]) .a3mk-label,
  :host([loading]) .a3mk-icon {
    opacity: 0;
  }

  /* ═══ Ripple ═══ */
  .a3mk-ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.35);
    transform: scale(0);
    animation: a3mk-ripple-anim calc(0.6s * var(--_multiplier)) linear;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes a3mk-ripple-anim {
    to { transform: scale(4); opacity: 0; }
  }

  /* ═══ Focus Ring (a11y) ═══ */
  .a3mk-btn:focus-visible {
    outline: 2px solid var(--_accent);
    outline-offset: 2px;
  }

  /* ═══ Reduced Motion ═══ */
  @media (prefers-reduced-motion: reduce) {
    .a3mk-btn, .a3mk-spinner, .a3mk-ripple {
      transition: none !important;
      animation: none !important;
    }
  }
`;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 5 — Web Component
 * ═══════════════════════════════════════════════════════════════════════ */

export class A3MKButton extends HTMLElement {
  static get observedAttributes(): string[] {
    return [
      'variant',
      'color',
      'size',
      'icon',
      'icon-position',
      'loading',
      'disabled',
      'rounded',
      'full-width',
      'type',
      'no-animation',
    ];
  }

  private _shadow: ShadowRoot;
  private _btn!: HTMLButtonElement;
  private _unsubscribe?: () => void;
  private _iconResolved: A3MKResolvedIcon | null = null;
  private _animationMultiplier = 1;
  private _rippleEnabled = true;
  private _prevIconKey = '';

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  /* ── Lifecycle ── */
  connectedCallback(): void {
    this._render();
    this._syncConfig(true);
    this._attachEvents();

    // ✅ subscribe تنادي _render لضمان تحديث DOM عند تغير config
    this._unsubscribe = subscribe(() => {
      this._syncConfig(false);
      if (this._btn) this._render();
    });
  }

  disconnectedCallback(): void {
    this._unsubscribe?.();
    this._unsubscribe = undefined;
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) return;
    if (name === 'icon') {
      this._syncConfig(true);
    }
    if (this._btn) this._render();
  }

  /* ── Config Sync (Memoized) ── */
  private _syncConfig(force: boolean): void {
    const config = getConfig();
    const iconName = this.getAttribute('icon') ?? '';
    const iconKey =
      iconName +
      '|' +
      (config.iconSize ?? '') +
      '|' +
      (config.iconColor ?? '');

    if (force || iconKey !== this._prevIconKey) {
      this._prevIconKey = iconKey;
      this._iconResolved = iconName ? resolveIcon(iconName) : null;
    }

    this._animationMultiplier = this.hasAttribute('no-animation')
      ? 0.01
      : getAnimationMultiplier();
    this._rippleEnabled = config.animations?.ripple ?? true;
  }

  /* ── Render ── */
  private _render(): void {
    // (1) مرة واحدة: هيكل الزر + الأنماط
    if (!this._btn) {
      this._shadow.innerHTML = `
        <style>${BUTTON_STYLES}</style>
        <button part="button" class="a3mk-btn" type="button">
          <span part="icon-start" class="a3mk-icon"></span>
          <span class="a3mk-label"><slot></slot></span>
          <span part="icon-end" class="a3mk-icon"></span>
        </button>
      `;
      this._btn = this._shadow.querySelector('button')!;
    }

    const btn = this._btn;
    const isLoading = this.hasAttribute('loading');
    const isDisabled = this.hasAttribute('disabled') || isLoading;
    const iconPosition = this.getAttribute('icon-position') ?? 'start';
    const btnType = (this.getAttribute('type') as ButtonType) || 'button';

    /* ── الحالة ── */
    btn.disabled = isDisabled;
    btn.type = btnType;
    btn.setAttribute('aria-busy', String(isLoading));
    btn.setAttribute('aria-disabled', String(isDisabled));
    btn.style.setProperty('--_multiplier', String(this._animationMultiplier));

    const ariaLabel = this.getAttribute('aria-label');
    if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
    else btn.removeAttribute('aria-label');

    const title = this.getAttribute('title');
    if (title) btn.setAttribute('title', title);
    else btn.removeAttribute('title');

    /* ── Loading State ── */
    const iconStartEl = this._shadow.querySelector<HTMLElement>('[part="icon-start"]')!;
    const iconEndEl = this._shadow.querySelector<HTMLElement>('[part="icon-end"]')!;
    const labelEl = this._shadow.querySelector<HTMLElement>('.a3mk-label')!;

    if (isLoading) {
      // نخفي كل حاجة ونعرض spinner
      iconStartEl.innerHTML = '';
      iconEndEl.innerHTML = '';
      labelEl.style.display = 'none';
      btn.querySelector('.a3mk-spinner')?.remove();
      const spinner = document.createElement('span');
      spinner.className = 'a3mk-spinner';
      spinner.setAttribute('part', 'spinner');
      spinner.setAttribute('aria-hidden', 'true');
      btn.insertBefore(spinner, btn.firstChild);
      return;
    }

    // نشيل الـ spinner لو موجود
    btn.querySelector('.a3mk-spinner')?.remove();
    labelEl.style.display = '';

    /* ── الأيقونة ── */
    const iconHTML = this._iconResolved
      ? renderIconHTML(this._iconResolved)
      : '';

    if (iconPosition === 'start') {
      iconStartEl.innerHTML = iconHTML;
      iconEndEl.innerHTML = '';
    } else {
      iconStartEl.innerHTML = '';
      iconEndEl.innerHTML = iconHTML;
    }
  }

  /* ── Events ── */
  private _attachEvents(): void {
    this._btn.addEventListener('click', (e) => {
      if (this.hasAttribute('disabled') || this.hasAttribute('loading')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      this.dispatchEvent(
        new CustomEvent('a3mk-click', {
          bubbles: true,
          composed: true,
          detail: { originalEvent: e, button: this },
        })
      );
    });

    this._btn.addEventListener('pointerdown', (e) => {
      if (this.hasAttribute('disabled') || this.hasAttribute('loading')) return;
      if (!this._rippleEnabled) return;
      if (this.hasAttribute('no-animation')) return;

      const rect = this._btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'a3mk-ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      this._btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  }

  /* ── Public API ── */
  startLoading(): void { this.setAttribute('loading', ''); }
  stopLoading(): void { this.removeAttribute('loading'); }
  disable(): void { this.setAttribute('disabled', ''); }
  enable(): void { this.removeAttribute('disabled'); }
  focusButton(): void { this._btn.focus(); }
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 6 — Registration
 * ═══════════════════════════════════════════════════════════════════════ */

if (
  typeof customElements !== 'undefined' &&
  !customElements.get('a3mk-button')
) {
  customElements.define('a3mk-button', A3MKButton);
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 7 — Fluent API
 * ═══════════════════════════════════════════════════════════════════════ */

export class ButtonBuilder {
  private _label: string;
  private _options: ButtonOptions;
  private _handlers: {
    click: Array<(e: MouseEvent) => void>;
    a3mkClick: Array<(e: CustomEvent) => void>;
  } = { click: [], a3mkClick: [] };
  private _element?: A3MKButton;
  private _loadingTimer?: number;
  private _abortController?: AbortController;

  constructor(label: string, options: ButtonOptions = {}) {
    this._label = label ?? '';
    this._options = { ...options };
  }

  /* ── Chainable Methods ── */
  variant(v: ButtonVariant): this { this._options.variant = v; return this._apply(); }
  color(c: ButtonColor): this { this._options.color = c; return this._apply(); }
  size(s: ButtonSize): this { this._options.size = s; return this._apply(); }
  icon(i: A3MKIcon): this { this._options.icon = i; return this._apply(); }
  iconStart(): this { this._options.iconPosition = 'start'; return this._apply(); }
  iconEnd(): this { this._options.iconPosition = 'end'; return this._apply(); }
  fullWidth(): this { this._options.fullWidth = true; return this._apply(); }
  rounded(): this { this._options.rounded = true; return this._apply(); }
  disable(): this { this._options.disabled = true; return this._apply(); }
  enable(): this { this._options.disabled = false; return this._apply(); }
  noAnimation(value = true): this { this._options.noAnimation = value; return this._apply(); }
  id(id: string): this { this._options.id = id; return this._apply(); }
  className(c: string): this { this._options.className = c; return this._apply(); }
  title(t: string): this { this._options.title = t; return this._apply(); }
  ariaLabel(l: string): this { this._options.ariaLabel = l; return this._apply(); }
  type(t: ButtonType): this { this._options.type = t; return this._apply(); }

  /* ── Loading ── */
  loading(ms = 0): this {
    this._options.loading = true;
    this._apply();
    if (ms > 0 && this._element) {
      if (this._loadingTimer) window.clearTimeout(this._loadingTimer);
      this._loadingTimer = window.setTimeout(() => this.stopLoading(), ms);
    }
    return this;
  }

  stopLoading(): this {
    this._options.loading = false;
    if (this._loadingTimer) {
      window.clearTimeout(this._loadingTimer);
      this._loadingTimer = undefined;
    }
    return this._apply();
  }

  /* ── Events ── */
  onClick(fn: (e: MouseEvent) => void): this {
    if (typeof fn === 'function') this._handlers.click.push(fn);
    this._attachHandlers();
    return this;
  }

  onA3MKClick(fn: (e: CustomEvent) => void): this {
    if (typeof fn === 'function') this._handlers.a3mkClick.push(fn);
    this._attachHandlers();
    return this;
  }

  off(): this {
    this._handlers.click = [];
    this._handlers.a3mkClick = [];
    this._abortController?.abort();
    this._abortController = undefined;
    return this;
  }

  /* ── Mounting ── */
  mount(target: string | HTMLElement): HTMLElement {
    const container =
      typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) throw new Error(`[A3MK-UI] Mount target not found: ${target}`);
    this._element = this._createElement();
    container.appendChild(this._element);
    this._attachHandlers();
    return this._element;
  }

  appendTo(target: string | HTMLElement): this {
    const container =
      typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) throw new Error(`[A3MK-UI] Append target not found: ${target}`);
    this._element = this._createElement();
    container.appendChild(this._element);
    this._attachHandlers();
    return this;
  }

  getElement(): A3MKButton | undefined {
    return this._element;
  }

  remove(): void {
    if (this._loadingTimer) {
      window.clearTimeout(this._loadingTimer);
      this._loadingTimer = undefined;
    }
    this._abortController?.abort();
    this._abortController = undefined;
    this._element?.remove();
    this._element = undefined;
  }

  /* ── Internal ── */
  private _createElement(): A3MKButton {
    const el = document.createElement('a3mk-button') as A3MKButton;
    el.textContent = this._label;
    this._applyTo(el);
    return el;
  }

  private _apply(): this {
    if (this._element) this._applyTo(this._element);
    return this;
  }

  private _applyTo(el: A3MKButton): void {
    const o = this._options;

    if (o.variant) el.setAttribute('variant', o.variant);
    if (o.color) el.setAttribute('color', o.color);
    if (o.size) el.setAttribute('size', o.size);

    if (o.icon !== undefined) {
      if (o.icon) el.setAttribute('icon', String(o.icon));
      else el.removeAttribute('icon');
    }

    if (o.iconPosition) el.setAttribute('icon-position', o.iconPosition);
    if (o.fullWidth) el.setAttribute('full-width', '');
    if (o.disabled) el.setAttribute('disabled', '');
    if (o.loading) el.setAttribute('loading', '');
    if (o.rounded) el.setAttribute('rounded', '');
    if (o.noAnimation) el.setAttribute('no-animation', '');
    if (o.type) el.setAttribute('type', o.type);
    if (o.id) el.id = o.id;
    if (o.title) el.setAttribute('title', o.title);
    if (o.ariaLabel) el.setAttribute('aria-label', o.ariaLabel);
    if (o.className) el.className = o.className;
  }

  private _attachHandlers(): void {
    if (!this._element) return;

    this._abortController?.abort();
    this._abortController = new AbortController();
    const { signal } = this._abortController;

    this._element.addEventListener(
      'click',
      (e) => {
        this._handlers.click.forEach((fn) => {
          try {
            fn(e);
          } catch (err) {
            console.error('[A3MK-UI] Error in click handler:', err);
          }
        });
      },
      { signal }
    );

    this._element.addEventListener(
      'a3mk-click',
      (e) => {
        this._handlers.a3mkClick.forEach((fn) => {
          try {
            fn(e as CustomEvent);
          } catch (err) {
            console.error('[A3MK-UI] Error in a3mk-click handler:', err);
          }
        });
      },
      { signal }
    );
  }
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 8 — Factory Function
 * ═══════════════════════════════════════════════════════════════════════ */

export function Button(label: string, options?: ButtonOptions): ButtonBuilder {
  return new ButtonBuilder(label, options);
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 9 — Global Declaration
 * ═══════════════════════════════════════════════════════════════════════ */

declare global {
  interface HTMLElementTagNameMap {
    'a3mk-button': A3MKButton;
  }

  interface GlobalEventHandlersEventMap {
    'a3mk-click': CustomEvent<{ originalEvent: MouseEvent; button: A3MKButton }>;
  }
}

export default Button;
