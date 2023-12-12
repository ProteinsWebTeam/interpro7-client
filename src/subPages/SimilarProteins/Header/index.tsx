import React from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

import Loading from 'components/SimpleCommonComponents/Loading';
import { ida2json } from 'components/Entry/DomainArchitectures';
import IDAProtVista from 'components/Entry/DomainArchitectures/IDAProtVista';
import IDAOptions from 'components/Entry/DomainArchitectures/Options';
import TextIDA from 'components/Entry/DomainArchitectures/TextIDA';

const FAKE_PROTEIN_LENGTH = 1000;

type DomainsPayload = PayloadList<{
  metadata: EntryMetadata;
  proteins: Array<EntryProteinMatch>;
  extra_fields?: { short_name?: string };
}>;

const formatDomainsPayload = (payload: DomainsPayload, ida: string) => {
  const namesMap: Record<string, string> = {};
  payload.results.forEach((result) => {
    if (result.metadata.source_database.toLowerCase() === 'interpro') {
      const acc = result.metadata.accession;
      namesMap[acc.toLowerCase()] = result?.extra_fields?.short_name || acc;
    }
  });

  const domainsMap: Record<string, ProtVistaLocation[]> = {};
  payload.results.forEach((result) => {
    if (result.metadata.source_database.toLowerCase() === 'pfam') {
      const acc = result.metadata.accession;
      namesMap[acc.toLowerCase()] = result?.extra_fields?.short_name || acc;

      domainsMap[acc.toLowerCase()] = [
        ...result.proteins[0].entry_protein_locations,
      ];

      if (result.metadata.integrated) {
        domainsMap[result.metadata.integrated.toLowerCase()] = [
          ...result.proteins[0].entry_protein_locations,
        ];
      }
    }
  });
  const domains: Array<{
    entry: string;
    name: string;
    coordinates: ProtVistaLocation[];
  }> = [];
  ida.split(/[:-]/).forEach((domain) => {
    domains.push({
      entry: domain.toUpperCase(),
      coordinates: domainsMap[domain.toLowerCase()].splice(0, 1),
      name: namesMap[domain.toLowerCase()] || domain,
    });
  });
  return {
    accession: payload.results?.[0]?.proteins?.[0]?.accession,
    length: payload.results?.[0]?.proteins?.[0]?.protein_length,
    domains,
  };
};

type Props = {
  accession: string;
  idaAccessionDB?: string;
  databases: DBsInfo;
};
interface LoadedProps
  extends Props,
    LoadDataProps<{ ida: string }>,
    LoadDataProps<DomainsPayload, 'Domain'> {}

const SimilarProteinsHeaderWithData = ({
  accession,
  data,
  dataDomain,
  databases,
  idaAccessionDB,
}: LoadedProps) => {
  const { payload, loading } = data || {};
  const { payload: payloadDomain, loading: loadingDomain } = dataDomain || {};

  if (loading || loadingDomain) return <Loading />;
  if (!payload || !payloadDomain) return null;
  const representative = formatDomainsPayload(payloadDomain, payload.ida);
  if (!representative) return null;
  const idaObj = ida2json(payload.ida, representative, idaAccessionDB);
  return (
    <div>
      <header>
        All the proteins in this page share the domain architecture below with
        the protein with accession <b>{accession}</b>.
        <IDAOptions />
      </header>
      <TextIDA accessions={idaObj.accessions} />
      <IDAProtVista
        matches={idaObj.domains}
        length={idaObj?.length || FAKE_PROTEIN_LENGTH}
        maxLength={idaObj?.length || FAKE_PROTEIN_LENGTH}
        databases={databases}
      />
      <br />
    </div>
  );
};

const getUrlForIDA = createSelector(
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
        root + descriptionToPath(description).replace('/similar_proteins', ''),
      query: _search,
    });
  },
);
const getUrlForDomains = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description) => {
    const newDescription = {
      main: { key: 'entry' },
      entry: { db: 'all' },
      protein: {
        accession: description.protein.accession,
        db: 'uniprot',
        isFilter: true,
      },
    };

    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDescription),
      query: {
        extra_fields: 'short_name',
        page_size: 100,
      },
    });
  },
);

const mapStateToPropsAccessionDB = createSelector(
  (state: GlobalState) => state.settings.ui,
  ({ idaAccessionDB }) => ({
    idaAccessionDB,
  }),
);

export default loadData<DomainsPayload, 'Domain'>({
  getUrl: getUrlForDomains,
  propNamespace: 'Domain',
} as Params)(
  loadData({
    getUrl: getUrlForIDA,
    mapStateToProps: mapStateToPropsAccessionDB,
  } as Params)(React.memo(SimilarProteinsHeaderWithData)),
);
