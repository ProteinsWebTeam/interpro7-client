import React from 'react';

import cssBinder from 'styles/cssBinder';

import { ClanVisEdge } from '../buildEdges';
import { getMethodLabel } from '../colorPalette';
import { formatScore, getScoreLabel } from '../scoreLabel';

import style from '../style.css';

const css = cssBinder(style);

type Props = {
  edge: ClanVisEdge;
};

// What hovering an edge shows: the same lines vis-network's own tooltip showed,
// in the corner and the style the node details use, so a match and an entry
// read as two of the same thing. Only ever one of the two is on screen (see
// index.tsx), so they share the corner without ever colliding.
const EdgePopover = ({ edge }: Props) => {
  const { link, sourceLabel, targetLabel } = edge;

  return (
    <div
      className={css('clan-network-node-popover')}
      role="dialog"
      aria-label={`${getMethodLabel(link.method)} match details`}
    >
      <strong>{getMethodLabel(link.method)}</strong>
      <br />
      <strong>{getScoreLabel(link.method)}:</strong> {formatScore(link.score)}
      <br />
      <strong>Between:</strong>
      <br />
      {sourceLabel}
      <br />
      {targetLabel}
      {link.nested && (
        <>
          <br />
          <strong>Nested domain relationship</strong>
        </>
      )}
    </div>
  );
};

export default EdgePopover;
