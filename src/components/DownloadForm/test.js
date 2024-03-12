import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { DownloadForm } from '.';

const renderer = new ShallowRenderer();

describe('<DownloadForm />', () => {
  test('should render', () => {
    renderer.render(
      <DownloadForm
        matched={'/entry/InterPro/|accession'}
        api={{
          hostname: 'wwwdev.ebi.ac.uk',
          port: '443',
          protocol: 'https:',
          root: '/interpro7/api/',
        }}
        lowGraphics={false}
        customLocation={{
          main: {
            key: 'result',
          },
          result: {
            type: 'download',
          },
        }}
        goToCustomLocation={() => {}}
        data={{}}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
