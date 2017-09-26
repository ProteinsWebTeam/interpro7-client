import React from 'react';

import FiltersPanel from 'components/FiltersPanel';
import ExperimentTypeFilter from './ExperimentTypeFilter';
// import LengthFilter from './LengthFilter';
// import TaxonomyFilter from './TaxonomyFilter';
import ErrorBoundary from 'wrappers/ErrorBoundary';

const StructureListFilters = () =>
  <FiltersPanel>
    <ErrorBoundary label="Experiment Type">
      <ExperimentTypeFilter />
    {/* <TaxonomyFilter label="Taxonomy" />*/}
    {/* <LengthFilter label="Protein Length"/>*/}
    </ErrorBoundary>
  </FiltersPanel>;

export default StructureListFilters;
