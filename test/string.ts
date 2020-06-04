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



import { Strings } from '../src/string';
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
    })
});
