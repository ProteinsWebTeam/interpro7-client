// @flow
import React from 'react';
import T from 'prop-types';

import { format } from 'url';
import { createSelector } from 'reselect';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { goToCustomLocation } from 'actions/creators';

import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';
import style from '../style.css';
const f = foundationPartial(style);

const Selector = (
  {
    data,
    isoform = '',
    goToCustomLocation,
    customLocation,
  } /*: {data: {loading: boolean, payload: Object}, isoform?: string, goToCustomLocation: function, customLocation: {}} */,
) => {
  if (!data || data.loading || !data.payload) return <Loading />;
  const isoforms = data.payload.results;
  const onChange = (event) => {
    const newLocation = {
      ...customLocation,
      search: {},
    };
    if (event.target.value) {
      newLocation.search.isoform = event.target.value;
    }
    goToCustomLocation(newLocation);
  };
  return (
    // eslint-disable-next-line jsx-a11y/no-onchange
    <select onChange={onChange} value={isoform}>
      <option className={f('placeholder')} value="">
        Select an Isoform to display...
      </option>
      {isoforms.map((acc) => (
        <option value={acc} key={acc}>
          {acc}
          {acc.endsWith('-1') ? ' [canonical]' : ''}
        </option>
      ))}
    </select>
  );
};
Selector.propTypes = {
  data: T.shape({
    loading: T.bool,
    payload: T.object,
  }),
  goToCustomLocation: T.func.isRequired,
  customLocation: T.object.isRequired,
  isoform: T.string,
};

const mapStateToProps = createSelector(
  (state) => state.customLocation,
  (state) => state.customLocation.search,
  (customLocation, { isoform }) => ({ customLocation, isoform }),
);

const getIsoformURL = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  ({ protocol, hostname, port, root }, { protein: { accession } }) => {
    const description = {
      main: { key: 'protein' },
      protein: { db: 'uniprot', accession },
    };

    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: {
        isoforms: '',
      },
    });
  },
);
export default loadData({
  getUrl: getIsoformURL,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(Selector);
