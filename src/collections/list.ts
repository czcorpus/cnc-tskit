/*
 * Copyright 2018 Tomas Machalek <tomas.machalek@gmail.com>
 * Copyright 2020 Martin Zimandl <martin.zimandl@gmail.com>
 * Copyright 2018 Institute of the Czech National Corpus,
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

import { Dict } from './dict';

// NOTE: please note that these functions in general may mutate their
// arguments as we rely on Immer.js working for us when reducing states.


/**
 * List namespace contains functions for array creating
 * and manipulation. For easier composition, the functions
 * are defined as "data-last" (this applies even for functions
 * like concat!).
 */
export namespace List {

    /**
     * Return length of a provided array
     */
    export function size<T>(data:Array<T>):number;
    export function size<T>():(data:Array<T>)=>number;
    export function size<T>(data?:Array<T>):any {
        return data ? data.length : (data2:Array<T>)=>data2.length;
    }

    /**
     * Return true if length of the provided array is 0
     * else return false.
     */
    export function empty<T>(data:Array<T>):boolean;
    export function empty<T>():(data:Array<T>)=>number;
    export function empty<T>(data?:Array<T>):any {
        return data ? data.length === 0 : (data2:Array<T>)=>data2.length === 0;
    }

    /**
     * Create an array of size 'size' filled in by values created
     * by factory function fn. The parameter idx passed to fn
     * describes order of the item (0-based).
     */
    export function repeat<T>(fn:(idx?:number)=>T, size:number):Array<T> {
        const ans:Array<T> = [];
        for (let i = 0; i < size; i += 1) {
            ans.push(fn(i));
        }
        return ans;
    }

    /**
     *
     * @param from lower limit (inclusive)
     * @param to upper limit (exclusive)
     * @param step either positive or negative number
     */
    export function range(from:number, to:number, step:number = 1):Array<number> {
        const ans:Array<number> = [];
        const cmp = step >= 0 ? (i:number) => i < to : (i:number) => i > to;
        for (let i = from; cmp(i); i += step) {
            ans.push(i);
        }
        return ans;
    }

    /**
     * Zips elements of two arrays using min length of two.
     */
    export function zip<T, U>(incoming:Array<U>, data:Array<T>):Array<[T, U]>;
    export function zip<T, U>(incoming:Array<U>):(data:Array<T>)=>Array<[T, U]>;
    export function zip<T, U>(incoming:Array<U>, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<[T, U]> => {
            const ans:Array<[T, U]> = [];
            for (let i = 0; i < Math.min(data2.length, incoming.length); i++) {
                ans.push([data2[i], incoming[i]]);
            }
            return ans;
        }
        return data ? fn(data) : fn;
    }

    /**
     *
     * Zips elements of two arrays using max length of two. The possible missing positions
     * are filled in with undefined.
     */
    export function zipAll<T, U>(incoming:Array<U>, data:Array<T>):Array<[T|undefined, U|undefined]>;
    export function zipAll<T, U>(incoming:Array<U>):(data:Array<T>)=>Array<[T|undefined, U|undefined]>;
    export function zipAll<T, U>(incoming:Array<U>, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<[T|undefined, U|undefined]> => {
            const ans:Array<[T|undefined, U|undefined]> = [];
            for (let i = 0; i < Math.max(data2.length, incoming.length); i++) {
                ans.push([data2[i], incoming[i]]);
            }
            return ans;
        }
        return data ? fn(data) : fn;
    }

