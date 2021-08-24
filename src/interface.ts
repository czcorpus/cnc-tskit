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

export type EntriesOf<T> = Array<[keyof T, T[keyof T]]>;

export class Interface {

    /**
     * Transform an object to list of [key, value] pairs
     * while treated as an interface type (i.e. use rather
     * an union type for possible 'key' values).
     */
    static toEntries<T>(v:T):EntriesOf<T>;
    static toEntries<T>():(v:T)=>EntriesOf<T>;
    static toEntries<T>(v?:T):any {
        const fn = (v2:T) => {
            const ans:EntriesOf<T> = [];
            Object.keys(v2).forEach((k) => {
                ans.push([k as keyof T, v2[k]])
            });
            return ans;
        };
        return v !== undefined ? fn(v) : fn;
    }
}
