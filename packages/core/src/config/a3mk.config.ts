/**
 * ═══════════════════════════════════════════════════════════════════════
 *  A3MK-UI — Master Configuration System
 *  نظام التحكم الرئيسي في المكتبة
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  @file    a3mk.config.ts
 *  @package @a3mk-ui/core
 *  @version 1.0.0-a3mk-ui1
 *  @author  A3MK
 *  @license MIT
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  ملاحظات مهمة:
 *  ─────────────────────────────────────────────────────────────────────
 *  • صفر تبعيات (Zero Dependencies)
 *  • آمن على SSR (Next.js, Nuxt, Astro, SvelteKit)
 *  • كل الـ types معرّفة قبل الاستخدام
 *  • كل دوال DOM محمية بـ isBrowser() guard
 *  • Phosphor Icons هي المكتبة الأساسية والوحيدة للأيقونات
 *  • resolvePhosphorIcon لتطبيع الأيقونات ودمجها مع الإعدادات
 *  • الـ Config يبقى نقي (Pure) — الـ Memoization مسؤولية الـ Renderer
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
export type A3MKLanguage = 'ar' | 'en' | 'fr' | 'es' | 'tr' | 'de' | 'it';

/**
 * وزن أيقونة Phosphor
 */
export type A3MKPhosphorWeight =
  | 'thin'
  | 'light'
  | 'regular'
  | 'bold'
  | 'fill'
  | 'duotone';

/**
 * أيقونة Phosphor — الشكل الوحيد المدعوم
 *
 * @example
 *   // اسم مباشر
 *   'heart'
 *
 *   // كائن كامل
 *   { name: 'heart', weight: 'fill', size: 24, color: '#f00' }
 *
 *   // بدون أيقونة
 *   null
 */
export type A3MKPhosphorIcon =
  | string
  | {
      name: string;
      weight?: A3MKPhosphorWeight;
      color?: string;
      size?: number | string;
    }
  | null;

/**
 * أيقونة بعد التطبيع (Resolved)
 * كائن موحد دايمًا — سهل الاستخدام في الـ Renderer
 */
export interface A3MKResolvedIcon {
  name: string;
  weight: A3MKPhosphorWeight;
  size: number;
  color?: string;
}

/**
 * الاسم القديم محفوظ للتوافق — Phosphor فقط
 */
export type A3MKIcon = A3MKPhosphorIcon;

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
  button: {
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    add: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    reset: string;
    search: string;
    filter: string;
    refresh: string;
    reload: string;
    copy: string;
    paste: string;
    cut: string;
    undo: string;
    redo: string;
    select: string;
    selectAll: string;
    clear: string;
    apply: string;
    done: string;
    ok: string;
  };
  navigation: {
    home: string;
    explore: string;
    dashboard: string;
    profile: string;
    account: string;
    settings: string;
    menu: string;
    notifications: string;
    messages: string;
    search: string;
    help: string;
    about: string;
    contact: string;
    logout: string;
    login: string;
    signup: string;
    language: string;
    theme: string;
  };
  payment: {
    pay: string;
    payNow: string;
    processing: string;
    success: string;
    failed: string;
    retry: string;
    checkout: string;
    cart: string;
    card: string;
    invoice: string;
    refund: string;
    wallet: string;
    coupon: string;
    discount: string;
    total: string;
    subtotal: string;
    tax: string;
    shipping: string;
    confirmPayment: string;
  };
  files: {
    open: string;
    upload: string;
    download: string;
    import: string;
    export: string;
    print: string;
    attach: string;
    share: string;
    copyLink: string;
    saveAs: string;
    rename: string;
    move: string;
    folder: string;
    file: string;
  };
  communication: {
    call: string;
    email: string;
    message: string;
    video: string;
    audio: string;
    voice: string;
    invite: string;
    send: string;
    reply: string;
    forward: string;
    mute: string;
    unmute: string;
  };
  media: {
    play: string;
    pause: string;
    stop: string;
    record: string;
    volume: string;
    mute: string;
    unmute: string;
    fullscreen: string;
    speed: string;
    quality: string;
  };
  states: {
    success: string;
    warning: string;
    error: string;
    info: string;
    loading: string;
    empty: string;
    notFound: string;
    forbidden: string;
    unauthorized: string;
    offline: string;
    online: string;
    pending: string;
    approved: string;
    rejected: string;
    completed: string;
    failed: string;
    cancelled: string;
    processing: string;
  };
  messages: {
    savedSuccessfully: string;
    copiedSuccessfully: string;
    deletedSuccessfully: string;
    updatedSuccessfully: string;
    createdSuccessfully: string;
    errorOccurred: string;
    tryAgain: string;
    confirmDelete: string;
    areYouSure: string;
    cannotUndo: string;
    pleaseWait: string;
    loadingData: string;
    noResults: string;
  };
  custom: {
    payButton: string;
    saveButton: string;
    copyButton: string;
    errorButton: string;
    errorText: string;
    likeButton: string;
    unlikeButton: string;
    lockButton: string;
    unlockButton: string;
    launchingButton: string;
    animationButton: string;
  };
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 3 — Icons Schema (Phosphor Only)
 * ═══════════════════════════════════════════════════════════════════════ */

