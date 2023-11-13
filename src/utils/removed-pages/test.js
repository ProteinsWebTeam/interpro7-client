import { doesObjectFits, doesArrayFits } from './index.ts';

describe('removed pages', () => {
  test('object fits', () => {
    expect(doesObjectFits({}, {})).toBe(true);
    expect(doesObjectFits({ key: 'value' }, { key: 'value' })).toBe(true);
    expect(
      doesObjectFits({ key: 'value', key2: 'value2' }, { key: 'value' }),
    ).toBe(true);
    expect(
      doesObjectFits({ key: { key: 'value' } }, { key: { key: 'value' } }),
    ).toBe(true);
    expect(
      doesObjectFits(
        { key: { key: 'value', key2: 'value2' } },
        { key: { key: 'value' } },
      ),
    ).toBe(true);
    expect(
      doesObjectFits({ key: ['value', 'value2'] }, { key: ['value'] }),
    ).toBe(true);
  });

  test('object does not fits', () => {
    expect(
      doesObjectFits({ key: 'value' }, { key: 'value', key2: 'value2' }),
    ).toBe(false);
    expect(
      doesObjectFits(
        { key: { key: 'value' } },
        { key: { key: 'value', key2: 'value2' } },
      ),
    ).toBe(false);
    expect(
      doesObjectFits(
        { key: { key: 'value', key2: 'value2' } },
        { key: ['value'] },
      ),
    ).toBe(false);
    expect(
      doesObjectFits({ key: ['value2', 'value1'] }, { key: ['value'] }),
    ).toBe(false);
  });

  test('array does fits', () => {
    expect(doesArrayFits([], [])).toBe(true);
    expect(doesArrayFits(['value'], ['value'])).toBe(true);
    expect(doesArrayFits(['value', 'value2'], ['value'])).toBe(true);
    expect(doesArrayFits([{ key: 'value' }], [{ key: 'value' }])).toBe(true);
    expect(doesArrayFits([['value']], [['value']])).toBe(true);
    expect(doesArrayFits([['value', 'value2']], [['value']])).toBe(true);
  });

  test('array does NOT fits', () => {
    expect(doesArrayFits(['value'], ['value', 'value2'])).toBe(false);
    expect(doesArrayFits([['value2']], [['value']])).toBe(false);
    expect(doesArrayFits([['value2', 'value']], [['value']])).toBe(false);
    expect(doesArrayFits([['value']], [['value', 'value2']])).toBe(false);
    expect(
      doesArrayFits([{ key: 'value' }], [{ key: 'value', key2: 'value2' }]),
    ).toBe(false);
  });
});
