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
    
    export function color2str(c:RGBA):string {
        return c !== null ? `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})` : 'transparent';
    }
    
    export function textColorFromBg(bgColor:RGBA):RGBA {
        const color = bgColor ? bgColor : [255, 255, 255, 1];
        const lum = 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
        return lum > 128 ? [1, 1, 1, 1] : [231, 231, 231, 1];
    }
    
    export function importColor(color:string, opacity:number):RGBA {
        const fromHex = (pos:number) => parseInt(color.substr(2 * pos + 1, 2), 16);
        if (color.substr(0, 1) === '#') {
            return [
                fromHex(0),
                fromHex(1),
                fromHex(2),
                parseFloat(opacity.toFixed(1))
            ];
    
        } else if (color.toLowerCase().indexOf('rgb') === 0) {
            const srch = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*[\d\.]+)?\s*\)/i.exec(color);
            if (srch) {
                return [
                    parseInt(srch[1]),
                    parseInt(srch[2]),
                    parseInt(srch[3]),
                    parseFloat(opacity.toFixed(1))
                ];
    
            } else {
                throw new Error('Cannot import color ' + color);
            }
    
        } else {
            throw new Error('Cannot import color ' + color);
        }
    }
}