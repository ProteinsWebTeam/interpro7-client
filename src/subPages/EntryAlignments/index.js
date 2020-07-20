import React, { useState, useEffect } from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { goToCustomLocation } from 'actions/creators';

import { format } from 'url';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Link from 'components/generic/Link';
import Tip from 'components/Tip';
import AlignmentViewer from './Viewer';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';

import { foundationPartial } from 'styles/foundation';
import localStyle from './style.css';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(localStyle, ipro, fonts);

const _Alignment = ({
  type,
  colorscheme,
  onConservationProgress,
  setDisplayingAlignment,
  setColorMap,
  overlayConservation,
  data: { payload },
}) => {
  const [forceShow, setForceShow] = useState(false);
  const threshold = 1000;
  // eslint-disable-next-line camelcase
  const num = payload?.num_sequences || Infinity;
  const show = forceShow || num < threshold;
  setDisplayingAlignment(show);
  useEffect(() => {
    setForceShow(false);
  }, [payload]);
  if (!payload) return null;
  return (
    <div>
      {show ? (
        <AlignmentViewer
          onConservationProgress={onConservationProgress}
          setColorMap={setColorMap}
          type={type}
          num={num}
          colorscheme={colorscheme}
          overlayConservation={overlayConservation}
        />
      ) : (
        <div>
          <p>
            This alignment has {num} sequences. This can cause memory issues in
            your browser.
          </p>
          <p>
            If you still want to display it, press{' '}
            <button className={f('button')} onClick={() => setForceShow(true)}>
              HERE
            </button>
          </p>
        </div>
      )}
    </div>
  );
};
_Alignment.propTypes = {
  type: T.string,
  colorscheme: T.string,
  onConservationProgress: T.func,
  setDisplayingAlignment: T.func,
  setColorMap: T.func,
  data: dataPropType,
  overlayConservation: T.bool,
};

const mapStateToPropsForAlignment = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (_, props) => props?.type || '',
  ({ protocol, hostname, port, root }, description, type) => {
    // omit elements from description
    const { ...copyOfDescription } = description;
    if (description.main.key) {
      copyOfDescription[description.main.key] = {
        ...description[description.main.key],
        detail: null,
      };
    }
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(copyOfDescription),
      query: { 'annotation:info': type },
    });
  },
);

const Alignment = loadData(mapStateToPropsForAlignment)(_Alignment);

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
  const disallowedList = ['ncbi', 'meta'];
  const [colorscheme, setColorscheme] = useState('clustal2');
  const [conservastionProgress, setConservastionProgress] = useState(0);
  // TODO: draw the legend using 👇🏽 the colorMap coming from events in the component.
  const [colorMap, setColorMap] = useState({});
  const [isDisplayingAlignment, setDisplayingAlignment] = useState(false);
  const [overlayConservation, setOverlayConservation] = useState(false);

  // eslint-disable-next-line camelcase
  const types = (data?.payload?.metadata?.entry_annotations || [])
    .filter((ann) => ann.startsWith(tag))
    .map((ann) => ann.slice(tag.length))
    .filter((ann) => disallowedList.indexOf(ann) === -1);
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
      <div
        className={f('callout', 'info', 'withicon')}
        style={{
          display: 'flex',
        }}
      >
        <b>BETA</b>: This is a new feature and its under current development.
      </div>
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
          {types.map((t) => (
            <option key={t}>{t}</option>
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
                  Overlay Conservation:
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
                    {Object.entries(colorMap).map(([legend, color], i) => (
                      <tr key={i}>
                        <td style={{ background: color }}> </td>
                        <td>{legend}</td>
                      </tr>
                    ))}
                  </table>
                </DropDownButton>
              </>
            )}
            <Link
              className={f('button')}
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
          type={`${tag}${type}`}
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
  (state) =>
    mapStateToPropsForAlignment(state)
      .replace(':info', '')
      .replace('%3Ainfo', ''),
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
