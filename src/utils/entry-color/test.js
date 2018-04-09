// @flow
import { EntryColorMode, getTrackColor } from '.';

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
});
