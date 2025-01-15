/*
 * Copyright 2018 Tomas Machalek <tomas.machalek@gmail.com>
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

import { DictType, KeyArgType } from '../common.js';


/**
 * Dict operations are most suitable for dynamic hash table-like structures with
 * no predefined structure. Please note that most of the operations mutate original
 * input.
 */
export namespace Dict {

    export function get<V, K extends string>(k:KeyArgType, dflt:V|undefined, data:DictType<V, K>):V|undefined;
    export function get<V, K extends string>(k:KeyArgType, dflt:V|undefined):(data:DictType<V, K>)=>V|undefined;
    export function get<V, K extends string>(k:KeyArgType, dflt?:V, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => data2[k] !== undefined ? data2[k] : dflt;
        return data ? fn(data) : fn;
    }

    /**
     * Set a new value 'v' under the key 'k'.
     * Mutates the original object.
     */
    export function set<V, K extends string>(k:KeyArgType, v:V, data:DictType<V, K>):DictType<V, K>;
    export function set<V, K extends string>(k:KeyArgType, v:V):(data:DictType<V, K>)=>DictType<V, K>;
    export function set<V, K extends string>(k:KeyArgType, v:V, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => {
            data2[k] = v;
            return data2;
        }
        return data ? fn(data) : fn;
    }

    /**
     * Remove an existing value under the key 'k'.
     * Mutates the original object.
     */
    export function remove<V, K extends string>(k:KeyArgType, data:DictType<V, K>):DictType<V, K>;
    export function remove<V, K extends string>(k:KeyArgType):(data:DictType<V, K>)=>DictType<V, K>;
    export function remove<V, K extends string>(k:KeyArgType, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => {
            delete data2[k];
            return data2;
        }
        return data ? fn(data) : fn;
    }

    /**
     * Return number of keys/properties of a provided object
     */
    export function size<V, K extends string>(data:DictType<V, K>):number;
    export function size<V, K extends string>():(data:DictType<V, K>)=>number;
    export function size<V, K extends string>(data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => Object.keys(data2).length;
        return data ? fn(data) : fn;
    }

    /**
     * Return true if number of object's keys/properties is zero.
     */
    export function empty<V, K extends string>(data:DictType<V, K>):boolean;
    export function empty<V, K extends string>():(data:DictType<V, K>)=>boolean;
    export function empty<V, K extends string>(data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => Object.keys(data2).length === 0;
        return data ? fn(data) : fn;
    }

    /**
     * Create a dictionary from provided list of [key, value] pairs.
     * In case of a key collision, the last colliding item is inserted.
     */
    export function fromEntries<V, K extends string>(items:Array<[K, V]>):DictType<V, K>;
    export function fromEntries<V, K extends string>():(items:Array<[K, V]>)=>DictType<V, K>;
    export function fromEntries<V, K extends string>(items?:Array<[K, V]>):any {
        const fn = (items2:Array<[K, V]>):DictType<V, K> => {
            const ans:DictType<V, K> = {} as {[k in K]:V};
            items2.forEach(([k, v]) => {
                ans[k] = v;
            });
            return ans;
        };
        return items ? fn(items) : fn;
    }

