/*
 * Copyright 2020 Tomas Machalek <tomas.machalek@gmail.com>
 * Copyright 2020 Martin Zimandl <martin.zimandl@gmail.com>
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


import { Dict } from '../../src/collections/dict';
import { assert } from 'chai';

const mkData = ():{[k:string]:number} => ({a: 10, b: 20});
const mkDataEntries = ():Array<[string, number]> => ([['a', 10], ['b', 20]]);

describe('Dict#get', function () {

    it('works for an existing key', function () {
        assert.equal(Dict.get('a', undefined, mkData()), 10);
    });

    it('works for a non-existing key', function () {
        assert.isUndefined(Dict.get('c', undefined, mkData()));
    });

    it('default value works', function () {
        assert.equal(Dict.get('c', 77, mkData()), 77);
    });

});

describe('Dict#keys', function () {

    it('works for a regular object', function () {
        const k = Dict.keys(mkData());
        assert.equal(k.length, 2);
        assert.isTrue(k.indexOf('a') > -1);
        assert.isTrue(k.indexOf('b') > -1);
    });

    it('works for an empty object', function () {
        const k = Dict.keys({});
        assert.equal(k.length, 0);
    });

});

describe('Dict#values', function () {

    it('works for a regular object', function () {
        const k = Dict.values(mkData());
        assert.equal(k.length, 2);
        assert.isTrue(k.indexOf(10) > -1);
        assert.isTrue(k.indexOf(20) > -1);
    });

    it('works for an empty object', function () {
        const k = Dict.values({});
        assert.equal(k.length, 0);
    });
});

describe('Dict#size', function () {

    it('works for a regular object', function () {
        assert.equal(Dict.size(mkData()), 2);
    });

    it('works for an empty object', function () {
        assert.equal(Dict.size({}), 0);
    });

});

describe('Dict#fromEntries', function () {

    it('works for a regular object', function () {
        const k = Dict.fromEntries(mkDataEntries());
        assert.deepEqual(k, mkData());
    });

    it('works for an empty object', function () {
        const k = Dict.fromEntries([]);
        assert.deepEqual(k, {});
    });

});

describe('Dict#toEntries', function () {

    it('works for a regular object', function () {
        const k = Dict.toEntries(mkData());
        assert.deepEqual(k, mkDataEntries());
    });

    it('works for an empty object', function () {
        const k = Dict.toEntries({});
        assert.deepEqual(k, []);
    });

});

describe('Dict#every', function () {

    it('works for a regular object', function () {
        const ans = Dict.every((v, k) => typeof v === 'number' && typeof k === 'string', mkData());
        assert.equal(ans, true);
        const ans2 = Dict.every((v, k) => v > 10, mkData());
        assert.equal(ans2, false);
    });

    it('works for an empty object', function () {
        assert.equal(Dict.every((v, k) => false, {}), true);
    });

});

describe('Dict#map', function () {

    it('works for a regular object', function () {
        const ans = Dict.map((v, k) => 10*v, mkData());
        assert.deepEqual(ans, {'a': 100, 'b': 200});
    });

    it('works for an empty object', function () {
        assert.deepEqual(Dict.map((v, k) => 10*v, {}), {});
    });

});

describe('Dict#filter', function () {

    it('filters all out', function () {
        assert.deepEqual(Dict.filter((v, k) => false, mkData()), {});
    });

    it('filters nothing out', function () {
        assert.deepEqual(Dict.filter((v, k) => true, mkData()), mkData());
    });

    it('filters by value only', function () {
        assert.deepEqual(Dict.filter((v, k) => v > 10, mkData()), {'b': 20});
    });

    it('filters by key only', function () {
        assert.deepEqual(Dict.filter((v, k) => k < 'b', mkData()), {'a':10});
    });

});

describe('Dict#hasValue', function () {

    it('works for a regular object', function () {
        assert.equal(Dict.hasValue(10, mkData()), true);
        assert.equal(Dict.hasValue(30, mkData()), false);
    });

    it('works for an empty object', function () {
        assert.equal(Dict.hasValue('anything', {}), false);
    });

});

describe('Dict#hasKey', function () {

    it('works for a regular object', function () {
        assert.equal(Dict.hasKey('a', mkData()), true);
        assert.equal(Dict.hasKey('c', mkData()), false);
    });

    it('works for an empty object', function () {
        assert.equal(Dict.hasKey('anything', {}), false);
    });

});

describe('Dict#find', function () {

    it('works for existing key/value', function () {
        assert.deepEqual(Dict.find((v, k) => k === 'a', mkData()), ['a', 10]);
        assert.deepEqual(Dict.find((v, k) => v === 20, mkData()), ['b', 20]);
    });

    it('works for non-existing key/value', function () {
        assert.equal(Dict.find((v, k) => k === 'anything', mkData()), undefined);
        assert.equal(Dict.find((v, k) => v === 0, mkData()), undefined);
    });

    it('works for an empty object', function () {
        assert.equal(Dict.find((v, k) => k === 'anything', {}), undefined);
    });

});

describe('Dict#mapEntries', function () {

    it('works for a regular object', function () {
        const ans = Dict.mapEntries(([k, v]) => [k.toUpperCase(), 10*v], mkData());
        assert.deepEqual(ans, [['A', 100], ['B', 200]]);
    });

});

describe('Dict#forEach', function () {

    it('works for a regular object', function () {
        let valueSum = 0;
        let keySum = '';
        Dict.forEach((v, k) => {valueSum += v; keySum += k;}, mkData());
        assert.equal(valueSum, 30);
        assert.equal(keySum, 'ab');
    });

});

describe('Dict#mergeDict', function () {

    it('works for a regular and empty object', function () {
        const ans = Dict.mergeDict((oldV, newV, k) => newV, {}, mkData());
        assert.deepEqual(ans, mkData());
        const ans2 = Dict.mergeDict((oldV, newV, k) => newV, mkData(), {});
        assert.deepEqual(ans2, mkData());
    });

    it('works for a not overlaping regular objects', function () {
        const ans = Dict.mergeDict((oldV, newV, k) => newV, {'a': 10}, {'b': 20} as {[key:string]:number});
        assert.deepEqual(ans, mkData());
    });

    it('works for overlaping regular objects', function () {
        const ans = Dict.mergeDict((oldV, newV, k) => newV, {'b': 200, 'c': 300}, mkData());
        assert.deepEqual(ans, {'a': 10, 'b': 200, 'c': 300});
    });

});

describe('Dict#clear', function () {


    it('works for a regular non-empty object', function () {
        const data = {
            foo: 1,
            bar: 'test',
            baz: {x: 10}
        };
        const ans = Dict.clear(data);

        assert.isTrue(data === ans);
        assert.equal(Object.keys(ans).length, 0);
    });

    it('works for an empty object', function () {
        const data = {};
        const ans = Dict.clear(data);

        assert.isTrue(data === ans);
        assert.equal(Object.keys(ans).length, 0);
    });

});
