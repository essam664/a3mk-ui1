/**
 * ═══════════════════════════════════════════════════════════════════════
 *  A3MK-UI — Button Component
 *  زر A3MK — Web Component + Fluent API
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  @file    a3mk-button.ts
 *  @package @a3mk-ui/core
 *  @version 1.0.0-a3mk-ui1
 *  @author  A3MK
 *  @license MIT
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  ⚠️ Dependencies Note:
 *  ─────────────────────────────────────────────────────────────────────
 *  هذا الملف يعتمد على **Lit** (مكتبة Web Components من Google).
 *
 *  • Lit size: ~5KB gzipped (minified + gzipped)
 *  • Reason: توفر Reactive Properties + Shadow DOM + Efficient rendering
 *
 *  لباقي أجزاء المكتبة (config / tokens): **صفر تبعيات**.
 *  الأدوات النقية (Pure utilities) يمكن استخدامها بدون Lit.
 *
 *  لو تريد إصدار "No Lit" — استخدم `@a3mk-ui/core/headless`.
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  الميزات:
 *  ─────────────────────────────────────────────────────────────────────
 *  • 3 أنواع: contained / outlined / text
 *  • 6 ألوان دلالية: primary/secondary/success/warning/danger/info
 *  • 5 أحجام: xs / sm / md / lg / xl
 *  • Phosphor Icons
 *  • Ripple effect (قابل للإيقاف)
 *  • Loading state (spinner داخلي)
 *  • تأثير ضغط داخلي قوي
 *  • Accessibility كامل (ARIA + keyboard)
 *  • Reactive مع تغييرات Config (مع Memoization)
 *  • Handlers ديناميكية بعد mount
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 0 — Imports
 * ═══════════════════════════════════════════════════════════════════════ */

import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import {
  getConfig,
  resolvePhosphorIcon,
  subscribe,
  getAnimationMultiplier,
  type A3MKPhosphorIcon,
  type A3MKResolvedIcon,
  type A3MKState,
} from '../../config/a3mk.config.js';

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
  icon?: A3MKPhosphorIcon;
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
 *  SECTION 2 — Icon Helper
 * ═══════════════════════════════════════════════════════════════════════ */

