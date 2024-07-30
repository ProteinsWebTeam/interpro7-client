// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
// import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// import { flattenDeep } from 'lodash-es';

// $FlowFixMe
import Related from 'components/Related/RelatedAdvanced';
import Loading from 'components/SimpleCommonComponents/Loading';
import Redirect from 'components/generic/Redirect';

// $FlowFixMe
import { descriptionSelector } from 'reducers/custom-location/description';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import { iproscan2urlDB } from 'utils/url-patterns';

/*:: type Props = {
  data: Object,
  localPayload: Object,
  dataBase: Object,
  entryDB: string,
}*/

const flatMatchesFromIPScanPayload = function* (ipScanMatches, proteinLength) {
  for (const match of ipScanMatches) {
    if (match.signature.entry) {
      yield {
        accession: match.signature.entry.accession,
        name: match.signature.entry.description,
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
          },
        ],
      };
    }
    yield {
      accession: match.signature.accession,
      name: match.signature.description || '',
      source_database: iproscan2urlDB(
        match.signature.signatureLibraryRelease.library,
      ),
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
        },
      ],
    };
  }
};

const getCountersFromFlatArray = (flatArray) =>
  Array.from(
    new Map(
      flatArray.map(({ accession, source_database: s }) => [accession, s]),
    ).entries(),
  ).reduce((agg, [_, source]) => {
    const db = source.toLowerCase();
    agg[db] = agg[db] ? agg[db] + 1 : 1;
    return agg;
  }, {});

const mergeEntries = (matches) => {
  const map = new Map();
  for (const match of matches) {
    const _match = map.get(match.accession);
    if (_match) {
      _match.matches = [..._match.matches, ...match.matches];
    }
    map.set(match.accession, _match || match);
  }
  return Array.from(map.values());
};

class EntrySubPage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.object.isRequired,
    dataBase: T.object.isRequired,
    entryDB: T.string.isRequired,
    localPayload: T.object,
  };

  render() {
    const {
      entryDB,
      data: { payload },
      dataBase,
      localPayload,
    } = this.props;
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
    if (!payload && !localPayload) return <Loading />;
    const mainData = payload ? { ...payload.results[0] } : localPayload;
    mainData.length = mainData.sequence.length;
    const flatArray = Array.from(
      flatMatchesFromIPScanPayload(mainData.matches, mainData.length),
    );
    const counts = getCountersFromFlatArray(flatArray);
    const filtered = flatArray.filter(
      ({ source_database: db }) => db.toLowerCase() === entryDB.toLowerCase(),
    );
    const unique = mergeEntries(filtered);
    return (
      <Related
        mainData={mainData}
        secondaryData={unique}
        secondaryDataLoading={false}
        isStale={false}
        mainType="protein"
        focusType="entry"
        focusDB={entryDB}
        actualSize={unique.length}
        dbCounters={counts}
        dataBase={dataBase}
      />
    );
  }
}

const mapStateToProps = createSelector(descriptionSelector, (description) => ({
  entryDB: description.entry.db,
}));

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
  mapStateToProps,
})(EntrySubPage);
