/**
 * ═══════════════════════════════════════════════════════════════════════
 *  A3MK-UI — Vite Build Configuration
 *  إعدادات البناء باستخدام Vite
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  @file    vite.config.ts
 *  @package @a3mk-ui/core
 *  @version 1.0.0-a3mk-ui1
 *  @author  A3MK
 *  @license MIT
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  نظرة عامة:
 *  ─────────────────────────────────────────────────────────────────────
 *  يبني المكتبة بصيغتين:
 *    • ESM  — للـ modern bundlers (Vite / Rollup / Webpack 5)
 *    • CJS  — للـ Node.js / legacy consumers
 *
 *  ─────────────────────────────────────────────────────────────────────
 *  المبادئ:
 *  ─────────────────────────────────────────────────────────────────────
 *  • Tree-Shaking Friendly — moduleSideEffects محدّد بدقة
 *  • Minimal bundle       — كل ما يُستخدم فقط
 *  • Source maps          — للـ debugging
 *  • TypeScript types     — تُولَّد تلقائيًا
 *  • External deps        — Lit و Phosphor لا تُضمَّن
 *  • Multi-entry          — index / auto / button / config / tokens
 *  • CJS interop          — 'auto' لدعم require() بأمان
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
import { visualizer } from 'rollup-plugin-visualizer';

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 1 — Constants
 * ═══════════════════════════════════════════════════════════════════════ */

const ROOT = resolve(__dirname);
const SRC = resolve(ROOT, 'src');
const DIST = resolve(ROOT, 'dist');

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 2 — Entry Points
 * ═══════════════════════════════════════════════════════════════════════ */

/**
 * نقاط الدخول (Multi-Entry)
 *
 * كل entry يُبنى بشكل مستقل لتحقيق Tree-Shaking الأمثل.
 * `lib.fileName` هي المسؤولة عن تسمية الملفات (تحترم ES/CJS).
 */
const ENTRIES = {
  index: resolve(SRC, 'index.ts'),
  auto: resolve(SRC, 'auto.ts'),
  'components/button/a3mk-button': resolve(
    SRC,
    'components/button/a3mk-button.ts'
  ),
  'config/a3mk.config': resolve(SRC, 'config/a3mk.config.ts'),
  'tokens/tokens': resolve(SRC, 'tokens/tokens.ts'),
} as const;

