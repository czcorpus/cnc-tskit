
import { Color } from '../src/colors.js';
import { assert } from 'chai';
import { pipe } from '../src/index.js';

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

describe('Color#importColor', function () {

  it('imports hex color with hash prefix', function () {
    assert.deepEqual(Color.importColor(1, '#abcdef'), [171, 205, 239, 1]);
  });

  it('imports RGB triplet format', function () {
    assert.deepEqual(Color.importColor(1, 'RGB (171, 205, 239)'), [171, 205, 239, 1]);
  });

  it('imports RGB triplet format (lowercase)', function () {
    assert.deepEqual(Color.importColor(1, 'rgb (1, 2, 3)'), [1, 2, 3, 1]);
  });

  it('imports (incorrect) RGB quadruplet format, opacity ignored', function () {
    assert.deepEqual(Color.importColor(0.3, 'rgb (1, 2, 3, 0.5)'), [1, 2, 3, 0.3]);
  });

  it('imports RGBA quadruplet format, opacity applied', function () {
    assert.deepEqual(Color.importColor(0.3, 'rgba(1, 2, 3, 0.5)'), [1, 2, 3, 0.5]);
  });

});

describe('Color#hsl2Rgb', function () {

  it('converts a sample color with known result', function () {
    const [r, g, b] = Color.hsl2Rgb([0.5, 0.5, 0.5]);
    assert.equal(r, 64);
    assert.equal(g, 191);
    assert.equal(b, 191);
  });

  it('converts another sample color with known result', function () {
    const [r, g, b] = Color.hsl2Rgb([0.036, 0.23, 0.23]);
    assert.equal(r, 72);
    assert.equal(g, 51);
    assert.equal(b, 45);
  });

  it('converts white', function () {
    const [r, g, b] = Color.hsl2Rgb([1, 1, 1]);
    assert.equal(r, 255);
    assert.equal(g, 255);
    assert.equal(b, 255);
  });

  it('converts black', function () {
    const [r, g, b] = Color.hsl2Rgb([0, 0, 0]);
    assert.equal(r, 0);
    assert.equal(g, 0);
    assert.equal(b, 0);
  });


  it('converts pure red', function () {
    const [r, g, b] = Color.hsl2Rgb([0, 1, 0.5]);
    assert.equal(r, 255);
    assert.equal(g, 0);
    assert.equal(b, 0);
  });

  it('converts pure green', function () {
    const [r, g, b] = Color.hsl2Rgb([0.3333, 1, 0.5]);
    assert.equal(r, 0);
    assert.equal(g, 255);
    assert.equal(b, 0);
  });

});


describe('Color#hsl', function () {

  it('converts a color', function() {
    const [h, s, l] = Color.rgb2Hsl([210, 120, 80, 1]);
    assert.closeTo(h, 0.05, 0.005);
    assert.closeTo(s, 0.59, 0.005);
    assert.closeTo(l, 0.57, 0.005);
  });

  it('converts pure red', function() {
    const [h, s, l] = Color.rgb2Hsl([255, 0, 0, 1]);
    assert.closeTo(h, 0, 0.001);
    assert.closeTo(s, 1, 0.005);
    assert.closeTo(l, 0.5, 0.005);
  });

  it('converts pure green', function() {
    const [h, s, l] = Color.rgb2Hsl([0, 255, 0, 1]);
    assert.closeTo(h, 0.33, 0.005);
    assert.closeTo(s, 1, 0.005);
    assert.closeTo(l, 0.5, 0.005);
  });

  it('converts black', function() {
    const [h, s, l] = Color.rgb2Hsl([0, 0, 0, 1]);
    assert.closeTo(h, 0, 0.005);
    assert.closeTo(s, 0, 0.005);
    assert.closeTo(l, 0, 0.005);
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

describe('rgb2hex', function () {

  it('converts black', function () {
    assert.equal(Color.rgb2Hex([0, 0, 0, 0]), '#000000');
  });

  it('converts white', function () {
    assert.equal(Color.rgb2Hex([255, 255, 255, 0]), '#FFFFFF');
  });

  it('converts random color', function () {
    assert.equal(Color.rgb2Hex([61, 171, 51, 0]), '#3DAB33');
  });

  it('ignores opacity', function () {
    assert.isTrue(Color.rgb2Hex([14, 17, 176, 0]) === Color.rgb2Hex([14, 17, 176, 1]));
  });

  it('throws an error on ivalid rgba value', function () {
    assert.throws(function () {
      Color.rgb2Hex([61, 257, 51, 0])
    });
  });

});


describe('highlight', function () {

  it('generates proper values', function () {
    const v = Color.highlight(0.3, [140, 40, 50, 0.3]);
    console.log('v = ', v);
    assert.deepEqual(v, [216, 117, 127, 1]); // the color model conv. ignores alpha
  });

});