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
 * distributed under the License is distributed on an "AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export namespace Keyboard {

    /**
     * @deprecated
     */
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

    export enum Value {
        UNIDENTIFIED = 'Unidentified',

        // modifier keys
        ALT = 'Alt',
        ALT_GR = 'AltGraph',
        CAPS_LOCK = 'CapsLock',
        CTRL = 'Control',
        FN = 'Fn',
        FN_LOCK = 'FnLock',
        HYPER = 'Hyper',
        META = 'Meta',
        NUM_LOCK = 'NumLock',
        SCROLL_LOCK = 'ScrollLock',
        SHIFT = 'Shift',
        SUPER = 'Super',
        SYMBOL = 'Symbol',
        SYMBOL_LOCK = 'SymbolLock',

        // whitespace keys
        ENTER = 'Enter',
        TAB = 'Tab',
        SPACE = ' ',

        // navigation keys
        DOWN_ARROW = 'ArrowDown',
        UP_ARROW = 'ArrowUp',
        LEFT_ARROW = 'ArrowLeft',
        RIGHT_ARROW = 'ArrowRight',
        END = 'End',
        HOME = 'Home',
        PG_DOWN = 'PageDown',
        PG_UP = 'PageUp',

        // editing keys
        BACKSPACE = 'Backspace',
        CLEAR = 'Clear',
        COPY = 'Copy',
        CURSOR_SEL = 'CrSel',
        CUT = 'Cut',
        DEL = 'Delete',
        ERASE_EOF = 'EraseEof',
        EXTEND_SEL = 'ExSel',
        INSERT = 'Insert',
        PASTE = 'Paste',
        REDO = 'Redo',
        UNDO = 'Undo',

        // UI keys
        ACCEPT = 'Accept',
        AGAIN = 'Again',
        ATTENTION = 'Attn',
        CANCEL = 'Cancel',
        CTX_MENU = 'ContextMenu',
        ESC = 'Escape',
        EXECUTE = 'Execute',
        FIND = 'Find',
        HELP = 'Help',
        PAUSE = 'Pause',
        PLAY = 'Play',
        PROPS = 'Props',
        SELECT = 'Select',
        ZOOM_IN = 'ZoomIn',
        ZOOM_OUT = 'ZoomOut'
    }

    /**
     * Test whether the provided value matches an arrow key (up, down, left, right)
     */
    export function isArrowKey(value:string):boolean;
    /**
     * @deprecated
     */
    export function isArrowKey(code:number):boolean;
    export function isArrowKey(v:number|string):boolean {
        if (typeof v === 'number') {
            return v === Code.UP_ARROW || v === Code.DOWN_ARROW ||
                    v === Code.LEFT_ARROW || v === Code.RIGHT_ARROW;
        }
        return v === Value.UP_ARROW || v === Value.DOWN_ARROW ||
                v === Value.LEFT_ARROW || v === Value.RIGHT_ARROW;

    }
}