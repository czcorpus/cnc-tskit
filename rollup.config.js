/*
 * Copyright 2018 Tomas Machalek <tomas.machalek@gmail.com>
 * Copyright 2018 Institute of the Czech National Corpus,
 *                Faculty of Arts, Charles University
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import esbuild from 'rollup-plugin-esbuild';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';
import path from 'path';

const external = ['chai', ...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];

export default [
	{
		input: 'src/index.ts',
		output: {
			name: 'cnc-tskit',
			file: pkg.browser,
			format: 'umd'
        },
        external,
		plugins: [
			esbuild(),
            terser()
		]
    },
	{
        input: {
            'index': 'src/index.ts'
        },
        output: [
			{ dir: path.dirname(pkg.main), format: 'cjs' },
			{ dir: path.dirname(pkg.module), format: 'es' }
		],
        external,
		plugins: [
			esbuild()
		]
    }
];