    /**
     * Create a list of [key, value] pairs from provided dictionary
     */
    export function toEntries<V, K extends string>(data:DictType<V, K>):Array<[K, V]>;
    export function toEntries<V, K extends string>():(data:DictType<V, K>)=>Array<[K, V]>;
    export function toEntries<V, K extends string>(data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):Array<[K, V]> => {
            const ans:Array<[K, V]> = [];
            for (let k in data2) {
                ans.push([k, data2[k]]);
            }
            return ans;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Apply a side-effect using each item of an object. The order of items cannot be determined
     * in advance.
     */
    export function forEach<V, K extends string>(effect:(v:V, k:K)=>void, data:DictType<V, K>):DictType<V, K>;
    export function forEach<V, K extends string>(effect:(v:V, k:K)=>void):(data:DictType<V, K>)=>DictType<V, K>;
    export function forEach<V, K extends string>(effect:(v:V, k:K)=>void, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):DictType<V, K> => {
            for (let k in data2) {
                effect(data2[k], k);
            }
            return data2;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Test whether at least a single item (= key & value) matches a provided predicate.
     */
    export function some<V, K extends string>(pred:(v:V, k:K)=>boolean, data:DictType<V, K>):boolean;
    export function some<V, K extends string>(pred:(v:V, k:K)=>boolean):(data:DictType<V, K>)=>boolean;
    export function some<V, K extends string>(pred:(v:V, k:K)=>boolean, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):boolean => {
            for (let k in data2) {
                if (pred(data2[k], k)) {
                    return true;
                }
            }
            return false;
        }
        return data ? fn(data) : fn;
    }

    /**
     * Test whether each item (= key & value) matches a provided predicate
     */
    export function every<V, K extends string>(pred:(v:V, k:K)=>boolean, data:DictType<V, K>):boolean;
    export function every<V, K extends string>(pred:(v:V, k:K)=>boolean):(data:DictType<V, K>)=>boolean;
    export function every<V, K extends string>(pred:(v:V, k:K)=>boolean, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):boolean => {
            for (let k in data2) {
                if (!pred(data2[k], k)) {
                    return false;
                }
            }
            return true;
        }
        return data ? fn(data) : fn;
    }

