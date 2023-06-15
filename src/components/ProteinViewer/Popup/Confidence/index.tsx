import React from 'react';

import ColorScale from '../ColorScale';
import NightingaleColoredSequence from '@nightingale-elements/nightingale-colored-sequence';

const levels = {
  H: 'Very high',
  M: 'Confident',
  L: 'Low',
  D: 'Very Low',
};

export type ConfidenceDetail = {
  target?: HTMLElement;
  feature: {
    aa?: keyof typeof levels;
    start?: number;
  };
};
type Props = {
  detail: ConfidenceDetail;
};

const ConfidencePopup = ({ detail }: Props) => {
  const element = detail?.target?.closest<NightingaleColoredSequence>(
    'nightingale-colored-sequence'
  );
  if (!element) return null;
  const aa = detail.feature.aa || '';
  return (
    <section>
      <h6>Residue {detail.feature.start}</h6>
      <div>
        <b>{aa ? levels[aa] : '-'}</b>
        <br />
        <ColorScale {...element.colorScale} />
      </div>
    </section>
  );
};

export default ConfidencePopup;
