import React from 'react';

import InfoFilters from 'components/Related/Taxonomy/InfoFilters';

import FiltersPanel from 'components/FiltersPanel';
import CurationFilter from 'components/Protein/ProteinListFilters/CurationFilter';
import Matches from 'components/Matches';

import { toPlural } from 'utils/pages/toPlural';

import cssBinder from 'styles/cssBinder';
import filtersAndTable from 'components/FiltersPanel/filters-and-table.css';
import { GenericMatch } from 'src/components/Matches/MatchesByPrimary';

const f = cssBinder(filtersAndTable);

const primariesAndSecondaries: Record<
  Endpoint,
  Partial<
    Record<
      Endpoint,
      {
        primary: Endpoint;
        secondary: Endpoint;
      }
    >
  >
> = {
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

type RelatedTableProps = {
  mainType: Endpoint;
  mainData: MetadataWithLocations;
  secondaryData: Array<MetadataWithLocations>;
  isStale: boolean;
  focusType: Endpoint;
  actualSize: number;
  otherFilters?: Array<EndpointFilter>;
  dataBase: RequestedData<RootAPIPayload>;
  otherProps: Record<string, unknown>;
};
const RelatedTable = ({
  mainType,
  mainData,
  secondaryData,
  isStale,
  focusType,
  actualSize,
  otherFilters,
  dataBase,
  otherProps,
}: RelatedTableProps) => {
  const hasFilters = focusType === 'protein';
  const databases =
    (dataBase &&
      !dataBase.loading &&
      dataBase.payload &&
      dataBase.payload.databases) ||
    {};

  const { primary, secondary } =
    primariesAndSecondaries?.[mainType]?.[focusType] || {};
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
            hasFilters ? 'large-10' : 'large-12'
          )}
        >
          <Matches
            {...otherProps}
            mainData={mainData}
            actualSize={actualSize}
            matches={secondaryData.reduce(
              (prev, { coordinates, ...secondaryData }) => [
                ...prev,
                {
                  [mainType]: mainData,
                  [focusType]: secondaryData,
                  coordinates,
                } as GenericMatch,
              ],
              [] as Array<GenericMatch>
            )}
            isStale={isStale}
            databases={databases}
            primary={primary}
            secondary={secondary}
          />
        </section>
      </div>
    </>
  );
};

export default RelatedTable;
