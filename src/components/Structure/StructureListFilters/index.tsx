import React from 'react';

import FiltersPanel from 'components/FiltersPanel';
import ExperimentTypeFilter from './ExperimentTypeFilter';
import ResolutionFilter from './ResolutionFilter';

const StructureListFilters = () => (
  <FiltersPanel>
    <ExperimentTypeFilter label="Experiment Type" />
    <ResolutionFilter label="Resolution (Å)" />
  </FiltersPanel>
);

export default StructureListFilters;
