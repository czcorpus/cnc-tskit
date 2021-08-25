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

import { List } from './collections/list';
import { pipe, tuple } from './index';


export namespace URL {

    export function join(...path:string[]):string {
        return path.length === 1 ?
            path[0] :
            path.slice(1).reduce(
                (acc, curr) => {
                    const part1 = acc.endsWith('/') ? acc.slice(0, acc.length - 1) : acc;
                    const part2 = curr.startsWith('/') ? curr.slice(1) : curr;
                    return `${part1}/${part2}`;
                },
                path[0]
            );
    }

    type EntriesOf<T> = Array<[keyof T, T[keyof T]]>;

    /**
     * Convert a value (typically an object) to a list of [key, value] pairs
     * with:
     * keys converted to string
     * value converted to string as follows:
     *   undefined => the [key, value] is excluded from the result
     *   null => [key, ''] (i.e. it is treated as a "flag" argument)
     *   boolean => true => 1, false => 0
     *   otherwise => string representation of the value
     * both keys and values URL-escaped
     *
     * In case a value is of Array type, it is flattened
     * and the order of items in the array is preserved.
     * (e.g. {k1: ['foo', 'bar']} is transformed into [ ['k1', 'foo'], ['k1', 'bar'] ])
     *
     * Array is converted into pairs where keys are '0', '1', '2',...
     * 'null' is converted into an empty array
     * Other values (string, number, bool,...) return a single pair with key '0'
     */
    export function valueToPairs<T>(obj:T):Array<[string, string]>;
    export function valueToPairs<T>():(obj:T)=>Array<[string, string]>;
    export function valueToPairs<T>(obj?:T):any {


        const toEntries = (v:T) => {
            if (Array.isArray(v)) {
                return v.map((v, i) => [i, v]);

            } else if (v === null) {
                return [];

            } else if (typeof v === 'object') {
                const ans:EntriesOf<T> = [];
                Object.keys(v).forEach((k) => {
                    ans.push([k as keyof T, v[k]])
                });
                return ans;

            } else {
                return [[0, v]];
            }
        };

        const fn = (obj2:T) => pipe(
            obj2 ? obj2 : {},
            toEntries,
            List.filter(([, v]) => v !== undefined),
            List.map(([k, v]) => {
              if (v === null) {
                  return tuple(k, '');

              } else if (typeof v === 'boolean') {
                  return tuple(k, ~~v);

              } else {
                  return tuple(k, v);
              }
            }),
            List.flatMap(
                ([k, v]) => Array.isArray(v) ?
                    List.map(item => tuple(encodeURIComponent(k), encodeURIComponent(item)), v) :
                    [tuple(encodeURIComponent(k),  encodeURIComponent(v))]
            )
        );
        return obj !== undefined ? fn(obj) : fn;
    }

}
