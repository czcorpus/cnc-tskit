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

export namespace Time {

    /**
     * Convert a number of seconds to a formatted string
     * hh:mm:ss. Supports also negative values.
     */
    export function secs2hms():(s:number)=>string;
    export function secs2hms(s:number):string;
    export function secs2hms(s?:number):any {
        const fn = (s2:number) => {
            const sgn = s2 < 0 ? '-' : '';
            const s3 = Math.abs(s2);
            const h = Math.floor(s3 / 3600);
            const m = Math.floor((s3 % 3600) / 60);
            const s = s3 % 60;
            const lz = (v:number) => v < 10 ? `0${v.toFixed()}` : v.toFixed();
            return `${sgn}${lz(h)}:${lz(m)}:${lz(s)}`;
        };
        return s !== undefined ? fn(s) : fn;
    }

}