function renderIcon(icon: A3MKResolvedIcon | null): unknown {
  if (!icon) return nothing;

  const hasPhosphor =
    typeof customElements !== 'undefined' &&
    customElements.get('ph-icon') !== undefined;

  if (!hasPhosphor) {
    return html`<span class="a3mk-icon-fallback" aria-hidden="true">${icon.name}</span>`;
  }

  return html`
    <ph-icon
      class="a3mk-icon"
      name=${icon.name}
      weight=${icon.weight}
      size=${String(icon.size)}
      style=${icon.color ? `color:${icon.color}` : nothing}
      aria-hidden="true"
    ></ph-icon>
  `;
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 3 — Web Component
 * ═══════════════════════════════════════════════════════════════════════ */

@customElement('a3mk-button')
export class A3MKButton extends LitElement {
  /* ── Public Properties ── */
  @property({ type: String, reflect: true }) variant: ButtonVariant = 'contained';
  @property({ type: String, reflect: true }) color: ButtonColor = 'primary';
  @property({ type: String, reflect: true }) size: ButtonSize = 'md';
  @property({ type: String }) icon: A3MKPhosphorIcon = null;
  @property({ type: String, attribute: 'icon-position' })
  iconPosition: 'start' | 'end' = 'start';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true, attribute: 'full-width' })
  fullWidth = false;
  @property({ type: Boolean, reflect: true, attribute: 'no-animation' })
  noAnimation = false;
  @property({ type: Boolean, reflect: true }) rounded = false;
  @property({ type: String }) type: ButtonType = 'button';
  @property({ type: String }) override title = '';
  @property({ type: String, attribute: 'aria-label' }) override ariaLabel = '';

  /* ── Internal State ── */
  @state() private _iconResolved: A3MKResolvedIcon | null = null;
  @state() private _animationMultiplier = 1;
  @state() private _rippleEnabled = true;

  /* ── Memoization Keys (لمنع إعادة الحساب غير الضروري) ── */
  private _prevIconKey = '';
  private _prevAnimationKey = '';

  /* ── Subscription ── */
  private _unsubscribe?: () => void;

  /* ── Lifecycle ── */
  connectedCallback(): void {
    super.connectedCallback();

    // اقرأ الإعدادات الأولية
    this._syncFromConfig(true);

    // اشترك في تغييرات الـ config
    this._unsubscribe = subscribe((s) => this._onConfigChange(s));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unsubscribe?.();
    this._unsubscribe = undefined;
  }

  /* ── Config Sync ── */
  private _onConfigChange(_s: Readonly<A3MKState>): void {
    this._syncFromConfig(false);
  }

  /**
   * مزامنة الإعدادات من الـ config
   *
   * ✅ Memoization: يتم إعادة الحساب فقط عندما تتغير المفاتيح الفعلية
   *
   * @param force - إجبار إعادة الحساب (يُستخدم عند connectedCallback)
   */
  private _syncFromConfig(force = false): void {
    const config = getConfig();
    let needsUpdate = false;

    /* ── أيقونة: يُعاد حسابها فقط عند تغير الأيقونة أو إعداداتها ── */
    const iconKey =
      JSON.stringify(this.icon) +
      '|' +
      (config.iconWeight ?? '') +
      '|' +
      (config.iconSize ?? '') +
      '|' +
      (config.iconColor ?? '');

    if (force || iconKey !== this._prevIconKey) {
      this._prevIconKey = iconKey;
      this._iconResolved = this.icon ? resolvePhosphorIcon(this.icon) : null;
      needsUpdate = true;
    }

    /* ── مضاعف السرعة + Ripple ── */
    const animationKey =
      String(getAnimationMultiplier()) +
      '|' +
      String(config.animations?.ripple ?? true) +
      '|' +
      String(this.noAnimation);

    if (force || animationKey !== this._prevAnimationKey) {
      this._prevAnimationKey = animationKey;
      this._animationMultiplier = this.noAnimation
        ? 0.01
        : getAnimationMultiplier();
      this._rippleEnabled = config.animations?.ripple ?? true;
      needsUpdate = true;
    }

    /* ── نطلب تحديث الـ DOM فقط إذا كان هناك تغيير حقيقي ── */
    if (needsUpdate) {
      this.requestUpdate();
    }
  }

  /* ── Styles ── */
  static styles = css`
    :host {
      display: inline-block;
      --_bg-start: rgba(255, 255, 255, 0.08);
      --_bg-mid: rgba(255, 255, 255, 0.03);
      --_bg-end: rgba(255, 255, 255, 0.06);
      --_border: rgba(255, 255, 255, 0.12);
      --_text: var(--a3mk-color-text-primary, #eaeaf0);
      --_accent: var(--a3mk-color-semantic-primary, #7c3aed);
      --_blur: var(--a3mk-blur-md, 14px);
      --_radius: var(--a3mk-radius-pill, 999px);
      --_press: var(--a3mk-color-glass-press, rgba(0, 0, 0, 0.3));
      --_multiplier: 1;
    }

    :host([full-width]) { display: block; width: 100%; }

    :host([color='primary']) { --_accent: var(--a3mk-color-semantic-primary, #7c3aed); }
    :host([color='secondary']) { --_accent: var(--a3mk-color-semantic-secondary, #3b82f6); }
    :host([color='success']) { --_accent: var(--a3mk-color-semantic-success, #86efac); }
    :host([color='warning']) { --_accent: var(--a3mk-color-semantic-warning, #fbbf24); }
    :host([color='danger']) { --_accent: var(--a3mk-color-semantic-danger, #ef4444); }
    :host([color='info']) { --_accent: var(--a3mk-color-semantic-info, #60a5fa); }

    .a3mk-btn {
      position: relative;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      font-family: var(--a3mk-typography-font-family-sans, 'Segoe UI', Tahoma, sans-serif);
      font-weight: var(--a3mk-typography-font-weight-medium, 500);
      letter-spacing: 0.2px;
      color: var(--_text);
      white-space: nowrap;
      background: linear-gradient(135deg, var(--_bg-start) 0%, var(--_bg-mid) 50%, var(--_bg-end) 100%);
      border: 1px solid var(--_border);
      border-radius: var(--_radius);
      backdrop-filter: blur(var(--_blur)) saturate(160%);
      -webkit-backdrop-filter: blur(var(--_blur)) saturate(160%);
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
        background calc(0.3s * var(--_multiplier, 1)) var(--a3mk-ease-smooth, cubic-bezier(0.25, 0.1, 0.25, 1)),
        border-color calc(0.3s * var(--_multiplier, 1)) var(--a3mk-ease-smooth, cubic-bezier(0.25, 0.1, 0.25, 1)),
        box-shadow calc(0.3s * var(--_multiplier, 1)) var(--a3mk-ease-smooth, cubic-bezier(0.25, 0.1, 0.25, 1)),
        color calc(0.3s * var(--_multiplier, 1)) var(--a3mk-ease-smooth, cubic-bezier(0.25, 0.1, 0.25, 1));
    }

    :host([size='xs']) .a3mk-btn { padding: 6px 14px; font-size: 11px; min-width: 80px; }
    :host([size='sm']) .a3mk-btn { padding: 8px 18px; font-size: 12px; min-width: 95px; }
    :host([size='md']) .a3mk-btn { padding: 11px 22px; font-size: 13px; min-width: 110px; }
    :host([size='lg']) .a3mk-btn { padding: 15px 34px; font-size: 15px; font-weight: 600; min-width: 140px; }
    :host([size='xl']) .a3mk-btn { padding: 18px 44px; font-size: 17px; font-weight: 700; min-width: 170px; }

    :host([full-width]) .a3mk-btn { width: 100%; min-width: 0; }

    :host([rounded]) .a3mk-btn { border-radius: 50%; padding: 0; width: 44px; height: 44px; min-width: 0; }
    :host([rounded][size='xs']) .a3mk-btn { width: 32px; height: 32px; }
    :host([rounded][size='sm']) .a3mk-btn { width: 38px; height: 38px; }
    :host([rounded][size='lg']) .a3mk-btn { width: 54px; height: 54px; }
    :host([rounded][size='xl']) .a3mk-btn { width: 64px; height: 64px; }

    :host([variant='outlined']) .a3mk-btn {
      background: transparent;
      border-color: var(--_accent);
      color: var(--_accent);
      box-shadow: none;
    }

    :host([variant='text']) .a3mk-btn {
      background: transparent;
      border-color: transparent;
      box-shadow: none;
      padding: 11px 16px;
      min-width: 0;
    }

    .a3mk-btn:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.1) 100%);
      border-color: rgba(255, 255, 255, 0.22);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.3),
        inset 0 -1px 0 rgba(0, 0, 0, 0.18),
        0 4px 14px rgba(0, 0, 0, 0.4);
    }

    :host([variant='outlined']) .a3mk-btn:hover:not(:disabled) {
      background: color-mix(in srgb, var(--_accent) 12%, transparent);
      border-color: var(--_accent);
      box-shadow: none;
    }

    :host([variant='text']) .a3mk-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.06);
      box-shadow: none;
    }

    .a3mk-btn:active:not(:disabled) {
      background: var(--_press);
      border-color: rgba(255, 255, 255, 0.15);
      box-shadow:
        inset 0 2px 8px rgba(0, 0, 0, 0.4),
        0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .a3mk-btn:disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }

    :host([no-animation]) .a3mk-btn,
    :host([no-animation]) .a3mk-icon,
    :host([no-animation]) .a3mk-spinner,
    :host([no-animation]) .a3mk-ripple {
      transition: none !important;
      animation: none !important;
    }

    .a3mk-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.35);
      transform: scale(0);
      animation: a3mk-ripple-anim calc(0.6s * var(--_multiplier, 1)) var(--a3mk-ease-smooth, linear);
      pointer-events: none;
      z-index: 0;
    }

    :host([variant='outlined']) .a3mk-ripple,
    :host([variant='text']) .a3mk-ripple {
      background: color-mix(in srgb, var(--_accent) 30%, transparent);
    }

    @keyframes a3mk-ripple-anim {
      to { transform: scale(4); opacity: 0; }
    }

    .a3mk-icon,
    .a3mk-icon-fallback {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15em;
      line-height: 1;
      flex-shrink: 0;
      z-index: 1;
      transition: transform calc(0.4s * var(--_multiplier, 1)) var(--a3mk-ease-bounce, cubic-bezier(0.34, 1.56, 0.64, 1));
    }

    .a3mk-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      z-index: 1;
      position: relative;
    }

    .a3mk-spinner {
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: a3mk-spin calc(0.7s * var(--_multiplier, 1)) linear infinite;
      z-index: 1;
      flex-shrink: 0;
    }

    @keyframes a3mk-spin {
      to { transform: rotate(360deg); }
    }

    :host([loading]) .a3mk-btn { pointer-events: none; cursor: wait; }
    :host([loading]) .a3mk-label,
    :host([loading]) .a3mk-icon,
    :host([loading]) .a3mk-icon-fallback {
      opacity: 0;
      pointer-events: none;
    }

    .a3mk-btn:focus-visible {
      outline: 2px solid var(--_accent);
      outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      .a3mk-btn,
      .a3mk-icon,
      .a3mk-icon-fallback,
      .a3mk-spinner,
      .a3mk-ripple {
        transition: none !important;
        animation: none !important;
      }
    }
  `;

  /* ── Render ── */
  protected render() {
    const isLoading = this.loading;
    const isDisabled = this.disabled || isLoading;

    return html`
      <button
        part="button"
        class="a3mk-btn"
        type=${this.type}
        ?disabled=${isDisabled}
        aria-busy=${isLoading}
        aria-disabled=${this.disabled}
        aria-label=${this.ariaLabel || nothing}
        title=${this.title || nothing}
        @click=${this._handleClick}
        @pointerdown=${this._handlePointerDown}
      >
        ${isLoading
          ? html`<span class="a3mk-spinner" part="spinner" aria-hidden="true"></span>`
          : this._iconResolved && this.iconPosition === 'start'
          ? html`<span part="icon" class="a3mk-icon-wrap">${renderIcon(this._iconResolved)}</span>`
          : nothing}

        <span class="a3mk-label" part="label">
          <slot></slot>
        </span>

        ${!isLoading && this._iconResolved && this.iconPosition === 'end'
          ? html`<span part="icon" class="a3mk-icon-wrap">${renderIcon(this._iconResolved)}</span>`
          : nothing}
      </button>
    `;
  }

  /* ── Events ── */
  private _handleClick(e: MouseEvent): void {
    if (this.disabled || this.loading) {
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
  }

  private _handlePointerDown(e: PointerEvent): void {
    if (this.disabled || this.loading) return;
    if (!this._rippleEnabled) return;
    if (this.noAnimation) return;

    const btn = e.currentTarget as HTMLButtonElement;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'a3mk-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    btn.appendChild(ripple);

    const duration = 600 * this._animationMultiplier;
    window.setTimeout(() => {
      ripple.remove();
    }, Math.max(duration, 100));
  }

  /* ── Public API ── */
  startLoading(): void { this.loading = true; }
  stopLoading(): void { this.loading = false; }
  disable(): void { this.disabled = true; }
  enable(): void { this.disabled = false; }

  focusButton(): void {
    const btn = this.shadowRoot?.querySelector('button');
    btn?.focus();
  }
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 4 — Fluent API (Chainable Builder)
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

  /**
   * ✅ AbortController لمنع التسريب + السماح بإعادة الربط
   * كل مرة نضيف handler جديد، نلغي القديم ونعيد الربط الكل
   */
  private _abortController?: AbortController;

  constructor(label: string, options: ButtonOptions = {}) {
    this._label = label;
    this._options = { ...options };
  }

  /* ── Configuration Methods ── */

  variant(v: ButtonVariant): this { this._options.variant = v; this._applyOptions(); return this; }
  color(c: ButtonColor): this { this._options.color = c; this._applyOptions(); return this; }
  size(s: ButtonSize): this { this._options.size = s; this._applyOptions(); return this; }
  icon(i: A3MKPhosphorIcon): this { this._options.icon = i; this._applyOptions(); return this; }
  iconStart(): this { this._options.iconPosition = 'start'; this._applyOptions(); return this; }
  iconEnd(): this { this._options.iconPosition = 'end'; this._applyOptions(); return this; }
  fullWidth(): this { this._options.fullWidth = true; this._applyOptions(); return this; }
  rounded(): this { this._options.rounded = true; this._applyOptions(); return this; }
  disable(): this { this._options.disabled = true; this._applyOptions(); return this; }
  enable(): this { this._options.disabled = false; this._applyOptions(); return this; }
  noAnimation(value = true): this { this._options.noAnimation = value; this._applyOptions(); return this; }
  id(id: string): this { this._options.id = id; this._applyOptions(); return this; }
  className(c: string): this { this._options.className = c; this._applyOptions(); return this; }
  title(t: string): this { this._options.title = t; this._applyOptions(); return this; }
  ariaLabel(l: string): this { this._options.ariaLabel = l; this._applyOptions(); return this; }
  type(t: ButtonType): this { this._options.type = t; this._applyOptions(); return this; }

  /* ── Loading ── */

  loading(ms = 0): this {
    this._options.loading = true;
    this._applyOptions();

    if (ms > 0 && this._element) {
      if (this._loadingTimer) window.clearTimeout(this._loadingTimer);
      this._loadingTimer = window.setTimeout(() => {
        this.stopLoading();
      }, ms);
    }

    return this;
  }

  stopLoading(): this {
    this._options.loading = false;
    if (this._loadingTimer) {
      window.clearTimeout(this._loadingTimer);
      this._loadingTimer = undefined;
    }
    this._applyOptions();
    return this;
  }

  /* ── Events ── */

  /**
   * إضافة handler للنقر
   *
   * ✅ يمكن استدعاؤه أكثر من مرة (حتى بعد mount)
   */
  onClick(fn: (e: MouseEvent) => void): this {
    this._handlers.click.push(fn);
    this._attachHandlers();
    return this;
  }

  /**
   * إضافة handler لحدث `a3mk-click` (المخصص)
   */
  onA3mkClick(fn: (e: CustomEvent) => void): this {
    this._handlers.a3mkClick.push(fn);
    this._attachHandlers();
    return this;
  }

  /**
   * إزالة جميع handlers
   */
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

    if (!container) {
      throw new Error(`[A3MK-UI] Mount target not found: ${target}`);
    }

    this._element = this._createElement();
    container.appendChild(this._element);
    this._attachHandlers();
    return this._element;
  }

  appendTo(target: string | HTMLElement): this {
    const container =
      typeof target === 'string' ? document.querySelector(target) : target;

    if (!container) {
      throw new Error(`[A3MK-UI] Append target not found: ${target}`);
    }

    this._element = this._createElement();
    container.appendChild(this._element);
    this._attachHandlers();
    return this;
  }

  getElement(): A3MKButton | undefined {
    return this._element;
  }

  /**
   * إزالة الزر من DOM + تنظيف كل شيء
   *
   * ✅ يمنع تسريب الذاكرة:
   *    • يلغي الـ AbortController
   *    • يوقف الـ loading timer
   *    • يمسح الـ element reference
   */
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
    this._applyOptionsToElement(el);
    return el;
  }

  private _applyOptions(): void {
    if (this._element) {
      this._applyOptionsToElement(this._element);
    }
  }

  private _applyOptionsToElement(el: A3MKButton): void {
    const o = this._options;

    if (o.variant) el.variant = o.variant;
    if (o.color) el.color = o.color;
    if (o.size) el.size = o.size;
    if (o.icon !== undefined) el.icon = o.icon;
    if (o.iconPosition) el.iconPosition = o.iconPosition;
    if (o.fullWidth !== undefined) el.fullWidth = o.fullWidth;
    if (o.disabled !== undefined) el.disabled = o.disabled;
    if (o.loading !== undefined) el.loading = o.loading;
    if (o.rounded !== undefined) el.rounded = o.rounded;
    if (o.noAnimation !== undefined) el.noAnimation = o.noAnimation;
    if (o.type) el.type = o.type;
    if (o.id) el.id = o.id;
    if (o.title) el.title = o.title;
    if (o.ariaLabel) el.setAttribute('aria-label', o.ariaLabel);
    if (o.className) el.className = o.className;
  }

  /**
   * ربط الـ handlers بالعنصر
   *
   * ✅ يستخدم AbortController:
   *    1. يلغي الـ listeners القديمة بأمان
   *    2. يعيد ربط الجميع (بما فيها الجديدة)
   *    3. يمنع تسريب الذاكرة
   *
   * ✅ يسمح بالإضافة الديناميكية:
   *    Button('حفظ').mount('#app');
   *    // لاحقاً:
   *    btn.onClick(saveHandler); // ✅ يعمل
   */
  private _attachHandlers(): void {
    if (!this._element) return;

    // 1) ألغِ الـ listeners القديمة
    this._abortController?.abort();

    // 2) أنشئ AbortController جديد
    this._abortController = new AbortController();
    const { signal } = this._abortController;

    // 3) اربط click handlers
    this._element.addEventListener(
      'click',
      (e) => {
        this._handlers.click.forEach((fn) => {
          try {
            fn(e);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[A3MK-UI] Error in click handler:', err);
          }
        });
      },
      { signal }
    );

    // 4) اربط a3mk-click handlers
    this._element.addEventListener(
      'a3mk-click',
      (e) => {
        this._handlers.a3mkClick.forEach((fn) => {
          try {
            fn(e as CustomEvent);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('[A3MK-UI] Error in a3mk-click handler:', err);
          }
        });
      },
      { signal }
    );
  }
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 5 — Factory Function
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * إنشاء زر A3MK
 *
 * @example
 *   Button('حفظ').mount('#app');
 *
 *   Button('إتمام الدفع')
 *     .color('success')
 *     .size('lg')
 *     .icon('credit-card')
 *     .onClick(pay)
 *     .mount('#checkout');
 */
export function Button(label: string, options?: ButtonOptions): ButtonBuilder {
  return new ButtonBuilder(label, options);
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 6 — Global Declaration
 * ═══════════════════════════════════════════════════════════════════════ */

declare global {
  interface HTMLElementTagNameMap {
    'a3mk-button': A3MKButton;
  }

  interface GlobalEventHandlersEventMap {
    'a3mk-click': CustomEvent<{ originalEvent: MouseEvent; button: A3MKButton }>;
  }
}

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 7 — Default Export
 * ═══════════════════════════════════════════════════════════════════════ */

export default Button;
