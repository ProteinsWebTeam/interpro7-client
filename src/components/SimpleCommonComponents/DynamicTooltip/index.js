import React, { useState, useRef, useEffect } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import loadData from 'higherOrder/loadData';
import PopperJS from 'popper.js';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { createSelector } from 'reselect';
import { format } from 'url';
import { foundationPartial } from 'styles/foundation';
import local from './style.css';

const f = foundationPartial(local);

const _DataProvider = (
  {
    data,
    onLoad,
    databases,
    locations,
  } /*: {data?: {loading: boolean, payload: Object}, onLoad: function, databases: Object} */,
) => {
  useEffect(() => {
    if (data && !data.loading && data.payload && data.payload.metadata) {
      const {
        accession,
        name: { name },
        source_database: db,
      } = data.payload.metadata;

      /* eslint-disable react/prop-types */
      const message = () => (
        <>
          <b>{accession}</b>
          <br />
          {name} <br />
          <small>{databases[db].name}</small>
          {locations?.length && (
            <div>
              <header>Locations:</header>
              <ul>
                {locations.map((l, i) => (
                  <li key={i}>
                    {l.fragments
                      .map(({ start, end }) => `${start}-${end}`)
                      .join(',')}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <br />
        </>
      );
      /* eslint-enable react/prop-types */

      onLoad(message);
    }
  });
  return null;
};
_DataProvider.propTypes = {
  data: dataPropType,
  onLoad: T.func.isRequired,
  databases: T.objectOf(
    T.shape({
      name: T.string,
    }),
  ),
};

const getUrlFor = createSelector(
  (state) => state.settings.api,
  (_, props) => props,
  ({ protocol, hostname, port, root }, props) => {
    const description = {
      main: { key: props.type },
      [props.type]: { accession: props.accession, db: props.source },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
    });
  },
);

const dataProviders = {};

const DynamicTooltip = (
  {
    type,
    source,
    accession,
    children,
    databases,
    locations,
    ...rest
  } /*: {type: string, source: string, accession: string, children: Object, databases: Object, locations: Array<{}>} */,
) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [message, setMessage] = useState(() => <b>{accession}</b>);
  const popperContainer = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const popupTargetClass = 'feature';
  const [DataProvider, setDataProvider] = useState(null);
  useEffect(() => {
    if (shouldLoad) {
      if (!(accession in dataProviders)) {
        dataProviders[accession] = loadData(getUrlFor)(_DataProvider);
      }
      setDataProvider(dataProviders[accession]);
    }
  });
  const _handleMouseOver = (e) => {
    if (e.target.classList.contains(popupTargetClass)) {
      const _popper = new PopperJS(e.target, popperContainer.current);
      setShowTooltip(true);
    }
    setShouldLoad(true);
  };

  const _handleMouseOut = () => {
    setShowTooltip(false);
  };

  return (
    <>
      {DataProvider && (
        <DataProvider
          accession={accession}
          type={type}
          source={source}
          onLoad={setMessage}
          databases={databases}
          locations={locations}
        />
      )}
      <div
        style={{ display: 'inline' }}
        {...rest}
        onMouseOver={(e) => _handleMouseOver(e)}
        onFocus={(e) => _handleMouseOver(e)}
        onMouseOut={_handleMouseOut}
        onBlur={_handleMouseOut}
      >
        {children}
      </div>
      <div
        ref={popperContainer}
        className={f('popper', { hide: !showTooltip })}
      >
        <div className={f('popper__arrow')} />
        <div>{message}</div>
      </div>
    </>
  );
};
DynamicTooltip.propTypes = {
  type: T.string.isRequired,
  source: T.string.isRequired,
  accession: T.string.isRequired,
  databases: T.object.isRequired,
  locations: T.arrayOf(T.object),
  children: T.object,
};

export default DynamicTooltip;
