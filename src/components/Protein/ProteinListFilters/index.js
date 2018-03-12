// @flow
import React from 'react';

import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from './CurationFilter';
import LengthFilter from './LengthFilter';
import TaxonomyFilter from './TaxonomyFilter';

const ProteinListFilters = () => (
  <FiltersPanel>
    <CurationFilter label="UniProt Curation" />
    <TaxonomyFilter label="Taxonomy" />
    <LengthFilter label="Length (AA)" />
  </FiltersPanel>
);

export default ProteinListFilters;
