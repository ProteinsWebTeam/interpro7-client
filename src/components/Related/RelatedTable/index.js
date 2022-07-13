// @flow
import React from 'react';
import T from 'prop-types';

import InfoFilters from 'components/Related/Taxonomy/InfoFilters';

import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from 'components/Protein/ProteinListFilters/CurationFilter';
import Matches from 'components/Matches';

import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';

const f = foundationPartial(ebiGlobalStyles, filtersAndTable);

const primariesAndSecondaries = {
  entry: {
    protein: {
      primary: 'protein',
      secondary: 'entry',
    },
    structure: {
      primary: 'structure',
      secondary: 'entry',
    },
    taxonomy: {
      primary: 'taxonomy',
      secondary: 'entry',
    },
    proteome: {
      primary: 'proteome',
      secondary: 'entry',
    },
    set: {
      primary: 'set',
      secondary: 'entry',
    },
  },
  protein: {
    entry: {
      primary: 'entry',
      secondary: 'protein',
    },
    structure: {
      primary: 'structure',
      secondary: 'protein',
    },
  },
  structure: {
    entry: {
      primary: 'entry',
      secondary: 'structure',
    },
    protein: {
      primary: 'protein',
      secondary: 'structure',
    },
  },
  taxonomy: {
    entry: {
      primary: 'entry',
      secondary: 'taxonomy',
    },
    protein: {
      primary: 'protein',
      secondary: 'taxonomy',
    },
    structure: {
      primary: 'structure',
      secondary: 'taxonomy',
    },
    proteome: {
      primary: 'proteome',
      secondary: 'taxonomy',
    },
  },
  proteome: {
    entry: {
      primary: 'entry',
      secondary: 'proteome',
    },
    protein: {
      primary: 'protein',
      secondary: 'proteome',
    },
    structure: {
      primary: 'structure',
      secondary: 'proteome',
    },
  },
  set: {
    entry: {
      primary: 'entry',
      secondary: 'set',
    },
    protein: {
      primary: 'protein',
      secondary: 'set',
    },
    structure: {
      primary: 'structure',
      secondary: 'set',
    },
    taxonomy: {
      primary: 'taxonomy',
      secondary: 'set',
    },
    proteome: {
      primary: 'proteome',
      secondary: 'set',
    },
  },
};
/*:: type RelatedTableProps = {
  mainType: string,
  mainData: Object,
  secondaryData: Array<Object>,
  isStale: boolean,
  focusType: string,
  actualSize: number,
  otherFilters?: Array<Object>,
  dataBase: {
    payload: Object,
    loading: boolean
  },
  otherProps: Object,
}; */
const RelatedTable = (
  {
    mainType,
    mainData,
    secondaryData,
    isStale,
    focusType,
    actualSize,
    otherFilters,
    dataBase,
    otherProps,
  } /*: RelatedTableProps */,
) => {
  const hasFilters = focusType === 'protein';
  const databases =
    (dataBase &&
      !dataBase.loading &&
      dataBase.payload &&
      dataBase.payload.databases) ||
    {};

  return (
    <>
      <p>
        This {mainType} matches
        {secondaryData.length > 1
          ? ` these ${toPlural(focusType)}:`
          : ` this ${focusType}:`}
      </p>
      <InfoFilters
        filters={otherFilters}
        focusType={focusType}
        databases={databases}
      />
      {mainType === 'set' &&
        focusType === 'entry' &&
        mainData?.source_database === 'pfam' && (
          <div className={f('callout', 'info', 'withicon')}>
            For more information about the different domain architectures of the
            Pfam entries included in this clan, you can click on a Pfam
            accession in the table below and go to the Domain architectures tab
            of the Pfam entry.
          </div>
        )}
      <div className={f('filters-and-table')}>
        {hasFilters && (
          <nav>
            <div className={f('browse-side-panel')}>
              <FiltersPanel>
                <CurationFilter label="UniProt Curation" />
              </FiltersPanel>
            </div>
          </nav>
        )}
        <section
          className={f(
            'columns',
            'small-12',
            hasFilters ? 'medium-9' : 'medium-12',
            hasFilters ? 'large-10' : 'large-12',
          )}
        >
          <Matches
            {...otherProps}
            actualSize={actualSize}
            matches={secondaryData.reduce(
              (prev, { coordinates, ...secondaryData }) => [
                ...prev,
                {
                  [mainType]: mainData,
                  [focusType]: secondaryData,
                  coordinates,
                },
              ],
              [],
            )}
            isStale={isStale}
            databases={databases}
            {...primariesAndSecondaries[mainType][focusType]}
          />
        </section>
      </div>
    </>
  );
};
RelatedTable.propTypes = {
  mainType: T.string.isRequired,
  mainData: T.object.isRequired,
  secondaryData: T.arrayOf(T.object).isRequired,
  isStale: T.bool.isRequired,
  focusType: T.string.isRequired,
  actualSize: T.number,
  otherFilters: T.array,
  dataBase: T.shape({
    payload: T.object,
    loading: T.bool.isRequired,
  }).isRequired,
  otherProps: T.object,
};

export default RelatedTable;
