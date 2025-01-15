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



import { Maths } from '../src/math.js';
import { assert } from 'chai';


describe('Maths#roundToPos', function () {

    it('rounds properly numbers', function () {
        assert.equal(Maths.roundToPos(3.275, 2), 3.28);
        assert.equal(Maths.roundToPos(3.274, 2), 3.27);
        assert.equal(Maths.roundToPos(0.009, 1), 0);
    });
});


describe('Maths#wilsonConfInterval', function () {

    it('works for some examples', function () {
        const [v1, v2] = Maths.wilsonConfInterval(17, 200, Maths.AlphaLevel.LEVEL_5);
        assert.closeTo(v1, 0.0537, 0.001);
        assert.closeTo(v2, 0.1319, 0.001);

        const [v1b, v2b] = Maths.wilsonConfInterval(478, 1500, Maths.AlphaLevel.LEVEL_10);
        assert.closeTo(v1b, 0.2992, 0.001);
        assert.closeTo(v2b, 0.3388, 0.001);
    });
});


describe('Maths#calcPercentRatios', function () {

    it('works on example data', function () {
        const ans = Maths.calcPercentRatios(
            v => v.tickets,
            (v, ratio) => ({name: v.name, ratio: ratio}),
            [
                {name: 'A', tickets: 27},
                {name: 'B', tickets: 23},
                {name: 'C', tickets: 3},
                {name: 'D', tickets: 41},
                {name: 'E', tickets: 15}
            ]
        );
        assert.deepEqual(ans.sort((v1, v2) => v2.ratio - v1.ratio), [
            {name: 'D', ratio: 37.6},
            {name: 'A', ratio: 24.7},
            {name: 'B', ratio: 21.1},
            {name: 'E', ratio: 13.8},
            {name: 'C', ratio: 2.8}
        ]);

        // this is quite redundant but to make the intent clear:
        assert.equal(ans.reduce((acc, curr) => acc + curr.ratio, 0), 100);
    });
});