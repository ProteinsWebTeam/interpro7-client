// @flow
import { getLiteratureIdsFromDescription } from '.';

describe('getLiteratureIdsFromDescription', () => {
  test('description without cites', () => {
    const decriptions = [
      '* Just text',
      '* Some text, some tags []',
      '* Some tag for something else with PUB [some:PUB12]',
      '* Some cite tag without PUB [cite:XXX]',
      '* Some cite:PUB but without the tags [] cite:PUB021',
    ];
    for (const description of decriptions) {
      expect(getLiteratureIdsFromDescription([description])).toHaveLength(0);
    }
  });
  test('description with cites', () => {
    const decriptions = [
      ['* Single cite [[cite:PUB0123]]', 1],
      ['* 2 cites in same block [[cite:PUB0123], [cite:PUB0124]]', 2],
      [
        '* 2 cites in different block [[cite:PUB0123]] and  [[cite:PUB0124]]',
        2,
      ],
    ];
    for (const [description, n] of decriptions) {
      const ids = getLiteratureIdsFromDescription([description]);
      expect(ids).toHaveLength(n);
      for (const id of ids) {
        expect(id).toMatch(/^PUB\d+$/);
      }
    }
  });
});
