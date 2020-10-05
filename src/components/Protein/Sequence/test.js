// @flow
import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { Sequence } from '.';

const renderer = new ShallowRenderer();

describe('<Sequence />', () => {
  test('should render', () => {
    renderer.render(
      <Sequence
        sequence={
          'MASIRRPHSPAKQQHLLRHGHLGPFASSSPPSSPLRHSSSSSSPRSAAHHHHHLLAAAGHTSFRRPLPRFAAF' +
          'FLLGSFLGLLHFLSHLPRPLGPIPNPNSHHRHRDPFPILQHPHPPSTPHSNHKLLIVVTPTRARPSQAYYLTRMAHTLRLLHDSPLLWIVVQA' +
          'GNPTPEAAAALRRTAVLHRYVGCCHNINASAPDFRPHQINAALDIVDNHRLDGVLYFADEEGVYSLHLFHHLRQIRRFATWPVPEISQHTNEV' +
          'VLQGPVCKQGQVVGWHTTHDGNKLRRFHLAMSGFAFNSTMLWDPKLRSHLAWNSIRHPEMVKESLQGSAFVEQLVEDESQMEGIPADCSQIMN' +
          'WHVPFGSESVVYPKGWRVATDLDVIIPLK'
        }
        goToCustomLocation={() => {}}
        name={'Glycosyltransferases'}
        accession={'A0A023NCQ6'}
        customLocation={{
          description: {
            entry: { db: 'InterPro' },
            main: { key: 'entry' },
          },
          hash: 'table',
          search: {},
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
