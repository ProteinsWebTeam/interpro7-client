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
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro, local);

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
        <section className={f('entry-popup')}>
          <h6>
            {databases[db].name} - {accession}
          </h6>
          <h6>{name}</h6>
          {locations?.length && (
            <ul>
              {locations.map((l, i) => (
                <li key={i}>
                  <button className={f('button', 'secondary', 'coordinates')}>
                    {l.fragments
                      .map(({ start, end }) => `${start}-${end}`)
                      .join(',')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
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
  locations: T.arrayOf(
    T.shape({
      fragments: T.arrayOf(
        T.shape({
          start: T.number,
          end: T.number,
        }),
      ),
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
  const [currentLocation, setCurrentLocation] = useState(locations);
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
      // d3 sets the data of an elemen in __data__ - This needs to be check on major updates of d3
      if (e?.target?.__data__) {
        setCurrentLocation([e.target.__data__]);
      }
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
          locations={currentLocation}
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
