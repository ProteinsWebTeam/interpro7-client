import React from 'react';

import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from './CurationFilter';
// import LengthFilter from './LengthFilter';
import TaxonomyFilter from './TaxonomyFilter';

const ProteinListFilters = () =>
  <FiltersPanel>
    <CurationFilter label="Integration" />
    <TaxonomyFilter label="Taxonomy" />
    {/* <LengthFilter label="Protein Length" /> */}
  </FiltersPanel>;

export default ProteinListFilters;
