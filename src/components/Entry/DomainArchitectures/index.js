/* eslint no-magic-numbers: [1, {ignore: [0, 1, 2, 3, 10]}]*/
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import Footer from 'components/Table/Footer';
import ProtVistaMatches from 'components/Matches/ProtVistaMatches';
import DynamicTooltip from 'components/SimpleCommonComponents/DynamicTooltip';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import { toPlural } from 'utils/pages';
import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from './style.css';
import protvista from 'components/ProtVista/style.css';
import { getUrlForMeta } from '../../../higherOrder/loadData/defaults';

const f = foundationPartial(ebiGlobalStyles, pageStyle, protvista, fonts);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const FAKE_PROTEIN_LENGTH = 1000;
const GAP_BETWEEN_DOMAINS = 5;

const schemaProcessData = data => ({
  '@id': '@isContainedIn',
  '@type': [
    'DomainArchitecture',
    'StructuredValue',
    'BioChemEntity',
    'CreativeWork',
  ],
  identifier: data.ida_id,
  name: data.ida,
});

export const ida2json = (ida, domain) => {
  const idaParts = ida.split('-');
  const n = idaParts.length;
  const feature = (FAKE_PROTEIN_LENGTH - GAP_BETWEEN_DOMAINS * (n + 1)) / n;
  const domains = idaParts.map((p, i) => {
    const [pf, ipr] = p.split(':');
    return {
      // accession: ipr || pf,
      accession: domain === 'pfam' ? pf : ipr || pf,
      unintegrated: !ipr,
      locations: [
        {
          fragments: [
            {
              start: GAP_BETWEEN_DOMAINS + i * (GAP_BETWEEN_DOMAINS + feature),
              end: (i + 1) * (GAP_BETWEEN_DOMAINS + feature),
            },
          ],
        },
      ],
    };
  });
  const grouped = domains.reduce((obj, domain) => {
    if (obj[domain.accession])
      obj[domain.accession].locations.push(domain.locations[0]);
    else obj[domain.accession] = domain;
    return obj;
  }, {});
  const obj = {
    length: FAKE_PROTEIN_LENGTH,
    domains: Object.values(grouped),
    accessions: domains.map(d => d.accession),
  };
  return obj;
};

export const TextIDA = ({ accessions } /*: {accessions: Array<string>} */) => (
  <div>
    {accessions.map((accession, i) => (
      <React.Fragment key={i}>
        {i !== 0 && ' - '}
        <span>
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: accession.toLowerCase().startsWith('ipr')
                    ? 'InterPro'
                    : 'pfam',
                  accession,
                },
              },
            }}
          >
            {' '}
            {accession}{' '}
          </Link>
        </span>
      </React.Fragment>
    ))}
  </div>
);

TextIDA.propTypes = {
  accessions: T.arrayOf(T.string),
};
/* :: type Props = {
  matches: Array<Object>,
  highlight: Array<string>,
  databases: Object
}
*/
export class IDAProtVista extends ProtVistaMatches {
  static propTypes = {
    matches: T.arrayOf(T.object).isRequired,
    databases: T.object.isRequired,
    highlight: T.arrayOf(T.string),
  };

  updateTracksWithData(props /*: Props */) {
    const { matches } = props;

    for (const domain of matches) {
      const isIPR = domain.accession.toLowerCase().startsWith('ipr');
      const sourceDatabase = isIPR ? 'interpro' : 'pfam';
      const tmp = [
        {
          name: domain.accession,
          source_database: sourceDatabase,
          // color: !isIPR
          //   ? getTrackColor(
          //       { accession: domain.accession },
          //       EntryColorMode.ACCESSION,
          //     )
          //   : '#888888',
          color: getTrackColor(
            { accession: domain.accession },
            EntryColorMode.ACCESSION,
          ),
          type: 'entry',
          ...domain,
        },
      ];
      this.web_tracks[domain.accession].data = tmp;
    }
  }

