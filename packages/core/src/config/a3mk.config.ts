/**
 * ═══════════════════════════════════════════════════════════════════════
 *  A3MK-UI — Master Configuration System
 *  نظام التحكم الرئيسي في المكتبة
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  @file    a3mk.config.ts
 *  @package @a3mk-ui/core
 *  @version 1.0.0
 *  @author  essam664
 *  @license MIT
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  المبادئ:
 *  ─────────────────────────────────────────────────────────────────────
 *  • صفر تبعيات خارجية (Zero External Dependencies)
 *  • آمن على SSR (Next.js, Nuxt, Astro)
 *  • كل الـ types معرّفة قبل الاستخدام
 *  • كل دوال DOM محمية بـ isBrowser() guard
 *  • الأيقونات: أسماء SVG strings (تُستخدم مباشرة)
 *  • الـ Config يبقى نقي (Pure) — الـ Memoization مسؤولية الـ Renderer
 *  • اتجاه التبعية: config → tokens (One-way فقط)
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

function mergeDeep<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T> | Record<string, unknown> | undefined
): T {
  if (!source || typeof source !== 'object') {
    return { ...target };
  }

  const output: Record<string, unknown> = { ...target };

  for (const key of Object.keys(source)) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const sourceValue = (source as Record<string, unknown>)[key];
    const targetValue = (target as Record<string, unknown>)[key];

    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      output[key] = mergeDeep(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue;
    }
  }

  return output as T;
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;
  const cloned: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
  }
  return cloned as T;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 1 — Core Types
 * ═══════════════════════════════════════════════════════════════════════ */

export type A3MKTheme = 'dark' | 'light' | 'auto';
export type A3MKDirection = 'rtl' | 'ltr' | 'auto';
export type A3MKSpeed = 'slow' | 'normal' | 'fast' | 'instant';
export type A3MKLanguage = 'ar' | 'en';

/**
 * اسم أيقونة — string بسيط
 * (يُستخدم مباشرة في SVG المدمجة داخل الزر)
 */
export type A3MKIcon = string | null;

/**
 * كائن أيقونة بعد الحل
 */
export interface A3MKResolvedIcon {
  name: string;
  size: number;
  color?: string;
}

/**
 * DeepPartial
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 2 — Labels Schema
 * ═══════════════════════════════════════════════════════════════════════ */

export interface A3MKLabels {
  button: Record<string, string>;
  navigation: Record<string, string>;
  payment: Record<string, string>;
  files: Record<string, string>;
  communication: Record<string, string>;
  media: Record<string, string>;
  states: Record<string, string>;
  messages: Record<string, string>;
  custom: Record<string, string>;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 3 — Icons Schema
 * ═══════════════════════════════════════════════════════════════════════ */

export interface A3MKIcons {
  button: Record<string, A3MKIcon>;
  navigation: Record<string, A3MKIcon>;
  payment: Record<string, A3MKIcon>;
  files: Record<string, A3MKIcon>;
  communication: Record<string, A3MKIcon>;
  media: Record<string, A3MKIcon>;
  states: Record<string, A3MKIcon>;
  special: Record<string, A3MKIcon>;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 4 — Master Config Schema
 * ═══════════════════════════════════════════════════════════════════════ */

export interface A3MKConfig {
  /** اسم التطبيق */
  name?: string;

  /** اللغة */
  language?: A3MKLanguage;

  /** الثيم */
  theme?: A3MKTheme;

  /** الاتجاه */
  direction?: A3MKDirection;

  /** بادئة الـ CSS Variables */
  prefix?: string;

  /** حجم الأيقونات الافتراضي (px) */
  iconSize?: number;

  /** لون الأيقونات الافتراضي */
  iconColor?: string;

  /** إعدادات الأنيميشن */
  animations?: {
    enabled?: boolean;
    speed?: A3MKSpeed;
    ripple?: boolean;
    hoverEffects?: boolean;
  };

