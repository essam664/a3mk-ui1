import dts from 'vite-plugin-dts';

export default defineConfig({
  // ...
  plugins: [
    dts({
      /* ── Include ── */
      include: ['src/**/*.ts'],

      /* ── Exclude ── */
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/**/*.stories.ts',
      ],

      /* ── Output ── */
      outDir: 'dist',

      /* ── Rollup types في ملف واحد لكل entry ── */
      rollupTypes: false,

      /* ── Copy .d.ts ── */
      copyDtsFiles: true,

      /* ── Static Import ── */
      staticImport: true,

      /* ── Insert Types Entry ── */
      insertTypesEntry: true,

      /* ── Log Level ── */
      logLevel: 'warn',

      /* ── Strict Output ── */
      strictOutput: false,

      /* ── Compiler Options ── */
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: false,
        noEmit: false,
        removeComments: false,
      },
    }),
  ],
});
