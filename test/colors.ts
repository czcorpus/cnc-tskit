
import { Color } from '../src/colors';
import { assert } from 'chai';
import { pipe } from '../src/index';

describe('Color#color2str', function () {

  it('returns proper RGBA string for a valid example', function () {
    assert.equal(Color.color2str([23, 137, 55, .07]), 'rgba(23, 137, 55, 0.07)');
  });

});

describe('Color#luminosity', function () {

  it('converts 128, 128, 128 to half luminosity', function () {
    assert.deepEqual(Color.luminosity(0.5, [128, 128, 128, 1]), [64, 64, 64, 1]);
  });

  it('converts 128, 128, 128 to + 1/2 luminosity', function () {
    assert.deepEqual(Color.luminosity(1.5, [128, 128, 128, 1]), [192, 192, 192, 1]);
  });

  it('does not overflow to negative values', function () {
    assert.deepEqual(Color.luminosity(0, [128, 128, 128, 1]), [0, 0, 0, 1]);
  });

  it('does not accept negative values', function () {
    assert.throws(function () {
      Color.luminosity(-3, [10, 10, 10, 1]);
    });
  });

});

describe('Color pipeability', function () {

  it('allows piping color operations together', function () {
    const x = pipe(
      '#58D68D',
      Color.importColor(0.7),
      Color.luminosity(1.5),
      Color.color2str()
    );
    assert.equal(x, 'rgba(132, 255, 212, 0.7)');
  });

});