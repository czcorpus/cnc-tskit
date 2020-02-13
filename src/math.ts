/*
 * Copyright 2020 Tomas Machalek <tomas.machalek@gmail.com>
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

export namespace Maths {


    export function roundToPos(v:number, numPos:number):number {
        const r = 10 ** numPos;
        return Math.round(v * r) / r;
    }



    export enum AlphaLevel {
        LEVEL_10 = '0.1',
        LEVEL_5 = '0.05',
        LEVEL_1 = '0.01'
    }


    export function wilsonConfInterval(v:number, base:number, alphaId:AlphaLevel):[number, number] {
        const z = { // scipy.stat.norm.pdf(1 - alpha / 2)
            '0.1': 1.6448536269514722,
            '0.05': 1.959963984540054,
            '0.01': 2.5758293035489004
        }[alphaId];
        const p = v / base;
        const sq = z * Math.sqrt( p * (1 - p) / base + z ** 2 / (4 * base ** 2) );
        const denom = 1 + z ** 2 / base;
        const a = p + z ** 2 / (2 * base);

        return [(a - sq) / denom, (a + sq) / denom];
    }


    export function calcPercentRatios<T, U>(get:(v:T)=>number, trans:(v:T, ratio:number)=>U, values:Array<T>):Array<U>;
    export function calcPercentRatios<T, U>(get:(v:T)=>number, trans:(v:T, ratio:number)=>U):(values:Array<T>)=>Array<U>;
    export function calcPercentRatios<T, U>(get:(v:T)=>number, trans:(v:T, ratio:number)=>U, values?:Array<T>):any {
        const fn = (values2:Array<T>):Array<U> => {
            const sum = values2.reduce((acc, curr) => acc + get(curr), 0);
            const mod = values2
                .map((v, i) => {
                    const ratio = Math.round(get(v) / sum * 1000) / 10;
                    return {
                        v: (rx:number) => trans(v, rx),
                        r: ratio
                    };
                }).sort(
                    (x1, x2) => (x2.r - Math.floor(x2.r)) - (x1.r - Math.floor(x1.r))
                );
            const diff = Math.round((100 - mod.reduce((acc, curr) => acc + curr.r, 0)) * 10) / 10;
            return mod.map((v, i) => i === 0 ? v.v(v.r + diff) : v.v(v.r));
        };
        return values ? fn(values): fn;
    }

}
