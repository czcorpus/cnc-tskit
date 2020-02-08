
import { Color } from '../src/colors';
import { assert } from 'chai';

describe('Color functions', () => {
  it('returns proper RGBA string for a valid example', () => {
    assert.equal(Color.color2str([23, 137, 55, .07]), 'rgba(23, 137, 55, 0.07)');
  });
});
