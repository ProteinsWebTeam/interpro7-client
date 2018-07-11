// @flow
import { EntryColorMode, getTrackColor, hexToRgb } from '.';

import config from 'config';

describe('getTrackColor', () => {
  const fallback = config.colors.get();
  const entry = {
    accession: 'IPR000001',
    source_database: 'InterPro',
  };

  test('no, or invalid, color mode', () => {
    // $FlowIgnore
    expect(getTrackColor(entry)).toBe(fallback);
    // $FlowIgnore
    expect(getTrackColor(entry, 'whatever')).toBe(fallback);
    expect(getTrackColor(entry, EntryColorMode.whatever)).toBe(fallback);
  });

  for (const colorModeKey of Object.keys(EntryColorMode)) {
    const colorMode = EntryColorMode[colorModeKey];
    test(colorMode, () => {
      expect(getTrackColor(entry, colorMode)).toMatchSnapshot();
    });
  }
});

describe('hexToRgb', () => {
  test('basic', () => {
    expect(hexToRgb('000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('00FF00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
  });

  test('invalid', () => {
    expect(hexToRgb('invalid')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#00000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('00000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('red')).toEqual({ r: 0, g: 0, b: 0 });
  });
});
