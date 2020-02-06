import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';
import path from 'path';

export default [
	{
		input: 'src/index.ts',
		output: {
			name: 'cnc-tskit',
			file: pkg.browser,
			format: 'umd'
        },
        external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
		plugins: [
			typescript({
                typescript: require('typescript'),
                tsconfig: './src/tsconfig.json',
                tsconfigOverride:  {
                    compilerOptions: {
                        declaration: false,
                        lib: ['es5', 'dom', 'es2015.iterable'],
                        target: 'es5',
                    }
                }
            }),
            uglify()
		]
    },
	{
        input: {
            'index': 'src/index.ts',
            'collections': 'src/collections/index.ts'
        },
        output: [
			{ dir: path.dirname(pkg.main), format: 'cjs' },
			{ dir: path.dirname(pkg.module), format: 'es' }
		],
        external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
		plugins: [
			typescript({
                typescript: require('typescript'),
                tsconfig: "./src/tsconfig.json",
            })
		]
    }
];
