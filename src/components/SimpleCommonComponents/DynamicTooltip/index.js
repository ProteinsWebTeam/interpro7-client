import React, { PureComponent } from 'react';

import T from 'prop-types';
// import Tippy from '@tippy.js/react';
import loadData from 'higherOrder/loadData';
import Loading from 'components/SimpleCommonComponents/Loading';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { getUrlForMeta } from '../../../higherOrder/loadData/defaults';
import { createSelector } from 'reselect';
import { format } from 'url';

class _DynamicTooltip extends PureComponent /*:: <Pros> */ {
  static propTypes = {
    data: T.shape({
      payload: T.object,
      loading: T.bool,
    }).isRequired,
    dataDB: T.shape({
      metadata: T.object,
      loading: T.bool,
    }).isRequired,
    type: T.string.isRequired,
    source: T.string.isRequired,
    accession: T.string.isRequired,
  };

  render() {
    const {
      type,
      source,
      accession,
      data,
      dataDB,
      isStaleDB: _isStaleDB,
      isStale: _isStale,
      ...rest
    } = this.props;

    let message = '';
    if (!dataDB || !data || dataDB.loading || data.loading) {
      message += `<b>${accession} </b></br>`;
    } else {
      const name = data.payload.metadata.name.name;
      const displaySourceDB = dataDB.payload.databases[source].name;
      const dataType = data.payload.metadata.type;
      message += `<b>${accession}</b></br>`;
      message += `${name} </br>`;
      message += `${displaySourceDB}`;
      if (dataType) message += ` ${dataType}`;
    }

    return <Tooltip html={message} {...rest} />;
  }
}

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

export const DynamicTooltip = _DynamicTooltip;
export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
})(
  loadData({
    getUrl: getUrlFor,
  })(DynamicTooltip),
);