export interface A3MKIcons {
  button: {
    save: A3MKPhosphorIcon;
    cancel: A3MKPhosphorIcon;
    confirm: A3MKPhosphorIcon;
    delete: A3MKPhosphorIcon;
    edit: A3MKPhosphorIcon;
    add: A3MKPhosphorIcon;
    close: A3MKPhosphorIcon;
    back: A3MKPhosphorIcon;
    next: A3MKPhosphorIcon;
    previous: A3MKPhosphorIcon;
    submit: A3MKPhosphorIcon;
    reset: A3MKPhosphorIcon;
    search: A3MKPhosphorIcon;
    refresh: A3MKPhosphorIcon;
    copy: A3MKPhosphorIcon;
    undo: A3MKPhosphorIcon;
    redo: A3MKPhosphorIcon;
  };
  navigation: {
    home: A3MKPhosphorIcon;
    explore: A3MKPhosphorIcon;
    dashboard: A3MKPhosphorIcon;
    profile: A3MKPhosphorIcon;
    settings: A3MKPhosphorIcon;
    menu: A3MKPhosphorIcon;
    notifications: A3MKPhosphorIcon;
    messages: A3MKPhosphorIcon;
    search: A3MKPhosphorIcon;
  };
  payment: {
    pay: A3MKPhosphorIcon;
    cart: A3MKPhosphorIcon;
    card: A3MKPhosphorIcon;
    invoice: A3MKPhosphorIcon;
    success: A3MKPhosphorIcon;
    error: A3MKPhosphorIcon;
  };
  files: {
    open: A3MKPhosphorIcon;
    upload: A3MKPhosphorIcon;
    download: A3MKPhosphorIcon;
    print: A3MKPhosphorIcon;
    attach: A3MKPhosphorIcon;
    share: A3MKPhosphorIcon;
    link: A3MKPhosphorIcon;
  };
  communication: {
    call: A3MKPhosphorIcon;
    email: A3MKPhosphorIcon;
    message: A3MKPhosphorIcon;
    video: A3MKPhosphorIcon;
    audio: A3MKPhosphorIcon;
    invite: A3MKPhosphorIcon;
    send: A3MKPhosphorIcon;
  };
  media: {
    play: A3MKPhosphorIcon;
    pause: A3MKPhosphorIcon;
    next: A3MKPhosphorIcon;
    previous: A3MKPhosphorIcon;
    volume: A3MKPhosphorIcon;
    mute: A3MKPhosphorIcon;
  };
  states: {
    success: A3MKPhosphorIcon;
    warning: A3MKPhosphorIcon;
    error: A3MKPhosphorIcon;
    info: A3MKPhosphorIcon;
    loading: A3MKPhosphorIcon;
  };
  special: {
    heart: A3MKPhosphorIcon;
    heartFilled: A3MKPhosphorIcon;
    lock: A3MKPhosphorIcon;
    unlock: A3MKPhosphorIcon;
    rocket: A3MKPhosphorIcon;
    sparkle: A3MKPhosphorIcon;
    star: A3MKPhosphorIcon;
  };
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 4 — Master Config Schema
 * ═══════════════════════════════════════════════════════════════════════ */

export interface A3MKConfig {
  name?: string;
  language?: A3MKLanguage;
  theme?: A3MKTheme;
  direction?: A3MKDirection;
  prefix?: string;

