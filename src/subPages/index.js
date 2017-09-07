import { createSelector } from 'reselect';
import { stringify as qsStringify } from 'query-string';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

const Entry = loadable({
  loader: () => import(/* webpackChunkName: "entry-subpage" */ './Entry'),
});

const Protein = loadable({
  loader: () => import(/* webpackChunkName: "protein-subpage" */ './Protein'),
});

const Structure = loadable({
  loader: () =>
    import(/* webpackChunkName: "structure-subpage" */ './Structure'),
});

const Organism = loadable({
  loader: () => import(/* webpackChunkName: "organism-subpage" */ './Organism'),
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
  state => state.settings.pagination,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, pagination, _description, _search) => {
    const search = _search || {};
    search.page_size = search.page_size || pagination.pageSize;
    const description = {
      mainType: _description.mainType,
      mainDB: _description.mainDB,
      mainAccession: _description.mainAccession,
      focusType: _description.focusType,
      focusDB: _description.focusDB,
      focusAccession: _description.focusAccession,
    };
    return `${protocol}//${hostname}:${port}${root}${description2path(
      description
    )}?${qsStringify(search)}`;
  }
);

const mapStateToPropsForHMMModel = createSelector(
  state => state.settings.api,
  state => state.newLocation.description,
  state => state.newLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // omit elements from search
    const { type, search: _, ...restOfSearch } = search;
    // modify search
    restOfSearch.annotation = 'logo';
    // omit elements from description
    const { mainDetail, ...restOfDescription } = description;
    // build URL
    return `${protocol}//${hostname}:${port}${root}${description2path(
      restOfDescription
    )}?${qsStringify(restOfSearch)}`;
  }
);

const subPages = new Map([
  ['entry', loadData(defaultMapStateToProps)(Entry)],
  ['protein', loadData(defaultMapStateToProps)(Protein)],
  ['structure', loadData(defaultMapStateToProps)(Structure)],
  ['organism', loadData(defaultMapStateToProps)(Organism)],
  ['domain_architecture', loadData(defaultMapStateToProps)(DomainArchitecture)],
  ['hmm_model', loadData(mapStateToPropsForHMMModel)(HMMModel)],
]);

export default subPages;
