/*
 * Copyright 2020 Tomas Machalek <tomas.machalek@gmail.com>
 * Copyright 2020 Institute of the Czech National Corpus,
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

import { assert } from 'chai';
import { List, tuple } from '../src/index';

describe('tuple', function () {

    it('creates a proper type', function () {
        const items = ['a', 'bc', 'def'];
        const ans = List.map(
            d => tuple(d, d.length),
            items
        );
        assert.deepEqual(ans, [ ['a', 1], ['bc', 2], ['def', 3] ]);
        // also, just by compiling this code we test proper type inference
        // which is the main thing we're interested here
    });
});