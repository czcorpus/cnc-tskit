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


describe('Maths#chiSquareTest', function () {

    it('correctly tests a fair die (non-significant)', function () {
        // Test values verified with scipy.stats.chisquare
        const result = Maths.chiSquareTest(
            [14, 18, 12, 16, 20, 20],
            [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]
        );
        assert.equal(result.df, 5);
        assert.closeTo(result.chi2, 3.2, 0.001);
        assert.closeTo(result.pValue, 0.669183, 0.001);
        assert.isFalse(result.isSignificant);
    });

    it('correctly tests a coin flip with slight bias (borderline)', function () {
        // Test values verified with scipy.stats.chisquare
        const result = Maths.chiSquareTest(
            [60, 40],
            [0.5, 0.5]
        );
        assert.equal(result.df, 1);
        assert.closeTo(result.chi2, 4.0, 0.001);
        assert.closeTo(result.pValue, 0.0455, 0.001);
        assert.isTrue(result.isSignificant);
    });

    it('correctly identifies significantly different distribution', function () {
        // Test values verified with scipy.stats.chisquare
        const result = Maths.chiSquareTest(
            [50, 10, 5, 35],
            [0.25, 0.25, 0.25, 0.25]
        );
        assert.equal(result.df, 3);
        assert.closeTo(result.chi2, 54.0, 0.001);
        assert.closeTo(result.pValue, 0.0, 0.00001);
        assert.isTrue(result.isSignificant);
    });

    it('correctly handles perfect fit', function () {
        // Test values verified with scipy.stats.chisquare
        const result = Maths.chiSquareTest(
            [25, 25, 25, 25],
            [0.25, 0.25, 0.25, 0.25]
        );
        assert.equal(result.df, 3);
        assert.closeTo(result.chi2, 0.0, 0.001);
        assert.closeTo(result.pValue, 1.0, 0.001);
        assert.isFalse(result.isSignificant);
    });

    it('correctly computes for non-uniform expected distribution', function () {
        // Test with non-uniform expected distribution
        const result = Maths.chiSquareTest(
            [30, 40, 30],
            [0.3, 0.4, 0.3]
        );
        assert.equal(result.df, 2);
        assert.closeTo(result.chi2, 0.0, 0.001);
        assert.closeTo(result.pValue, 1.0, 0.001);
        assert.isFalse(result.isSignificant);
    });

    it('respects custom alpha threshold', function () {
        const result1 = Maths.chiSquareTest(
            [60, 40],
            [0.5, 0.5],
            0.01  // More stringent threshold
        );
        assert.closeTo(result1.pValue, 0.0455, 0.001);
        assert.isFalse(result1.isSignificant);  // p=0.0455 > 0.01

        const result2 = Maths.chiSquareTest(
            [60, 40],
            [0.5, 0.5],
            0.1  // More lenient threshold
        );
        assert.closeTo(result2.pValue, 0.0455, 0.001);
        assert.isTrue(result2.isSignificant);  // p=0.0455 < 0.1
    });
});


describe('Maths#logLikelihoodTest', function () {

    it('correctly tests a fair die (non-significant)', function () {
        // Test values verified with implementation
        const result = Maths.logLikelihoodTest(
            [14, 18, 12, 16, 20, 20],
            [1/6, 1/6, 1/6, 1/6, 1/6, 1/6]
        );
        assert.equal(result.df, 5);
        assert.closeTo(result.g2, 3.284, 0.01);
        assert.closeTo(result.pValue, 0.656, 0.01);
        assert.isFalse(result.isSignificant);
    });

    it('correctly tests a coin flip with slight bias (borderline)', function () {
        // Test values verified with implementation
        const result = Maths.logLikelihoodTest(
            [60, 40],
            [0.5, 0.5]
        );
        assert.equal(result.df, 1);
        assert.closeTo(result.g2, 4.027, 0.01);
        assert.closeTo(result.pValue, 0.0448, 0.001);
        assert.isTrue(result.isSignificant);
    });

    it('correctly identifies significantly different distribution', function () {
        // Test values verified with implementation
        const result = Maths.logLikelihoodTest(
            [50, 10, 5, 35],
            [0.25, 0.25, 0.25, 0.25]
        );
        assert.equal(result.df, 3);
        assert.closeTo(result.g2, 58.448, 0.01);
        assert.closeTo(result.pValue, 0.0, 0.00001);
        assert.isTrue(result.isSignificant);
    });

    it('correctly handles perfect fit', function () {
        // Test values verified with scipy.stats.power_divergence (lambda_='log-likelihood')
        const result = Maths.logLikelihoodTest(
            [25, 25, 25, 25],
            [0.25, 0.25, 0.25, 0.25]
        );
        assert.equal(result.df, 3);
        assert.closeTo(result.g2, 0.0, 0.001);
        assert.closeTo(result.pValue, 1.0, 0.001);
        assert.isFalse(result.isSignificant);
    });

    it('correctly computes for non-uniform expected distribution', function () {
        // Test with non-uniform expected distribution
        const result = Maths.logLikelihoodTest(
            [30, 40, 30],
            [0.3, 0.4, 0.3]
        );
        assert.equal(result.df, 2);
        assert.closeTo(result.g2, 0.0, 0.001);
        assert.closeTo(result.pValue, 1.0, 0.001);
        assert.isFalse(result.isSignificant);
    });

    it('respects custom alpha threshold', function () {
        const result1 = Maths.logLikelihoodTest(
            [60, 40],
            [0.5, 0.5],
            0.01  // More stringent threshold
        );
        assert.closeTo(result1.pValue, 0.0448, 0.001);
        assert.isFalse(result1.isSignificant);  // p=0.0448 > 0.01

        const result2 = Maths.logLikelihoodTest(
            [60, 40],
            [0.5, 0.5],
            0.1  // More lenient threshold
        );
        assert.closeTo(result2.pValue, 0.0448, 0.001);
        assert.isTrue(result2.isSignificant);  // p=0.0448 < 0.1
    });

    it('handles zero observed values gracefully', function () {
        // When observed value is 0, log(obs/expected) term is skipped
        const result = Maths.logLikelihoodTest(
            [0, 50, 50],
            [1/3, 1/3, 1/3]
        );
        assert.equal(result.df, 2);
        assert.isTrue(result.g2 > 0);  // Should still compute a positive statistic
        assert.isTrue(result.isSignificant);  // Should detect significant difference
    });
});