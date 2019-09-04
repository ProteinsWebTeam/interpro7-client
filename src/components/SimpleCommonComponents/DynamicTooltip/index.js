import React, { useState, useRef } from 'react';
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
  } /*: {data?: {loading: boolean, payload: Object}, onLoad: function, databases: Object} */,
) => {
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
        <br />
      </>
    );
    /* eslint-enable react/prop-types */

    onLoad(message);
  }
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
  state => state.settings.api,
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
    ...rest
  } /*: {type: string, source: string, accession: string, children: Object, databases: Object} */,
) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [message, setMessage] = useState(() => <b>{accession}</b>);
  const popperContainer = useRef(null);
  const popupTargetClass = 'feature';

  const _handleMouseOver = e => {
    if (e.target.classList.contains(popupTargetClass)) {
      const _popper = new PopperJS(e.target, popperContainer.current);
      popperContainer.current.classList.remove(f('hide'));
    }
    setShouldLoad(true);
  };

  const _handleMouseOut = e => {
    if (e.target.classList.contains(popupTargetClass)) {
      popperContainer.current.classList.add(f('hide'));
    }
  };

  let DataProvider = _DataProvider;
  if (shouldLoad) {
    if (!(accession in dataProviders)) {
      dataProviders[accession] = loadData(getUrlFor)(_DataProvider);
    }
    DataProvider = dataProviders[accession];
  }

  return (
    <>
      <DataProvider
        accession={accession}
        type={type}
        source={source}
        onLoad={setMessage}
        databases={databases}
      />
      <div
        style={{ display: 'inline' }}
        {...rest}
        onMouseOver={e => _handleMouseOver(e)}
        onFocus={e => _handleMouseOver(e)}
        onMouseOut={e => _handleMouseOut(e)}
        onBlur={e => _handleMouseOut(e)}
      >
        {children}
      </div>
      <div ref={popperContainer} className={f('popper', 'hide')}>
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
  children: T.object,
};

export default DynamicTooltip;
