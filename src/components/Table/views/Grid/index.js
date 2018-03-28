import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import MemberSymbol from 'components/Entry/MemberSymbol';
import { NumberComponent } from 'components/NumberLabel';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts);

const lut = new Map([
  ['3702', { shortname: 'Mouse-ear cress' }],
  ['6239', { shortname: 'C. elegans', icon: 'W' }],
  ['7227', { shortname: 'Fruit fly', icon: 'F' }],
  ['7739', { shortname: 'Amphioxus' }],
  ['7955', { shortname: 'Zebrafish', icon: 'Z' }],
  ['8078', { shortname: 'Mummichog' }],
  ['8355', { shortname: 'African clawed frog', icon: 'f' }],
  ['9031', { shortname: 'Chicken', icon: 'k' }],
  ['9430', { shortname: 'Vampire bat', icon: '(' }],
  ['9544', { shortname: 'Rhesus macaque', icon: 'r' }],
  ['9601', { shortname: 'Sumatran orangutan', icon: '*' }],
  ['9606', { shortname: 'Human', icon: 'H' }],
  ['9615', { shortname: 'Dog', icon: 'd' }],
  ['9823', { shortname: 'Pig', icon: 'p' }],
  ['9913', { shortname: 'Bovine', icon: 'C' }],
  ['10090', { shortname: 'Mouse', icon: 'M' }],
  ['10116', { shortname: 'Rat', icon: 'R' }],
  ['31033', { shortname: 'Fugu rubripes', icon: 'E' }],
  ['35525', { shortname: 'Daphnia magna' }],
  ['39947', { shortname: 'Rice', icon: '6' }],
  ['282301', { shortname: 'Macrostomum lignano' }],
  ['559292', { shortname: 'Baker s yeast', icon: 'Y' }],
]);

const getUrlFor = accession =>
  createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      format({
        protocol,
        hostname,
        port,
        pathname:
          root +
          descriptionToPath({
            main: { key: 'organism' },
            organism: { db: 'taxonomy', accession },
          }),
      }),
  );