  /** الوزن الافتراضي لكل الأيقونات */
  iconWeight?: A3MKPhosphorWeight;

  /** حجم الأيقونات الافتراضي (px) */
  iconSize?: number;

  /** لون الأيقونات الافتراضي */
  iconColor?: string;

  animations?: {
    enabled?: boolean;
    speed?: A3MKSpeed;
    respectSystemPreference?: boolean;
    reducedMotion?: boolean;
    ripple?: boolean;
    hoverEffects?: boolean;
    successPulse?: boolean;
  };
  features?: {
    glassmorphism?: boolean;
    shadows?: boolean;
    glow?: boolean;
    blur?: boolean;
    hapticFeedback?: boolean;
    sounds?: boolean;
  };
  colors?: {
    primary?: string;
    secondary?: string;
    success?: string;
    warning?: string;
    danger?: string;
    error?: string;
    info?: string;
    background?: string;
    surface?: string;
    text?: string;
    textDim?: string;
  };
  performance?: {
    lazyLoad?: boolean;
    preloadCritical?: boolean;
    useShadowDOM?: boolean;
    virtualizeLists?: boolean;
    cacheTemplates?: boolean;
  };
  accessibility?: {
    focusRing?: boolean;
    highContrast?: boolean;
    announceChanges?: boolean;
    keyboardNavigation?: boolean;
    ariaLabels?: boolean;
  };
  labels?: DeepPartial<A3MKLabels>;
  icons?: DeepPartial<A3MKIcons>;
  custom?: Record<string, unknown>;
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
    filter: 'تصفية',
    refresh: 'تحديث',
    reload: 'إعادة تحميل',
    copy: 'نسخ',
    paste: 'لصق',
    cut: 'قص',
    undo: 'تراجع',
    redo: 'إعادة',
    select: 'اختيار',
    selectAll: 'اختيار الكل',
    clear: 'مسح',
    apply: 'تطبيق',
    done: 'تم',
    ok: 'موافق',
  },
  navigation: {
    home: 'الرئيسية',
    explore: 'استكشاف',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    account: 'حسابي',
    settings: 'الإعدادات',
    menu: 'القائمة',
    notifications: 'الإشعارات',
    messages: 'الرسائل',
    search: 'بحث',
    help: 'مساعدة',
    about: 'حول',
    contact: 'تواصل معنا',
    logout: 'خروج',
    login: 'تسجيل الدخول',
    signup: 'إنشاء حساب',
    language: 'اللغة',
    theme: 'المظهر',
  },
  payment: {
    pay: 'دفع',
    payNow: 'ادفع الآن',
    processing: 'جاري المعالجة...',
    success: 'تم الدفع بنجاح',
    failed: 'فشل الدفع',
    retry: 'إعادة المحاولة',
    checkout: 'إتمام الشراء',
    cart: 'السلة',
    card: 'بطاقة',
    invoice: 'الفاتورة',
    refund: 'استرداد',
    wallet: 'المحفظة',
    coupon: 'كوبون',
    discount: 'خصم',
    total: 'الإجمالي',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة',
    shipping: 'الشحن',
    confirmPayment: 'تأكيد الدفع',
  },
  files: {
    open: 'فتح',
    upload: 'رفع',
    download: 'تحميل',
    import: 'استيراد',
    export: 'تصدير',
    print: 'طباعة',
    attach: 'إرفاق',
    share: 'مشاركة',
    copyLink: 'نسخ الرابط',
    saveAs: 'حفظ باسم',
    rename: 'إعادة تسمية',
    move: 'نقل',
    folder: 'مجلد',
    file: 'ملف',
  },
  communication: {
    call: 'اتصال',
    email: 'إيميل',
    message: 'رسالة',
    video: 'فيديو',
    audio: 'صوت',
    voice: 'صوتي',
    invite: 'دعوة',
    send: 'إرسال',
    reply: 'رد',
    forward: 'تحويل',
    mute: 'كتم',
    unmute: 'إلغاء الكتم',
  },
  media: {
    play: 'تشغيل',
    pause: 'إيقاف',
    stop: 'إيقاف',
    record: 'تسجيل',
    volume: 'الصوت',
    mute: 'كتم',
    unmute: 'إلغاء الكتم',
    fullscreen: 'ملء الشاشة',
    speed: 'السرعة',
    quality: 'الجودة',
  },
  states: {
    success: 'نجاح',
    warning: 'تحذير',
    error: 'خطأ',
    info: 'معلومة',
    loading: 'جاري التحميل',
    empty: 'لا يوجد',
    notFound: 'غير موجود',
    forbidden: 'ممنوع',
    unauthorized: 'غير مصرح',
    offline: 'غير متصل',
    online: 'متصل',
    pending: 'قيد الانتظار',
    approved: 'موافق عليه',
    rejected: 'مرفوض',
    completed: 'مكتمل',
    failed: 'فشل',
    cancelled: 'ملغي',
    processing: 'جاري المعالجة',
  },
  messages: {
    savedSuccessfully: 'تم الحفظ بنجاح',
    copiedSuccessfully: 'تم النسخ بنجاح',
    deletedSuccessfully: 'تم الحذف بنجاح',
    updatedSuccessfully: 'تم التحديث بنجاح',
    createdSuccessfully: 'تم الإنشاء بنجاح',
    errorOccurred: 'حدث خطأ',
    tryAgain: 'حاول مرة أخرى',
    confirmDelete: 'تأكيد الحذف',
    areYouSure: 'هل أنت متأكد؟',
    cannotUndo: 'لا يمكن التراجع',
    pleaseWait: 'الرجاء الانتظار',
    loadingData: 'جاري تحميل البيانات',
    noResults: 'لا توجد نتائج',
  },
  custom: {
    payButton: 'إتمام الدفع الآن',
    saveButton: 'حفظ',
    copyButton: 'نسخ',
    errorButton: 'خطأ',
    errorText: '⚠ خطأ ⚠',
    likeButton: 'إعجاب',
    unlikeButton: 'معجب',
    lockButton: 'مقفل',
    unlockButton: 'مفتوح',
    launchingButton: 'إطلاق',
    animationButton: 'تشغيل الأنيميشن',
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
    filter: 'Filter',
    refresh: 'Refresh',
    reload: 'Reload',
    copy: 'Copy',
    paste: 'Paste',
    cut: 'Cut',
    undo: 'Undo',
    redo: 'Redo',
    select: 'Select',
    selectAll: 'Select All',
    clear: 'Clear',
    apply: 'Apply',
    done: 'Done',
    ok: 'OK',
  },
  navigation: {
    home: 'Home',
    explore: 'Explore',
    dashboard: 'Dashboard',
    profile: 'Profile',
    account: 'Account',
    settings: 'Settings',
    menu: 'Menu',
    notifications: 'Notifications',
    messages: 'Messages',
    search: 'Search',
    help: 'Help',
    about: 'About',
    contact: 'Contact',
    logout: 'Logout',
    login: 'Login',
    signup: 'Sign Up',
    language: 'Language',
    theme: 'Theme',
  },
  payment: {
    pay: 'Pay',
    payNow: 'Pay Now',
    processing: 'Processing...',
    success: 'Payment Successful',
    failed: 'Payment Failed',
    retry: 'Retry',
    checkout: 'Checkout',
    cart: 'Cart',
    card: 'Card',
    invoice: 'Invoice',
    refund: 'Refund',
    wallet: 'Wallet',
    coupon: 'Coupon',
    discount: 'Discount',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    shipping: 'Shipping',
    confirmPayment: 'Confirm Payment',
  },
  files: {
    open: 'Open',
    upload: 'Upload',
    download: 'Download',
    import: 'Import',
    export: 'Export',
    print: 'Print',
    attach: 'Attach',
    share: 'Share',
    copyLink: 'Copy Link',
    saveAs: 'Save As',
    rename: 'Rename',
    move: 'Move',
    folder: 'Folder',
    file: 'File',
  },
  communication: {
    call: 'Call',
    email: 'Email',
    message: 'Message',
    video: 'Video',
    audio: 'Audio',
    voice: 'Voice',
    invite: 'Invite',
    send: 'Send',
    reply: 'Reply',
    forward: 'Forward',
    mute: 'Mute',
    unmute: 'Unmute',
  },
  media: {
    play: 'Play',
    pause: 'Pause',
    stop: 'Stop',
    record: 'Record',
    volume: 'Volume',
    mute: 'Mute',
    unmute: 'Unmute',
    fullscreen: 'Fullscreen',
    speed: 'Speed',
    quality: 'Quality',
  },
  states: {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    info: 'Info',
    loading: 'Loading',
    empty: 'Empty',
    notFound: 'Not Found',
    forbidden: 'Forbidden',
    unauthorized: 'Unauthorized',
    offline: 'Offline',
    online: 'Online',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
    failed: 'Failed',
    cancelled: 'Cancelled',
    processing: 'Processing',
  },
  messages: {
    savedSuccessfully: 'Saved successfully',
    copiedSuccessfully: 'Copied successfully',
    deletedSuccessfully: 'Deleted successfully',
    updatedSuccessfully: 'Updated successfully',
    createdSuccessfully: 'Created successfully',
    errorOccurred: 'An error occurred',
    tryAgain: 'Try again',
    confirmDelete: 'Confirm delete',
    areYouSure: 'Are you sure?',
    cannotUndo: 'This cannot be undone',
    pleaseWait: 'Please wait',
    loadingData: 'Loading data',
    noResults: 'No results',
  },
  custom: {
    payButton: 'Complete Payment',
    saveButton: 'Save',
    copyButton: 'Copy',
    errorButton: 'Error',
    errorText: '⚠ ERROR ⚠',
    likeButton: 'Like',
    unlikeButton: 'Liked',
    lockButton: 'Locked',
    unlockButton: 'Unlocked',
    launchingButton: 'Launch',
    animationButton: 'Play Animation',
  },
};

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 8 — Default Icons (Phosphor Only)
 * ═══════════════════════════════════════════════════════════════════════ */