    /**
     * Join items of an array using values produced by a factory
     * function joinItemFact.
     * E.g. List.join((i)=>'x', ['a', 'b']) produces ['a', 'x', 'b'].
     * The 'i' argument of the passed function is called with the resulting position
     * of each join item (i.e. 1, 3, 5, 7, 9,...)
     */
    export function join<T>(joinItemFact:(i:number)=>T, data:Array<T>):Array<T>;
    export function join<T>(joinItemFact:(i:number)=>T):(data:Array<T>)=>Array<T>;
    export function join<T>(joinItemFact:(i:number)=>T, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            const ans:Array<T> = [];
            for (let i = 0; i < data2.length; i++) {
                ans.push(data2[i]);
                if (i < data2.length - 1) {
                    ans.push(joinItemFact(2 * i + 1));
                }
            }
            return ans;
        }
        return data ? fn(data) : fn;
    }

    /**
     * Apply a function to each array member and return a new array.
     */
    export function map<T, U>(fn:(v:T, i:number)=>U):(data:Array<T>)=>Array<U>;
    export function map<T, U>(fn:(v:T, i:number)=>U, data:Array<T>):Array<U>;
    export function map<T, U>(fn:(v:T, i:number)=>U, data?:Array<T>):any {
        const partial = (data2:Array<T>):Array<U> => data2.map(fn);
        return data ? partial(data) : partial;
    }

    export function get<T>(idx:number, data:Array<T>):T;
    export function get<T>(idx:number):(data:Array<T>)=>T;
    export function get<T>(idx:number, data?:Array<T>):any {
        const fn = (data2:Array<T>):T => idx >= 0 ? data2[idx] : data2[data2.length + idx];
        return data ? fn(data) : fn;
    }

    /**
     * Get min and max items
     * @param cmp
     */
    export function findRange<T>(cmp:(v1:T, v2:T)=>number):(data:Array<T>)=>[T, T];
    export function findRange<T>(cmp:(v1:T, v2:T)=>number, data:Array<T>):[T, T];
    export function findRange<T>(cmp:(v1:T, v2:T)=>number, data?:Array<T>):any {
        const partial = (data2:Array<T>):[T, T] => {
            let min:T = data2[0];
            let max:T = data2[0];
            data2.forEach(v => {
                if (cmp(v, min) < 0) {
                    min = v;
                }
                if (cmp(v, max) > 0) {
                    max = v;
                }
            });
            return [min, max];
        };
        return data ? partial(data) : partial;
    }

    /**
     * Convert an array to a dict with keys corresponding to
     * the original items indices.
     */
    export function toDict<T>(data:Array<T>):{[key:string]:T};
    export function toDict<T>():(data:Array<T>)=>{[key:string]:T};
    export function toDict<T>(data?:Array<T>):any {
        const fn = (data2:Array<T>):{[key:string]:T} => {
            const ans:{[key:string]:T} = {};
            data2.forEach((v, i) => {
                ans[i.toFixed()] = v;
            });
            return ans;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Return a value producing max. value
     * when a mapper function is applied to it.
     */
    export function maxItem<T>(mapper:(v:T)=>number, data:Array<T>):T;
    export function maxItem<T>(mapper:(v:T)=>number):(data:Array<T>)=>T;
    export function maxItem<T>(mapper:(v:T)=>number, data?:Array<T>):any {
        const fn = (data2:Array<T>):T => {
            let max = data2[0];
            for (let i = 1; i < data2.length; i++) {
                if (mapper(max) < mapper(data2[i])) {
                    max = data2[i];
                }
            }
            return max;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Convert an array of arrays into a 1-dimensional array.
     */
    export function flatMap<T, U>(mapper:(v:T, i:number) => Array<U>, data:Array<T>):Array<U>;
    export function flatMap<T, U>(mapper:(v:T, i:number) => Array<U>):(data:Array<T>)=>Array<U>;
    export function flatMap<T, U>(mapper:(v:T, i:number) => Array<U>, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<U> => data2.reduce(
            (acc, curr, i) => acc.concat(mapper(curr, i)),
            [] as Array<U>
        );
        return data ? fn(data) : fn;
    }

    /**
     * Reverse the original array.
     */
    export function reverse<T>(data:Array<T>):Array<T>;
    export function reverse<T>():(data:Array<T>)=>Array<T>;
    export function reverse<T>(data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => data2.reverse();
        return data ? fn(data) : fn;
    }

    /**
     * Create a new array with a reversed item order.
     */
    export function reversed<T>(data:Array<T>):Array<T>;
    export function reversed<T>():(data:Array<T>)=>Array<T>;
    export function reversed<T>(data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            const ans:Array<T> = [];
            for (let i = data2.length - 1; i >= 0; i--) {
                ans.push(data2[i]);
            }
            return ans;
        };
        return data ? fn(data) : fn;
    }

    export function reduce<T, U>(reducer:(acc:U, V:T, i:number)=>U, initial:U, data:Array<T>):U;
    export function reduce<T, U>(reducer:(acc:U, V:T, i:number)=>U, initial:U):(data:Array<T>)=>U;
    export function reduce<T, U>(reducer:(acc:U, V:T, i:number)=>U, initial:U, data?:Array<T>):any {
        const fn = (data2:Array<T>):U => data2.reduce((acc, curr, i, _) => reducer(acc, curr, i), initial);
        return data ? fn(data) : fn;
    }

    export function foldl<T, U>(reducer:(acc:U, v:T)=>U, initial:U, data:Array<T>):U;
    export function foldl<T, U>(reducer:(acc:U, v:T)=>U, initial:U):(data:Array<T>)=>U;
    export function foldl<T, U>(reducer:(acc:U, v:T)=>U, initial:U, data?:Array<T>):any {
        const fn = (data2:Array<T>):U => data2.reduce((acc, curr) => reducer(acc, curr), initial);
        return data ? fn(data) : fn;
    }

    export function foldr<T, U>(reducer:(acc:U, v:T)=>U, initial:U, data:Array<T>):U;
    export function foldr<T, U>(reducer:(acc:U, v:T)=>U, initial:U):(data:Array<T>)=>U;
    export function foldr<T, U>(reducer:(acc:U, v:T)=>U, initial:U, data?:Array<T>):any {
        const fn = (data2:Array<T>):U => {
            let ans:U = initial;
            for (let i = data2.length - 1; i >= 0; i--) {
                ans = reducer(ans, data2[i]);
            }
            return ans;
        };
        return data ? fn(data) : fn;
    }


    export function groupBy<T>(mapper:(v:T, i:number)=>string, data:Array<T>):Array<[string, Array<T>]>;
    export function groupBy<T>(mapper:(v:T, i:number)=>string):(data:Array<T>)=>Array<[string, Array<T>]>;
    export function groupBy<T>(mapper:(v:T, i:number)=>string, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<[string, Array<T>]> => {
            const ans = {} as {[k:string]:Array<T>};
            data2.forEach((v, i) => {
                const k = mapper(v, i);
                if (ans[k] === undefined) {
                    ans[k] = [];
                }
                ans[mapper(v, i)].push(v);
            });
            return Dict.toEntries(ans);
        };
        return data ? fn(data) : fn;
    }

    /**
     * Add item 'v' to the end of the provided array.
     * Pushing undefined value is not allowed.
     * Mutates the original array.
     */
    export function push<T>(v:T, data:Array<T>):Array<T>;
    export function push<T>(v:T):(data:Array<T>)=>Array<T>;
    export function push<T>(v:T, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            if (v === undefined) {
                throw Error('List.push - cannot insert undefined');
            }
            data2.push(v);
            return data2;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Sorts the original array using numbers produced by the map function.
     */
    export function sortBy<T>(map:(v:T) => number, data:Array<T>):Array<T>;
    export function sortBy<T>(map:(v:T) => number):(data:Array<T>)=>Array<T>;
    export function sortBy<T>(map:(v:T) => number, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => data2.sort((v1, v2) => map(v1) - map(v2));
        return data ? fn(data) : fn;
    }

    /**
     * Sorts a copy of provided array using numbers produced by the map function.
     */
    export function sortedBy<T>(map:(v:T) => number, data:Array<T>):Array<T>;
    export function sortedBy<T>(map:(v:T) => number):(data:Array<T>)=>Array<T>;
    export function sortedBy<T>(map:(v:T) => number, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => [...data2].sort((v1, v2) => map(v1) - map(v2));
        return data ? fn(data) : fn;
    }

    /**
     * Sorts the original array using strings produced by the map function.
     */
    export function sortAlphaBy<T>(map:(v:T) => string, data:Array<T>):Array<T>;
    export function sortAlphaBy<T>(map:(v:T) => string):(data:Array<T>)=>Array<T>;
    export function sortAlphaBy<T>(map:(v:T) => string, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => data2.sort((v1, v2) => map(v1).localeCompare(map(v2)));
        return data ? fn(data) : fn;
    }

    /**
     * Just like List.sort() but produces a shallow copy.
     */
    export function sorted<T>(cmp:(v1:T, v2:T) => number, data:Array<T>):Array<T>;
    export function sorted<T>(cmp:(v1:T, v2:T) => number):(data:Array<T>)=>Array<T>;
    export function sorted<T>(cmp:(v1:T, v2:T) => number, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => [...data2].sort(cmp);
        return data ? fn(data) : fn;
    }

    /**
     * Sorts the original array using strings produced by the map function.
     */
    export function sortedAlphaBy<T>(map:(v:T) => string, data:Array<T>):Array<T>;
    export function sortedAlphaBy<T>(map:(v:T) => string):(data:Array<T>)=>Array<T>;
    export function sortedAlphaBy<T>(map:(v:T) => string, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => [...data2].sort((v1, v2) => map(v1).localeCompare(map(v2)));
        return data ? fn(data) : fn;
    }

    /**
     * Filter array items using a defined predicate. The function can be also used
     * to narrow types of the items (e.g. an array of both strings and numbers can be
     * filtered to an array of just numbers or just strings).
     */
    export function filter<T, S extends T>(pred:(v:T, i:number)=>v is S, data:Array<T>):Array<S>;
    export function filter<T>(pred:(v:T, i:number)=>boolean, data:Array<T>):Array<T>;
    export function filter<T, S extends T>(pred:(v:T, i:number)=>v is S):(data:Array<T>)=>Array<S>;
    export function filter<T>(pred:(v:T, i:number)=>boolean):(data:Array<T>)=>Array<T>;
    export function filter<T>(pred:(v:T, i:number)=>boolean, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => data2.filter(pred);
        return data ? fn(data) : fn;
    }

    /**
     *
     * Return a new array with elements from 'start' (including) to 'end' (excluding).
     * The 'end' argument can be negative - in such case, the value is added to the
     * last possible index value ([0, 1, 2, 3, 4] with end = -2 goes up to '2')
     */
    export function slice<T>(start:number, end:number, data:Array<T>):Array<T>;
    export function slice<T>(start:number, end:number):(data:Array<T>)=>Array<T>;
    export function slice<T>(start:number):(data:Array<T>)=>Array<T>;
    export function slice<T>(start:number, end?:number, data?:Array<T>):any {
        const fn = (data2:Array<T>) => data2.slice(start, end);
        return data ? fn(data) : fn;
    }

    /**
     * Apply a side-effect using provided array.
     */
    export function forEach<T>(effect:(v:T, i:number)=>void, data:Array<T>):Array<T>;
    export function forEach<T>(effect:(v:T, i:number)=>void):(data:Array<T>)=>Array<T>;
    export function forEach<T>(effect:(v:T, i:number)=>void, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            data2.forEach((v, i) => effect(v, i));
            return data2;
        }
        return data ? fn(data) : fn;
    }

    /**
     * zipByMappedKey zips multiple arrays containing the same datatype T
     * tranforming them into type U and deciding which items belong together using
     * 'map' function. Because the type U is independent of T, also a factory
     * for type U must be provided (dfltFact()). Items of type T are merged into U
     * using importer() function.
     * @param data
     * @param map
     * @param dfltFact
     * @param importer
     */
    export function zipByMappedKey<T, U>(map:(v:T)=>string, dfltFact:()=>U, importer:(dest:U, incom:T, datasetIdx:number)=>U, data:Array<Array<T>>):Array<U>;
    export function zipByMappedKey<T, U>(map:(v:T)=>string, dfltFact:()=>U, importer:(dest:U, incom:T, datasetIdx:number)=>U):(data:Array<Array<T>>)=>Array<U>;
    export function zipByMappedKey<T, U>(map:(v:T)=>string, dfltFact:()=>U, importer:(dest:U, incom:T, datasetIdx:number)=>U, data?:Array<Array<T>>):any {
        const fn = (data2:Array<Array<T>>):Array<U> => {
            const ans:Array<U> = [];
            const index:{[key:string]:number} = {};

            data2.forEach((itemList, datasetIdx) => {
                itemList.forEach(item => {
                    const key = map(item);
                    if (index[key] === undefined) {
                        ans.push(importer(dfltFact(), item, datasetIdx));
                        index[key] = ans.length - 1;

                    } else {
                        ans[index[key]] = importer(ans[index[key]], item, datasetIdx);
                    }
                });
            });
            return ans;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Remove item from the beginning of an Array
     */
    export function shift<T>(data:Array<T>):Array<T>;
    export function shift<T>():(data:Array<T>)=>Array<T>;
    export function shift<T>(data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            data2.splice(0, 1);
            return data2;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Add item 'v' to the beginning of the provided array.
     * Mutates the original array.
     */
    export function unshift<T>(v:T, data:Array<T>):Array<T>;
    export function unshift<T>(v:T):(data:Array<T>)=>Array<T>;
    export function unshift<T>(v:T, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            if (v === undefined) {
                throw Error('List.unshift - cannot insert undefined.');
            }
            data2.unshift(v);
            return data2;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Add item iff there is no strictly equal item already
     * present.
     */
    export function addUnique<T>(v:T, data:Array<T>):Array<T>;
    export function addUnique<T>(v:T):(data:Array<T>)=>Array<T>;
    export function addUnique<T>(v:T, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            const idx = data2.findIndex(item => item === v);
            if (idx < 0) {
                data2.push(v);
            }
            return data2;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Make each item in an array unique based on provided keyFn.
     * The function does not guarantee preserved order.
     */
    export function unique<T>(keyFn:(v:T)=>string|number|boolean, data:Array<T>):Array<T>;
    export function unique<T>(keyFn:(v:T)=>string|number|boolean):(data:Array<T>)=>Array<T>;
    export function unique<T>(keyFn:(v:T)=>string|number|boolean, data?:Array<T>):any {
        const fn = (data2:Array<T>) => {
            const tmp:{[key:string]:T} = {};
            data2.forEach(v => {
                tmp[keyFn(v) + ''] = v;
            });
            return Dict.values(tmp);
        };
        return data ? fn(data) : fn;
    }

    /**
     * Remove a value for an array in case it is strictly
     * equal to the provided one.
     * The function mutates the original array.
     */
    export function removeValue<T>(v:T, data:Array<T>):Array<T>;
    export function removeValue<T>(v:T):(data:Array<T>)=>Array<T>;
    export function removeValue<T>(v:T, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            const idx = data2.findIndex(item => item === v);
            if (idx > -1) {
                data2.splice(idx, 1);
            }
            return data2;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Find an array item based on a predicate. If nothing is found, undefined is returned.
     *
     */
    export function find<T>(pred:(v:T, i:number)=>boolean, data:Array<T>):T|undefined;
    export function find<T>(pred:(v:T, i:number)=>boolean):(data:Array<T>)=>T|undefined;
    export function find<T>(pred:(v:T, i:number)=>boolean, data?:Array<T>):any {
        const fn = (data2:Array<T>):T|undefined => data2.find(pred);
        return data ? fn(data) : fn;
    }

    /**
     * Find an index of an array item based on a predicate. If nothing is
     * found then -1 is returned.
     */
    export function findIndex<T>(pred:(v:T, i:number)=>boolean, data:Array<T>):number;
    export function findIndex<T>(pred:(v:T, i:number)=>boolean):(data:Array<T>)=>number;
    export function findIndex<T>(pred:(v:T, i:number)=>boolean, data?:Array<T>):any {
        const fn = (data2:Array<T>):number => data2.findIndex(pred);
        return data ? fn(data) : fn;
    }

    /**
     * Test whether at least one item matches a provided predicate.
     */
    export function some<T>(pred:(v:T)=>boolean, data:Array<T>):boolean;
    export function some<T>(pred:(v:T)=>boolean):(data:Array<T>)=>boolean;
    export function some<T>(pred:(v:T)=>boolean, data?:Array<T>):any {
        const fn = (data2:Array<T>):boolean => data2.some(pred);
        return data ? fn(data) : fn;
    }

    /**
     * Test whether all the array items match a provided predicate.
     */
    export function every<T>(pred:(v:T)=>boolean, data:Array<T>):boolean;
    export function every<T>(pred:(v:T)=>boolean):(data:Array<T>)=>boolean;
    export function every<T>(pred:(v:T)=>boolean, data?:Array<T>):any {
        const fn = (data2:Array<T>):boolean => data2.every(pred);
        return data ? fn(data) : fn;
    }

    /**
     * Concat two arrays with 'data' coming first and then 'incoming'.
     * Please recall that the 'data' argument comes in second
     * (just like in all the other functions).
     */
    export function concat<T>(incoming:Array<T>, data:Array<T>):Array<T>;
    export function concat<T>(incoming:Array<T>):(data:Array<T>)=>Array<T>;
    export function concat<T>(incoming:Array<T>, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => data2.concat(incoming);
        return data ? fn(data) : fn;
    }

    /**
     * Concat two arrays with 'incoming' coming first and then 'data'.
     * Please recall that the 'data' argument comes in second
     * (just like in all the other functions).
     */
    export function concatr<T>(incoming:Array<T>, data:Array<T>):Array<T>;
    export function concatr<T>(incoming:Array<T>):(data:Array<T>)=>Array<T>;
    export function concatr<T>(incoming:Array<T>, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => incoming.concat(data2);
        return data ? fn(data) : fn;
    }

    /**
     * Return the first item of an array. In case the array
     * is empty, an error is thrown.
     */
    export function head<T>(data:Array<T>):T;
    export function head<T>():(data:Array<T>)=>T;
    export function head<T>(data?:Array<T>):any {
        const fn = (data2:Array<T>):T => {
            if (data2 && data2.length > 0) {
                return data2[0];
            }
            throw Error('Calling head on empty array');
        };
        return data ? fn(data) : fn;
    }

    /**
     * Return the last item of an array. In case the array
     * is empty, an error is thrown.
     */
    export function last<T>(data:Array<T>):T;
    export function last<T>():(data:Array<T>)=>T;
    export function last<T>(data?:Array<T>):any {
        const fn = (data2:Array<T>):T => {
            if (data2 && data2.length > 0) {
                return data2[data2.length - 1];
            }
            throw Error('Calling last on empty array');
        };
        return data ? fn(data) : fn;
    }

    /**
     * Return all the items except the first one.
     * If applied on an empty array an error is thrown.
     */
    export function tail<T>(data:Array<T>):Array<T>;
    export function tail<T>():(data:Array<T>)=>Array<T>;
    export function tail<T>(data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            if (data2 && data2.length > 0) {
                return data2.slice(1);
            }
            throw Error('Calling tail on empty array');
        };
        return data ? fn(data) : fn;
    }

    /**
     * Return all the items except the last one.
     * If applied on an empty array an error is thrown.
     */
    export function init<T>(data:Array<T>):Array<T>;
    export function init<T>():(data:Array<T>)=>Array<T>;
    export function init<T>(data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            if (data2 && data2.length > 0) {
                return data2.slice(0, -1);
            }
            throw Error('Calling init on empty array');
        }
        return data ? fn(data) : fn;
    }

    /**
     * Remove item at specified position. Negative numbers
     * can be used to address from the end of the array.
     * If idx is out of the array bounds (either positive
     * or negative) an error is thrown.
     * The function mutates the original array.
     */
    export function removeAt<T>(idx:number, data:Array<T>):Array<T>;
    export function removeAt<T>(idx:number):(data:Array<T>)=>Array<T>;
    export function removeAt<T>(idx:number, data?:Array<T>):any {
        const fn = (data2:Array<T>):Array<T> => {
            if (data2) {
                if (idx < data2.length && idx >= -data2.length) {
                    data2.splice(idx, 1);
                    return data2;

                } else {
                    throw Error(`Index ${idx} is out of bounds`);
                }
            }
            throw Error('Calling init on empty array');
        }
        return data ? fn(data) : fn;
    }
}