/* ═══════════════════════════════════════════════════════════════════════
 *  SECTION 3 — Vite Config
 * ═══════════════════════════════════════════════════════════════════════ */

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const isAnalyze = mode === 'analyze';

  return {
    /* ── Root ── */
    root: ROOT,

    /* ── Public Directory ── */
    publicDir: false,

    /* ── Resolve ── */
    resolve: {
      alias: {
        '@': SRC,
      },
      extensions: ['.ts', '.js', '.json'],
    },

    /* ── Build ── */
    build: {
      /* ── Output Directory ── */
      outDir: DIST,
      emptyOutDir: true,

      /* ── Library Mode ── */
      lib: {
        entry: ENTRIES,
        name: 'A3MKUI',
        formats: ['es', 'cjs'],

        /**
         * ✅ اسم الملف يُحدَّد هنا فقط.
         *    يحترم الـ format تلقائيًا (ES / CJS).
         *
         *    index.ts → index.js  (ESM)
         *             → index.cjs (CJS)
         */
        fileName: (format, entryName) => {
          if (format === 'es') return `${entryName}.js`;
          if (format === 'cjs') return `${entryName}.cjs`;
          return `${entryName}.${format}.js`;
        },
      },

      /* ── Rollup Options ── */
      rollupOptions: {
        /* ── External ── */
        external: (id) => {
          // Lit & sub-imports
          if (id === 'lit' || id.startsWith('lit/')) return true;
          // Phosphor Icons
          if (id.startsWith('@phosphor-icons/')) return true;
          return false;
        },

        /* ── Output ── */
        output: {
          /**
           * ✅ interop: 'auto' — لضمان التوافق مع CJS
           *
           * بدونه، المستهلك الذي يستخدم require() قد يحصل على:
           *   { default: { ... } }
           *
           * مع 'auto'، Rollup يستخدم __esModule تلقائيًا للـ ESM
           * ويضمن أن الـ named exports تظهر بشكل صحيح.
           */
          interop: 'auto',

          /**
           * ✅ Export Mode — named exports فقط (Tree-Shaking friendly)
           */
          exports: 'named',

          /**
           * ✅ Preserve Modules Root
           *    يحافظ على هيكل المجلدات في dist/
           */
          preserveModulesRoot: 'src',

          /**
           * ✅ Globals للـ UMD (احتياطي)
           */
          globals: {
            lit: 'Lit',
            'lit/decorators.js': 'LitDecorators',
          },

          /**
           * ✅ Asset Naming (CSS وملفات أخرى)
           */
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'styles/[name][extname]';
            }
            return 'assets/[name][extname]';
          },

          /**
           * ✅ Chunk Naming — للـ shared chunks فقط
           *
           * ملاحظة: entryFileNames محذوف عن قصد — lib.fileName هي المسؤولة.
           */
          chunkFileNames: '_chunks/[name]-[hash].js',
        },

        /* ── Treeshake ── */
        treeshake: {
          /**
           * ✅ moduleSideEffects — محدّد بدقة
           *
           * القاعدة: فقط `auto.ts` له side effects حقيقية.
           *
           * السبب:
           *   • `auto.ts` يستورد كل الـ components لتسجيلها في customElements
           *   • ملفات الـ components نفسها لا تُنفّذ أي كود عند الاستيراد
           *     (فقط تعريف كلاسات + @customElement decorator،
           *      وهذا لا يُنفَّذ إلا عند استيراد الملف)
           *
           * النتيجة:
           *   import { Button } from '@a3mk-ui/core'
           *     → يتم تضمين Button فقط، وليس كل الـ components
           */
          moduleSideEffects: (id) => {
            // ✅ فقط auto.ts
            if (id.endsWith('/auto.ts')) return true;
            if (id.endsWith('/auto.js')) return true;

            // ✅ باقي الملفات آمنة للحذف
            return false;
          },

          /**
           * ✅ propertyReadSideEffects
           *    يسمح بحذف خصائص غير مستخدمة
           */
          propertyReadSideEffects: false,

          /**
           * ✅ tryCatchDeoptimization
           *    يحسّن تحليل الكود الذي يستخدم try/catch
           */
          tryCatchDeoptimization: false,
        },

        /* ── onwarn ── */
        onwarn(warning, warn) {
          // تجاهل تحذيرات معروفة ومقبولة
          if (warning.code === 'CIRCULAR_DEPENDENCY') return;
          if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;
          warn(warning);
        },
      },

      /* ── Source Maps ── */
      sourcemap: isProduction ? true : 'inline',

      /* ── Minify ── */
      minify: isProduction ? 'esbuild' : false,

      /* ── Target ── */
      target: 'es2022',

      /* ── CSS ── */
      cssCodeSplit: false,

      /* ── SSR Support ── */
      ssr: false,

      /* ── Report Compressed Size ── */
      reportCompressedSize: isProduction,

      /* ── Chunk Size Warning ── */
      chunkSizeWarningLimit: 100, // KB
    },

    /* ── Plugins ── */
    plugins: [
      /* ── TypeScript Declarations ── */
      dts({
        include: ['src/**/*.ts'],
        exclude: [
          'src/**/*.test.ts',
          'src/**/*.spec.ts',
          'src/**/*.stories.ts',
        ],
        outDir: DIST,
        rollupTypes: false,
        copyDtsFiles: true,
        staticImport: true,
        insertTypesEntry: true,
        logLevel: 'warn',
        strictOutput: false,
        compilerOptions: {
          declaration: true,
          declarationMap: true,
          emitDeclarationOnly: false,
          noEmit: false,
          removeComments: false,
        },
      }),

      /* ── Bundle Analyzer (فقط في mode=analyze) ── */
      ...(isAnalyze
        ? [
            visualizer({
              filename: 'dist/stats.html',
              open: true,
              gzipSize: true,
              brotliSize: true,
              template: 'treemap',
            }),
          ]
        : []),
    ],

    /* ── Define ── */
    define: {
      __VERSION__: JSON.stringify('1.0.0-a3mk-ui1'),
      __DEV__: JSON.stringify(!isProduction),
    },

    /* ── Optimize Deps ── */
    optimizeDeps: {
      exclude: ['lit'],
    },

    /* ── ESBuild ── */
    esbuild: {
      keepNames: true,
      drop: isProduction ? ['debugger'] : [],
      legalComments: 'none',
      target: 'es2022',
    },
  };
});
