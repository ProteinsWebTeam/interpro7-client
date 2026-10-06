import React from 'react';

import cssBinder from 'styles/cssBinder';

import { getClanStatus } from '../colorPalette';
import { ClanNetworkNode } from '../types';

import style from '../style.css';

const css = cssBinder(style);

type Props = {
  node: ClanNetworkNode;
  currentClanAccession: string;
};

// What hovering a node shows -- the same few lines vis-network's own tooltip
// showed, plus how to open the entry. It appears in a fixed corner of the
// canvas rather than over the node, so it never covers what is being looked at,
// and it goes again as soon as the pointer leaves (see index.tsx), which is why
// it needs no close button of its own.
const NodePopover = ({ node, currentClanAccession }: Props) => {
  const status = getClanStatus(node, currentClanAccession);

  return (
    <div
      className={css('clan-network-node-popover')}
      role="dialog"
      aria-label={`${node.short_name || node.accession} details`}
    >
      <strong>{node.short_name}</strong> ({node.accession})
      <br />
      <strong>Type:</strong> {node.type}
      <br />
      <strong>Length:</strong> {node.score}
      <br />
      <strong>Clan:</strong> {node.clan ?? 'none'}
      {status === 'current-clan' && ' (this clan)'}
      <br />
      {node.name}
      <br />
      <span className={css('clan-network-node-popover-hint')}>
        ⌘/Ctrl-click the entry to open its page
      </span>
    </div>
  );
};

export default NodePopover;
