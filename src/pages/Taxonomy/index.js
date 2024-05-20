// @flow
/* eslint-disable react/display-name */
/* eslint-disable camelcase */
import React, { PureComponent, useEffect, useState } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';
import { cloneDeep } from 'lodash-es';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { includeTaxonFocusedOnURL } from 'higherOrder/loadData/defaults';

import Link from 'components/generic/Link';
import MemberDBSelector from 'components/MemberDBSelector';
// $FlowFixMe
import TaxonomyCard from 'components/Taxonomy/Card';
import Table, {
  Column,
  Card,
  SearchBox,
  PageSizeSelector,
  Exporter,
  HighlightToggler,
} from 'components/Table';
// $FlowFixMe
import File from 'components/File';
// $FlowFixMe
import APIViewButton from 'components/Table/Exporter/APIViewButton';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import HighlightedText from 'components/SimpleCommonComponents/HighlightedText';
import NumberComponent from 'components/NumberComponent';

import loadable from 'higherOrder/loadable';

import {
  schemaProcessDataTable,
  schemaProcessDataTableRow,
} from 'schema_org/processors';

import subPages from 'subPages';
import config from 'config';

import EndPointPage from '../endpoint-page';
import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from '../style.css';
import styles from 'styles/blocks.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import exporterStyle from 'components/Table/Exporter/style.css';
import local from './style.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';

const f = foundationPartial(
  ebiGlobalStyles,
  pageStyle,
  styles,
  fonts,
  exporterStyle,
  local,
  filtersAndTable,
);

const EntryAccessionsRenderer = (entryDB) => (taxId, _row, extra) => (
  <File
    fileType="accession"
    name={`${entryDB || 'all'}-entry-accessions-for-${taxId}.txt`}
    count={extra && extra.counters && extra.counters.entries}
    customLocationDescription={{
      main: { key: 'entry' },
      entry: { db: entryDB || 'all' },
      taxonomy: { isFilter: true, db: 'UniProt', accession: `${taxId}` },
    }}
  />
);

const ProteinFastasRenderer = (entryDB) => (taxId, _row, extra) => (
  <File
    fileType="fasta"
    name={`protein-sequences${
      entryDB ? `-matching-${entryDB}` : ''
    }-for-${taxId}.fasta`}
    count={extra && extra.counters && extra.counters.proteins}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: 'UniProt' },
      entry: { isFilter: true, db: entryDB || 'all' },
      taxonomy: { isFilter: true, db: 'UniProt', accession: `${taxId}` },
    }}
  />
);

