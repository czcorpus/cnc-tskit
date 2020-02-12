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


import { List } from '../../src/collections/index';
import { assert } from 'chai';

describe('List#repeat', () => {


    it('should repeat 0 times', function () {
        const a = List.repeat(() => 1, 0);
        assert.equal(a.length, 0);
    });

    it('should repeat 0 times if num repeat < 0', function () {
        const a = List.repeat(() => 1, -3);
        assert.equal(a.length, 0);
    });

    it('should repeat items using index', function () {
        const a = List.repeat((i) => i, 5);
        assert.deepEqual(a, [0, 1, 2, 3, 4]);
    });

});


describe('List#zip', () => {

    it('should zip two equally long arrays', function () {
        const ans = List.zip([0, 1, 2, 3], ['a', 'b', 'c', 'd']);
        assert.deepEqual(ans, [ ['a', 0], ['b', 1], ['c', 2], ['d', 3] ]);
    });

    it('should zip two unequally long arrays', function () {
        const ans = List.zip([0, 1, 2, 3, 4, 5], ['a', 'b', 'c', 'd']);
        assert.deepEqual(ans, [ ['a', 0], ['b', 1], ['c', 2], ['d', 3] ]);
    });
})