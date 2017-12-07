// @flow
import getEmptyDescription from '.';

describe('getEmptyDescription', () => {
  test('should return new empty description object', () => {
    expect(getEmptyDescription()).toMatchSnapshot();
  });

  test('should return new objects every time', () => {
    const d1 = getEmptyDescription();
    const d2 = getEmptyDescription();
    expect(d1).toEqual(d2);
    expect(d1).not.toBe(d2);
    for (const [key, value] of Object.entries(d1)) {
      expect(value).toEqual(d2[key]);
      expect(value).not.toBe(d2[key]);
    }
  });
});
