// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import {
  IPScanSearch,
  checkValidity,
  isTooShort,
  cleanUp,
  MAX_NUMBER_OF_SEQUENCES,
} from '.';

jest.mock('draft-js/lib/generateRandomKey', () => () => '123');

const renderer = new ShallowRenderer();

describe('<IPScanSearch />', () => {
  test('should render', () => {
    renderer.render(
      <IPScanSearch
        createJob={() => {}}
        goToCustomLocation={() => {}}
        ipScan={{
          hostname: 'www.ebi.ac.uk',
          port: '443',
          protocol: 'https:',
          root: '/Tools/services/rest/iprscan5/',
        }}
        value={''}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
const seq = `
>testing
tgcatgcatgtca
gcatgcat`;

describe('checkValidity()', () => {
  test('valid text', () => {
    expect(checkValidity(seq.split('\n'))).toEqual(true);
    expect(isTooShort(seq.split('\n'))).toEqual(false);
  });
  test('other char', () => {
    expect(checkValidity(`${seq}4`.split('\n'))).toEqual(false);
    expect(checkValidity(`${seq}-`.split('\n'))).toEqual(false);
    expect(checkValidity(`${seq}.`.split('\n'))).toEqual(false);
    expect(isTooShort(`${seq}4`.split('\n'))).toEqual(false);
  });
  test('too short', () => {
    expect(checkValidity(['A'])).toEqual(true);
    expect(isTooShort(['A'])).toEqual(true);
    expect(isTooShort([...seq.split('\n'), '> another seq', 'A'])).toEqual(
      true,
    );
    expect(
      isTooShort([
        ...seq.split('\n'),
        ...seq.split('\n'),
        '> another seq',
        'A',
        ...seq.split('\n'),
      ]),
    ).toEqual(true);
  });
  test('Max number of sequenceas', () => {
    let seqs = '';
    for (let i = 0; i < MAX_NUMBER_OF_SEQUENCES; i++) seqs += `${seq}\n`;
    expect(checkValidity(seqs.split('\n'))).toEqual(true);
    expect(checkValidity(`${seqs}${seq}`.split('\n'))).toEqual(false);
  });
});

describe('clenUp()', () => {
  test('already clean text', () => {
    expect(cleanUp(seq.split('\n').map((l) => ({ text: l })))).toEqual(
      seq.trim(),
    );
  });
  test('cleaning other chars', () => {
    expect(
      cleanUp(`${seq}41$9{-.`.split('\n').map((l) => ({ text: l }))),
    ).toEqual(seq.trim());
  });
  test('double headers', () => {
    expect(
      cleanUp(
        `${seq}\n> double header${seq}${seq}`
          .split('\n')
          .map((l) => ({ text: l })),
      ),
    ).toEqual(`${seq.trim()}\n${seq.trim()}\n${seq.trim()}`);
    expect(
      cleanUp(
        `${seq}\n;comment\n> double header\n;comment${seq}${seq}`
          .split('\n')
          .map((l) => ({ text: l })),
      ),
    ).toEqual(
      `${seq.trim()}\n;comment\n;comment\n${seq.trim()}\n${seq.trim()}`,
    );
  });
});
