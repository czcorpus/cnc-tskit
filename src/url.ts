/*
 * Copyright 2020 Martin Zimandl <martin.zimandl@gmail.com>
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

export namespace URL {

    export function join(...path:string[]):string {
        return path.length === 1 ?
            path[0] :
            path.slice(1).reduce(
                (acc, curr) => {
                    const part1 = acc.endsWith('/') ? acc.slice(0, acc.length - 1) : acc;
                    const part2 = curr.startsWith('/') ? curr.slice(1) : curr;
                    return `${part1}/${part2}`;
                },
                path[0]
            );
    }

}
