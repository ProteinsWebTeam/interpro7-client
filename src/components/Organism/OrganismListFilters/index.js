import React from 'react';

import FiltersPanel from 'components/FiltersPanel';
import OrganismDBFilter from './OrganismDBFilter';
// import LengthFilter from './LengthFilter';
// import TaxonomyFilter from './TaxonomyFilter';
import ErrorBoundary from 'wrappers/ErrorBoundary';

const OrganismListFilters = () =>
  <FiltersPanel>
    <ErrorBoundary label="Organism Type">
      <OrganismDBFilter />
    {/* <TaxonomyFilter label="Taxonomy" />*/}
    {/* <LengthFilter label="Protein Length"/>*/}
    </ErrorBoundary>
  </FiltersPanel>;

export default OrganismListFilters;
