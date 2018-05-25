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
    import(/* webpackChunkName: "domain-architecture-subpage" */ './DomainArchitecture'),
});

const HMMModel = loadable({
  loader: () =>
    import(/* webpackChunkName: "hmm-model-subpage" */ './HMMModel'),
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
    // const search = _search || {};
    const search =
      description.main.key && description[description.main.key].accession
        ? {}
        : _search || {};
    search.page_size = search.page_size || settingsPageSize;
    // TODO: We were doing a copy of selected field here, but seems that we can use the original
    // TODO: Delete the commented lines if nothing breaks (31/10/2017)
    // const description = {
    //   mainType: _description.mainType,
    //   mainDB: _description.mainDB,
    //   mainAccession: _description.mainAccession,
    //   focusType: _description.focusType,
    //   focusDB: _description.focusDB,
    //   focusAccession: _description.focusAccession,
    // };
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

const subPages = new Map([
  ['entry', loadData(defaultMapStateToProps)(List)],
  ['protein', loadData(defaultMapStateToProps)(List)],
  ['structure', loadData(defaultMapStateToProps)(List)],
  ['taxonomy', loadData(defaultMapStateToProps)(List)],
  ['set', loadData(defaultMapStateToProps)(List)],
  ['sequence', Sequence],
  ['domain_architecture', DomainArchitecture],
  ['logo', loadData(mapStateToPropsForHMMModel)(HMMModel)],
  ['proteome', loadData()(Proteome)],
]);

export default subPages;
