import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  target: 'esnext',
  external: [
    'react',
    'react-hook-form',
    'zod',
    'yup',
    '@hookform/resolvers/zod',
    '@hookform/resolvers/yup',
  ],
});
