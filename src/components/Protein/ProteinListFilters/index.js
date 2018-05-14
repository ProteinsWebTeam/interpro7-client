// @flow
import React from 'react';

import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from './CurationFilter';
import SizeFilter from './SizeFilter';
import TaxonomyFilter from './TaxonomyFilter';

const ProteinListFilters = () => (
  <FiltersPanel>
    <CurationFilter label="UniProt Curation" />
    <TaxonomyFilter label="Taxonomy" />
    <SizeFilter label="Protein Size" />
  </FiltersPanel>
);

export default ProteinListFilters;
