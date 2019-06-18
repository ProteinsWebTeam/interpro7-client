import React, { useState } from 'react';

import T from 'prop-types';
import loadData from 'higherOrder/loadData';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { createSelector } from 'reselect';
import { format } from 'url';

const _DataProvider = ({ data, onLoad }) => {
  if (data && !data.loading && data.payload && data.payload.metadata) {
    const {
      accession,
      name: { name },
      source_database: db,
    } = data.payload.metadata;

    const message = `
        <b>${accession}</b></br>
        ${name} </br>
        ${db} </br>
    `;

    onLoad(message);
  }
  return null;
};
_DataProvider.propTypes = {
  data: T.shape({
    payload: T.object,
    loading: T.bool,
  }),
  onLoad: T.func.isRequired,
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

const DynamicTooltip = ({ type, source, accession, ...props }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [message, setMessage] = useState(accession);
  const _handleMouseOver = () => {
    setShouldLoad(true);
  };
  const DataProvider = shouldLoad
    ? loadData(getUrlFor)(_DataProvider)
    : _DataProvider;

  return (
    <>
      <DataProvider
        accession={accession}
        type={type}
        source={source}
        onLoad={setMessage}
      />
      <Tooltip
        html={message}
        {...props}
        onMouseOver={_handleMouseOver}
        onFocus={_handleMouseOver}
      />
    </>
  );
};
DynamicTooltip.propTypes = {
  type: T.string.isRequired,
  source: T.string.isRequired,
  accession: T.string.isRequired,
};

export default DynamicTooltip;
