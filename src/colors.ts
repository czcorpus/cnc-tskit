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

export namespace Color {

    export type RGBA = [number, number, number, number];

    export function color2str():(c:RGBA)=>string;
    export function color2str(c:RGBA):string;
    export function color2str(c?:RGBA):any {
        const fn = (c2:RGBA) => c2 !== null ? `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, ${c2[3]})` : 'transparent';
        return c ? fn(c) : fn;
    }

    export function textColorFromBg():(bgColor:RGBA)=>RGBA;
    export function textColorFromBg(bgColor:RGBA):RGBA;
    export function textColorFromBg(bgColor?:RGBA):any {
        const fn = (bgColor2) => {
            const color = bgColor2 ? bgColor2 : [255, 255, 255, 1];
            const lum = 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
            return lum > 128 ? [1, 1, 1, 1] : [231, 231, 231, 1];
        };
        return bgColor ? fn(bgColor) : fn;
    }

    /**
     * Set luminosity where value 1 = leave unchanged, 1.5 = add 50%,
     * 0.5 = remove 50% etc.
     * @param color
     * @param value
     */
    export function luminosity(value:number, color:RGBA):RGBA;
    export function luminosity(value:number):(color:RGBA)=>RGBA;
    export function luminosity(value:number, color?:RGBA):any {
        const fn = (color2:RGBA):RGBA => {
            if (value < 0) {
                throw new Error('Cannot use negative luminosity');
            }
            const ans:RGBA = [color2[0], color2[1], color2[2], color2[3]];
            for (let i = 0; i < 3; i++) {
                ans[i] = Math.round(Math.min(255, color2[i] * value));
            }
            return ans;
        };
        return color ? fn(color) : fn;
    }

    export function importColor(opacity:number, color:string):RGBA;
    export function importColor(opacity:number):(color:string)=>RGBA;
    export function importColor(opacity:number, color?:string):any {
        const fn = (color2:string):RGBA => {
            const fromHex = (pos:number) => parseInt(color2.substr(2 * pos + 1, 2), 16);
            if (color2.substr(0, 1) === '#') {
                return [
                    fromHex(0),
                    fromHex(1),
                    fromHex(2),
                    parseFloat(opacity.toFixed(1))
                ];

            } else if (color2.toLowerCase().indexOf('rgb') === 0) {
                const srch = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d\.]+)?\s*\)/i.exec(color2);
                if (srch) {
                    return [
                        parseInt(srch[1]),
                        parseInt(srch[2]),
                        parseInt(srch[3]),
                        parseFloat(opacity.toFixed(1))
                    ];

                } else {
                    throw new Error('Cannot import color ' + color2);
                }

            } else {
                throw new Error('Cannot import color ' + color2);
            }
        };
        return color ? fn(color) : fn;
    }

    /**
     * Convert 0..1, 0..1, 0..1 encoded HSL color to RGB.
     * The algorithm is taken from
     * https://www.w3.org/TR/css-color-3/#hsl-color
     */
    export function hsl2Rgb(hsl:[number, number, number]):RGBA;
    export function hsl2Rgb():(hsl:[number, number, number])=>RGBA;
    export function hsl2Rgb(hsl?:[number, number, number]):any {

        const hue2rgb = (m1:number, m2:number, h:number):number => {
            if (h < 0) {
                h += 1;

            } else if (h > 1) {
                h -= 1;
            }
            if (6 * h < 1) {
                return m1 + (m2 - m1) * 6 * h;
            }
            if (2 * h < 1) {
                return m2;
            }
            if (3 * h < 2) {
                return m1 + (m2 - m1) * (2/3 - h) * 6;
            }
            return m1;
        };

        const norm = (v:[number, number, number]):RGBA => {
            return [
                Math.round(v[0] * 255),
                Math.round(v[1] * 255),
                Math.round(v[2] * 255),
                1
            ];
        }

        const fn = (hsl2:[number, number, number]) => {
            const [hue, sat, lgt] = hsl2;
            const m2 = lgt < 0.5 ? lgt * (1 + sat) : lgt + sat - lgt * sat;
            const m1 = 2 * lgt - m2;
            return norm([
                hue2rgb(m1, m2, hue + 1/3),
                hue2rgb(m1, m2, hue),
                hue2rgb(m1, m2, hue - 1/3)
            ]);
        };
        return hsl ? fn(hsl) : fn;
    }


    /**
     * Convert RGB value to HSL (0..1, 0..1, 0..1)
     */
    export function rgb2Hsl(rgb:RGBA):[number, number, number];
    export function rgb2Hsl():(rgb:RGBA)=>[number, number, number];
    export function rgb2Hsl(rgb?:RGBA):any {
        const fn = (rgb2:RGBA) => {
            const [nr, ng, nb] = rgb2.map(v => v / 255);
            const min = Math.min(nr, ng, nb);
            const max = Math.max(nr, ng, nb);
            const delta = max - min;
            const lum = (max + min) / 2;

            if (min === max) {
                return [0, 0, (max + min) / 2];

            } else {
                const sat = delta / (1 - Math.abs(2 * lum - 1));
                const calc = [
                    () => (ng - nb) / delta + (ng < nb ? 6 : 0),
                    () => 2.0 + (nb - nr) / delta,
                    () => 4.0 + (nr - ng) / delta
                ];
                const srch = rgb2.reduce((acc, v, i) => v > acc.max ? {max: v, i: i} : acc, {max: 0, i: 0});
                const hue = calc[srch.i]() * 60 / 360;
                return [hue, sat, lum];
            }
        };
        return rgb ? fn(rgb) : fn;
    }
}