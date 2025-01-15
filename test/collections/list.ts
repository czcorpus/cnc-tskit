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


import { List } from '../../src/collections/list.js';
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


describe('List#zipAll', function () {

    it('should zipAll two equally long arrays', function () {
        const ans = List.zipAll([0, 1, 2, 3], ['a', 'b', 'c', 'd']);
        assert.deepEqual(ans, [ ['a', 0], ['b', 1], ['c', 2], ['d', 3] ]);
    });

    it('should zip when 1st is shorter than 2nd', function () {
        const ans = List.zipAll([0, 1, 2, 3, 4, 5], ['a', 'b', 'c', 'd']);
        assert.deepEqual(ans, [ ['a', 0], ['b', 1], ['c', 2], ['d', 3], [undefined, 4], [undefined, 5] ]);
    });

    it('should zip when 2nd is shorter than 1st', function () {
        const ans = List.zipAll(['a', 'b', 'c', 'd'], [0, 1, 2, 3, 4, 5]);
        assert.deepEqual(ans, [ [0, 'a'], [1, 'b'], [2, 'c'], [3, 'd'], [4, undefined], [5, undefined] ]);
    });
});


describe('List#join', function () {

    it('should work on a regular array', function () {
        const input = [{v: 1}, {v: 2}, {v: 3}, {v: 4}];
        const ans = List.join(() => ({v: -1}), input);
        assert.deepEqual(ans, [ {v: 1}, {v: -1}, {v: 2}, {v: -1}, {v: 3}, {v: -1}, {v: 4} ]);
        assert.notStrictEqual(ans[1], ans[3]);
        assert.notStrictEqual(ans[3], ans[5]);
        assert.notStrictEqual(ans[5], ans[1]);
    });

    it('works on an empty array', function () {
        const ans = List.join(() => 3, []);
        assert.deepEqual(ans, []);
    });

    it('works on an array of size 1', function () {
        const ans = List.join(() => 3, [4]);
        assert.deepEqual(ans, [4]);
    });

    it('factory called with proper i argument', function () {
        const input = [{v: 0}, {v: 2}, {v: 4}, {v: 6}];
        const ans = List.join((i) => ({v: i}), input);
        assert.deepEqual(ans, [ {v: 0}, {v: 1}, {v: 2}, {v: 3}, {v: 4}, {v: 5}, {v: 6} ]);
    });

})


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


