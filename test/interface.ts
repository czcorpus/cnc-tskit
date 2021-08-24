/*
 * Copyright 2021 Tomas Machalek <tomas.machalek@gmail.com>
 * Copyright 2021 Institute of the Czech National Corpus,
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
import { Interface } from '../src/index';

describe('Interface#toEntries', function () {

    it('works with an interface type', function () {
        interface Foo {
            age:number;
            name:string;
        }
        const input:Foo = {age: 20, name: 'foobar'};
        const data:Array<['age'|'name', number|string]> = Interface.toEntries(input);
        const dataCmp = data.sort(([k1,], [k2,]) => k1.localeCompare(k2));
        assert.deepEqual(dataCmp, [ ['age', 20], ['name', 'foobar'] ]);
    });

    it('handles general object', function () {
        type Foo = {[key:string]:number|string};
        const input:Foo = {age: 20, name: 'foobar'};
        const data:Array<[string|number, number|string]> = Interface.toEntries(input);
        const dataCmp = data.sort(([k1,], [k2,]) => ('' + k1).localeCompare('' + k2));
        assert.deepEqual(dataCmp, [ ['age', 20], ['name', 'foobar'] ]);
    })

});