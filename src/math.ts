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

    function lngamma(z: number):number {
        const g = 7;
        const p = [ // see https://en.wikipedia.org/wiki/Lanczos_approximation
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
        ];
        if (z < 0.5) {
            return Math.log(Math.PI / Math.sin(Math.PI * z)) - lngamma(1.0 - z);
        }
        z -= 1;
        let x = p[0];
        for (let i = 1; i < g + 2; i++) {
            x += p[i] / (z + i);
        }
        let t = z + g + 0.5;
        return Math.log(Math.sqrt(2 * Math.PI)) + Math.log(t) * (z + 0.5) - t + Math.log(x);
    }

    function incompleteGamma(s: number, x:number): number {
        if (x < 0.0) {
            return 0.0;
        }

        let sum = 1.0 / s;
        let term = sum;

        // Taylor expansion for the approx.
        for (let i = 1; i < 100; i++) {
            term = (term * x) / (s + i);
            sum += term;
            if (term < sum * 1e-15) break;
        }

        return sum * Math.exp(-x + s * Math.log(x) - lngamma(s));
    }

    /**
     * Goodness of fit chi-square test
     * @param {number[]} observed - Absolute observed values
     * @param {number[]} expectedProps - Relative expected ratios (0...1)
     * @param {number} alpha - Significance level threshold (default: 0.05)
     * @returns {object} Test results containing chi2 statistic, degrees of freedom, p-value, and significance
     */
    export function chiSquareTest(observed: Array<number>, expectedProps: Array<number>, alpha: number = 0.05):{
        chi2: number;
        df: number;
        pValue: number;
        isSignificant: boolean;
    } {
        const totalObserved = observed.reduce((a, b) => a + b, 0);

        let chi2 = 0;
        for (let i = 0; i < observed.length; i++) {
            const expected = expectedProps[i] * totalObserved;
            if (expected > 0) {
                chi2 += Math.pow(observed[i] - expected, 2) / expected;
            }
        }

        const df = observed.length - 1;

        const pValue = 1.0 - incompleteGamma(df / 2.0, chi2 / 2.0);

        return {
            chi2,
            df,
            pValue,
            isSignificant: pValue < alpha
        };
    }


    export function logLikelihoodTest(
        observed: Array<number>,
        expectedProps: Array<number>,
        alpha: number = 0.05
    ): {
        g2: number;
        df: number;
        pValue: number;
        isSignificant: boolean;
    } {
        const totalObserved = observed.reduce((a, b) => a + b, 0);

        let g2 = 0;
        for (let i = 0; i < observed.length; i++) {
            const expected = expectedProps[i] * totalObserved;
            const obs = observed[i];
            if (obs > 0 && expected > 0) {
                g2 += obs * Math.log(obs / expected);
            }
        }
        g2 *= 2;
        const df = observed.length - 1;
        const pValue = 1.0 - incompleteGamma(df / 2.0, g2 / 2.0);

        return {
            g2,
            df,
            pValue,
            isSignificant: pValue < alpha
        };
    }
}
