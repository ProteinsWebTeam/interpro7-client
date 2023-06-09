import React from 'react';
import cssBinder from 'styles/cssBinder';

import NightingaleNavigation from 'components/Nightingale/Navigation';
import NightingaleSequence from 'components/Nightingale/Sequence';

import style from '../../ProtVista/style.css';
import grid from '../../ProtVista/grid.css';

const css = cssBinder(style, grid);

type Props = {
  length: number;
  sequence: string;
  highlightColor: string;
};
const ProteinViewerHeader = ({ length, sequence, highlightColor }: Props) => {
  return (
    <>
      <div className={css('track')}>
        <NightingaleNavigation
          length={length}
          // ref={this._navigationRef}
          // display-start={1}
          // display-end={length}
          margin-color="#fafafa"
          height={50}
          show-highlight
          highlight-color={highlightColor}
        />
      </div>
      <div className={css('track')}>
        <NightingaleSequence
          sequence={sequence}
          length={length}
          // display-start={1}
          // display-end={length}
          margin-color="#fafafa"
          highlight-event="onmouseover"
          highlight-color={highlightColor}
          height={30}
          use-ctrl-to-zoom
        />
      </div>
    </>
  );
};

export default ProteinViewerHeader;
