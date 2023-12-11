// @flow
/* eslint no-magic-numbers: [1, {ignore: [0, 1, 2, 100]}]*/
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import Footer from 'components/Table/Footer';
import { edgeCases } from 'utils/server-message';
// $FlowFixMe
import EdgeCase from 'components/EdgeCase';

// $FlowFixMe
import IDAOptions from './Options';
// $FlowFixMe
import IDAProtVista from './IDAProtVista';
// $FlowFixMe
import TextIDA from './TextIDA';
import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from './style.css';
import protvista from 'components/ProteinViewer/style.css';

const f = foundationPartial(ebiGlobalStyles, pageStyle, protvista, fonts);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const FAKE_PROTEIN_LENGTH = 1000;
const GAP_BETWEEN_DOMAINS = 5;

const schemaProcessData = (data) => ({
  '@id': '@additionalProperty',
  '@type': 'PropertyValue',
  name: 'isContainedIn',
  value: [
    {
      '@type': 'CreativeWork',
      additionalType: 'DomainArchitecture',
      identifier: data.ida_id,
      name: data.ida,
    },
  ],
});
/*::
type Representative = {
  domains:Array<{
    name: string,
    coordinates: {
      fragments: {
          start: number;
          end: number;
      }[]
    }[]
  }>,
  length: number
}|typeof undefined
*/
export const ida2json = (
  ida /*: string */,
  representative /*: Representative */,
  entry /*: string */,
) /*: {    length: number,    domains: Array<mixed>,    accessions: Array<string>  } */ => {
  const idaParts = ida.split('-');
  const n = idaParts.length;
  const feature = (FAKE_PROTEIN_LENGTH - GAP_BETWEEN_DOMAINS * (n + 1)) / n;
  const repDomains = representative ? [...representative.domains] : [];
  const domains = idaParts.map((p, i) => {
    const [pf, ipr] = p.split(':');
    let [namePf, nameIpr] = p.split(':');
    let locations = [
      {
        fragments: [
          {
            start: GAP_BETWEEN_DOMAINS + i * (GAP_BETWEEN_DOMAINS + feature),
            end: (i + 1) * (GAP_BETWEEN_DOMAINS + feature),
          },
        ],
      },
    ];
    if (representative) {
      const [pfLocation, iprLocation] = repDomains.splice(0, ipr ? 2 : 1);
      if (pfLocation?.name) namePf = pfLocation.name;
      if (iprLocation?.name) nameIpr = iprLocation.name;
      locations =
        entry === 'pfam'
          ? pfLocation?.coordinates
          : iprLocation?.coordinates || pfLocation?.coordinates;
    }
    return {
      // accession: ipr || pf,
      accession: entry === 'pfam' ? pf : ipr || pf,
      name: entry === 'pfam' ? namePf : nameIpr || namePf,
      unintegrated: !ipr,
      locations,
    };
  });
  const grouped = domains.reduce((obj, domain) => {
    if (obj[domain.accession])
      obj[domain.accession].locations.push(domain.locations[0]);
    else
      obj[domain.accession] = { ...domain, locations: [...domain.locations] };
    return obj;
  }, {});
  const obj = {
    length: representative?.length || FAKE_PROTEIN_LENGTH,
    domains: Object.values(grouped),
    accessions: domains.map((d) => d.accession),
  };
  return obj;
};
const getMaxLength = (idaResults) => {
  const max = Math.max(
    ...idaResults.map((result) => result?.representative?.length || 0),
  );
  return max === 0 ? FAKE_PROTEIN_LENGTH : 100 * Math.ceil(max / 100);
};

/* :: type DomainArchitecturesWithDataProps = {
  data: Object,
  dataDB: Object,
  mainAccession: string,
  search: Object,
  highlight: Array<string>,
  idaAccessionDB: string,
  database: string,
}
*/
class _DomainArchitecturesWithData extends PureComponent /*:: <DomainArchitecturesWithDataProps> */ {
  static propTypes = {
    data: T.object.isRequired,
    mainAccession: T.string,
    search: T.object,
    dataDB: T.object.isRequired,
    highlight: T.arrayOf(T.string),
    idaAccessionDB: T.string,
    database: T.string,
  };

  render() {
    const {
      data: { loading, payload, status },
      mainAccession,
      search,
      dataDB,
      highlight = [],
      idaAccessionDB,
      database,
    } = this.props;
    if (loading || dataDB.loading) return <Loading />;
    const edgeCaseText = edgeCases.get(status);
    if (edgeCaseText) return <EdgeCase text={edgeCaseText} status={status} />;

    if (!payload.results) return null;
    const toHighlight =
      highlight.length === 0 && mainAccession ? [mainAccession] : highlight;

    let messageContent;
    if (payload.count === 0) {
      const searchEntries = search.ida_search.split(',');
      const invalidEntries = [];
      searchEntries.forEach((entry) => {
        const matches = entry.match(new RegExp(/(ipr|pf)/, 'ig'));
        if (!matches) invalidEntries.push(entry);
      });

      messageContent = (
        <div className={f('callout', 'info', 'withicon')}>
          <b>No Domain architectures found</b>. They are calculated for InterPro
          entries of type <b>Domain</b>. Please make sure the type is Domain for
          the accessions you are searching for.
          {invalidEntries.length > 0 ? (
            <div style={{ margin: '1rem' }}>
              Please check if the following are valid <b>InterPro</b> or{' '}
              <b>Pfam</b> accessions:
              <ul>
                {invalidEntries.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      );
    } else {
      messageContent = (
        <>
          <h4>{payload.count} domain architectures found.</h4>
          {!database && <IDAOptions />}
        </>
      );
    }
    const maxLength = getMaxLength(payload.results || []);
    return (
      <div className={f('row')}>
        <div className={f('columns')}>
          {messageContent}
          {(payload.results || []).map((obj) => {
            const currentDB = (database || idaAccessionDB).toLowerCase();
            const idaObj = ida2json(obj.ida, obj.representative, currentDB);
            const representativeAcc = obj?.representative?.accession;
            return (
              <div key={obj.ida_id} className={f('margin-bottom-large')}>
                <SchemaOrgData data={obj} processData={schemaProcessData} />
                <div>
                  <Link
                    to={{
                      description: {
                        main: { key: 'protein' },
                        protein: { db: 'UniProt' },
                        entry: {
                          db: database || idaAccessionDB,
                          accession: mainAccession,
                        },
                      },
                      search: { ida: obj.ida_id },
                    }}
                  >
                    There {obj.unique_proteins > 1 ? 'are' : 'is'}{' '}
                    {obj.unique_proteins}{' '}
                    {toPlural('protein', obj.unique_proteins)}{' '}
                  </Link>
                  with this architecture
                  {representativeAcc && (
                    <>
                      {' '}
                      (represented by{' '}
                      <Link
                        to={{
                          description: {
                            main: { key: 'protein' },
                            protein: {
                              db: 'uniprot',
                              accession: representativeAcc,
                            },
                          },
                        }}
                      >
                        {representativeAcc}
                      </Link>
                      )
                    </>
                  )}
                  :
                </div>
                <TextIDA accessions={idaObj.accessions} />
                <IDAProtVista
                  matches={idaObj.domains}
                  length={idaObj.length}
                  maxLength={maxLength}
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
            notFound={false}
          />
        </div>
      </div>
    );
  }
}

const getUrlFor = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
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
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  (state) => state.customLocation.search,
  (state) => state.settings.ui,
  (mainAccession, search, { idaAccessionDB }) => ({
    mainAccession,
    search,
    idaAccessionDB,
  }),
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
