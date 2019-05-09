import { createSelector } from 'reselect';
import { format } from 'url';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

const List = loadable({
  loader: () => import(/* webpackChunkName: "list-subpage" */ './ListSubPage'),
});

const Proteome = loadable({
  loader: () => import(/* webpackChunkName: "proteome-subpage" */ './Proteome'),
});

const Sequence = loadable({
  loader: () => import(/* webpackChunkName: "sequence-subpage" */ './Sequence'),
});

const DomainArchitecture = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "domain-architecture-subpage" */ './DomainArchitecture'
    ),
});

const HMMModel = loadable({
  loader: () =>
    import(/* webpackChunkName: "hmm-model-subpage" */ './HMMModel'),
});
const SetAlignments = loadable({
  loader: () =>
    import(/* webpackChunkName: "set-alignments-subpage" */ './SetAlignments'),
});
const SimilarProteins = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "similar-proteins-subpage" */ './SimilarProteins'
    ),
});

const defaultMapStateToProps = createSelector(
  state => state.settings.api,
  state => state.settings.navigation.pageSize,
  state => state.customLocation.description,
  state => state.customLocation.search,
  (
    { protocol, hostname, port, root },
    settingsPageSize,
    description,
    _search,
  ) => {
    const search =
      description.main.key && description[description.main.key].accession
        ? {}
        : _search || {};
    search.page_size = search.page_size || settingsPageSize;
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: search,
    });
  },
);

const mapStateToPropsForHMMModel = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit elements from search
    const { type, search: _, ...restOfSearch } = search;
    // modify search
    restOfSearch.annotation = 'logo';
    // omit elements from description
    const { ...copyOfDescription } = description;
    if (description.main.key) {
      copyOfDescription[description.main.key] = {
        ...description[description.main.key],
        detail: null,
      };
    }
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(copyOfDescription),
      query: restOfSearch,
    });
  },
);
const mapStateToPropsForSimilarProteins = createSelector(
  state => state.settings.api,
  state => state.customLocation.search,
  (_, props) => props.data,
  ({ protocol, hostname, port, root }, search, data) => {
    // omit elements from search
    const { type, search: _, ...restOfSearch } = search;
    // modify search
    restOfSearch.ida =
      data &&
      data.payload &&
      data.payload &&
      data.payload.metadata &&
      data.payload.metadata.ida_accession;

    const description = {
      main: { key: 'protein' },
      protein: { db: 'uniprot' },
    };
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: restOfSearch,
    });
  },
);

const subPages = new Map([
  ['entry', loadData(defaultMapStateToProps)(List)],
  ['protein', loadData(defaultMapStateToProps)(List)],
  ['structure', loadData(defaultMapStateToProps)(List)],
  ['taxonomy', loadData(defaultMapStateToProps)(List)],
  ['set', loadData(defaultMapStateToProps)(List)],
  ['sequence', Sequence],
  ['domain_architecture', DomainArchitecture],
  ['alignments', SetAlignments],
  ['logo', loadData(mapStateToPropsForHMMModel)(HMMModel)],
  ['proteome', loadData()(Proteome)],
  [
    'similar_proteins',
    loadData({
      getUrl: mapStateToPropsForSimilarProteins,
      propNamespace: 'IDA',
    })(SimilarProteins),
  ],
]);

export default subPages;