    /**
     * Map values using a provided mapper function. Create a new object with the same keys
     * and respective mapped values.
     */
    export function map<V, U, K extends string>(mapper:(v:V, k:K)=>U, data:DictType<V, K>):DictType<U, K>;
    export function map<V, U, K extends string>(mapper:(v:V, k:K)=>U):(data:DictType<V, K>)=>DictType<U, K>;
    export function map<V, U, K extends string>(mapper:(v:V, k:K)=>U, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):DictType<U, K> => {
            const ans:DictType<U, K> = {} as DictType<U, K>;
            for (let k in data2) {
                ans[k] = mapper(data2[k], k);
            }
            return ans;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Filter object properties using a defined predicate. The function can be also used
     * to narrow types of values within an object.
     */
    export function filter<V, U extends V, K extends string>(pred:(v:V, k:K)=>v is U, data:DictType<V, K>):DictType<U, K>;
    export function filter<V, K extends string>(pred:(v:V, k:K)=>boolean, data:DictType<V, K>):DictType<V, K>;
    export function filter<V, U extends V, K extends string>(pred:(v:V, k:K)=>v is U):(data:DictType<V, K>)=>DictType<U, K>;
    export function filter<V, K extends string>(pred:(v:V, k:K)=>boolean):(data:DictType<V, K>)=>DictType<V, K>;
    export function filter<V, K extends string>(pred:(v:V, k:K)=>boolean, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):DictType<V, K> => {
            const ans:DictType<V, K> = {} as DictType<V, K>;
            for (let k in data2) {
                if (pred(data2[k], k)) {
                    ans[k] = data2[k];
                }
            }
            return ans;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Test whether the object contains an entry with provided value 'v'.
     * For comparison, strict equality (===) is used.
     */
    export function hasValue<V, K extends string>(v:V, data:DictType<V, K>):boolean;
    export function hasValue<V, K extends string>(v:V):(data:DictType<V, K>)=>boolean;
    export function hasValue<V, K extends string>(v:V, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):boolean => {
            for (let k in data2) {
                if (data2[k] === v) {
                    return true;
                }
            }
            return false;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Test whether the object contains a provided key. In case the object contains
     * 'undefined' with the specified key - the method Please note that
     * numeric keys are (just like in plain JS) converted to strings.
     */
    export function hasKey<V, K extends string>(k:KeyArgType, data:DictType<V, K>):boolean;
    export function hasKey<V, K extends string>(k:KeyArgType):(data:DictType<V, K>)=>boolean;
    export function hasKey<V, K extends string>(k:KeyArgType, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => Object.prototype.hasOwnProperty.call(data2, k);
        return data ? fn(data) : fn;
    }

    /**
     * Find a key-value pair patching predicate. Order is not defined.
     * If nothing is found, undefined is returned.
     */
    export function find<V, K extends string>(pred:(v:V, k:K)=>boolean, data:DictType<V, K>):[K, V]|undefined;
    export function find<V, K extends string>(pred:(v:V, k:K)=>boolean):(data:DictType<V, K>)=>[K, V]|undefined;
    export function find<V, K extends string>(pred:(v:V, k:K)=>boolean, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):[K, V]|undefined => {
            for (let k in data2) {
                if (pred(data2[k], k)) {
                    return [k, data2[k]];
                }
            }
            return undefined;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Map over entries [k1, v1],....[kN, VN] and return a list of pairs with original
     * keys and values produced by the mapper function.
     */
    export function mapEntries<V, U, K extends string>(mapper:(entry:[K, V])=>U, data:DictType<V, K>):Array<[K, U]>;
    export function mapEntries<V, U, K extends string>(mapper:(entry:[K, V])=>U):(data:DictType<V, K>)=>Array<[K, U]>;
    export function mapEntries<V, U, K extends string>(mapper:(entry:[K, V])=>U, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):Array<[K, U]> => {
            return Object.keys(data2).map((k:K) => [k, mapper([k, data2[k]])]);
        };
        return data ? fn(data) : fn;
    }

    /**
     * Merge two objects into a single one. Possible conflicts can be resolved
     * manually using a provided 'merger' function.
     */
    export function mergeDict<V, K extends string>(merger:(oldVal:V, newVal:V, key:K) => V, incoming:DictType<V, K>, data:DictType<V, K>):DictType<V, K>;
    export function mergeDict<V, K extends string>(merger:(oldVal:V, newVal:V, key:K) => V, incoming:DictType<V, K>):(data:DictType<V, K>)=>DictType<V, K>;
    export function mergeDict<V, K extends string>(merger:(oldVal:V, newVal:V, key:K) => V, incoming:DictType<V, K>, data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>):DictType<V, K> => {
            for (let k in incoming) {
                if (data2[k] === undefined) {
                    data2[k] = incoming[k];

                } else {
                    data2[k] = merger(data2[k], incoming[k], k);
                }
            }
            return data2;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Return keys of an object. Please note that internally, all
     * the keys are of 'string' type so even if some properties
     * have been set using a numeric key, the key representation
     * is string.
     */
    export function keys<V, K extends string>(data:DictType<V, K>):Array<K>;
    export function keys<V, K extends string>():(data:DictType<V, K>)=>Array<K>;
    export function keys<V, K extends string>(data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => Object.keys(data2);
        return data ? fn(data) : fn;
    }

    /**
     * Return values of an object. The order cannot be determined in advance.
     */
    export function values<V, K extends string>(data:DictType<V, K>):Array<V>;
    export function values<V, K extends string>():(data:DictType<V, K>)=>Array<V>;
    export function values<V, K extends string>(data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => Object.values(data2);
        return data ? fn(data) : fn;
    }

    /**
     * Remove all the properties of object, keep the reference.
     */
    export function clear<V, K extends string>(data:DictType<V, K>):DictType<V, K>;
    export function clear<V, K extends string>():(data:DictType<V, K>)=>DictType<V, K>;
    export function clear<V, K extends string>(data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => {
            for (let p in data2) {
                delete data2[p];
            }
            return data2;
        };
        return data ? fn(data) : fn;
    }

    /**
     * Create a shallow copy of a provided object.
     */
    export function clone<V, K extends string>(data:DictType<V, K>):DictType<V, K>;
    export function clone<V, K extends string>():(data:DictType<V, K>)=>DictType<V, K>;
    export function clone<V, K extends string>(data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => {
            return {...data2};
        };
        return data ? fn(data) : fn;
    }

    /**
     * Remove all the keys with values "undefined". The functions
     * mutates the original object.
     */
    export function normalize<V, K extends string>(data:DictType<V, K>):DictType<V, K>;
    export function normalize<V, K extends string>():(data:DictType<V, K>)=>DictType<V, K>;
    export function normalize<V, K extends string>(data?:DictType<V, K>):any {
        const fn = (data2:DictType<V, K>) => {
            Object.keys(data2).forEach(k => {
                if (data2[k] === undefined) {
                    delete data2[k];
                }
            });
            return data2;
        };
        return data ? fn(data) : fn;
    }

}