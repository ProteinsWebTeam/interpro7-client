// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { IPScanSearch, checkValidity, isTooShort, cleanUp } from '.';

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
  });
});

describe('clenUp()', () => {
  test('already clean text', () => {
    expect(cleanUp(seq.split('\n').map(l => ({ text: l })))).toEqual(
      seq.trim(),
    );
  });
  test('cleaning other chars', () => {
    expect(
      cleanUp(`${seq}41$9{-.`.split('\n').map(l => ({ text: l }))),
    ).toEqual(seq.trim());
  });
  test('multiple sequence', () => {
    expect(
      cleanUp((seq + seq + seq).split('\n').map(l => ({ text: l }))),
    ).toEqual(seq.trim());
  });
});
