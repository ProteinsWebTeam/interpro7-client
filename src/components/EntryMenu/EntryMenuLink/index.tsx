import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { singleEntity } from 'menuConfig';
import EntryMenuLinkWithoutData from './EntryMenuLinkWithoutData';

const singleEntityNames = new Map(
  Array.from(singleEntity).map((e) => [e[1].name, e[0]]),
);

const whitelist = new Set(['Overview', 'Sequence', 'Alignments']);

const hasAlignments = (
  name: string,
  db: string,
  annotations: Record<string, unknown>,
) => {
  if (name !== 'Alignment' || db === 'InterPro') return false;
  for (const ann of Object.keys(annotations)) {
    if (ann.startsWith('alignment:')) return true;
  }
  return false;
};
type Props = {
  to?:
    | InterProPartialLocation
    | ((customLocation: InterProLocation) => InterProPartialLocation);
  exact?: boolean;
  name: string;
  counter?: string;
  data: RequestedData<{ metadata: Metadata }>;
  isFirstLevel?: boolean;
  usedOnTheSide?: boolean;
  collapsed?: boolean;
  mainKey?: string | null;
  entryDB?: string | null;
};

export const EntryMenuLink = ({
  to,
  exact,
  name,
  counter,
  data: { loading, payload },
  isFirstLevel,
  usedOnTheSide,
  collapsed,
  mainKey,
  entryDB,
}: Props) => {
  let value: null | number = null;
  let shouldPointToAll = false;
  if (!loading && payload && payload.metadata) {
    if (payload.metadata.counters) {
      if (counter) {
        // Some tabs do not have counter
        let counterValue: MetadataCounter = Infinity;
        counter.split('.').forEach((key, index) => {
          if (index === 0) counterValue = payload.metadata.counters[key];
          else if (typeof counterValue === 'object')
            counterValue = counterValue[key];
        });

        if (counterValue && Number.isFinite(counterValue as number))
          value = counterValue as number;
      }
      if (
        name.toLowerCase() === 'entries' &&
        mainKey?.toLowerCase() !== 'set'
      ) {
        const dbEntries = payload.metadata.counters.dbEntries as Record<
          string,
          number
        >;
        if (dbEntries.interpro) {
          value = dbEntries.interpro;
        } else {
          shouldPointToAll = true;
        }
        if (entryDB) {
          value = dbEntries[entryDB.toLowerCase()];
        }
      }
    }
    if (
      mainKey?.toLowerCase() === 'protein' &&
      name.toLowerCase() === 'alphafold'
    ) {
      value = (payload.metadata as EntryMetadata).in_alphafold ? 1 : 0;
    }

    /**
     * Enabling the menuitems that appear in the entry_annotations array,
     * i.e. only enable the menu item if there is info for it.
     */
    const annotations = (payload.metadata as EntryMetadata)?.entry_annotations;
    if (
      annotations &&
      (Object.prototype.hasOwnProperty.call(
        annotations,
        singleEntityNames.get(name) || '',
      ) ||
        hasAlignments(name, entryDB || '', annotations))
    ) {
      value = NaN;
    }
    // TODO: find a generic way to deal with this:
    if (whitelist.has(name)) value = NaN;
    // TODO: find a generic way to deal with this:
    if (
      name === 'Pathways' &&
      payload.metadata.source_database.toLowerCase() !== 'interpro'
    ) {
      value = null;
    }

    if (
      name === 'Curation' &&
      payload.metadata.source_database.toLowerCase() === 'pfam'
    ) {
      value = NaN;
    }
  }

  if (!isFirstLevel && !value && !isNaN(value as number)) return null;
  const newTo = shouldPointToAll
    ? (customLocation: InterProLocation) => {
        const newLocation =
          typeof to === 'function'
            ? to(customLocation)
            : (to as InterProPartialLocation);
        if (newLocation?.description.entry)
          newLocation.description.entry.db = 'all';
        return newLocation;
      }
    : to;
  return (
    <EntryMenuLinkWithoutData
      name={name}
      value={value as number}
      loading={loading}
      to={newTo}
      exact={exact}
      usedOnTheSide={usedOnTheSide}
      collapsed={collapsed}
    />
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description.main.key,
  (state: GlobalState) => state.customLocation.description.entry.db,
  (mainKey, entryDB) => ({ mainKey, entryDB }),
);

export default connect(mapStateToProps)(EntryMenuLink);
