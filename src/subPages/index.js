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
const InteractionsSubPage = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "interactions-subpage" */ './InteractionsSubPage'
    ),
});
const PathwaysSubPage = loadable({
  loader: () => import(/* webpackChunkName: "pathways-subpage" */ './Pathways'),
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
const Genome3d = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "genome3d-subpage" */ 'components/Genome3D/List'
    ),
});
const Curation = loadable({
  loader: () => import(/* webpackChunkName: "curation-subpage" */ './Curation'),
});
const RoseTTAFoldModel = loadable({
  loader: () =>
    import(
      /* webpackChunkName: "rosettafold-model-subpage" */ './RoseTTAFoldModel'
    ),
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

const g3dVariables = {
  accession: 'uniprot',
  evidences: 'resource',
};
const getGenome3dURL = createSelector(
  (state) => state.settings.genome3d,
  (state) => state.customLocation.search,
  (state) => state.settings.navigation.pageSize,
  (state) => state.customLocation.description.entry.accession,
  ({ protocol, hostname, port, root }, search, settingsPageSize, accession) => {
    const query = {
      rows: search.page_size || settingsPageSize,
    };
    if (search.page) query.page = search.page;
    if (search.accession) query.filter_uniprot = search.accession.toUpperCase();
    if (search.evidences) query.filter_resource = search.evidences;
    if (search.confidence) query.filter_min_confidence = search.confidence;

    if (search.sort_by) {
      const variables = search.sort_by.split(',');
      query.order_by = variables
        .map((term) => g3dVariables[term] || term)
        .join(',');
    }
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}interpro/ipr/${accession}`,
      query,
    });
  },
);
const getInterProModifierURL = (modifier) =>
  createSelector(
    (state) => state.settings.api,
    (state) => state.customLocation.description.entry,
    ({ protocol, hostname, port, root }, entry) => {
      const search = {};
      search[modifier] = '';
      const _description = {
        main: { key: 'entry' },
        entry: {
          db: 'interpro',
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
    loadData(getInterProModifierURL('interactions'))(InteractionsSubPage),
  ],
  ['pathways', loadData(getInterProModifierURL('pathways'))(PathwaysSubPage)],
  ['rosettafold', RoseTTAFoldModel],
  ['alphafold', AlphaFoldModelSubPage],
  ['alignments', SetAlignments],
  ['entry_alignments', EntryAlignments],
  ['logo', loadData(mapStateToPropsForHMMModel)(HMMModel)],
  ['proteome', loadData()(Proteome)],
  [
    'genome3d',
    loadData({
      getUrl: getGenome3dURL,
    })(Genome3d),
  ],
  ['similar_proteins', SimilarProteins],
  ['curation', Curation],
]);

export default subPages;
