import React, { forwardRef } from 'react';
import cssBinder from 'styles/cssBinder';

import NightingaleNavigationCE from '@nightingale-elements/nightingale-navigation';

import NightingaleNavigation from 'components/Nightingale/Navigation';
import NightingaleSequence from 'components/Nightingale/Sequence';

import style from '../../ProteinViewer/style.css';
import grid from '../../ProteinViewer/grid.css';

const css = cssBinder(style, grid);

type Props = {
  length: number;
  sequence: string;
  highlightColor: string;
};

const ProteinViewerHeader = forwardRef<NightingaleNavigationCE, Props>(
  ({ length, sequence, highlightColor }, ref) => {
    return (
      <>
        <div className={css('track')}>
          <NightingaleNavigation
            length={length}
            margin-color="#fafafa"
            margin-left={20}
            height={50}
            show-highlight
            highlight-color={highlightColor}
            ref={ref}
          />
        </div>
        <div className={css('track')}>
          <NightingaleSequence
            sequence={sequence}
            length={length}
            margin-color="#fafafa"
            margin-left={20}
            highlight-event="onmouseover"
            highlight-color={highlightColor}
            height={30}
            use-ctrl-to-zoom
          />
        </div>
      </>
    );
  },
);

export default ProteinViewerHeader;