  render() {
    const { matches, length, databases, highlight = [] } = this.props;
    return (
      <div>
        {matches.map(d => (
          <div key={d.accession} className={f('track-row')}>
            <div
              className={f('track-component', {
                highlight: highlight.indexOf(d.accession) >= 0,
              })}
            >
              <DynamicTooltip
                type="entry"
                source={
                  d.accession.toLowerCase().startsWith('ipr')
                    ? 'interpro'
                    : 'pfam'
                }
                accession={`${d.accession}`}
                databases={databases}
              >
                <protvista-interpro-track
                  length={length}
                  displaystart="1"
                  displayend={length}
                  id={`track_${d.accession}`}
                  ref={e => (this.web_tracks[d.accession] = e)}
                  shape="roundRectangle"
                  expanded
                />
              </DynamicTooltip>
            </div>
            <div className={f('track-accession')}>
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: {
                      db: d.accession.toLowerCase().startsWith('ipr')
                        ? 'InterPro'
                        : 'pfam',
                      accession: d.accession,
                    },
                  },
                }}
              >
                {d.accession}
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

/* :: type DomainArchitecturesWithDataProps = {
  data: Object,
  dataDB: Object,
  mainAccession: string,
  search: Object,
  highlight: Array<string>,
}
*/
class _DomainArchitecturesWithData extends PureComponent /*:: <DomainArchitecturesWithDataProps> */ {
  static propTypes = {
    data: T.object.isRequired,
    mainAccession: T.string,
    search: T.object,
    dataDB: T.object.isRequired,
    highlight: T.arrayOf(T.string),
  };

  constructor(props) {
    super(props);

    this.state = {
      domain: 'pfam',
    };
  }
  toggleDomain = () => {
    if (this.state.domain === 'pfam') this.setState({ domain: 'interpro' });
    else this.setState({ domain: 'pfam' });
  };

  render() {
    const {
      data: { loading, payload },
      mainAccession,
      search,
      dataDB,
      highlight = [],
    } = this.props;
    if (loading || dataDB.loading) return <Loading />;

    if (!payload.results) return null;
    const toHighlight =
      highlight.length === 0 && mainAccession ? [mainAccession] : highlight;
    return (
      <div className={f('row')}>
        <div className={f('columns')}>
          {payload.count === 0 ? (
            <div className={f('callout', 'info', 'withicon')}>
              There are no Domain architectures for the current selection.
            </div>
          ) : (
            <h4>
              {payload.count} domain architectures found.
              <Tooltip title="Toogle between domain architectures based on Pfam and InterPro entries">
                {this.state.domain === 'pfam' ? (
                  <button
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf204;"
                    onClick={this.toggleDomain}
                  />
                ) : (
                  <button
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf205;"
                    onClick={this.toggleDomain}
                  />
                )}
              </Tooltip>
            </h4>
          )}
          {(payload.results || []).map(obj => {
            const idaObj = ida2json(obj.ida, this.state.domain);
            return (
              <div key={obj.ida_id} className={f('margin-bottom-large')}>
                <SchemaOrgData data={obj} processData={schemaProcessData} />
                <div>
                  <Link
                    to={{
                      description: {
                        main: { key: 'protein' },
                        protein: { db: 'UniProt' },
                        entry: { db: 'InterPro', accession: mainAccession },
                      },
                      search: { ida: obj.ida_id },
                    }}
                  >
                    There {obj.unique_proteins > 1 ? 'are' : 'is'}{' '}
                    {obj.unique_proteins}{' '}
                    {toPlural('protein', obj.unique_proteins)}{' '}
                  </Link>
                  with this architecture:
                </div>
                <TextIDA accessions={idaObj.accessions} />
                <IDAProtVista
                  matches={idaObj.domains}
                  length={FAKE_PROTEIN_LENGTH}
                  databases={dataDB.payload.databases}
                  highlight={toHighlight}
                />
                {/* <pre>{JSON.stringify(idaObj, null, ' ')}</pre>*/}
              </div>
            );
          })}
          <Footer
            withPageSizeSelector={true}
            actualSize={payload.count}
            pagination={search}
            nextAPICall={payload.next}
            previousAPICall={payload.previous}
          />
        </div>
      </div>
    );
  }
}

const getUrlFor = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { type, search: _, ..._search } = search;
    // add to search
    _search.ida = null;
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath(description).replace('domain_architecture', ''),
      query: _search,
    });
  },
);

const mapStateToProps = createSelector(
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  state => state.customLocation.search,
  (mainAccession, search) => ({ mainAccession, search }),
);

export const DomainArchitecturesWithData = _DomainArchitecturesWithData;
export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
})(
  loadData({
    getUrl: getUrlFor,
    mapStateToProps,
  })(DomainArchitecturesWithData),
);
