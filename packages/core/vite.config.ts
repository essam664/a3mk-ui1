import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'config/a3mk.config': resolve(__dirname, 'src/config/a3mk.config.ts'),
        'tokens/tokens': resolve(__dirname, 'src/tokens/tokens.ts'),
        'components/button/a3mk-button': resolve(
          __dirname,
          'src/components/button/a3mk-button.ts'
        ),
      },
      name: 'A3MKUI',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.js` : `${entryName}.cjs`,
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: false,
        globals: {},
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    dts({
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/**/*.stories.ts',
      ],
      outDir: 'dist',
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
  ],
});
