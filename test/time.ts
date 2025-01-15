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


import { Time } from '../src/time.js';
import { assert } from 'chai';
import { pipe } from '../src/index.js';

describe('Time#secs2hms', function () {

  it('returns time string for a valid example', function () {
    assert.equal(Time.secs2hms(12345), '03:25:45');
  });

  it('returns a correct result for 0', function () {
    assert.equal(Time.secs2hms(0), '00:00:00');
  });

  it('returns a correct result for a negative value', function () {
    assert.equal(Time.secs2hms(-768), '-00:12:48');
  });

  it('allows piping', function () {
    assert.equal(
      pipe(
        12345,
        Time.secs2hms()
      ),
      '03:25:45'
    );
  });

});
