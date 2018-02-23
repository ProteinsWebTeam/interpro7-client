// @flow
import React from 'react';

import FiltersPanel from 'components/FiltersPanel';
import OrganismDBFilter from './OrganismDBFilter';
// import LengthFilter from './LengthFilter';
// import TaxonomyFilter from './TaxonomyFilter';

const OrganismListFilters = () => (
  <FiltersPanel>
    <OrganismDBFilter label="Organism Type" />
  </FiltersPanel>
);

export default OrganismListFilters;
