/*
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



import { URL } from '../src/url';
import { assert } from 'chai';


describe('URL#join', function () {

    it('returns identity', function () {
        const joined = URL.join('anything/');
        assert.equal(joined, 'anything/');
    });

    it('joins paths without slashes', function () {
        const joined = URL.join('a', 'b', 'c');
        assert.equal(joined, 'a/b/c');
    });

    it('joins paths with slashes', function () {
        const joined = URL.join('a/', '/b/', '/c');
        assert.equal(joined, 'a/b/c');
    });

    it('joins mixed paths', function () {
        const joined = URL.join('a/', '/b/c', 'd/e');
        assert.equal(joined, 'a/b/c/d/e');
    });

    it('preserves leading and trailing slashes', function () {
        const trailing = URL.join('/a', 'b', 'c');
        const leading = URL.join('a', 'b', 'c/');
        const both = URL.join('/a', 'b', 'c/');
        assert.equal(trailing, '/a/b/c');
        assert.equal(leading, 'a/b/c/');
        assert.equal(both, '/a/b/c/');
    });
});


describe('URL#valueToPairs', function () {

    it('works for a regular object with a defined interface', function () {

        interface User {
            name:string;
            age:number;
            tag:Array<string>;
        }

        const user:User = {name: 'John', age: 30, tag: ['user', 'admin', 'owner']};

        const ans = URL.valueToPairs(user).sort(([k1,], [k2,]) => k1.localeCompare(k2));
        assert.deepStrictEqual(ans[0], ['age', '30']);
        assert.deepStrictEqual(ans[1], ['name', 'John']);
        assert.deepStrictEqual(ans[2], ['tag', 'user']);
        assert.deepStrictEqual(ans[3], ['tag', 'admin']);
        assert.deepStrictEqual(ans[4], ['tag', 'owner']);
    });

    it('returns a function in case no arg is provided (regression test, issue #54)', function () {
        assert.typeOf(URL.valueToPairs(), 'function');
    });

    it('escapes keys and values', function () {
        const ans = URL.valueToPairs({'key=x': 'one two'});
        assert.deepEqual(ans, [ ['key%3Dx', 'one%20two']])
    });

});
