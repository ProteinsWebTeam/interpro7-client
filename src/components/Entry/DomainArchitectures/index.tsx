import React from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import Footer from 'components/Table/Footer';
import { edgeCases } from 'utils/server-message';
import EdgeCase from 'components/EdgeCase';

import IDAOptions from './Options';
import IDAProtVista from './IDAProtVista';
import TextIDA from './TextIDA';
import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import loadable from 'higherOrder/loadable';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { toPlural } from 'utils/pages/toPlural';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import pageStyle from './style.css';
import protvista from 'components/ProteinViewer/style.css';

const css = cssBinder(pageStyle, protvista, fonts);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const FAKE_PROTEIN_LENGTH = 1000;
const GAP_BETWEEN_DOMAINS = 5;

const schemaProcessData = (data: { ida_id: string; ida: string }) => ({
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

type Representative =
  | {
      domains: Array<{
        name: string;
        coordinates: {
          fragments: {
            start: number;
            end: number;
          }[];
        }[];
      }>;
      length: number;
    }
  | undefined;

type ProcessedDomain = {
  accession: string;
  name: string;
  unintegrated: boolean;
  locations: Array<ProtVistaLocation>;
};
export const ida2json = (
  ida: string,
  representative: Representative,
  entry?: string,
): {
  length: number;
  domains: Array<ProcessedDomain>;
  accessions: Array<string>;
} => {
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
      accession: entry === 'pfam' ? pf : ipr || pf,
      name: entry === 'pfam' ? namePf : nameIpr || namePf,
      unintegrated: !ipr,
      locations,
    } as ProcessedDomain;
  });
  const grouped = domains.reduce(
    (obj, domain) => {
      if (obj[domain.accession])
        obj[domain.accession].locations.push(domain.locations[0]);
      else
        obj[domain.accession] = { ...domain, locations: [...domain.locations] };
      return obj;
    },
    {} as Record<string, ProcessedDomain>,
  );
  const obj = {
    length: representative?.length || FAKE_PROTEIN_LENGTH,
    domains: Object.values(grouped),
    accessions: domains.map((d) => d.accession),
  };
  return obj;
};

const getMaxLength = (
  idaResults: Array<{ representative?: { length: number } }>,
) => {
  const max = Math.max(
    ...idaResults.map((result) => result?.representative?.length || 0),
  );
  return max === 0 ? FAKE_PROTEIN_LENGTH : 100 * Math.ceil(max / 100);
};

type Props = {
  mainAccession?: string;
  search?: Record<string, string>;
  highlight?: Array<string>;
  idaAccessionDB?: string;
  database: string;
};
interface LoadedProps
  extends Props,
    LoadDataProps<RootAPIPayload, 'DB'>,
    LoadDataProps<IDAPayload> {}

export const DomainArchitecturesWithData = ({
  data,
  mainAccession,
  search,
  dataDB,
  highlight = [],
  idaAccessionDB,
  database,
}: LoadedProps) => {
  const { loading, payload, status } = data || {};
  if (loading || dataDB?.loading) return <Loading />;
  const edgeCaseText = edgeCases.get(status || 0);
  if (edgeCaseText)
    return <EdgeCase text={edgeCaseText} status={status || 0} />;

  if (!payload?.results) return null;
  const toHighlight =
    highlight.length === 0 && mainAccession ? [mainAccession] : highlight;

  let messageContent;
  if (payload.count === 0) {
    messageContent = (
      <div className={css('callout', 'warning')}>
        No domain architectures found. Domain architectures are calculated for
        InterPro entries of type Domain. Please ensure that the entries you are
        searching are of type Domain.
      </div>
    );
  } else {
    messageContent = <h4>{payload.count} domain architectures</h4>;
  }
  const maxLength = getMaxLength(payload.results || []);
  return (
    <div className={css('row')}>
      <div className={css('columns')}>
        {messageContent}
        <IDAOptions showDBSelector={!database} count={payload.count} />
        {(payload.results || []).map((obj) => {
          const currentDB = (database || idaAccessionDB || '').toLowerCase();
          const idaObj = ida2json(obj.ida, obj.representative, currentDB);
          const representativeAcc = obj?.representative?.accession;
          return (
            <div key={obj.ida_id} className={css('margin-bottom-large')}>
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
                databases={dataDB?.payload?.databases || {}}
                highlight={toHighlight}
              />
              {/* <pre>{JSON.stringify(idaObj, null, ' ')}</pre>*/}
            </div>
          );
        })}
        <Footer
          withPageSizeSelector={true}
          actualSize={payload.count}
          pagination={search || {}}
          nextAPICall={payload.next}
          previousAPICall={payload.previous}
          notFound={false}
        />
      </div>
    </div>
  );
};

const getUrlFor = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit from search
    const { type, search: _, ..._search } = search;
    // add to search
    _search.ida = '';
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
  (state: GlobalState) =>
    state.customLocation.description.main.key &&
    (
      state.customLocation.description[
        state.customLocation.description.main.key
      ] as EndpointLocation
    ).accession,
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.settings.ui,
  (mainAccession, search, { idaAccessionDB }) => ({
    mainAccession,
    search,
    idaAccessionDB,
  }),
);

export default loadData<RootAPIPayload, 'DB'>({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
})(
  loadData({
    getUrl: getUrlFor,
    mapStateToProps,
  } as Params)(DomainArchitecturesWithData),
);
