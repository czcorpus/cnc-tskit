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

export namespace Keyboard {

    export enum Code {
        ENTER = 13,
        ESC = 27,
        TAB = 9,
        DOWN_ARROW = 40,
        UP_ARROW = 38,
        LEFT_ARROW = 37,
        RIGHT_ARROW = 39,
        BACKSPACE = 8,
        DEL = 46,
        HOME = 36,
        END = 35
    }

    export function isArrowKey(code:number):boolean {
        return code === Code.UP_ARROW || code === Code.DOWN_ARROW ||
                code === Code.LEFT_ARROW || code === Code.RIGHT_ARROW;
    }
}