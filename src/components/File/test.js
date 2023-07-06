import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { File } from '.';

const renderer = new ShallowRenderer();

describe('<File />', () => {
  test('should render', () => {
    renderer.render(
      <File
        api={{
          hostname: 'wp-np3-ac.ebi.ac.uk',
          port: '80',
          protocol: 'http:',
          root: '/interpro/api/',
        }}
        entryDescription={{
          accession: 'IPR000001',
          db: 'InterPro',
        }}
        downloadURL={() => {}}
        fileType={'fasta'}
        count={6795}
        name={'protein-sequences-matching-IPR000001.fasta'}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