const SummaryAsync = loadable({
  loader: () =>
    import(
      // $FlowFixMe
      /* webpackChunkName: "taxonomy-summary" */ 'components/Taxonomy/Summary'
    ),
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const propTypes = {
  data: dataPropType.isRequired,
  isStale: T.bool.isRequired,
  customLocation: T.shape({
    description: T.object.isRequired,
    search: T.object,
  }).isRequired,
  match: T.string,
  dataBase: dataPropType,
  exactMatch: T.shape({
    metadata: T.object,
  }),
};

const subPagesForTaxonomy = new Map();
for (const subPage of config.pages.taxonomy.subPages) {
  subPagesForTaxonomy.set(subPage, subPages.get(subPage));
}
const AllTaxDownload = (
  {
    description,
    search,
    count,
    focused,
    fileType,
  } /*: {description: Object, search: Object, count: number, focused: ?string, fileType: string} */,
) => {
  const newDescription = cloneDeep(description);
  if (focused) {
    newDescription.taxonomy.accession = focused;
  }
  return (
    <File
      fileType={fileType}
      name={`taxon.${fileType}`}
      count={count}
      customLocationDescription={newDescription}
      search={{ ...search, extra_fields: 'counters:entry-protein' }}
      endpoint={'taxonomy'}
    />
  );
};
AllTaxDownload.propTypes = {
  description: T.object,
  search: T.object,
  count: T.number,
  focused: T.string,
  fileType: T.string,
};

/*:: type Props = {
  data: {
   payload: Object,
   loading: boolean,
   ok: boolean,
   url: string,
   status: number
  },
  isStale: boolean,
  customLocation: {
    description: Object,
    search: Object
  },
  match: string,
  dataBase: {
   payload: Object,
   loading: boolean
  },
  exactMatch: {
    metadata: Object,
  },
};
  type State = {
    focused: ?string,
  }
*/
class List extends PureComponent /*:: <Props,State> */ {
  /*:: _payload: Object; */
  static propTypes = propTypes;
  state = {
    focused: null,
  };

  render() {
    const {
      data: { payload, loading, ok, url, status },
      isStale,
      customLocation: { description, search },
      dataBase,
      exactMatch,
    } = this.props;
    let _payload = payload;
    let _status = status;
    const {
      entry: { db: entryDB },
    } = description;

    const HTTP_OK = 200;
    let notFound = !loading && status !== HTTP_OK;
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
    if (loading || notFound) {
      _payload = {
        results: [],
        count: 0,
        next: null,
        previous: null,
      };
    }
    const results = [...(_payload.results || [])];
    let size = _payload.count || 0;
    if (exactMatch) {
      const indexInPayload = results.findIndex(
        ({ metadata: { accession } }) =>
          accession === exactMatch.metadata.accession,
      );
      if (indexInPayload >= 0) {
        results.splice(indexInPayload, 1);
        size--;
      }

      results.splice(0, 1, {
        ...exactMatch,
        extra_fields: {
          counters: exactMatch.metadata.counters,
        },
        metadata: {
          ...exactMatch.metadata,
          name:
            exactMatch.metadata.name.short ||
            exactMatch.metadata.name.name ||
            exactMatch.metadata.name,
          exact_match: true,
        },
        className: f(local.exactMatch),
      });
      size++;
      notFound = false;
      _status = HTTP_OK;
    }
    const urlToExport = includeTaxonFocusedOnURL(url);
    // const hasTaxIdRegex = /taxonomy\/uniprot\/\d+/gi;
    // if (
    //   this.state.focused &&
    //   +this.state.focused !== 1 &&
    //   !url.match(hasTaxIdRegex)
    // ) {
    //   urlToExport = urlToExport.replace(
    //     /taxonomy\/uniprot\//,
    //     `/taxonomy/uniprot/${this.state.focused}/`,
    //   );
    // }
    return (
      <div className={f('row', 'filters-and-table')}>
        <nav>
          <div className={f('browse-side-panel')}>
            <div className={f('selector-container')}>
              <MemberDBSelector
                contentType="taxonomy"
                className="pp-left-side-db-selector"
              />
            </div>
            <hr style={{ paddingTop: '0.5rem' }} />
          </div>
        </nav>
        <section>
          {databases && (
            <SchemaOrgData
              data={{
                data: { db: databases.uniprot },
                location: window.location,
              }}
              processData={schemaProcessDataTable}
            />
          )}
          <Table
            dataTable={results}
            contentType="taxonomy"
            loading={loading}
            ok={ok}
            status={_status}
            isStale={isStale}
            actualSize={size}
            query={search}
            notFound={notFound}
            withTree={true}
            withGrid={true}
            databases={databases}
            nextAPICall={_payload.next}
            previousAPICall={_payload.previous}
            currentAPICall={url}
            onFocusChanged={(focused) => this.setState({ focused })}
          >
            <Exporter>
              <div className={f('menu-grid')}>
                <label htmlFor="json">JSON</label>
                <AllTaxDownload
                  description={description}
                  name="json"
                  search={search}
                  count={size}
                  focused={this.state.focused}
                  fileType="json"
                />

                <label htmlFor="tsv">TSV</label>
                <AllTaxDownload
                  description={description}
                  name="tsv"
                  search={search}
                  count={size}
                  focused={this.state.focused}
                  fileType="tsv"
                />

                <label htmlFor="api">API</label>
                <APIViewButton url={urlToExport} />
              </div>
            </Exporter>
            <PageSizeSelector />
            <Card>
              {(data) => (
                <TaxonomyCard
                  data={data}
                  search={search.search}
                  entryDB={entryDB}
                />
              )}
            </Card>
            <SearchBox loading={isStale}>Search taxonomy</SearchBox>
            <HighlightToggler />
            <Column
              dataKey="accession"
              renderer={(accession /*: string */, row) => (
                <Link
                  to={(customLocation) => ({
                    description: {
                      main: { key: 'taxonomy' },
                      taxonomy: {
                        ...customLocation.description.taxonomy,
                        accession: accession.toString(),
                      },
                    },
                  })}
                >
                  <SchemaOrgData
                    data={{
                      data: { row, endpoint: 'taxonomy' },
                      location: window.location,
                    }}
                    processData={schemaProcessDataTableRow}
                  />
                  <HighlightedText
                    text={accession}
                    textToHighlight={search.search}
                  />
                </Link>
              )}
            >
              Tax ID
            </Column>
            <Column
              dataKey="name"
              renderer={(
                name /*: string */,
                { accession } /*: {accession: string} */,
              ) => (
                <Link
                  to={(customLocation) => ({
                    description: {
                      main: { key: 'taxonomy' },
                      taxonomy: {
                        ...customLocation.description.taxonomy,
                        accession: accession.toString(),
                      },
                    },
                  })}
                >
                  <HighlightedText
                    text={name}
                    textToHighlight={search.search}
                  />
                </Link>
              )}
            >
              Name
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="entry-count"
              renderer={(accession /*: string */, _row, extra) => {
                const count =
                  (extra && extra.counters && extra.counters.entries) || '-';
                return (
                  <Link
                    className={f('no-decoration')}
                    to={{
                      description: {
                        main: { key: 'taxonomy' },
                        taxonomy: {
                          db: 'uniprot',
                          accession: `${accession}`,
                        },
                        entry: { isFilter: true, db: entryDB || 'all' },
                      },
                    }}
                  >
                    <NumberComponent loading={loading} abbr>
                      {count}
                    </NumberComponent>
                  </Link>
                );
              }}
            >
              Entry count
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="entryAccessions"
              renderer={EntryAccessionsRenderer(entryDB)}
            >
              Entry accessions
            </Column>
            <Column
              dataKey="accession"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              defaultKey="protein-count"
              renderer={(accession /*: string */, _row, extra) => {
                const count =
                  (extra && extra.counters && extra.counters.proteins) || '-';
                return (
                  <Link
                    to={{
                      description: {
                        main: { key: 'taxonomy' },
                        taxonomy: {
                          db: 'uniprot',
                          accession: `${accession}`,
                        },
                        protein: { isFilter: true, db: 'UniProt', order: 1 },
                        entry: entryDB
                          ? { isFilter: true, db: entryDB, order: 2 }
                          : null,
                      },
                    }}
                  >
                    <NumberComponent loading={loading} abbr>
                      {count}
                    </NumberComponent>
                  </Link>
                );
              }}
            >
              <Tooltip title="All the proteins for this taxonomy containing an entry from the selected database">
                Protein count
              </Tooltip>
            </Column>
            <Column
              dataKey="accession"
              defaultKey="proteinFastas"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              renderer={ProteinFastasRenderer(entryDB)}
            >
              FASTA
            </Column>
          </Table>
        </section>
      </div>
    );
  }
}
const childRoutes = /(\d+)|(all)/i;

const _ExactMatchSearch = ({ data, onSearchComplete }) => {
  useEffect(() => {
    onSearchComplete(data && !data.loading && data.payload);
  });
  return null;
};

const getURLFromState = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, { search }) => {
    if (search && search.match(/^\d+$/)) {
      const desc = {
        ...description,
        taxonomy: {
          db: 'uniprot',
          accession: search,
        },
      };
      try {
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(desc),
        });
      } catch {
        return;
      }
    } else if (search && search.match(/^[\w ]+$/)) {
      try {
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(description),
          search: `?scientific_name=${search}`,
        });
      } catch {
        return;
      }
    }
  },
);

const ExactMatchSearch = loadData(getURLFromState)(_ExactMatchSearch);

const Taxonomy = ({ search }) => {
  const [accSearch, setAccSearch] = useState(null);
  const searchTerm = search && search.search;
  return (
    <>
      {searchTerm && <ExactMatchSearch onSearchComplete={setAccSearch} />}
      <EndPointPage
        subpagesRoutes={childRoutes}
        listOfEndpointEntities={List}
        SummaryAsync={SummaryAsync}
        subPagesForEndpoint={subPagesForTaxonomy}
        exactMatch={(searchTerm && accSearch) || null}
      />
    </>
  );
};
Taxonomy.propTypes = {
  search: T.shape({
    search: T.string,
  }),
};

const mapStateToProps = createSelector(
  (state) => state.customLocation.search,
  (search) => ({ search }),
);

export default connect(mapStateToProps)(Taxonomy);
