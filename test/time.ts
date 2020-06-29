
import { Time } from '../src/time';
import { assert } from 'chai';
import { pipe } from '../src/index';

describe('Time#secs2hms', function () {

  it('returns time string for a valid example', function () {
    assert.equal(Time.secs2hms(12345), '03:25:45');
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
