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

export namespace Ident {

    const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let uiCounter = 0;

    function numToString(v:number):string {
        const ans:Array<string> = [];
        while (v > 0) {
            ans.push(ALPHABET[v % ALPHABET.length]);
            v = Math.floor(v / ALPHABET.length);
        }
        return ans.join('');
    }

    /**
     * Create unique id
     */
    export function puid():string {
        const v = uiCounter;
        uiCounter += 1;
        return (
            numToString(new Date().getTime() + v) + numToString(Math.random() * 1e14)
        ).substr(0, 14);
    }

    /**
     * Create insecure hash code out of a provided string
     * @param s
     */
    export function hashCode(s:string):string {
        if (s.length == 0) {
            return '';
        }
        let hash = 0;
        for (let i = 0; i < s.length; i++) {
            const char = s.charCodeAt(i);
            hash = ( (hash << 5 ) - hash) + char;
        }
        return numToString(Math.abs(hash));
    }
}