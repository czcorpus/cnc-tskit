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

import { Obj } from '../common';


export namespace Dict {

    export function get<V, K extends string>(k:string, dflt:V|undefined, data:Obj<V, K>):V|undefined;
    export function get<V, K extends string>(k:string, dflt:V|undefined):(data:Obj<V, K>)=>V|undefined;
    export function get<V, K extends string>(k:string, dflt?:V, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>) => data2[k] !== undefined ? data2[k] : dflt;
        return data ? fn(data) : fn;
    }

    /**
     * Return number of keys/properties of a provided object
     */
    export function size<V, K extends string>(data:Obj<V, K>):number;
    export function size<V, K extends string>():(data:Obj<V, K>)=>number;
    export function size<V, K extends string>(data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>) => Object.keys(data2).length;
        return data ? fn(data) : fn;
    }

    /**
     * Return true if number of object's keys/properties is zero.
     */
    export function empty<V, K extends string>(data:Obj<V, K>):number;
    export function empty<V, K extends string>():(data:Obj<V, K>)=>number;
    export function empty<V, K extends string>(data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>) => Object.keys(data2).length === 0;
        return data ? fn(data) : fn;
    }

    /**
     * Create a dictionary from provided list of [key, value] pairs.
     */
    export function fromEntries<V, K extends string>(items:Array<[K, V]>):Obj<V, K>;
    export function fromEntries<V, K extends string>():(items:Array<[K, V]>)=>Obj<V, K>;
    export function fromEntries<V, K extends string>(items?:Array<[K, V]>):any {
        const fn = (items2:Array<[K, V]>):Obj<V, K> => {
            const ans:Obj<V, K> = {} as {[k in K]:V};
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
    export function toEntries<V, K extends string>(data:Obj<V, K>):Array<[K, V]>;
    export function toEntries<V, K extends string>():(data:Obj<V, K>)=>Array<[K, V]>;
    export function toEntries<V, K extends string>(data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>):Array<[K, V]> => {
            const ans:Array<[K, V]> = [];
            for (let k in data2) {
                ans.push([k, data2[k]]);
            }
            return ans;
        };
        return data ? fn(data) : fn;
    }


    export function forEach<V, K extends string>(effect:(v:V, k:K)=>void, data:Obj<V, K>):Obj<V, K>;
    export function forEach<V, K extends string>(effect:(v:V, k:K)=>void):(data:Obj<V, K>)=>Obj<V, K>;
    export function forEach<V, K extends string>(effect:(v:V, k:K)=>void, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>):Obj<V, K> => {
            for (let k in data2) {
                effect(data2[k], k);
            }
            return data2;
        };
        return data ? fn(data) : fn;
    }

    export function every<V, K extends string>(pred:(v:V, k:K)=>boolean, data:Obj<V, K>):boolean;
    export function every<V, K extends string>(pred:(v:V, k:K)=>boolean):(data:Obj<V, K>)=>boolean;
    export function every<V, K extends string>(pred:(v:V, k:K)=>boolean, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>):boolean => {
            for (let k in data2) {
                if (!pred(data2[k], k)) {
                    return false;
                }
            }
            return true;
        }
        return data ? fn(data) : fn;
    }

    export function map<V, U, K extends string>(mapper:(v:V, k:K)=>U, data:Obj<V, K>):Obj<U, K>;
    export function map<V, U, K extends string>(mapper:(v:V, k:K)=>U):(data:Obj<V, K>)=>Obj<U, K>;
    export function map<V, U, K extends string>(mapper:(v:V, k:K)=>U, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>):Obj<U, K> => {
            const ans:Obj<U, K> = {} as Obj<U, K>;
            for (let k in data2) {
                ans[k] = mapper(data2[k], k);
            }
            return ans;
        };
        return data ? fn(data) : fn;
    }

    export function filter<V, K extends string>(pred:(v:V, k:K)=>boolean, data:Obj<V, K>):Obj<V, K>;
    export function filter<V, K extends string>(pred:(v:V, k:K)=>boolean):(data:Obj<V, K>)=>Obj<V, K>;
    export function filter<V, K extends string>(pred:(v:V, k:K)=>boolean, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>):Obj<V, K> => {
            const ans:Obj<V, K> = {} as Obj<V, K>;
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
     * note: function uses strict comparison (===)
     */
    export function hasValue<V, K extends string>(v:V, data:Obj<V, K>):boolean;
    export function hasValue<V, K extends string>(v:V):(data:Obj<V, K>)=>boolean;
    export function hasValue<V, K extends string>(v:V, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>):boolean => {
            for (let k in data2) {
                if (data2[k] === v) {
                    return true;
                }
            }
            return false;
        };
        return data ? fn(data) : fn;
    }

    export function hasKey<V, K extends string>(k:string, data:Obj<V, K>):boolean;
    export function hasKey<V, K extends string>(k:string):(data:Obj<V, K>)=>boolean;
    export function hasKey<V, K extends string>(k:string, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>) => data2[k] !== undefined;
        return data ? fn(data) : fn;
    }

    /**
     * Find a key-value pair patching predicate. Order is not defined.
     * If nothing is found, undefined is returned.
     * @param data
     * @param pred
     */
    export function find<V, K extends string>(pred:(v:V, k:K)=>boolean, data:Obj<V, K>):[K, V]|undefined;
    export function find<V, K extends string>(pred:(v:V, k:K)=>boolean):(data:Obj<V, K>)=>[K, V]|undefined;
    export function find<V, K extends string>(pred:(v:V, k:K)=>boolean, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>):[K, V]|undefined => {
            for (let k in data2) {
                if (pred(data2[k], k)) {
                    return [k, data2[k]];
                }
            }
            return undefined;
        };
        return data ? fn(data) : fn;
    }

    export function mapEntries<V, U, K extends string>(mapper:(entry:[K, V])=>U, data:Obj<V, K>):Array<U>;
    export function mapEntries<V, U, K extends string>(mapper:(entry:[K, V])=>U):(data:Obj<V, K>)=>Array<U>;
    export function mapEntries<V, U, K extends string>(mapper:(entry:[K, V])=>U, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>):Array<U> => {
            const ans:Array<U> = [];
            for (let k in data2) {
                ans.push(mapper([k, data2[k]]));
            }
            return ans;
        };
        return data ? fn(data) : fn;
    }

    export function mergeDict<V, K extends string>(merger:(oldVal:V, newVal:V, key:K) => V, incoming:Obj<V, K>, data:Obj<V, K>):Obj<V, K>;
    export function mergeDict<V, K extends string>(merger:(oldVal:V, newVal:V, key:K) => V, incoming:Obj<V, K>):(data:Obj<V, K>)=>Obj<V, K>;
    export function mergeDict<V, K extends string>(merger:(oldVal:V, newVal:V, key:K) => V, incoming:Obj<V, K>, data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>):Obj<V, K> => {
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

    export function keys<V, K extends string>(data:Obj<V, K>):Array<K>;
    export function keys<V, K extends string>():(data:Obj<V, K>)=>Array<K>;
    export function keys<V, K extends string>(data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>) => Object.keys(data2);
        return data ? fn(data) : fn;
    }

    export function values<V, K extends string>(data:Obj<V, K>):Array<V>;
    export function values<V, K extends string>():(data:Obj<V, K>)=>Array<V>;
    export function values<V, K extends string>(data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>) => Object.values(data2);
        return data ? fn(data) : fn;
    }

    /**
     * Remove all the properties, keep the reference.
     */
    export function clear<V, K extends string>(data:Obj<V, K>):Obj<V, K>;
    export function clear<V, K extends string>(data?:Obj<V, K>):any {
        const fn = (data2:Obj<V, K>) => {
            for (let p in data2) {
                delete data2[p];
            }
            return data2;
        };
        return data ? fn(data) : fn;
    }

}