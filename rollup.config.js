import esbuild from 'rollup-plugin-esbuild';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8')
);

const external = [
  'chai',
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];


export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'cnc-tskit',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    },
    external,
    plugins: [
      esbuild({
        target: 'es2020',
        sourceMap: true
      }),
      terser()
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        dir: dirname(pkg.main),
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
        exports: 'named'
      },
      {
        dir: dirname(pkg.module),
        format: 'es',
        sourcemap: true,
        preserveModules: true
      }
    ],
    external,
    plugins: [
      esbuild({
        target: 'es2020',
        sourceMap: true
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: resolve(dirname(pkg.module), 'cnc-tskit.d.ts'),
      format: 'es'
    },
    plugins: [dts()]
  }
];