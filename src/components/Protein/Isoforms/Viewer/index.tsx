import React from 'react';

import { format } from 'url';
import { createSelector } from 'reselect';
import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import NumberComponent from 'components/NumberComponent';
import { groupByEntryType } from 'components/Related/DomainsOnProtein';
import { byEntryType } from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';
import { selectRepresentativeData } from 'components/ProteinViewer/utils';
import Loading from 'components/SimpleCommonComponents/Loading';

import loadable from 'higherOrder/loadable';

import cssBinder from 'styles/cssBinder';

import style from '../style.css';
const css = cssBinder(style);

const ProteinViewer = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
  loading: null,
});

type InterProFeature = MinimalFeature & {
  integrated?: string;
  children?: Array<MinimalFeature>;
  type: string;
  short_name?: string;
};
type FeatureMap = Record<string, InterProFeature>;

type IsoformPayload = {
  accession: string;
  length: number;
  protein_acc: string;
  sequence: string;
  features: FeatureMap;
};

const features2protvista = (features: FeatureMap) => {
  const featArray = Object.values(features || {});
  const integrated: Array<InterProFeature> = [];
  for (const feature of featArray) {
    if (!feature) continue;
    if (!feature.short_name) feature.short_name = feature.name;
    if (feature.integrated && feature.integrated in features) {
      const parent = features[feature.integrated];
      if (!('children' in parent)) {
        parent.children = [];
      }
      if (parent.children?.indexOf(feature) === -1)
        parent.children.push(feature);
      integrated.push(feature);
    }
  }

  const interpro = featArray.filter(({ accession }) =>
    accession.toLowerCase().startsWith('ipr'),
  );
  const groups = groupByEntryType(interpro);
  const unintegrated = featArray.filter(
    (f) => interpro.indexOf(f) === -1 && integrated.indexOf(f) === -1,
  );
  const categories: Array<[string, unknown]> = [
    ...(Object.entries(groups) as Array<[string, unknown]>),
    ['unintegrated', unintegrated],
  ];

  const sortedCategories = categories.sort(byEntryType);

  const representativeDomains = selectRepresentativeData(
    featArray,
    'locations',
    'domain',
  );

  const representativeFamilies = selectRepresentativeData(
    featArray,
    'locations',
    'family',
  );

  const homologous_superfamily = sortedCategories.filter(
    (entry) => entry[0] == 'homologous superfamily',
  )[0];

  sortedCategories.map((entry) => {
    if (entry[0] === 'domain') {
      entry[0] = 'domains';
      if (homologous_superfamily) {
        if (Array.isArray(entry[1]))
          entry[1] = entry[1].concat(homologous_superfamily[1]);
      }

      if (representativeDomains) {
        if (Array.isArray(entry[1]))
          entry[1] = entry[1].concat(representativeDomains);
      }
    }

    if (entry[0] === 'family') {
      entry[0] = 'families';
      if (representativeFamilies) {
        if (Array.isArray(entry[1]))
          entry[1] = entry[1].concat(representativeFamilies);
      }
    }
  });

  return sortedCategories;
};
type Props = {
  isoform?: string;
};
interface LoadedProps extends Props, LoadDataProps<IsoformPayload> {}

type HeaderProps = { accession: string; length: number };
export const IsoformHeader = ({ accession, length }: HeaderProps) => {
  return (
    <header>
      <span className={css('key')}>Isoform:</span>{' '}
      <span className={css('id')}>{accession}</span> <br />
      <span className={css('key')}>Length:</span>{' '}
      <NumberComponent>{length}</NumberComponent>
    </header>
  );
};
const Viewer = ({ isoform, data }: LoadedProps) => {
  if (!isoform) return null;
  if (
    !data ||
    data.loading ||
    !data.payload ||
    !data.payload.accession ||
    isoform !== data.payload.accession
  )
    return <Loading />;

  const { accession, length, sequence, features } = data.payload;
  const dataProtvista = features2protvista(features);

  const mainTracks = [
    'alphafold confidence',
    'families',
    'domains',
    'pathogenic and likely pathogenic variants',
    'intrinsically disordered regions',
    'spurious proteins',
    'conserved residues',
  ];

  const hideCategories = {
    'secondary structure': false,
    families: true,
    domains: true,
    repeat: false,
    'conserved site': false,
    'active site': false,
    'binding site': false,
    ptm: false,
    'match conservation': false,
    'coiled-coils, signal peptides, transmembrane regions': false,
    'short linear motifs': false,
    'pfam-n': false,
    funfam: false,
  };

  return (
    <div className={css('isoform-panel')}>
      <IsoformHeader accession={accession} length={length} />
      <ProteinViewer
        mainTracks={mainTracks}
        hideCategories={hideCategories}
        protein={{ sequence, length: sequence.length }}
        data={dataProtvista}
        title="Entry matches to this isoform"
      />
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.search,
  ({ isoform }) => ({ isoform }),
);

const getIsoformURL = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  (
    { protocol, hostname, port, root },
    { protein: { accession } },
    { isoform },
  ) => {
    const description: InterProPartialDescription = {
      main: { key: 'protein' },
      protein: { db: 'uniprot', accession },
    };

    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: {
        isoforms: isoform,
      },
    });
  },
);
export default loadData({
  getUrl: getIsoformURL,
  mapStateToProps,
} as LoadDataParameters)(Viewer);
