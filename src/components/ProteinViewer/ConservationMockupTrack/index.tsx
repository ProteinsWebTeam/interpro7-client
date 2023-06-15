import React, { useState } from 'react';
import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';

import style from '../../ProtVista/style.css';
import grid from '../../ProtVista/grid.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import popper from '../../ProtVista/popper.css';

const css = cssBinder(style, grid, fonts, popper);

type Props = {
  showConservationButton?: boolean;
  handleConservationLoad?: () => void;
  conservationError?: string;
  isPrinting: boolean;
};

const ConservationMockupTrack = ({
  showConservationButton,
  handleConservationLoad,
  conservationError,
  isPrinting,
}: Props) => {
  const [isLoading, setLoading] = useState(false);

  const handleConservation = () => {
    if (handleConservationLoad) {
      handleConservationLoad();
      setLoading(true);
    }
  };
  return showConservationButton ? (
    <div
      className={css('tracks-container', 'track-sized', 'protvista-grid', {
        printing: isPrinting,
      })}
    >
      <header>
        <button onClick={() => handleConservation()}>
          <span className={css('icon', 'icon-common', 'icon-caret-right')} />{' '}
          Match Conservation
        </button>
      </header>
      <div className={css('track')}>
        <div
          className={css('conservation-placeholder-component')}
          // ref={this._conservationTrackRef}
        >
          {conservationError ? (
            <div className={css('conservation-error')}>
              ⚠️ {conservationError}
            </div>
          ) : (
            <>{isLoading ? <Loading inline /> : null}</>
          )}
        </div>
      </div>
      <div className={css('track-label')}>
        <button
          type="button"
          className={css('hollow', 'button', 'user-select-none')}
          onClick={() => handleConservation()}
        >
          Fetch Conservation
        </button>
      </div>
    </div>
  ) : null;
};

export default ConservationMockupTrack;
