import React from 'react';

import FiltersPanel from 'components/FiltersPanel';
import ExperimentTypeFilter from './ExperimentTypeFilter';
// import LengthFilter from './LengthFilter';
// import TaxonomyFilter from './TaxonomyFilter';

const StructureListFilters = () =>
  <FiltersPanel>
      <ExperimentTypeFilter label="Experiment Type" />
    {/* <TaxonomyFilter label="Taxonomy" />*/}
    {/* <LengthFilter label="Protein Length"/>*/}
  </FiltersPanel>;

export default StructureListFilters;