export const DEFAULT_ICONS: A3MKIcons = {
  button: {
    save: 'floppy-disk',
    cancel: 'x',
    confirm: 'check',
    delete: 'trash',
    edit: 'pencil-simple',
    add: 'plus',
    close: 'x-circle',
    back: 'arrow-left',
    next: 'arrow-right',
    previous: 'arrow-left',
    submit: 'paper-plane-tilt',
    reset: 'arrow-counter-clockwise',
    search: 'magnifying-glass',
    refresh: 'arrows-clockwise',
    copy: 'copy',
    undo: 'arrow-u-up-left',
    redo: 'arrow-u-up-right',
  },
  navigation: {
    home: 'house',
    explore: 'compass',
    dashboard: 'chart-bar',
    profile: 'user',
    settings: 'gear-six',
    menu: 'list',
    notifications: 'bell',
    messages: 'chat',
    search: 'magnifying-glass',
  },
  payment: {
    pay: 'credit-card',
    cart: 'shopping-cart',
    card: 'credit-card',
    invoice: 'receipt',
    success: 'check-circle',
    error: 'x-circle',
  },
  files: {
    open: 'folder-open',
    upload: 'upload-simple',
    download: 'download-simple',
    print: 'printer',
    attach: 'paperclip',
    share: 'share-network',
    link: 'link',
  },
  communication: {
    call: 'phone',
    email: 'envelope',
    message: 'chat',
    video: 'video-camera',
    audio: 'microphone',
    invite: 'envelope-open',
    send: 'paper-plane-tilt',
  },
  media: {
    play: 'play',
    pause: 'pause',
    next: 'skip-forward',
    previous: 'skip-back',
    volume: 'speaker-high',
    mute: 'speaker-slash',
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
    heartFilled: 'heart-straight-fill',
    lock: 'lock',
    unlock: 'lock-open',
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
  iconWeight: 'regular',
  iconSize: 20,
  animations: {
    enabled: true,
    speed: 'normal',
    respectSystemPreference: true,
    reducedMotion: false,
    ripple: true,
    hoverEffects: true,
    successPulse: true,
  },
  features: {
    glassmorphism: true,
    shadows: true,
    glow: true,
    blur: true,
    hapticFeedback: false,
    sounds: false,
  },
  performance: {
    lazyLoad: true,
    preloadCritical: true,
    useShadowDOM: true,
    virtualizeLists: false,
    cacheTemplates: true,
  },
  accessibility: {
    focusRing: true,
    highContrast: false,
    announceChanges: false,
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
  fr: () => deepClone(EN_LABELS),
  es: () => deepClone(EN_LABELS),
  tr: () => deepClone(EN_LABELS),
  de: () => deepClone(EN_LABELS),
  it: () => deepClone(EN_LABELS),
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
      // eslint-disable-next-line no-console
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
      const isRTL = lang === 'ar';
      root.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    } else {
      root.setAttribute('dir', dir);
    }

    // ── إعدادات الأيقونات ──
    if (state.config.iconWeight) {
      root.setAttribute(`data-${prefix}-icon-weight`, state.config.iconWeight);
    }
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
    root.setAttribute(
      `data-${prefix}-glass`,
      String(state.config.features?.glassmorphism ?? true)
    );
    root.setAttribute(
      `data-${prefix}-shadows`,
      String(state.config.features?.shadows ?? true)
    );
    root.setAttribute(
      `data-${prefix}-glow`,
      String(state.config.features?.glow ?? true)
    );
    root.setAttribute(
      `data-${prefix}-blur`,
      String(state.config.features?.blur ?? true)
    );
    root.setAttribute(
      `data-${prefix}-ripple`,
      String(state.config.animations?.ripple ?? true)
    );

    // ── إتاحة الوصول ──
    root.setAttribute(
      `data-${prefix}-focus-ring`,
      String(state.config.accessibility?.focusRing ?? true)
    );
    root.setAttribute(
      `data-${prefix}-high-contrast`,
      String(state.config.accessibility?.highContrast ?? false)
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[A3MK-UI] Error applying config to DOM:', err);
  }
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 14 — Language API
 * ═══════════════════════════════════════════════════════════════════════ */

export function setLanguage(lang: A3MKLanguage): void {
  if (!LANGUAGE_PACKS[lang]) {
    // eslint-disable-next-line no-console
    console.warn(`[A3MK-UI] Language "${lang}" is not supported, falling back to English`);
    lang = 'en';
  }

  state.config.language = lang;

  const userLabels = state.config.labels ?? {};
  const baseLabels = LANGUAGE_PACKS[lang]();

  state.labels = mergeDeep(baseLabels, userLabels) as A3MKLabels;

  if (lang === 'ar') {
    state.config.direction = 'rtl';
  } else {
    state.config.direction = 'ltr';
  }

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

/**
 * تغيير أيقونة واحدة (Phosphor فقط)
 *
 * @example
 *   setIcon('payment.pay', 'money');
 *   setIcon('payment.pay', { name: 'money', weight: 'fill' });
 *   setIcon('payment.pay', null); // إخفاء الأيقونة
 */
export function setIcon(path: string, icon: A3MKPhosphorIcon): void {
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

export function getIcon(path: string): A3MKPhosphorIcon {
  if (!path) return null;
  const keys = path.split('.').filter(Boolean);
  if (keys.length === 0) return null;

  let current: unknown = state.icons;

  for (const key of keys) {
    if (current === null || typeof current !== 'object') return null;
    current = (current as Record<string, unknown>)[key];
  }

  return (current as A3MKPhosphorIcon) ?? null;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 16.1 — Icon Resolution (Pure Functions)
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  ⚠️ ملاحظة معمارية مهمة (Architectural Note):
 *  ─────────────────────────────────────────────────────────────────────
 *  الدوال هنا **نقية** (Pure) — لا تحتوي على أي Memoization.
 *  السبب:
 *    1. الـ Config يجب أن يبقى **سريع وخفيف** بدون تعقيد
 *    2. الـ Memoization مسؤولية **الـ Renderer Layer** لأنها تعرف
 *       متى تتغير القيم ومتى تعيد الحساب.
 *    3. الفصل بين Layers يسهّل الاختبار والـ Debugging.
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  🎯 مسؤولية الـ Renderer (خارج هذا الملف):
 *  ─────────────────────────────────────────────────────────────────────
 *  عندما تستدعي هذه الدوال داخل Render Cycle متكرر أو Loop كبير،
 *  استخدم Memoization في طبقة الـ Renderer:
 *
 *    // في الـ Renderer (مثال)
 *    const iconCache = new Map<string, A3MKResolvedIcon | null>();
 *
 *    function getCachedIcon(path: string): A3MKResolvedIcon | null {
 *      if (iconCache.has(path)) return iconCache.get(path)!;
 *      const icon = A3MK.getResolvedIcon(path);
 *      iconCache.set(path, icon);
 *      return icon;
 *    }
 *
 *    // مسح الـ Cache عند تغيير الإعدادات
 *    A3MK.subscribe(() => iconCache.clear());
 *
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * تطبيع أيقونة Phosphor ودمجها مع الإعدادات العامة
 *
 * **Pure Function** — لا Memoization، لا Side Effects.
 * استخدمها في الـ Renderer مع Memoization إذا دعت الحاجة.
 *
 * @param icon - الأيقونة (string | object | null)
 * @param overrides - إعدادات مؤقتة (اختياري)
 * @returns كائن موحد جاهز للاستخدام في الـ Renderer، أو null إذا كانت الأيقونة مخفية
 *
 * @example
 *   resolvePhosphorIcon('heart')
 *   // => { name: 'heart', weight: 'regular', size: 20, color: undefined }
 *
 *   resolvePhosphorIcon({ name: 'heart', weight: 'fill', size: 32 })
 *   // => { name: 'heart', weight: 'fill', size: 32, color: undefined }
 *
 *   resolvePhosphorIcon(null)
 *   // => null
 */
export function resolvePhosphorIcon(
  icon: A3MKPhosphorIcon,
  overrides?: Partial<A3MKResolvedIcon>
): A3MKResolvedIcon | null {
  // 1) لو الأيقونة مخفية أو فاضية
  if (icon === null || icon === undefined || icon === '') {
    return null;
  }

  // 2) تطبيع: string → object
  const normalized: {
    name: string;
    weight?: A3MKPhosphorWeight;
    size?: number | string;
    color?: string;
  } = typeof icon === 'string' ? { name: icon } : icon;

  // 3) تأكد إن فيه اسم
  if (!normalized.name) return null;

  // 4) معالجة الحجم (يقبل number أو string زي '1.5rem')
  let sizeNum: number | undefined;
  if (typeof normalized.size === 'number') {
    sizeNum = normalized.size;
  } else if (typeof normalized.size === 'string') {
    const parsed = parseFloat(normalized.size);
    sizeNum = !Number.isNaN(parsed) ? parsed : undefined;
  }

  // 5) دمج القيم:
  //    normalized (الأولوية الأعلى) → overrides → config العام → default
  return {
    name: normalized.name,
    weight:
      normalized.weight ??
      overrides?.weight ??
      state.config.iconWeight ??
      'regular',
    size:
      sizeNum ??
      overrides?.size ??
      state.config.iconSize ??
      20,
    color:
      normalized.color ??
      overrides?.color ??
      state.config.iconColor,
  };
}

/**
 * الحصول على أيقونة مع تطبيعها مباشرة من الـ config
 *
 * **Pure Function** — تجمع بين `getIcon` و `resolvePhosphorIcon`.
 * للاستخدام داخل Render Cycle متكرر، غلّفها بـ Memoization في الـ Renderer.
 *
 * @example
 *   const icon = getResolvedIcon('payment.pay');
 *   // => { name: 'credit-card', weight: 'regular', size: 20, color: undefined }
 */
export function getResolvedIcon(
  path: string,
  overrides?: Partial<A3MKResolvedIcon>
): A3MKResolvedIcon | null {
  return resolvePhosphorIcon(getIcon(path), overrides);
}

/**
 * تطبيع مجموعة أيقونات كاملة
 *
 * **Pure Function** — لا Memoization.
 *
 * ⚠️ **تحذير للأداء:**
 * هذه الدالة تستدعي `resolvePhosphorIcon` لكل مفتاح، وكل استدعاء
 * يقرأ من `state.config`. إذا كنت ستستدعيها داخل:
 *   • `render()` في component
 *   • `for` loop كبير
 *   • `map()` على مصفوفة كبيرة
 *   • أكثر من مرة في الـ Render Cycle
 *
 * فاستخدم **Memoization في طبقة الـ Renderer** (وليس هنا).
 *
 * @example
 *   // استخدام عادي (مرة واحدة)
 *   const icons = resolveIconSet(DEFAULT_ICONS.payment);
 *   // => { pay: {...}, cart: {...}, card: {...}, ... }
 *
 *   // في Render Cycle — استخدم Memoization خارجيًا
 *   const cache = new Map();
 *   function getPaymentIcons() {
 *     if (cache.has('payment')) return cache.get('payment');
 *     const result = resolveIconSet(DEFAULT_ICONS.payment);
 *     cache.set('payment', result);
 *     return result;
 *   }
 */
export function resolveIconSet<T extends Record<string, A3MKPhosphorIcon>>(
  icons: T
): Record<keyof T, A3MKResolvedIcon | null> {
  const result = {} as Record<keyof T, A3MKResolvedIcon | null>;
  for (const key of Object.keys(icons) as Array<keyof T>) {
    result[key] = resolvePhosphorIcon(icons[key]);
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

  if (
    state.config.animations?.respectSystemPreference &&
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
    // eslint-disable-next-line no-console
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

/**
 * الحصول على الوزن الافتراضي للأيقونات
 */
export function getDefaultIconWeight(): A3MKPhosphorWeight {
  return state.config.iconWeight ?? 'regular';
}

/**
 * الحصول على الحجم الافتراضي للأيقونات (px)
 */
export function getDefaultIconSize(): number {
  return state.config.iconSize ?? 20;
}

/**
 * الحصول على لون الأيقونات الافتراضي
 */
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
  resolveIcon: resolvePhosphorIcon,
  getResolvedIcon,
  resolveIconSet,
  getDefaultIconWeight,
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
