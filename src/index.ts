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

import { Fn } from './common';

export { Dict, List } from './collections/index';

export { Color } from './colors';

export { HTTP } from './http';

export { Keyboard } from './keyboard';

export { Ident } from './ident';

export { Maths } from './math';

/**
 * Apply one or more functions (from left to right) to a provided argument.
 */
export function pipe<T, U1>(data:T, op1:Fn<T, U1>):U1;
export function pipe<T, U1, U2>(data:T, op1:Fn<T, U1>, op2:Fn<U1, U2>):U2;
export function pipe<T, U1, U2, U3>(data:T, op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>):U3;
export function pipe<T, U1, U2, U3, U4>(data:T, op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>):U4;
export function pipe<T, U1, U2, U3, U4, U5>(data:T, op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>):U5;
export function pipe<T, U1, U2, U3, U4, U5, U6>(data:T, op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>, op6:Fn<U5, U6>):U6;
export function pipe<T, U1, U2, U3, U4, U5, U6, U7>(data:T, op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>, op6:Fn<U5, U6>, op7:Fn<U6, U7>):U7;
export function pipe<T, U1, U2, U3, U4, U5, U6, U7, U8>(data:T, op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>, op6:Fn<U5, U6>, op7:Fn<U6, U7>, op8:Fn<U7, U8>):U8;
export function pipe<T, U1, U2, U3, U4, U5, U6, U7, U8, U9>(data:T, op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>, op6:Fn<U5, U6>, op7:Fn<U6, U7>, op8:Fn<U7, U8>, op9:Fn<U8, U9>):U9;
export function pipe<T>(data:T,...ops:Array<Fn<any, any>>):Fn<any, any> {
    return ops.reduce((prev, fn) => fn(prev), data);
}

/**
 * Compose functions from left to right (i.e. just like pipe).
 * To ensure proper typing, at least the first function should
 * contain type information (e.g. List.map<number, string>).
 */
export function composeLeft<T, U1>(op1:Fn<T, U1>):Fn<T, U1>;
export function composeLeft<T, U1, U2>(op1:Fn<T, U1>, op2:Fn<U1, U2>):Fn<T, U2>;
export function composeLeft<T, U1, U2, U3>(op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>):Fn<T, U3>;
export function composeLeft<T, U1, U2, U3, U4>(op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>):Fn<T, U4>;
export function composeLeft<T, U1, U2, U3, U4, U5>(op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>):Fn<T, U5>;
export function composeLeft<T, U1, U2, U3, U4, U5, U6>(op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>, op6:Fn<U5, U6>):Fn<T, U6>;
export function composeLeft<T, U1, U2, U3, U4, U5, U6, U7>(op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>, op6:Fn<U5, U6>, op7:Fn<U6, U7>):Fn<T, U7>;
export function composeLeft<T, U1, U2, U3, U4, U5, U6, U7, U8>(op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>, op6:Fn<U5, U6>, op7:Fn<U6, U7>, op8:Fn<U7, U8>):Fn<T, U8>;
export function composeLeft<T, U1, U2, U3, U4, U5, U6, U7, U8, U9>(op1:Fn<T, U1>, op2:Fn<U1, U2>, op3:Fn<U2, U3>, op4:Fn<U3, U4>, op5:Fn<U4, U5>, op6:Fn<U5, U6>, op7:Fn<U6, U7>, op8:Fn<U7, U8>, op9:Fn<U8, U9>):Fn<T, U9>;
export function composeLeft(...ops:Array<Fn<any, any>>):Fn<any, any> {
    return ops.reduce((prev, fn) => (data:any) => fn(prev(data)), v => v);
}