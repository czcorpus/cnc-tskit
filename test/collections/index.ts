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


describe('List#range', () => {

    it('works for OK args', function () {
        const ans = List.range(9, 12, 1);
        assert.deepEqual(ans, [9, 10, 11]);
    });

    it('has default step 1', function () {
        const ans = List.range(9, 12);
        assert.deepEqual(ans, [9, 10, 11]);
    });

    it('handles unaligned step and upper bound', function () {
        const ans = List.range(9, 12, 2);
        assert.deepEqual(ans, [9, 11]);
    });

    it('handles inverse bounds', function () {
        const ans = List.range(12, 0, 1);
        assert.deepEqual(ans, []);
    });

    it('handles negative step', function () {
        const ans = List.range(12, 10, -1);
        assert.deepEqual(ans, [12, 11]);
    });

    it('handles zero step', function () {
        const ans = List.range(12, 10, 0);
        assert.deepEqual(ans, []);
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
});


describe('List#map', () => {

    it('works for a standard configuration', function () {
        const ans = List.map((v => v * 2), [0, 1, 2, 3, 4]);
        assert.deepEqual(ans, [0, 2, 4, 6, 8]);
    });

    it('creates a new array', function () {
        const orig = [0, 1, 2, 3, 4];
        const ans = List.map((v => v * 2), orig);
        assert.notStrictEqual(orig, ans);
    });

});


describe('List#get', () => {

    it('works for an existing element', function () {
        const ans = List.get(3, [10, 11, 12, 13, 14]);
        assert.equal(ans, 13);
    });

    it('supports negative index', function () {
        const ans = List.get(-3, [10, 11, 12, 13, 14]);
        assert.equal(ans, 12);
    });

    it('returns undefined if out of bounds', function () {
        const ans = List.get(21, [10, 11, 12, 13, 14]);
        assert.isUndefined(ans);
    });

    it('returns undefined if out of bounds negative', function () {
        const ans = List.get(-71, [10, 11, 12, 13, 14]);
        assert.isUndefined(ans);
    });
});


describe('List#findRange', () => {

    it('works for list of integers', function () {
        const [min, max] = List.findRange((v1, v2) => v1 - v2, [4, 2, 15, 1]);
        assert.equal(min, 1);
        assert.equal(max, 15);
    });

    it('works for list of strings', function () {
        const [min, max] = List.findRange((v1, v2) => v1.localeCompare(v2), ['d', 'c', 'b', 'y', 'w']);
        assert.equal(min, 'b');
        assert.equal(max, 'y');
    });

    it('works for list of size 1', function () {
        const [min, max] = List.findRange((v1, v2) => v1 - v2, [4]);
        assert.equal(min, 4);
        assert.equal(max, 4);
    });

    it('works for OK list of size 0', function () {
        const [min, max] = List.findRange((v1, v2) => v1 - v2, []);
        assert.isUndefined(min);
        assert.isUndefined(max);
    });

});


describe('List#toDict', () => {

    it('transforms properly', function () {
        assert.deepEqual(List.toDict(['a', 'b', 'c']), {'0': 'a', '1': 'b', '2': 'c'});
    });

    it('transforms properly an empty array', function () {
        assert.deepEqual(List.toDict([]), {});
    });
});

describe('List#maxItem', () => {

    it('searches properly', function () {
        const m = List.maxItem(v => v.length, ['hi', 'people', 'of', 'the', 'world']);
        assert.equal(m, 'people');
    });

    it('searches properly for an empty array', function () {
        const m = List.maxItem(v => v.length, [] as Array<string>);
        assert.isUndefined(m);
    });

});
