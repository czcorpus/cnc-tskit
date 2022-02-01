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

export namespace Strings {

    export function shortenText(text:string, maxLength:number, suff:string='\u2026'):string {
        const ans:Array<string> = text.split(/\s+/).filter(v =>  !!v);
        let total = ans.length > 0 ? ans[0].length : 0;
        for (let i = 1; i < ans.length; i++) {
            if (total + 1 + ans[i].length > maxLength) {
                ans.splice(i);
                return ans.join(' ') + suff;
            }
            total += 1 + ans[i].length;
        }
        const s = ans.join(' ');
        return s.length <= maxLength ? s : s.substr(0, maxLength) + suff;
    }

    /**
     * Replace all the occurrences of '{}' with provided arguments.
     * Behavior details:
     *  - in case there is more '{}'s than actual values the rest will be replaced
     *    by empty strings
     *  - in case there is more values than '{}' the rest of values is ignored
     *  - in case the value is a function then it will be evaluated
     *    passing it the index (0-based) of a respective '{}' occurrence
     *  - to write actual '{}', just escape the braces with backslashes
     *  - null and undefined are interpreted as empty strings
     * Please note there are no advanced formatting options possible here
     * (e.g. like in Python str.format, sprintf etc.).
     */
    export function substitute(
        template:string,
        ...values:Array<string|number|boolean|((i:number)=>string|number|boolean)>
    ):string {

        let i = -1;
        return template.replace(/{{}}/g, '\\{\\}').replace(
            /{}/g,
            () => {
                i += 1;
                const value = values[i];
                const replacement = typeof value === 'function' ? value(i) : value;
                return replacement !== null && replacement !== undefined ?
                    replacement + '' : '';
            }
        ).replace(/\\{\\}/g, '{}');
    }

    /**
     * Overwrite string 'orig' by a string 'overwrite' starting from right. In case
     * the 'overwrite' is longer than the 'orig' only a respective suffix of 'overwrite'
     * is used so the final size of the string is always equal to the size of 'orig'.
     */
    export function overwriteStringFromRight(orig:string, overwrite:string):string {
        const ans:Array<string> = [];
        for (let i = 0; i < Math.max(orig.length - overwrite.length, 0); i++) {
            ans.push(orig[i]);
        }
        for (let i = Math.max(overwrite.length - orig.length, 0); i < overwrite.length; i++) {
            ans.push(overwrite[i]);
        }
        return ans.join('');
    }

    /**
     * Overwrite string 'orig' by a string 'overwrite' starting from left. In case
     * the 'overwrite' is longer than the 'orig' only a respective prefix of 'overwrite'
     * is used so the final size of the string is always equal to the size of 'orig'.
     */
     export function overwriteStringFromLeft(orig:string, overwrite:string):string {
        const ans:Array<string> = [];
        for (let i = 0; i < Math.min(orig.length, overwrite.length); i++) {
            ans.push(overwrite[i]);
        }
        for (let i = Math.min(orig.length, overwrite.length); i < orig.length ; i++) {
            ans.push(orig[i]);
        }

        return ans.join('');
    }
}