// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';
import localStyle from './style.css';

const f = foundationPartial(localStyle);

import Table, {
  Column,
  PageSizeSelector,
  SearchBox,
  Exporter,
} from 'components/Table';

const formatInteractionsData = data => data.interactions || [];

const renderMolecule = ({ accession, identifier, type }) =>
  type === 'protein' ? (
    <Link
      to={{
        description: {
          main: { key: 'protein' },
          protein: { db: 'uniprot', accession },
        },
      }}
    >
      {identifier} ({accession})
    </Link>
  ) : (
    <span>
      {identifier} ({accession})
    </span>
  );

const FullLoadedTableSubPage = ({ description, data, search, pageSize }) => {
  let _data = data?.payload || [];
  let header = '';
  const renderers = {};
  const page = search?.page || 1;
  if (description.entry?.detail === 'interactions') {
    _data = formatInteractionsData(_data);
    header =
      'Proteins matching this entry have been experimentally proven to be involved in Protein:Protein interactions.';
    renderers['molecule_1'] = renderMolecule;
    renderers['molecule_2'] = renderMolecule;
  }
  const keys = Object.keys(_data?.[0] || {});
  let subset = _data;
  for (let key of keys) {
    if (search[key]) {
      subset = subset.filter(
        row =>
          JSON.stringify(row[key])
            .toLowerCase()
            .indexOf(search[key].toLowerCase()) !== -1,
      );
    }
  }
  const size = search.page_size || pageSize;
  subset = subset.slice((page - 1) * size, page * size);
  return (
    <div className={f('row', 'column')}>
      <p>{header}</p>
      <Table actualSize={_data.length} dataTable={subset} query={search}>
        <PageSizeSelector />
        {keys.map(key => (
          <Column
            key={key}
            dataKey={key}
            renderer={renderers[key] || (d => d)}
            isSearchable={true}
          />
        ))}
      </Table>
    </div>
  );
};

const mapStateToProps = createSelector(
  state => state.customLocation.description,
  state => state.customLocation.search,
  state => state.settings.navigation.pageSize,
  (description, search, pageSize) => ({ description, search, pageSize }),
);

export default connect(mapStateToProps)(FullLoadedTableSubPage);
