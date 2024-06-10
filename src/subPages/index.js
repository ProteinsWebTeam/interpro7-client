import { createSelector } from 'reselect';
import { format } from 'url';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
// Too small to be split.
import Proteome from './Proteome';

const List = loadable({
  loader: () => import(/* webpackChunkName: "list-subpage" */ './ListSubPage'),
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
const InteractionsSubPage = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "interactions-subpage" */ './InteractionsSubPage'
    ),
});
const PathwaysSubPage = loadable({
  loader: () => import(/* webpackChunkName: "pathways-subpage" */ './Pathways'),
});
const FeedbackSubPage = loadable({
  loader: () => import(/* webpackChunkName: "feedback-subpage" */ './Feedback'),
});
const SubfamiliesSubPage = loadable({
  loader: () =>
    import(/* webpackChunkName: "subfamilies-subpage" */ './Subfamilies'),
});

const HMMModel = loadable({
  loader: () =>
    import(/* webpackChunkName: "hmm-model-subpage" */ './HMMModel'),
});
const EntryAlignments = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "entry-alignments-subpage" */ './EntryAlignments'
    ),
});
const SimilarProteins = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "similar-proteins-subpage" */ './SimilarProteins'
    ),
});
const Curation = loadable({
  loader: () => import(/* webpackChunkName: "curation-subpage" */ './Curation'),
});
const AlphaFoldModelSubPage = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "alphafold-model-subpage" */ './AlphaFoldModelSubPage'
    ),
});

const defaultMapStateToProps = createSelector(
  (state) => state.settings.api,
  (state) => state.settings.navigation.pageSize,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
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
    const _description =
      description.main.key && description[description.main.key].accession
        ? {
            main: description.main,
            [description.main.key]: description[description.main.key],
          }
        : description;
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(_description),
      query: search,
    });
  },
);

const mapStateToPropsForHMMModel = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
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

const getDBModifierURL = (db, modifier) =>
  createSelector(
    (state) => state.settings.api,
    (state) => state.customLocation.description.entry,
    ({ protocol, hostname, port, root }, entry) => {
      const search = {};
      search[modifier] = '';
      const _description = {
        main: { key: 'entry' },
        entry: {
          db,
          accession: entry.accession,
        },
      };
      return format({
        protocol,
        hostname,
        port,
        pathname: root + descriptionToPath(_description),
        query: search,
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
  [
    'interactions',
    loadData(getDBModifierURL('InterPro', 'interactions'))(InteractionsSubPage),
  ],
  [
    'pathways',
    loadData(getDBModifierURL('InterPro', 'pathways'))(PathwaysSubPage),
  ],
  ['subfamilies', SubfamiliesSubPage],
  ['alphafold', AlphaFoldModelSubPage],
  ['entry_alignments', EntryAlignments],
  ['logo', loadData(mapStateToPropsForHMMModel)(HMMModel)],
  ['proteome', loadData()(Proteome)],
  ['similar_proteins', SimilarProteins],
  ['curation', Curation],
  ['feedback', FeedbackSubPage],
]);

export default subPages;
