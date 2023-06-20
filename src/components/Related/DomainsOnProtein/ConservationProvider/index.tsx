import { useEffect } from 'react';
import { format } from 'url';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { Params } from 'higherOrder/loadData/extract-params';

type Props = {
  handleLoaded: (payload: ConservationPayload) => void;
  handleError: (dataRequest: RequestedData<ConservationPayload>) => void;
};

interface LoadedProps extends Props, LoadDataProps<ConservationPayload> {}

export const ConservationProvider = ({
  handleLoaded,
  handleError,
  dataConservation,
}: LoadedProps) => {
  useEffect(() => {
    if (dataConservation && !dataConservation.loading) {
      if (dataConservation.ok && dataConservation.payload) {
        handleLoaded(dataConservation.payload);
      } else {
        handleError(dataConservation);
      }
    }
  });
  return null;
};

const getConservationURL = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (
    { protocol, hostname, port, root }: ParsedURLServer,
    description: InterProDescription
  ) => {
    const url = format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: {
        conservation: 'panther',
      },
    });
    return url;
  }
);

export default loadData({
  getUrl: getConservationURL,
  propNamespace: 'Conservation',
} as Params)(ConservationProvider);

const CONSERVATION_WINDOW = 25;

export const processConservationData = (match: Array<ConservationValue>) => {
  const halfWindow = Math.trunc(CONSERVATION_WINDOW / 2);
  const scores = [];

  let window = [];
  for (let i = 0; i < match.length; i++) {
    if (i < halfWindow) {
      // First half of first window [0-11] -> window length varies from 13 to 24
      window = match.slice(0, i + halfWindow + 1);
    } else if (i >= halfWindow && i < match.length - halfWindow) {
      // Rest takes fixed length of 25. [-12--element--12]
      window = match.slice(i - halfWindow, i + halfWindow + 1);
    } else {
      // Last half of last window [seqLength-12 to seqLength] -> window length varies from 24 to 13
      window = match.slice(i - halfWindow, match.length);
    }
    scores.push({
      ...match[i],
      value: (
        window.reduce((acc: number, residue: { score: number }) => {
          let score = residue.score;
          if (score < 0)
            // In case of negative score, treat it as 0
            score = 0;
          return acc + score;
        }, 0) / window.length
      ).toFixed(2),
    });
  }
  return scores;
};

type MinimalFeature = {
  accession: string;
  source_database?: string;
  children?: Array<{ accession: string; source_database: string }>;
};
export const addExistingEntryToConservationResults = (
  data: ProteinViewerDataObject<MinimalFeature>,
  conservationDatabases: Array<string>,
  entryWithMostCoverage: string
) => {
  for (const matches of [data.domain, data.family, data.repeat]) {
    if (matches) {
      for (const entry of matches) {
        for (const child of entry.children || []) {
          if (
            conservationDatabases.includes(child.source_database) &&
            child.accession === entryWithMostCoverage
          ) {
            data.match_conservation.push(child);
          }
        }
      }
    }
  }

  for (const entry of data.unintegrated) {
    if (
      entry &&
      conservationDatabases.includes(entry.source_database || '') &&
      entry.accession === entryWithMostCoverage
    ) {
      data.match_conservation.push(entry);
    }
  }
};

type PartialConservationValue = {
  position: number;
  value: number | string | null;
};

export const mergeConservationData = (
  data: ProteinViewerDataObject<MinimalFeature>,
  conservationData: ConservationPayload
) => {
  data.match_conservation = [];
  const conservationDatabases = [];
  let entryWithMostCoverage = '';
  for (const db of Object.keys(conservationData)) {
    if (db.toLowerCase() !== 'sequence') {
      conservationDatabases.push(db);
      const dbConservationScores = {
        category: 'Sequence conservation',
        type: 'sequence_conservation',
        accession: db,
        data: [] as Array<{
          name: unknown;
          range: [number, number];
          colour: string;
          values: Array<PartialConservationValue>;
        }>,
        warnings: [] as Array<string>,
      };
      const entries = conservationData[db].entries;
      /* eslint-disable max-depth */
      if (entries) {
        let coverage = 0;
        // Add only the entry match that covers the most (longest)
        for (const entry of Object.keys(entries)) {
          const matches = entries[entry];
          const length = matches.reduce(
            (sum: number, array) => sum + array.length,
            0
          );
          if (length > coverage) {
            coverage = length;
            entryWithMostCoverage = entry;
          }
        }

        for (const entry of Object.keys(entries)) {
          if (entry === entryWithMostCoverage) {
            const values: Array<PartialConservationValue> = [];
            let end = 0;
            for (const match of entries[entry]) {
              if (values.length === 0) {
                end = match[match.length - 1].position;
              } else {
                // Fill with empty values to render gaps in between in the line graph
                if (match[0].position - end > 1) {
                  for (let i = end; i < match[0].position; i++) {
                    const nextPosition = i + 1;
                    values.push({ position: nextPosition, value: null });
                  }
                }
              }
              const conservationAverage = processConservationData(match);
              values.push(...conservationAverage);
            }
            dbConservationScores.data.push({
              name: entry,
              // eslint-disable-next-line no-magic-numbers
              range: [0, 2.5],
              colour: '#006400',
              values: values,
            });
          }
        }
        const warnings = conservationData[db].warnings;
        if (warnings) {
          dbConservationScores.warnings = warnings;
        }
        data.match_conservation?.push(dbConservationScores);

        // add data from integrated and unintegrated matches to panel for ease of use
        addExistingEntryToConservationResults(
          data,
          conservationDatabases,
          entryWithMostCoverage
        );
      }
    }
  }
};

const MAX_PROTEIN_LENGTH_FOR_HMMER = 5000;
export const isConservationDataAvailable = (
  data: ProteinViewerDataObject<{
    protein_length: number;
    member_databases: Record<string, string>;
    source_database: string;
  }>,
  proteinDB: string
) => {
  // HMMER can't generate conservation data for unreviewed proteins
  if (proteinDB === 'unreviewed') return false;

  // check protein length is less than HmmerWeb length limit
  if (data.domain && data.domain.length > 0) {
    if (data.domain[0].protein_length >= MAX_PROTEIN_LENGTH_FOR_HMMER)
      return false;
  }
  if (data.unintegrated && data.unintegrated.length > 0) {
    if (data.unintegrated[0].protein_length >= MAX_PROTEIN_LENGTH_FOR_HMMER)
      return false;
  }

  // ensure there is a panther entry somewhere in the matches
  /* eslint-disable max-depth */
  for (const matches of [data.domain, data.family, data.repeat]) {
    if (matches) {
      for (const entry of matches) {
        for (const memberDatabase of Object.keys(entry.member_databases)) {
          if (memberDatabase.toLowerCase() === 'panther') return true;
        }
      }
    }
  }
  /* eslint-enable max-depth */
  for (const entry of data.unintegrated) {
    if (entry.source_database.toLowerCase() === 'panther') return true;
  }

  return false;
};
