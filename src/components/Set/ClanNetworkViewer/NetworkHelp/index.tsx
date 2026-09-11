import React, { useState } from 'react';

import Button from 'components/SimpleCommonComponents/Button';
import cssBinder from 'styles/cssBinder';

import style from '../style.css';

const css = cssBinder(style);

// VF's global list and text classes, from the stylesheet the page loads.
const HELP_LIST = ['vf-list', 'vf-list--unordered', 'vf-list--tight'];
const HELP_ITEM = ['vf-list__item', 'vf-text-body--5'];

type Props = {
  // Opens the legend panel; left out in full screen, where the legend is
  // always shown and there is nothing to open.
  onShowLegend?: () => void;
};

// The one place that explains the whole viewer: how to move around it, how to
// read its nodes and edges, and what the legend's filters do. Only its button
// opens and closes it -- not hover, not clicking elsewhere -- so it stays up
// while the user tries out on the canvas what it says.
//
// The shared Tooltip component portals its content out of the viewer, which
// does not survive full screen; this one stays inside the viewer.
const NetworkHelp = ({ onShowLegend }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={css('clan-network-info')}>
      {/* Primary while open, the way the toolbar's other toggles show
          their state. */}
      <Button
        type={isOpen ? 'primary' : 'secondary'}
        icon="icon-info"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="clanNetworkHelp"
      >
        {' '}
        How to use
      </Button>
      {isOpen && (
        <div
          id="clanNetworkHelp"
          role="region"
          aria-label="How to use the clan network viewer"
          className={css('clan-network-info-bubble')}
        >
          <p className={css('vf-text-body--4')}>Getting around</p>
          <ul className={css(...HELP_LIST)}>
            <li className={css(...HELP_ITEM)}>
              Drag a node to reposition it; ctrl/⌘-click it to open its entry.
            </li>
            <li className={css(...HELP_ITEM)}>
              Select a node, then use the focus button (bottom right) to show
              only it and its connections.
            </li>
            <li className={css(...HELP_ITEM)}>
              Search for an entry (top left) to zoom in on it.
            </li>
          </ul>
          <p className={css('vf-text-body--4')}>Filtering</p>
          <ul className={css(...HELP_LIST)}>
            <li className={css(...HELP_ITEM)}>
              Every item in the{' '}
              {onShowLegend ? (
                <Button
                  type="secondary"
                  onClick={onShowLegend}
                  className={css('clan-network-info-legend-button')}
                >
                  Interactive Legend
                </Button>
              ) : (
                'interactive legend (below the network)'
              )}{' '}
              is a filter: click it to hide those nodes or edges, and again to
              bring them back. A method hides all of its edges, a range band
              just those in it.
            </li>
            <li className={css(...HELP_ITEM)}>
              An entry from outside this clan left with no edges is hidden too;
              members of this clan always stay.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NetworkHelp;
