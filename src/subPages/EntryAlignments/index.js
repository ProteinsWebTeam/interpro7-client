import React, { useState, useEffect } from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { goToCustomLocation } from 'actions/creators';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Link from 'components/generic/Link';
import Tip from 'components/Tip';
import AlignmentViewer from './Viewer';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

import { foundationPartial } from 'styles/foundation';
import localStyle from './style.css';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';

const f = foundationPartial(localStyle, ipro, fonts, buttonCSS);

const Alignment = ({
  type,
  numSequences,
  colorscheme,
  onConservationProgress,
  setDisplayingAlignment,
  setColorMap,
  overlayConservation,
}) => {
  const [forceShow, setForceShow] = useState(false);
  const threshold = 1000;
  const show = forceShow || numSequences < threshold;
  useEffect(() => {
    setDisplayingAlignment(show);
  }, [show]);
  useEffect(() => {
    setForceShow(false);
  }, [numSequences]);

  return (
    <div>
      {show ? (
        <AlignmentViewer
          onConservationProgress={onConservationProgress}
          setColorMap={setColorMap}
          type={type}
          num={numSequences}
          colorscheme={colorscheme}
          overlayConservation={overlayConservation}
        />
      ) : (
        <div>
          <p>
            This alignment has {numSequences} sequences. This can cause memory
            issues in your browser.
          </p>
          <p>
            If you still want to display it, press{' '}
            <Button onClick={() => setForceShow(true)}>HERE</Button>
          </p>
        </div>
      )}
    </div>
  );
};
Alignment.propTypes = {
  type: T.string,
  numSequences: T.number,
  colorscheme: T.string,
  onConservationProgress: T.func,
  setDisplayingAlignment: T.func,
  setColorMap: T.func,
  overlayConservation: T.bool,
};

const AllowedColorschemes = [
  'buried_index',
  'clustal',
  'clustal2',
  'cinema',
  'helix_propensity',
  'hydro',
  'lesk',
  'mae',
  'nucleotide',
  'purine_pyrimidine',
  'strand_propensity',
  'taylor',
  'turn_propensity',
  'zappo',
];
const EntryAlignments = ({
  data,
  customLocation,
  type,
  url,
  showCtrlToZoomToast,
  goToCustomLocation,
}) => {
  const tag = 'alignment:';
  const [colorscheme, setColorscheme] = useState('clustal2');
  const [conservastionProgress, setConservastionProgress] = useState(0);
  // TODO: draw the legend using 👇🏽 the colorMap coming from events in the component.
  const [colorMap, setColorMap] = useState({});
  const [isDisplayingAlignment, setDisplayingAlignment] = useState(false);
  const [overlayConservation, setOverlayConservation] = useState(false);

  // eslint-disable-next-line camelcase
  const types = Object.entries(data?.payload?.metadata?.entry_annotations || {})
    .filter(([type]) => type.startsWith(tag))
    .map(([type, count]) => [type.slice(tag.length), count])
    .sort(([, aCount], [, bCount]) => aCount - bCount);
  if (!types.length) return null;
  const handleChange = (evt) => {
    goToCustomLocation({
      ...customLocation,
      search: { type: evt.target.value },
    });
  };
  const alignmentType = type || '';
  const conservationOptions =
    conservastionProgress === 1 ? {} : { disabled: true };
  return (
    <div className={f('row', 'column')}>
      {alignmentType !== '' && showCtrlToZoomToast ? (
        <Tip
          body="You can Zoom in/out by pressing [ctrl] and scroll up/down. Alternatively, you can  drag the borders in the navigation component."
          toastID="ctrlToZoom"
          settingsName="showCtrlToZoomToast"
        />
      ) : null}
      <label className={f('alignment-selector')}>
        <span>Available alignments:</span>
        <select
          value={alignmentType}
          onChange={handleChange}
          onBlur={handleChange}
        >
          <option value="" disabled>
            Choose...
          </option>
          {types.map(([type, count]) => (
            <option key={type} value={type}>
              {type} ({count.toLocaleString()})
            </option>
          ))}
        </select>
      </label>
      <div className={f('controllers')}>
        {alignmentType !== '' && (
          <>
            {isDisplayingAlignment && (
              <>
                <label>
                  Colors:
                  <select
                    value={colorscheme}
                    onChange={(evt) => setColorscheme(evt.target.value)}
                    onBlur={(evt) => setColorscheme(evt.target.value)}
                  >
                    {AllowedColorschemes.map((color) => (
                      <option key={color}>{color}</option>
                    ))}
                    <option {...conservationOptions}>
                      conservation
                      {conservastionProgress < 1
                        ? `[Calculating: ${(
                            conservastionProgress * 100
                          ).toFixed(2)}%]`
                        : ''}
                    </option>
                  </select>
                </label>
                <label className={f({ disabled: conservastionProgress < 1 })}>
                  Conservation:
                  <input
                    type="checkbox"
                    value={overlayConservation}
                    onChange={() =>
                      setOverlayConservation(!overlayConservation)
                    }
                    disabled={conservastionProgress < 1}
                  />
                </label>
                <DropDownButton
                  label="Legends"
                  extraClasses={f('dropdown-container')}
                >
                  <table className={f('legend-table')}>
                    <tbody>
                      {Object.entries(colorMap).map(([legend, color], i) => (
                        <tr key={i}>
                          <td style={{ background: color }}> </td>
                          <td>{legend}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </DropDownButton>
              </>
            )}
            <Link
              className={`${f(
                'vf-button',
                'vf-button--secondary',
                'vf-button--sm',
              )} vf-button`}
              href={`${url}${tag}${alignmentType}&download`}
              download={`${
                data?.payload?.metadata?.accession || 'download'
              }.alignment.${alignmentType}.gz`}
            >
              <span
                className={f('icon', 'icon-common', 'icon-download')}
                data-icon="&#xf019;"
              />{' '}
              Download
            </Link>
          </>
        )}
      </div>
      {alignmentType !== '' && (
        <Alignment
          colorscheme={colorscheme}
          type={`${tag}${alignmentType}`}
          numSequences={
            data?.payload?.metadata?.entry_annotations[`${tag}${alignmentType}`]
          }
          onConservationProgress={setConservastionProgress}
          setDisplayingAlignment={setDisplayingAlignment}
          setColorMap={setColorMap}
          overlayConservation={overlayConservation}
        />
      )}
    </div>
  );
};
EntryAlignments.propTypes = {
  data: dataPropType,
  customLocation: T.object,
  type: T.string,
  url: T.string,
  showCtrlToZoomToast: T.bool,
  goToCustomLocation: T.func,
};
const mapStateToProps = createSelector(
  (state) => state.customLocation,
  (state) => state.customLocation?.search?.type,
  (state) => {
    const { protocol, hostname, port, root } = state.settings.api;
    const description = state.customLocation.description;
    const { ...copyOfDescription } = description;
    if (description.main.key) {
      copyOfDescription[description.main.key] = {
        ...description[description.main.key],
        detail: null,
      };
    }

    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(copyOfDescription),
      query: { annotation: '' },
    });
  },
  (state) => state.settings.notifications.showCtrlToZoomToast,
  (customLocation, type, url, showCtrlToZoomToast) => ({
    customLocation,
    type,
    url,
    showCtrlToZoomToast,
  }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  EntryAlignments,
);