describe('List#filter', function () {

    it('works with a regular predicate', function () {
        const ans = List.filter(v => v.v % 2 == 0, [{v: 0}, {v: 1}, {v: 2}, {v: 3}, {v: 4}, {v: 5}, {v: 6}]);
        assert.deepEqual(ans, [{v: 0}, {v: 2}, {v: 4}, {v: 6}]);
    });

    it('works when using item index in predicate', function () {
        const ans = List.filter((_, i) => i % 2 == 0, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
        assert.deepEqual(ans, ['a', 'c', 'e', 'g']);
    });

    it('works with type assertion predicate', function () {
        interface Item {item:number};

        function itemIsItem(v:number|Item):v is Item { return v['item'] !== undefined};

        const ans:Array<Item> = List.filter(
            itemIsItem,
            [1, {item: 2}, 3, 4, {item: 5}]
        );

        assert.deepEqual(ans, [{item: 2}, {item: 5}]);

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



describe('List#concat', function () {

    it('works on a regular example', function () {
        const a1 = [0, 1, 2, 3];
        const a2 = [4, 5, 6];
        assert.deepEqual(List.concat(a2, a1), [0, 1, 2, 3, 4, 5, 6]);
    });

    it('works with incoming empty', function () {
        const a1 = [0, 1, 2, 3];
        const a2 = [];
        assert.deepEqual(List.concat(a2, a1), [0, 1, 2, 3]);
    });

    it('works with data empty', function () {
        const a1 = [];
        const a2 = [4, 5, 6];
        assert.deepEqual(List.concat(a2, a1), [4, 5, 6]);
    });

});


describe('List#concatr', function () {

    it('works on a regular example', function () {
        const a1 = [0, 1, 2, 3];
        const a2 = [4, 5, 6];
        assert.deepEqual(List.concatr(a2, a1), [4, 5, 6, 0, 1, 2, 3]);
    });

    it('works with incoming empty', function () {
        const a1 = [0, 1, 2, 3];
        const a2 = [];
        assert.deepEqual(List.concatr(a2, a1), [0, 1, 2, 3]);
    });

    it('works with data empty', function () {
        const a1 = [];
        const a2 = [4, 5, 6];
        assert.deepEqual(List.concatr(a2, a1), [4, 5, 6]);
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

    it('modifies original array', function () {
        const orig = ['a', 'b'];
        const m = List.reverse(orig);
        assert.isTrue(orig === m);
    });

});

describe('List#reversed', function () {

    it('works properly on regular data', function () {
        const m = List.reversed(['a', 'b', 'c', 'd']);
        assert.deepEqual(m, ['d', 'c', 'b', 'a']);
    });

    it('does not modify original array', function () {
        const orig = ['a', 'b'];
        const m = List.reversed(orig);
        assert.isTrue(orig !== m);
    });

    it('works properly on an empty array', function () {
        const m = List.reversed([]);
        assert.deepEqual(m, []);
    });

    it('works properly on a single item array', function () {
        const m = List.reversed([1]);
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

    it('works with an empty array', function () {
        const data:Array<number> = [];
        const ans = List.addUnique(1, data);
        assert.deepEqual(ans, [1]);
    });

    it('works on regular primitive data with no collision', function () {
        const data = [2, 3, 4];
        const ans = List.addUnique(1, data);
        assert.deepEqual(ans, [2, 3, 4, 1]);
    });

    it('works on regular primitive data with collision', function () {
        const data = [1, 2, 3];
        const ans = List.addUnique(1, data);
        assert.deepEqual(ans, [1, 2, 3]);
    });

    it('works on list of objects (strict comparison) with no collision', function () {
        const data:Array<{[k:string]:number}> = [{b: 2}, {c: 3}];
        const ans = List.addUnique({a: 1}, data);
        assert.deepEqual(ans, [{b: 2}, {c: 3}, {a: 1}]);
    });

    it('works on list of objects (strict comparison) with collision', function () {
        const data = [{a: 1}, {b: 2}];
        const ans = List.addUnique({a: 1}, data);
        assert.deepEqual(ans, [{a: 1}, {b: 2}, {a: 1}]);
    });

});


describe('List#push', function () {

    it('works for regular data', function () {
        const data = [1, 2, 3];
        const data2 = List.push(4, data);
        assert.deepEqual(data2, [1, 2, 3, 4]);
    });

    it('works for an empty array', function () {
        const data = [];
        const data2 = List.push(4, data);
        assert.deepEqual(data2, [4]);
    });

    it('cannot push undefined value', function () {
        assert.throws(() => List.push(undefined, []));
    });

});


describe('List#unshift', function () {

    it('works for regular data', function () {
        const data = [1, 2, 3];
        const data2 = List.unshift(4, data);
        assert.deepEqual(data2, [4, 1, 2, 3]);
    });

    it('works for an empty array', function () {
        const data = [];
        const data2 = List.unshift(4, data);
        assert.deepEqual(data2, [4]);
    });

    it('cannot push undefined value', function () {
        assert.throws(() => List.unshift(undefined, []));
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


describe('List#first', function () {

    it('works properly on regular data', function () {
        const m = List.last(['a', 'b', 'c', 'd']);
        assert.equal(m, 'd');
    });

    it('throws an error when applied on an empty array', function () {
        assert.throws(() => List.last([]));
    });

});


describe('List#sortBy', function () {

    it('sorts an array in-place', function () {
        const data = [{v: 10}, {v: 3}, {v: 5}];
        const ans = List.sortBy(v =>  v.v, data);
        assert.deepEqual(ans, [{v: 3}, {v: 5}, {v: 10}]);
        assert.strictEqual(ans, data);
    });

});


describe('List#sortedBy', function () {

    it('sorts an array on a shallow copy', function () {
        const data = [{v: 10}, {v: 3}, {v: 5}];
        const ans = List.sortedBy(v =>  v.v, data);
        assert.deepEqual(ans, [{v: 3}, {v: 5}, {v: 10}]);
        assert.notStrictEqual(ans, data);
    });

});

describe('List#sortAlphaBy', function () {

    it('sorts an array in place', function () {
        const data = [{v: 'zool'}, {v: 'fancy'}, {v: 'a'}];
        const ans = List.sortAlphaBy(v =>  v.v, data);
        assert.deepEqual(ans, [{v: 'a'}, {v: 'fancy'}, {v: 'zool'}]);
        assert.strictEqual(ans, data);
    });

});


describe('List#sortedAlphaBy', function () {

    it('sorts an array on a shallow copy', function () {
        const data = [{v: 'zool'}, {v: 'fancy'}, {v: 'a'}];
        const ans = List.sortedAlphaBy(v =>  v.v, data);
        assert.deepEqual(ans, [{v: 'a'}, {v: 'fancy'}, {v: 'zool'}]);
        assert.notStrictEqual(ans, data);
    });

});


describe('List#tail', function () {

    it('works properly on regular data', function () {
        const m = List.tail(['a', 'b', 'c', 'd']);
        assert.deepEqual(m, ['b', 'c', 'd']);
    });

    it('works properly on an array of size 1', function () {
        const m = List.tail(['a']);
        assert.deepEqual(m, []);
    });

    it('throws an error when applied on an empty array', function () {
        assert.throws(() => List.tail([]));
    });
});


describe('List#init', function () {

    it('works properly on regular data', function () {
        const m = List.init(['a', 'b', 'c', 'd']);
        assert.deepEqual(m, ['a', 'b', 'c']);
    });

    it('works properly on an array of size 1', function () {
        const m = List.init(['a']);
        assert.deepEqual(m, []);
    })

    it('throws an error when applied on an empty array', function () {
        assert.throws(() => List.init([]));
    });
});

describe('List#removeAt', function () {

    it('works properly on regular data', function () {
        const m = List.removeAt(2, ['a', 'b', 'c', 'd']);
        assert.deepEqual(m, ['a', 'b', 'd']);
    });

    it('works properly on regular data using negative idx', function () {
        const m = List.removeAt(-3, ['a', 'b', 'c', 'd']);
        assert.deepEqual(m, ['a', 'c', 'd']);
    });

    it('throws an error when idx is out of bounds (+)', function () {
        assert.throw(() => List.removeAt(4, ['a', 'b', 'c', 'd']));
    });

    it('throws an error when idx is out of bounds (+)', function () {
        assert.throw(() => List.removeAt(-5, ['a', 'b', 'c', 'd']));
    });

    it('works properly on an empty array', function () {
        assert.throw(() => List.removeAt(0, []));
    });
})