import React, { PureComponent } from 'react';
import T from 'prop-types';
// import { connect } from 'react-redux';
import { createSelector } from 'reselect';
// import { flattenDeep } from 'lodash-es';

import { _RelatedAdvanced as Related } from 'components/Related';
import Loading from 'components/SimpleCommonComponents/Loading';
import Redirect from 'components/generic/Redirect';

import { descriptionSelector } from 'reducers/custom-location/description';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import { iproscan2urlDB } from 'utils/url-patterns';

/*:: type Props = {
  data: Object,
  dataBase: Object,
  entryDB: entry,
}*/

const flatMatchesFromIPScanPayload = function*(ipScanMatches, proteinLength) {
  const protein = { protein: { length: proteinLength } };
  for (const match of ipScanMatches) {
    if (match.signature.entry) {
      yield {
        accession: match.signature.entry.accession,
        name: match.signature.entry.name,
        source_database: 'InterPro',
        entry_protein_locations: match.locations.map(location => ({
          fragments: [location],
        })),
        match: protein,
      };
    }
    yield {
      accession: match.signature.accession,
      name: match.signature.name || '',
      source_database: iproscan2urlDB(
        match.signature.signatureLibraryRelease.library,
      ),
      entry_protein_locations: match.locations.map(location => ({
        model_acc: match['model-ac'],
        fragments: [location],
      })),
      match: protein,
    };
  }
};

const getCountersFromFlatArray = flatArray =>
  Array.from(
    new Map(
      flatArray.map(({ accession, source_database: s }) => [accession, s]),
    ).entries(),
  ).reduce((agg, [_, source]) => {
    const db = source.toLowerCase();
    agg[db] = agg[db] ? agg[db] + 1 : 1;
    return agg;
  }, {});

const mergeEntries = matches => {
  const map = new Map();
  for (const match of matches) {
    const _match = map.get(match.accession);
    if (_match) {
      _match.entry_protein_locations = [
        ..._match.entry_protein_locations,
        ...match.entry_protein_locations,
      ];
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
  };

  render() {
    const {
      entryDB,
      data: { payload },
      dataBase,
    } = this.props;
    if (!entryDB)
      return (
        <Redirect
          to={customLocation => ({
            ...customLocation,
            description: {
              ...customLocation.description,
              entry: { isFilter: true, db: 'InterPro' },
            },
          })}
        />
      );
    if (!payload) return <Loading />;
    const mainData = { ...payload.results[0] };
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

const mapStateToProps = createSelector(descriptionSelector, description => ({
  entryDB: description.entry.db,
}));

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
  mapStateToProps,
})(EntrySubPage);
