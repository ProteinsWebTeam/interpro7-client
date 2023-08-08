import React from 'react';

import EntriesOnProtein from '../EntriesOnProtein';
import EntriesOnStructure from '../EntriesOnStructure';
import StructureOnProtein from '../StructureOnProtein';

type MetadataWithLocations = Metadata & {
  entry_protein_locations?: Array<ProtVistaLocation>;
  protein_structure_locations?: Array<ProtVistaLocation>;
}
export type GenericMatch = {
  entry?: MetadataWithLocations & {
    name: string | NameObject;
    entry_type: string;
  };
  protein?: MetadataWithLocations & {
    sequence?: string;
    length: number
  };
  structure?: MetadataWithLocations;
}
export type MatchesByPrimaryProps = {
  matches: Array<GenericMatch>;
  primary: Endpoint;
  secondary: Endpoint;
  isStale: boolean;
  options: {
    baseSize: number;
    offset: number;
    niceRatio: number;
  };
  actualSize: number;
};

const componentMatch: Partial<
  Record<
    Endpoint,
    Partial<
      Record<
        Endpoint,
        | typeof EntriesOnProtein
        | typeof StructureOnProtein
        | typeof EntriesOnStructure
        | undefined
      >
    >
  >
> = {
  protein: {
    entry: EntriesOnProtein,
    protein: undefined,
    structure: StructureOnProtein,
  },
  entry: {
    entry: undefined,
    protein: EntriesOnProtein,
    structure: EntriesOnStructure,
  },
  structure: {
    entry: EntriesOnStructure,
    protein: StructureOnProtein,
    structure: undefined,
  },
};

// List of all matches for one `primary`, one to many
const MatchesByPrimary = ({
  matches,
  primary,
  secondary,
  ...props
}: MatchesByPrimaryProps) => {
  const MatchComponent = componentMatch[primary]?.[secondary];

  return MatchComponent ? (
    <MatchComponent {...props} matches={matches} />
  ) : null;
};

export default MatchesByPrimary;