  /** الميزات */
  features?: {
    glassmorphism?: boolean;
    shadows?: boolean;
    glow?: boolean;
    blur?: boolean;
  };

  /** ألوان مخصصة */
  colors?: Record<string, string>;

  /** إتاحة الوصول */
  accessibility?: {
    focusRing?: boolean;
    keyboardNavigation?: boolean;
    ariaLabels?: boolean;
  };

  /** النصوص المخصصة */
  labels?: DeepPartial<A3MKLabels>;

  /** الأيقونات المخصصة */
  icons?: DeepPartial<A3MKIcons>;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 5 — State Types
 * ═══════════════════════════════════════════════════════════════════════ */

export interface A3MKState {
  config: Readonly<A3MKConfig>;
  labels: Readonly<A3MKLabels>;
  icons: Readonly<A3MKIcons>;
}

interface InternalState {
  config: A3MKConfig;
  labels: A3MKLabels;
  icons: A3MKIcons;
  initialized: boolean;
  listeners: Set<(state: Readonly<A3MKState>) => void>;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 6 — Default Labels (Arabic)
 * ═══════════════════════════════════════════════════════════════════════ */

export const AR_LABELS: A3MKLabels = {
  button: {
    save: 'حفظ',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    close: 'إغلاق',
    back: 'رجوع',
    next: 'التالي',
    previous: 'السابق',
    submit: 'إرسال',
    reset: 'إعادة تعيين',
    search: 'بحث',
    refresh: 'تحديث',
    copy: 'نسخ',
    undo: 'تراجع',
    redo: 'إعادة',
    done: 'تم',
    ok: 'موافق',
  },
  navigation: {
    home: 'الرئيسية',
    explore: 'استكشاف',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    menu: 'القائمة',
    notifications: 'الإشعارات',
    messages: 'الرسائل',
    logout: 'خروج',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
  },
  payment: {
    pay: 'دفع',
    payNow: 'ادفع الآن',
    processing: 'جاري المعالجة...',
    success: 'تم الدفع بنجاح',
    failed: 'فشل الدفع',
    checkout: 'إتمام الشراء',
    cart: 'السلة',
    card: 'بطاقة',
    invoice: 'الفاتورة',
    total: 'الإجمالي',
    confirmPayment: 'تأكيد الدفع',
  },
  files: {
    open: 'فتح',
    upload: 'رفع',
    download: 'تحميل',
    print: 'طباعة',
    attach: 'إرفاق',
    share: 'مشاركة',
    link: 'نسخ الرابط',
  },
  communication: {
    call: 'اتصال',
    email: 'إيميل',
    message: 'رسالة',
    video: 'فيديو',
    audio: 'صوت',
    invite: 'دعوة',
    send: 'إرسال',
  },
  media: {
    play: 'تشغيل',
    pause: 'إيقاف',
    volume: 'الصوت',
    mute: 'كتم',
  },
  states: {
    success: 'نجاح',
    warning: 'تحذير',
    error: 'خطأ',
    info: 'معلومة',
    loading: 'جاري التحميل',
  },
  messages: {
    savedSuccessfully: 'تم الحفظ بنجاح',
    copiedSuccessfully: 'تم النسخ بنجاح',
    deletedSuccessfully: 'تم الحذف بنجاح',
    errorOccurred: 'حدث خطأ',
  },
  custom: {
    payButton: 'إتمام الدفع الآن',
    saveButton: 'حفظ',
    copyButton: 'نسخ',
    errorButton: 'خطأ',
    likeButton: 'إعجاب',
    unlikeButton: 'معجب',
    lockButton: 'مقفل',
    unlockButton: 'مفتوح',
  },
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 7 — Default Labels (English)
 * ═══════════════════════════════════════════════════════════════════════ */

export const EN_LABELS: A3MKLabels = {
  button: {
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
    search: 'Search',
    refresh: 'Refresh',
    copy: 'Copy',
    undo: 'Undo',
    redo: 'Redo',
    done: 'Done',
    ok: 'OK',
  },
  navigation: {
    home: 'Home',
    explore: 'Explore',
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    menu: 'Menu',
    notifications: 'Notifications',
    messages: 'Messages',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
  },
  payment: {
    pay: 'Pay',
    payNow: 'Pay Now',
    processing: 'Processing...',
    success: 'Payment Successful',
    failed: 'Payment Failed',
    checkout: 'Checkout',
    cart: 'Cart',
    card: 'Card',
    invoice: 'Invoice',
    total: 'Total',
    confirmPayment: 'Confirm Payment',
  },
  files: {
    open: 'Open',
    upload: 'Upload',
    download: 'Download',
    print: 'Print',
    attach: 'Attach',
    share: 'Share',
    link: 'Copy Link',
  },
  communication: {
    call: 'Call',
    email: 'Email',
    message: 'Message',
    video: 'Video',
    audio: 'Audio',
    invite: 'Invite',
    send: 'Send',
  },
  media: {
    play: 'Play',
    pause: 'Pause',
    volume: 'Volume',
    mute: 'Mute',
  },
  states: {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    info: 'Info',
    loading: 'Loading',
  },
  messages: {
    savedSuccessfully: 'Saved successfully',
    copiedSuccessfully: 'Copied successfully',
    deletedSuccessfully: 'Deleted successfully',
    errorOccurred: 'An error occurred',
  },
  custom: {
    payButton: 'Complete Payment',
    saveButton: 'Save',
    copyButton: 'Copy',
    errorButton: 'Error',
    likeButton: 'Like',
    unlikeButton: 'Liked',
    lockButton: 'Locked',
    unlockButton: 'Unlocked',
  },
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 8 — Default Icons (SVG strings)
 * ═══════════════════════════════════════════════════════════════════════ */

export const DEFAULT_ICONS: A3MKIcons = {
  button: {
    save: 'floppy-disk',
    cancel: 'x',
    confirm: 'check',
    delete: 'trash',
    edit: 'edit',
    add: 'plus',
    close: 'x-circle',
    back: 'arrow-left',
    next: 'arrow-right',
    previous: 'arrow-left',
    submit: 'send',
    reset: 'refresh',
    search: 'search',
    refresh: 'refresh',
    copy: 'copy',
    undo: 'undo',
    redo: 'redo',
  },
  navigation: {
    home: 'house',
    explore: 'compass',
    dashboard: 'chart',
    profile: 'user',
    settings: 'gear',
    menu: 'menu',
    notifications: 'bell',
    messages: 'chat',
  },
  payment: {
    pay: 'credit-card',
    cart: 'cart',
    card: 'credit-card',
    invoice: 'receipt',
    success: 'check-circle',
    error: 'x-circle',
  },
  files: {
    open: 'folder-open',
    upload: 'upload',
    download: 'download',
    print: 'print',
    attach: 'attach',
    share: 'share',
    link: 'link',
  },
  communication: {
    call: 'phone',
    email: 'envelope',
    message: 'chat',
    video: 'video',
    audio: 'mic',
    invite: 'envelope',
    send: 'send',
  },
  media: {
    play: 'play',
    pause: 'pause',
    volume: 'volume',
    mute: 'mute',
  },
  states: {
    success: 'check-circle',
    warning: 'warning',
    error: 'x-circle',
    info: 'info',
    loading: 'spinner',
  },
  special: {
    heart: 'heart',
    heartFilled: 'heart',
    lock: 'lock',
    unlock: 'unlock',
    rocket: 'rocket',
    sparkle: 'sparkle',
    star: 'star',
  },
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 9 — Default Config
 * ═══════════════════════════════════════════════════════════════════════ */

export const DEFAULT_CONFIG: A3MKConfig = {
  name: 'A3MK App',
  language: 'ar',
  theme: 'dark',
  direction: 'rtl',
  prefix: 'a3mk',
  iconSize: 20,
  animations: {
    enabled: true,
    speed: 'normal',
    ripple: true,
    hoverEffects: true,
  },
  features: {
    glassmorphism: true,
    shadows: true,
    glow: true,
    blur: true,
  },
  accessibility: {
    focusRing: true,
    keyboardNavigation: true,
    ariaLabels: true,
  },
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 10 — Internal State
 * ═══════════════════════════════════════════════════════════════════════ */

const state: InternalState = {
  config: deepClone(DEFAULT_CONFIG),
  labels: deepClone(AR_LABELS),
  icons: deepClone(DEFAULT_ICONS),
  initialized: false,
  listeners: new Set(),
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 11 — Language Packs
 * ═══════════════════════════════════════════════════════════════════════ */

const LANGUAGE_PACKS: Record<A3MKLanguage, () => A3MKLabels> = {
  ar: () => deepClone(AR_LABELS),
  en: () => deepClone(EN_LABELS),
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 12 — Notify Listeners
 * ═══════════════════════════════════════════════════════════════════════ */

function notifyListeners(): void {
  const snapshot: A3MKState = {
    config: state.config,
    labels: state.labels,
    icons: state.icons,
  };

  state.listeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch (err) {
      console.error('[A3MK-UI] Error in state listener:', err);
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 13 — Apply to DOM (SSR-Safe)
 * ═══════════════════════════════════════════════════════════════════════ */

function applyToDOM(): void {
  if (!isBrowser()) return;

  try {
    const root = document.documentElement;
    const prefix = state.config.prefix ?? 'a3mk';

    // ── الثيم ──
    const theme = state.config.theme ?? 'dark';
    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute(`data-${prefix}-theme`, isDark ? 'dark' : 'light');
    } else {
      root.setAttribute(`data-${prefix}-theme`, theme);
    }

    // ── اللغة والاتجاه ──
    const lang = state.config.language ?? 'ar';
    root.setAttribute('lang', lang);

    const dir = state.config.direction ?? 'rtl';
    if (dir === 'auto') {
      root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    } else {
      root.setAttribute('dir', dir);
    }

    // ── إعدادات الأيقونات ──
    if (state.config.iconSize !== undefined) {
      root.style.setProperty(`--${prefix}-icon-size`, `${state.config.iconSize}px`);
    }
    if (state.config.iconColor) {
      root.style.setProperty(`--${prefix}-icon-color`, state.config.iconColor);
    }

    // ── مضاعف سرعة الأنيميشن ──
    const speedMap: Record<A3MKSpeed, number> = {
      slow: 1.5,
      normal: 1,
      fast: 0.6,
      instant: 0.01,
    };
    const multiplier = state.config.animations?.enabled
      ? speedMap[state.config.animations.speed ?? 'normal']
      : 0.01;
    root.style.setProperty(`--${prefix}-animation-multiplier`, String(multiplier));

    // ── الألوان المخصصة ──
    if (state.config.colors) {
      for (const [key, value] of Object.entries(state.config.colors)) {
        if (value) {
          root.style.setProperty(`--${prefix}-color-${kebab(key)}`, value);
        }
      }
    }

    // ── الميزات ──
    root.setAttribute(`data-${prefix}-glass`, String(state.config.features?.glassmorphism ?? true));
    root.setAttribute(`data-${prefix}-shadows`, String(state.config.features?.shadows ?? true));
    root.setAttribute(`data-${prefix}-glow`, String(state.config.features?.glow ?? true));
    root.setAttribute(`data-${prefix}-blur`, String(state.config.features?.blur ?? true));
    root.setAttribute(`data-${prefix}-ripple`, String(state.config.animations?.ripple ?? true));

    // ── إتاحة الوصول ──
    root.setAttribute(`data-${prefix}-focus-ring`, String(state.config.accessibility?.focusRing ?? true));
  } catch (err) {
    console.error('[A3MK-UI] Error applying config to DOM:', err);
  }
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 14 — Language API
 * ═══════════════════════════════════════════════════════════════════════ */

export function setLanguage(lang: A3MKLanguage): void {
  if (!LANGUAGE_PACKS[lang]) {
    console.warn(`[A3MK-UI] Language "${lang}" not supported, falling back to Arabic`);
    lang = 'ar';
  }

  state.config.language = lang;

  const userLabels = state.config.labels ?? {};
  const baseLabels = LANGUAGE_PACKS[lang]();

  state.labels = mergeDeep(
    baseLabels as unknown as Record<string, unknown>,
    userLabels as unknown as Record<string, unknown>
  ) as unknown as A3MKLabels;

  state.config.direction = lang === 'ar' ? 'rtl' : 'ltr';

  if (isBrowser()) {
    applyToDOM();
  }

  notifyListeners();
}

export function getLanguage(): A3MKLanguage {
  return state.config.language ?? 'ar';
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 15 — Labels API
 * ═══════════════════════════════════════════════════════════════════════ */

export function setLabels(labels: DeepPartial<A3MKLabels>): void {
  state.config.labels = mergeDeep(
    (state.config.labels ?? {}) as Record<string, unknown>,
    labels as Record<string, unknown>
  ) as DeepPartial<A3MKLabels>;

  state.labels = mergeDeep(
    state.labels as unknown as Record<string, unknown>,
    labels as Record<string, unknown>
  ) as unknown as A3MKLabels;

  notifyListeners();
}

export function setLabel(path: string, value: string): void {
  if (!path || typeof value !== 'string') return;

  const keys = path.split('.').filter(Boolean);
  if (keys.length === 0) return;

  const labels = state.labels as unknown as Record<string, unknown>;
  let current: Record<string, unknown> = labels;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = value;
  notifyListeners();
}

export function getLabels(): Readonly<A3MKLabels> {
  return state.labels;
}

export function getLabel(path: string): string {
  if (!path) return '';
  const keys = path.split('.').filter(Boolean);
  if (keys.length === 0) return '';

  let current: unknown = state.labels;

  for (const key of keys) {
    if (current === null || typeof current !== 'object') return '';
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === 'string' ? current : '';
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 16 — Icons API
 * ═══════════════════════════════════════════════════════════════════════ */

export function setIcons(icons: DeepPartial<A3MKIcons>): void {
  state.config.icons = mergeDeep(
    (state.config.icons ?? {}) as Record<string, unknown>,
    icons as Record<string, unknown>
  ) as DeepPartial<A3MKIcons>;

  state.icons = mergeDeep(
    state.icons as unknown as Record<string, unknown>,
    icons as Record<string, unknown>
  ) as unknown as A3MKIcons;

  notifyListeners();
}

export function setIcon(path: string, icon: A3MKIcon): void {
  if (!path) return;

  const keys = path.split('.').filter(Boolean);
  if (keys.length === 0) return;

  const icons = state.icons as unknown as Record<string, unknown>;
  let current: Record<string, unknown> = icons;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  current[keys[keys.length - 1]] = icon;
  notifyListeners();
}

export function getIcons(): Readonly<A3MKIcons> {
  return state.icons;
}

export function getIcon(path: string): A3MKIcon {
  if (!path) return null;
  const keys = path.split('.').filter(Boolean);
  if (keys.length === 0) return null;

  let current: unknown = state.icons;

  for (const key of keys) {
    if (current === null || typeof current !== 'object') return null;
    current = (current as Record<string, unknown>)[key];
  }

  return (current as A3MKIcon) ?? null;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 16.1 — Icon Resolution (Pure Functions)
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  ⚠️ ملاحظة معمارية:
 *  الدوال هنا نقية (Pure) — لا تحتوي على أي Memoization.
 *  الـ Memoization مسؤولية الـ Renderer Layer.
 *
 *  🎯 مسؤولية الـ Renderer:
 *  عند الاستخدام في Render Cycle متكرر، استخدم Memoization خارجيًا.
 *
 * ═══════════════════════════════════════════════════════════════════════ */

export function resolveIcon(
  icon: A3MKIcon,
  overrides?: Partial<A3MKResolvedIcon>
): A3MKResolvedIcon | null {
  if (icon === null || icon === undefined || icon === '') {
    return null;
  }

  const name = typeof icon === 'string' ? icon : String(icon);
  if (!name) return null;

  return {
    name,
    size: overrides?.size ?? state.config.iconSize ?? 20,
    color: overrides?.color ?? state.config.iconColor,
  };
}

export function getResolvedIcon(
  path: string,
  overrides?: Partial<A3MKResolvedIcon>
): A3MKResolvedIcon | null {
  return resolveIcon(getIcon(path), overrides);
}

export function resolveIconSet<T extends Record<string, A3MKIcon>>(
  icons: T
): Record<keyof T, A3MKResolvedIcon | null> {
  const result = {} as Record<keyof T, A3MKResolvedIcon | null>;
  for (const key of Object.keys(icons) as Array<keyof T>) {
    result[key] = resolveIcon(icons[key]);
  }
  return result;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 17 — Configure API
 * ═══════════════════════════════════════════════════════════════════════ */

export function configure(config: A3MKConfig = {}): void {
  if (!config || typeof config !== 'object') return;

  const previousLang = state.config.language;

  const { labels: newLabels, icons: newIcons, ...restConfig } = config;

  state.config = mergeDeep(
    state.config as unknown as Record<string, unknown>,
    restConfig as Record<string, unknown>
  ) as A3MKConfig;

  // احترام تفضيلات النظام
  if (
    state.config.animations?.enabled &&
    isBrowser() &&
    typeof window.matchMedia === 'function'
  ) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      state.config.animations.enabled = false;
    }
  }

  const newLang = state.config.language ?? 'ar';
  if (newLang !== previousLang || !state.initialized) {
    if (newLabels) {
      state.config.labels = newLabels;
    }
    setLanguage(newLang);
  } else if (newLabels) {
    setLabels(newLabels);
  }

  if (newIcons) {
    setIcons(newIcons);
  }

  applyToDOM();

  state.initialized = true;
  notifyListeners();
}

export function getConfig(): Readonly<A3MKConfig> {
  return state.config;
}

export function reset(): void {
  state.config = deepClone(DEFAULT_CONFIG);
  state.labels = deepClone(AR_LABELS);
  state.icons = deepClone(DEFAULT_ICONS);
  state.initialized = false;

  applyToDOM();
  notifyListeners();
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 18 — Subscription API
 * ═══════════════════════════════════════════════════════════════════════ */

export function subscribe(
  listener: (state: Readonly<A3MKState>) => void
): () => void {
  if (typeof listener !== 'function') {
    return () => {};
  }

  state.listeners.add(listener);

  try {
    listener({
      config: state.config,
      labels: state.labels,
      icons: state.icons,
    });
  } catch (err) {
    console.error('[A3MK-UI] Error in initial listener call:', err);
  }

  return () => {
    state.listeners.delete(listener);
  };
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 19 — Helpers
 * ═══════════════════════════════════════════════════════════════════════ */

export function isReady(): boolean {
  return state.initialized;
}

export function isAnimationEnabled(): boolean {
  return state.config.animations?.enabled ?? true;
}

export function getAnimationMultiplier(): number {
  if (!state.config.animations?.enabled) return 0.01;

  const speedMap: Record<A3MKSpeed, number> = {
    slow: 1.5,
    normal: 1,
    fast: 0.6,
    instant: 0.01,
  };

  return speedMap[state.config.animations.speed ?? 'normal'];
}

export function getDefaultIconSize(): number {
  return state.config.iconSize ?? 20;
}

export function getDefaultIconColor(): string | undefined {
  return state.config.iconColor;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 20 — Unified Export
 * ═══════════════════════════════════════════════════════════════════════ */

export const A3MK = {
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

  // اللغات المتاحة
  languages: Object.keys(LANGUAGE_PACKS) as A3MKLanguage[],
} as const;

export default A3MK;
