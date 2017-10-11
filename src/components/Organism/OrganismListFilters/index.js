import React from 'react';

import FiltersPanel from 'components/FiltersPanel';
import OrganismDBFilter from './OrganismDBFilter';
// import LengthFilter from './LengthFilter';
// import TaxonomyFilter from './TaxonomyFilter';

const OrganismListFilters = () =>
  <FiltersPanel>
    <OrganismDBFilter label="Organism Type"/>
    {/* <TaxonomyFilter label="Taxonomy" />*/}
    {/* <LengthFilter label="Protein Length"/>*/}
  </FiltersPanel>;

export default OrganismListFilters;
