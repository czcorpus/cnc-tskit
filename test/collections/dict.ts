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


import { Dict } from '../../src/collections/dict';
import { assert } from 'chai';

const mkData = ():{[k:string]:number} => ({a: 10, b: 20});

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