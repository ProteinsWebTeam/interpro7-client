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
import AlignmentViewer from './Viewer';

import { foundationPartial } from 'styles/foundation';
import localStyle from './style.css';

const f = foundationPartial(localStyle);

const _Alignment = ({ type, data: { payload } }) => {
  const [forceShow, setForceShow] = useState(false);
  const threshold = 1000;
  // eslint-disable-next-line camelcase
  const num = payload?.num_sequences || Infinity;
  const show = forceShow || num < threshold;
  useEffect(() => {
    setForceShow(false);
  }, [payload]);
  if (!payload) return null;
  return (
    <div>
      {show ? (
        <AlignmentViewer type={type} num={num} />
      ) : (
        <div>
          <p>
            This alignment has {num} sequences. This can cause memory issues in
            your browser.
          </p>
          <p>
            If you still want to display it, press{' '}
            <button onClick={() => setForceShow(true)}>HERE</button>
          </p>
        </div>
      )}
    </div>
  );
};
_Alignment.propTypes = {
  type: T.string,
  data: dataPropType,
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

const EntryAlignments = ({
  data,
  customLocation,
  type,
  url,
  goToCustomLocation,
}) => {
  const tag = 'alignment:';
  // eslint-disable-next-line camelcase
  const types = (data?.payload?.metadata?.entry_annotations || [])
    .filter((ann) => ann.startsWith(tag))
    .map((ann) => ann.slice(tag.length));
  if (!types.length) return null;
  const handleChange = (evt) => {
    goToCustomLocation({
      ...customLocation,
      search: { type: evt.target.value },
    });
  };
  const alignmentType = type || '';
  return (
    <div className={f('row', 'column')}>
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
        {alignmentType !== '' && (
          <Link
            className={f('button')}
            href={`${url}${tag}${alignmentType}`}
            download={`${
              data?.payload?.metadata?.accession || 'download'
            }.alignment.${alignmentType}.gz`}
          >
            Download
          </Link>
        )}
      </label>
      {alignmentType !== '' && <Alignment type={`${tag}${type}`} />}
    </div>
  );
};
EntryAlignments.propTypes = {
  data: dataPropType,
  customLocation: T.object,
  type: T.string,
  url: T.string,
  goToCustomLocation: T.func,
};
const mapStateToProps = createSelector(
  (state) => state.customLocation,
  (state) => state.customLocation?.search?.type,
  (state) =>
    mapStateToPropsForAlignment(state)
      .replace(':info', '')
      .replace('%3Ainfo', ''),
  (customLocation, type, url) => ({ customLocation, type, url }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  EntryAlignments,
);
