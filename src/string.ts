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

    export function shortenText(text:string, maxLength:number):string {
        const ans:Array<string> = text.split(/\s+/).filter(v =>  !!v);
        let total = ans.length > 0 ? ans[0].length : 0;
        for (let i = 1; i < ans.length; i++) {
            if (total + 1 + ans[i].length > maxLength) {
                ans.splice(i);
                return ans.join(' ');
            }
            total += 1 + ans[i].length;
        }
        return ans.join(' ').substr(0, maxLength);
    }
}