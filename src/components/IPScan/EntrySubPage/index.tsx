import React from 'react';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import { iproscan2urlDB } from 'utils/url-patterns';

import { RelatedAdvanced } from 'components/Related/RelatedAdvanced';
import Loading from 'components/SimpleCommonComponents/Loading';
import Redirect from 'components/generic/Redirect';

const flatMatchesFromIPScanPayload = function* (
  ipScanMatches: Array<Iprscan5Match>,
  proteinLength: number,
) {
  for (const match of ipScanMatches) {
    if (match.signature.entry) {
      yield {
        accession: match.signature.entry.accession,
        name: match.signature.entry.description,
        short_name: match.signature.entry.name,
        source_database: 'InterPro',
        matches: [
          {
            protein_length: proteinLength,
            entry_protein_locations: match.locations.map((loc) => ({
              ...loc,
              model_acc: match['model-ac'],
              fragments:
                loc['location-fragments'] && loc['location-fragments'].length
                  ? loc['location-fragments']
                  : [{ start: loc.start, end: loc.end }],
            })),
            entry_type: match.signature.entry?.type,
            source_database: 'InterPro',
            entry_integrated: null,
            accession: match.signature.entry?.accession,
          } as EntryProteinMatch,
        ],
      } as MetadataWithLocations;
    }
    const db = iproscan2urlDB(match.signature.signatureLibraryRelease.library);
    yield {
      accession: match.signature.accession,
      name: match.signature.description || '',
      short_name: match.signature.name,
      source_database: db,
      matches: [
        {
          protein_length: proteinLength,
          entry_protein_locations: match.locations.map((loc) => ({
            ...loc,
            model_acc: match['model-ac'],
            fragments:
              loc['location-fragments'] && loc['location-fragments'].length
                ? loc['location-fragments']
                : [{ start: loc.start, end: loc.end }],
          })),
          entry_type: match.signature.entry?.type,
          source_database: db,
          entry_integrated: match.signature.entry?.accession,
          accession: match.signature.accession,
        } as EntryProteinMatch,
      ],
    } as MetadataWithLocations;
  }
};

const getCountersFromFlatArray = (
  flatArray: Array<{ accession: string; source_database: string }>,
) =>
  Array.from(
    new Map(
      flatArray.map(({ accession, source_database: s }) => [accession, s]),
    ).entries(),
  ).reduce(
    (agg, [_, source]) => {
      const db = source.toLowerCase();
      agg[db] = agg[db] ? agg[db] + 1 : 1;
      return agg;
    },
    {} as Record<string, number>,
  );

const mergeEntries = (entries: Array<MetadataWithLocations>) => {
  const map = new Map<string, MetadataWithLocations>();
  for (const entry of entries) {
    const entryInMap = map.get(entry.accession);
    if (entryInMap) {
      entryInMap.matches = [...entryInMap.matches!, ...entry.matches!];
    }
    map.set(entry.accession, entryInMap || entry);
  }
  return Array.from(map.values());
};

type Props = {
  localPayload: LocalPayload;
  data: RequestedData<Iprscan5Payload>;
  entryDB: string;
  orf?: boolean;
};
interface LoadedProps extends Props, LoadDataProps<RootAPIPayload, 'Base'> {}

const EntrySubPage = ({
  entryDB,
  data: { payload },
  dataBase,
  localPayload,
  orf,
}: LoadedProps) => {
  if (!entryDB)
    return (
      <Redirect
        to={(customLocation) => ({
          ...customLocation,
          description: {
            ...customLocation.description,
            entry: { isFilter: true, db: 'InterPro' },
          },
        })}
      />
    );
  if ((!payload && !localPayload) || !dataBase) return <Loading />;
  let mainData: LocalPayload = payload
    ? { ...payload.results[0] }
    : localPayload;
  if (
    (mainData as Iprscan5NucleotideResult).openReadingFrames?.length &&
    typeof orf === 'number'
  ) {
    mainData = {
      ...mainData,
      ...(mainData as Iprscan5NucleotideResult).openReadingFrames[orf].protein,
    };
  }
  mainData.length = mainData.sequence?.length;
  const flatArray = Array.from(
    flatMatchesFromIPScanPayload(
      (mainData as Iprscan5Result).matches,
      mainData.length || 0,
    ),
  );
  const counts = getCountersFromFlatArray(flatArray);
  const filtered = flatArray.filter(
    ({ source_database: db }) => db.toLowerCase() === entryDB.toLowerCase(),
  );
  const unique = mergeEntries(filtered);
  return (
    <RelatedAdvanced
      mainData={mainData}
      secondaryData={unique}
      secondaryDataLoading={false}
      isStale={false}
      mainType="protein"
      focusType="entry"
      focusDb={entryDB}
      actualSize={unique.length}
      dbCounters={counts}
      dataBase={dataBase}
    />
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description,
  (description) => ({
    entryDB: description.entry.db,
  }),
);

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
  mapStateToProps,
} as LoadDataParameters)(EntrySubPage);
