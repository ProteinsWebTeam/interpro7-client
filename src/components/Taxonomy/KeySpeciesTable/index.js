// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';
import { STATUS_OK } from 'utils/server-message';
import { getReversedUrl } from 'higherOrder/loadData/defaults';
import Loading from 'components/SimpleCommonComponents/Loading';
import { Column } from 'components/Table';
import Table from 'components/Table/SimpleTable';
import { ProteinDownloadRenderer } from 'components/Matches';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import { foundationPartial } from 'styles/foundation';

import { speciesFeat } from 'staticData/home';
import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';

const f = foundationPartial(fonts, ebiGlobalStyles);

/*:: import type { Description } from 'utils/processDescription/handlers'; */

/*:: type DataProps = {
  data: {
    loading: boolean,
    payload ?: Object,
    status ?: number,
  },
  description: Description,
}; */

const _KeySpeciesTableWithData = (props /*: DataProps */) => {
  const {
    data: { status, loading, payload },
    description,
  } = props;
  if (!loading && status !== STATUS_OK)
    return (
      <div className={f('callout', 'info')}>
        There is no key species associated with this accession
      </div>
    );
  if (loading || !payload) return <Loading />;
  return (
    <Table
      dataTable={payload.results.map((r) => ({
        ...r.metadata,
        ...((r.extra_fields && r.extra_fields.counters) || {}),
        features: speciesFeat.find((f) => f.tax_id === r.metadata.accession),
      }))}
      notFound={payload.results.length === 0}
      contentType="taxonomy"
    >
      <Column
        dataKey="accession"
        defaultKey="icons"
        renderer={(acc, { features }) => {
          return (
            <span
              style={{ color: features.color, fontSize: '2em' }}
              className={f('small', 'icon', 'icon-species')}
              data-icon={features.icon}
            />
          );
        }}
      >
        {' '}
      </Column>
      <Column
        dataKey="accession"
        renderer={(acc) => {
          return (
            <Link
              to={{
                description: {
                  main: { key: 'taxonomy' },
                  taxonomy: { db: 'uniprot', accession: acc },
                },
              }}
            >
              {acc}
            </Link>
          );
        }}
      >
        Tax ID
      </Column>
      <Column
        dataKey="name"
        renderer={(name, { accession }) => {
          return (
            <>
              <Link
                to={{
                  description: {
                    main: { key: 'taxonomy' },
                    taxonomy: { db: 'uniprot', accession },
                  },
                }}
              >
                {name}
              </Link>
            </>
          );
        }}
      >
        Name
      </Column>
      <Column
        dataKey="proteins"
        cellClassName={f('table-center')}
        headerClassName={f('table-center')}
        renderer={(count, { accession }) => (
          <Link
            to={{
              description: {
                ...description,
                protein: {
                  db: 'uniprot',
                  order: 1,
                  isFilter: true,
                },
                taxonomy: {
                  db: 'uniprot',
                  accession,
                  isFilter: true,
                  order: 2,
                },
              },
            }}
          >
            <NumberComponent abbr>{count}</NumberComponent>
          </Link>
        )}
      >
        protein count
      </Column>
      <Column
        dataKey="accession"
        defaultKey="proteinFastas"
        headerClassName={f('table-center')}
        cellClassName={f('table-center')}
        renderer={ProteinDownloadRenderer((description /*: any */))}
      >
        FASTA
      </Column>
    </Table>
  );
};
_KeySpeciesTableWithData.propTypes = {
  data: dataPropType.isRequired,
  description: T.object,
  status: T.number,
};
const mapStateToPropsDefault = createSelector(
  (state) => state.customLocation.description,
  (description) => ({ description }),
);
const KeySpeciesTableData = connect(mapStateToPropsDefault)(
  loadData({
    getUrl: ({ ...args }) => {
      const reversed = getReversedUrl({ ...args });
      return `${reversed}${reversed.indexOf('?') >= 0 ? '&' : '?'}key_species`;
    },
  })(_KeySpeciesTableWithData),
);

/*:: type Props = {}; */
/*:: type State = {
    open: boolean,
}; */

class KeySpeciesTable extends PureComponent /*:: <Props, State> */ {
  constructor(props /*: Props */) {
    super(props);
    this.state = { open: true };
  }
  render() {
    const { open } = this.state;
    return (
      <>
        <button onClick={() => this.setState({ open: !open })}>
          <h4>{open ? '▾ Hide' : '▸ Show'} Key Species</h4>
        </button>
        {open && <KeySpeciesTableData />}
      </>
    );
  }
}

export default KeySpeciesTable;
