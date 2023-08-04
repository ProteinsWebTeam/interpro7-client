import React from 'react';

import EntriesOnProtein from '../EntriesOnProtein';
import EntriesOnStructure from '../EntriesOnStructure';
import StructureOnProtein from '../StructureOnProtein';

type Props = {
  matches: Array<unknown>;
  primary: LinkedEndpoints;
  secondary: LinkedEndpoints;
  isStale: boolean;
  options: {
    baseSize: number;
    offset: number;
    niceRatio: number;
  };
  actualSize: number;
};

type LinkedEndpoints = 'protein' | 'entry' | 'structure';
const componentMatch: Record<
  LinkedEndpoints,
  Record<
    LinkedEndpoints,
    | typeof EntriesOnProtein
    | typeof StructureOnProtein
    | typeof EntriesOnStructure
    | undefined
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
const MatchesByPrimary = ({ matches, primary, secondary, ...props }: Props) => {
  const MatchComponent = componentMatch[primary][secondary];

  return MatchComponent ? (
    <MatchComponent {...props} matches={matches} />
  ) : null;
};

export default MatchesByPrimary;
