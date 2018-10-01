import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flattenDeep } from 'lodash-es';

import { _RelatedAdvanced as Related } from 'components/Related';
import Loading from 'components/SimpleCommonComponents/Loading';
import Redirect from 'components/generic/Redirect';

import { descriptionSelector } from 'reducers/custom-location/description';

/*:: type Props = {
  data: Object,
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
      accession: match['model-ac'],
      name: match.signature.name,
      source_database: match.signature.signatureLibraryRelease.library,
      entry_protein_locations: match.locations.map(location => ({
        fragments: [location],
      })),
      match: protein,
    };
  }
};

const mergeEntries = matches => {
  const map = new Map();
  for (const match of matches) {
    let _match = map.get(match.accession);
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
    entryDB: T.string.isRequired,
  };

  render() {
    const {
      entryDB,
      data: { payload },
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
    const filtered = flatArray.filter(
      ({ source_database }) =>
        source_database.toLowerCase() === entryDB.toLowerCase(),
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
      />
    );
  }
}

const mapStateToProps = createSelector(descriptionSelector, description => ({
  entryDB: description.entry.db,
}));

export default connect(mapStateToProps)(EntrySubPage);