class Lineage extends PureComponent {
  render() {
    const { entryDB, metadata } = this.props;
    return <div>test</div>;
  }
}
class SummaryCounter extends PureComponent {
  render() {
    const { entryDB, metadata, data: { loading, payload } } = this.props;
    return (
      <div className={f('card-item-m', 'card-sum-info', 'label-off')}>
        <div className={f('count-entries')}>
          {loading ? 0 : payload.metadata.lineage}
          <Tooltip
            title={`${
              loading ? 0 : payload.metadata.counters.entries
            } ${entryDB} entries matching ${metadata.name}`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'organism' },
                  organism: { db: 'taxonomy', accession: metadata.accession },
                  entry: { isFilter: true, db: 'all' },
                },
              }}
            >
              {
                // get the db
              }
              <MemberSymbol type={entryDB} className={f('md-small')} />
              <NumberComponent
                loading={loading}
                value={loading ? 0 : payload.metadata.counters.entries}
              />
              <span className={f('label-number')}>entries</span>
            </Link>
          </Tooltip>
        </div>
        <div className={f('count-proteins')}>
          <Tooltip
            title={`${
              loading ? 0 : payload.metadata.counters.proteins
            } proteins matching ${metadata.name}`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'organism' },
                  organism: { db: 'taxonomy', accession: metadata.accession },
                  protein: { isFilter: true, db: 'UniProt' },
                },
              }}
            >
              <div
                className={f('icon', 'icon-conceptual')}
                data-icon="&#x50;"
              />{' '}
              <NumberComponent
                loading={loading}
                value={loading ? 0 : payload.metadata.counters.proteins}
              />
              <span className={f('label-number')}>proteins</span>
            </Link>
          </Tooltip>
        </div>
        <div className={f('count-structures')}>
          <Tooltip
            title={`${
              loading ? 0 : payload.metadata.counters.structures
            } structures matching ${metadata.name}`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'organism' },
                  organism: { db: 'taxonomy', accession: metadata.accession },
                  structure: { isFilter: true, db: 'PDB' },
                },
              }}
            >
              <div
                className={f('icon', 'icon-conceptual')}
                data-icon="&#x73;"
              />{' '}
              <NumberComponent
                loading={loading}
                value={loading ? 0 : payload.metadata.counters.structures}
              />{' '}
              <span className={f('label-number')}>structures</span>
            </Link>
          </Tooltip>
        </div>

        <div className={f('count-proteomes')}>
          <Tooltip
            title={`${
              loading ? 0 : payload.metadata.counters.proteomes
            } proteomes matching ${metadata.name}`}
          >
            <Link
              to={{
                description: {
                  main: { key: 'organism' },
                  organism: {
                    db: metadata.source_database,
                    accession: metadata.accession,
                  },
                  structure: { isFilter: true, db: 'PDB' },
                },
              }}
            >
              <div
                className={f('icon', 'icon-common', 'icon-bookmark-temp')}
                data-icon="&#x2e;"
              />
              <NumberComponent
                loading={loading}
                value={loading ? 0 : payload.metadata.counters.proteomes}
              />{' '}
              <span className={f('label-number')}>proteomes</span>
            </Link>
          </Tooltip>
        </div>
      </div>
    );
  }
}
class GridView extends PureComponent {
  static propTypes = {
    entryDB: T.string,
    dataTable: T.array,
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  render() {
    const { dataTable, entryDB } = this.props;
    return (
      <div className={f('card-wrapper')}>
        {dataTable.map(({ metadata }) => {
          const SummaryCounterWithData = loadData(
            getUrlFor(`${metadata.accession}`),
          )(SummaryCounter);
          return (
            <div className={f('card-flex-container')} key={metadata.accession}>
              <div className={f('card-item')}>
                <div className={f('card-item-t')}>
                  <Link
                    to={{
                      description: {
                        main: { key: 'organism' },
                        organism: {
                          db: 'taxonomy',
                          accession: metadata.accession,
                        },
                      },
                    }}
                  >
                    {// E.Coli
                    metadata.accession === 562 ||
                    metadata.accession === 511693 ||
                    metadata.accession === 1248823 ||
                    metadata.accession === 1400022 ||
                    metadata.accession === 1438695 ||
                    metadata.accession === 1444037 ||
                    metadata.accession === 1444161 ||
                    metadata.accession === 1444228 ||
                    metadata.accession === 1444258 ||
                    metadata.accession === 1446533 ||
                    metadata.accession === 1446549 ||
                    metadata.accession === 1446596 ||
                    metadata.accession === 1446704 ||
                    metadata.accession === 1446753 ? (
                      <Tooltip title="This is an E.Coli icon">
                        {' '}
                        <span
                          style={{ color: '#5bc0de' }}
                          className={f('small', 'icon', 'icon-species')}
                          data-icon="&#x4c;"
                        />
                      </Tooltip>
                    ) : (
                      ''
                    )}

                    {// HUMAN
                    metadata.accession === 9606 ||
                    metadata.accession === 63221 ? (
                      <Tooltip title="This is a human icon">
                        {' '}
                        <span
                          style={{ color: '#e47471' }}
                          className={f('small', 'icon', 'icon-species')}
                          data-icon="H"
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Default species icon">
                        <span
                          style={{ color: '#ddd' }}
                          className={f('small', 'icon', 'icon-conceptual')}
                          data-icon="&#x6f;"
                        />
                      </Tooltip>
                    )}

                    <h6>{metadata.name}</h6>
                  </Link>
                </div>

                <SummaryCounterWithData entryDB={entryDB} metadata={metadata} />

                <div className={f('card-item-m')}>
                  Homo sapiens is the systematic name used in taxonomy [...]
                </div>

                <div className={f('card-item-b')}>
                  <div>
                    {metadata.parent}
                    Lineage: <Lineage entryDB={entryDB} metadata={metadata} />
                  </div>
                  <div>Tax ID: {metadata.accession}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ); //return
  } //render
} //gridview

const mapStateToProps = createSelector(
  state => state.customLocation.description.entry.db,
  entryDB => ({ entryDB }),
);
export default connect(mapStateToProps)(GridView);
