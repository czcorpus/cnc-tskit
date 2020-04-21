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


import { List } from '../../src/collections/list';
import { assert } from 'chai';

describe('List#repeat', function () {

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


describe('List#range', function () {

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


describe('List#zip', function () {

    it('should zip two equally long arrays', function () {
        const ans = List.zip([0, 1, 2, 3], ['a', 'b', 'c', 'd']);
        assert.deepEqual(ans, [ ['a', 0], ['b', 1], ['c', 2], ['d', 3] ]);
    });

    it('should zip two unequally long arrays', function () {
        const ans = List.zip([0, 1, 2, 3, 4, 5], ['a', 'b', 'c', 'd']);
        assert.deepEqual(ans, [ ['a', 0], ['b', 1], ['c', 2], ['d', 3] ]);
    });
});


describe('List#map', function () {

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


describe('List#get', function () {

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

describe('List#find', function () {

    it('works on a regular example', function () {
        const v = List.find(v => v > 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.equal(v, 6)
    });

    it('works on a regular example using item index', function () {
        const v = List.find((v, i) => i === 1, ['a', 'b', 'c']);
        assert.equal(v, 'b');
    });

    it('returns undefined if nothing found', function () {
        const v = List.find(v => v > 20, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.isUndefined(v);
    });

    it('works on an empty array', function () {
        const v = List.find(v => v > 20, []);
        assert.isUndefined(v);
    });
});


describe('List#findIndex', function () {

    it('works on a regular example', function () {
        const v = List.findIndex(v => v < 7, [9, 8, 7, 6, 5, 4, 3, 2, 1]);
        assert.equal(v, 3)
    });

    it('works on a regular example using item index', function () {
        const v = List.findIndex((v, i) => i === 1, ['a', 'b', 'c']);
        assert.equal(v, 1);
    });

    it('returns undefined if nothing found', function () {
        const v = List.findIndex(v => v > 20, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        assert.equal(v, -1);
    });

    it('works on an empty array', function () {
        const v = List.findIndex(v => v > 20, []);
        assert.equal(v, -1);
    });
});


describe('List#findRange', function () {

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


describe('List#toDict', function () {

    it('transforms properly', function () {
        assert.deepEqual(List.toDict(['a', 'b', 'c']), {'0': 'a', '1': 'b', '2': 'c'});
    });

    it('transforms properly an empty array', function () {
        assert.deepEqual(List.toDict([]), {});
    });
});

describe('List#maxItem', function () {

    it('searches properly', function () {
        const m = List.maxItem(v => v.length, ['hi', 'people', 'of', 'the', 'world']);
        assert.equal(m, 'people');
    });

    it('searches properly for an empty array', function () {
        const m = List.maxItem(v => v.length, [] as Array<string>);
        assert.isUndefined(m);
    });

});

describe('List#reduce', function () {

    it('works properly on regular data', function () {
        const m = List.reduce((acc, v) => acc + v, 'test', ['a', 'b', 'c']);
        assert.equal(m, 'testabc');
    });

});


describe('List#foldl', function () {

    it('works properly on regular data', function () {
        const m = List.foldl((acc, v) => acc + v, 'test', ['a', 'b', 'c']);
        assert.equal(m, 'testabc');
    });

    it('works properly on an empty array', function () {
        const m = List.foldl((acc, v) => acc + v, 'test', []);
        assert.equal(m, 'test');
    });

    it('works properly on a single item array', function () {
        const m = List.foldl((acc, v) => acc + v, 'test', ['x']);
        assert.equal(m, 'testx');
    });

});


describe('List#foldr', function () {

    it('works properly on regular data', function () {
        const m = List.foldr((acc, v) => acc + v, 'test', ['a', 'b', 'c']);
        assert.equal(m, 'testcba');
    });

    it('works properly on an empty array', function () {
        const m = List.foldr((acc, v) => acc + v, 'test', []);
        assert.equal(m, 'test');
    });

    it('works properly on a single item array', function () {
        const m = List.foldr((acc, v) => acc + v, 'test', ['x']);
        assert.equal(m, 'testx');
    });

});


describe('List#reverse', function () {

    it('works properly on regular data', function () {
        const m = List.reverse(['a', 'b', 'c', 'd']);
        assert.deepEqual(m, ['d', 'c', 'b', 'a']);
    });

    it('works properly on an empty array', function () {
        const m = List.reverse([]);
        assert.deepEqual(m, []);
    });

    it('works properly on a single item array', function () {
        const m = List.reverse([1]);
        assert.deepEqual(m, [1]);
    });
});

describe('List#forEach', function () {

    it('produces unchanged array and calls fn properly', function () {

        const a:Array<string> = [];
        const b:Array<number> = [];
        const ans = List.forEach(
            (v, i) => {
                a.push(v);
                b.push(i);
            },
            ['a', 'b', 'c', 'd']
        );

        assert.deepEqual(ans, ['a', 'b', 'c', 'd']);
        assert.deepEqual(a, ['a', 'b', 'c', 'd']);
        assert.deepEqual(b, [0, 1, 2, 3]);
    });


    it('works on an empty array', function () {

        const a:Array<string> = [];
        const b:Array<number> = [];
        const ans = List.forEach(
            (v, i) => {
                a.push(v);
                b.push(i);
            },
            []
        );

        assert.deepEqual(ans, []);
        assert.deepEqual(a, []);
        assert.deepEqual(b, []);
    });

});


describe('List#zipByMappedKey', function () {

    it('works on regular data', function () {
        const testData:Array<Array<{name:string; lastName:string; age:number}>> = [
            [
                {name: 'Jane', lastName: 'Doe', age: 35},
                {name: 'Tom', lastName: 'Jones', age: 50},
                {name: 'Pablo', lastName: 'Doe', age: 35}
            ],
            [
                {name: 'John', lastName: 'Doe', age: 37},
                {name: 'Lemmy', lastName: 'Kilmister', age: 60},
                {name: 'Sandy', lastName: 'Doe', age: 47}

            ]
        ];
        const ans = List.zipByMappedKey(
            v => v.lastName,
            () => ({ident: '', lastName: ''}),
            (dest, incom, datasetIdx) => {
                if (dest.lastName !== incom.lastName) {
                    return {
                        ident: `${incom.name}_${incom.age}`,
                        lastName: incom.lastName
                    };
                }
                return dest;
            },
            testData
        );
        assert.deepEqual(ans, [
            {ident: 'Jane_35', lastName: 'Doe'},
            { ident: 'Tom_50', lastName: 'Jones' },
            { ident: 'Lemmy_60', lastName: 'Kilmister' }
        ])
    });
});


describe('List#shift', function () {

    it('works on regular data', function () {
        const ans = List.shift(['a', 'b', 'c']);
        assert.deepEqual(ans, ['b', 'c']);
    });

    it('works on an empty array', function () {
        const ans = List.shift([]);
        assert.deepEqual(ans, []);
    });
});


describe('List#addUnique', function () {

    it('works on regular primitive data', function () {
        const data = [1, 2, 3];
        const ans = List.addUnique(1, data);
        assert.deepEqual(ans, [1, 2, 3]);
    });


    it('works on list of objects (strict comparison)', function () {
        const data = [{a: 1}, {b: 2}];
        const ans = List.addUnique({a: 1}, data);
        assert.deepEqual(ans, [{a: 1}, {b: 2}, {a: 1}]);
    });

});


describe('List#unique', function () {

    it('works on regular data', function () {
        const data = [{a: 1}, {a: 1}, {a: 2}];
        const ans = List.unique(v => v.a, data);
        assert.deepEqual(ans.sort((v1, v2) => v1.a - v2.a), [{a: 1}, {a: 2}]);
    });

    it('works on an empty array', function () {
        const data:Array<{a:number}> = [];
        const ans = List.unique(v => v.a, data);
        assert.deepEqual(ans, []);
    });

});


describe('List#head', function () {

    it('works properly on regular data', function () {
        const m = List.head(['a', 'b', 'c', 'd']);
        assert.equal(m, 'a');
    });

    it('throws error on an empty array', function () {
        assert.throws(() => List.head([]));
    });

});


describe('List#tail', function () {

    it('works properly on regular data', function () {
        const m = List.tail(['a', 'b', 'c', 'd']);
        assert.deepEqual(m, ['b', 'c', 'd']);
    });

    it('works properly on an empty array', function () {
        const m = List.tail([]);
        assert.deepEqual(m, []);
    });

});
