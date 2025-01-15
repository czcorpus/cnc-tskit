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



import { Strings } from '../src/string.js';
import { assert } from 'chai';


describe('Strings#shortenText', function () {

    it('handles zero input', function () {
        const short = Strings.shortenText('   ', 2, '');
        assert.equal(short, '');
    });

    it('handles short text', function () {
        const short = Strings.shortenText(' hi people  ', 100, '');
        assert.equal(short, 'hi people');
    });

    it('can take exact size if input matches', function () {
        //            01234567890123456789012345
        const text = 'lorem ipsum dolor sit amet';
        const short = Strings.shortenText(text, 17, '');
        assert.equal(short, 'lorem ipsum dolor');
        const short2 = Strings.shortenText(text, 18, '');
        assert.equal(short2, 'lorem ipsum dolor');
    });

    it('does not force an additional word to prevent overflow', function () {
        //            01234567890123456789012345
        const text = 'lorem ipsum dolor sit amet';
        const short = Strings.shortenText(text, 13, '');
        assert.equal(short, 'lorem ipsum');
    });

    it('cuts too long word', function () {
        const text = 'loremipsumdolorsitamet';
        const short = Strings.shortenText(text, 3, '');
        assert.equal(short, 'lor');
    });

    it('does not care about whitespace', function () {
        //            01234567890123456789012345
        const text = 'lorem              ipsum         dolor        sit     amet';
        const short = Strings.shortenText(text, 13, '');
        assert.equal(short, 'lorem ipsum');
    });

    it('default suffix works', function () {
        const text = 'lorem ipsum';
        const short = Strings.shortenText(text, 6);
        assert.equal(short, 'lorem\u2026');
    });

    it('custom suffix words', function () {
        const text = 'lorem ipsum';
        const short = Strings.shortenText(text, 6, ' etc.');
        assert.equal(short, 'lorem etc.');
    });

    it('suffix not used in case not necessary', function () {
        const short = Strings.shortenText('the people', 10, '_');
        assert.equal(short, 'the people');
    });
});


describe('Strings#substitute', function () {

    it('works with a regular string and multiple substitutions', function () {
        const s = 'This is the {}th attempt to resolve this {}';
        assert.strictEqual(Strings.substitute(s, 9, 'issue'), 'This is the 9th attempt to resolve this issue');
    });

    it('ignores escaped braces', function () {
        const s = 'Hi {} of {{}}'
        assert.strictEqual(Strings.substitute(s, 'people'), 'Hi people of {}');
    });

    it('uses empty strings if there is more {}\'s than values', function () {
        const s = 'One {} {}.'
        assert.strictEqual(Strings.substitute(s, 'two'), 'One two .');
    });

    it('ignores spare values', function () {
        const s = '{}'
        assert.strictEqual(Strings.substitute(s, 'one', 'two', 'three'), 'one');
    });

    it('supports function as value', function () {
        const s = 'zero {}, one {}, two is 2'
        const ans = Strings.substitute(
            s,
            i => 'is ' + i,
            i => 'is ' + i
        );
        assert.strictEqual(ans, 'zero is 0, one is 1, two is 2');
    });
});


describe('Strings#overwriteStringFromRight', function () {

    it('works with overwrite shorter than orig', function () {
        assert.strictEqual(Strings.overwriteStringFromRight('0123456789', 'foo'), '0123456foo');
    });

    it('works with overwrite longer than orig', function () {
        assert.strictEqual(Strings.overwriteStringFromRight('0123456789', 'foo_and_bar_and_baz'), 'ar_and_baz');
    });

    it('works with overwrite of the same size as orig', function () {
        assert.strictEqual(Strings.overwriteStringFromRight('0123456789', 'foo_and_ba'), 'foo_and_ba');
    });

    it('works with empty overwrite', function () {
        assert.strictEqual(Strings.overwriteStringFromRight('0123456789', ''), '0123456789');
    });

    it('works with empty orig', function () {
        assert.strictEqual(Strings.overwriteStringFromRight('', 'foo'), '');
    });

});


describe('Strings#overwriteStringFromLeft', function () {

    it('works with overwrite shorter than orig', function () {
        assert.strictEqual(Strings.overwriteStringFromLeft('0123456789', 'foo'), 'foo3456789');
    });

    it('works with overwrite longer than orig', function () {
        assert.strictEqual(Strings.overwriteStringFromLeft('0123456789', 'foo_and_bar_and_baz'), 'foo_and_ba');
    });

    it('works with overwrite of the same size as orig', function () {
        assert.strictEqual(Strings.overwriteStringFromLeft('0123456789', 'foo_and_ba'), 'foo_and_ba');
    });

    it('works with empty overwrite', function () {
        assert.strictEqual(Strings.overwriteStringFromLeft('0123456789', ''), '0123456789');
    });

    it('works with empty orig', function () {
        assert.strictEqual(Strings.overwriteStringFromLeft('', 'foo'), '');
    });

});


describe('Stdrings#escapeRegexp', function () {
//[\-\\^$*+?.()|[\]{}]
    it('escapes square brackets', function () {
        assert.strictEqual(Strings.escapeRegexp('a[0] = 10'), 'a\\[0\\] = 10');
    });

    it('escapes curly brackets', function () {
        assert.strictEqual(Strings.escapeRegexp('set: {0, 1, 2, 3}'), 'set: \\{0, 1, 2, 3\\}');
    });

    it('escapes parentheses', function () {
        assert.strictEqual(Strings.escapeRegexp('good (or even the best) thing'), 'good \\(or even the best\\) thing');
    });

    it('escapes dot, plus, star', function () {
        assert.strictEqual(Strings.escapeRegexp('I give it ***. 1 + 2'), 'I give it \\*\\*\\*\\. 1 \\+ 2');
    });

    it('escapes pipe, dash, backslash', function () {
        assert.strictEqual(Strings.escapeRegexp('foo|bar - \\location'), 'foo\\|bar \\- \\\\location');
    });

    it('escapes dollar, caret, question mark', function () {
        assert.strictEqual(Strings.escapeRegexp('What is X^Y? The $ is OK'), 'What is X\\^Y\\? The \\$ is OK');
    });
})
