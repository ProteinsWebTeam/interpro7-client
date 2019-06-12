import React from 'react';
import T from 'prop-types';

import { format } from 'url';
import { createSelector } from 'reselect';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';
import style from '../style.css';
const f = foundationPartial(style);

const Selector = ({ data, value = '', onChange = () => null }) => {
  if (!data || data.loading || !data.payload) return <Loading />;

  const isoforms = data.payload.results;
  return (
    // eslint-disable-next-line jsx-a11y/no-onchange
    <select onChange={onChange} className={f({ placeholder: !value })}>
      <option value="">Select an Isoform to display...</option>
      {isoforms.map(acc => (
        <option value={acc} key={acc}>
          {acc}
        </option>
      ))}
    </select>
  );
};
Selector.propTypes = {
  value: T.string,
  onChange: T.func,
};
const getIsoformURL = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
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
export default loadData(getIsoformURL)(Selector);
