// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import flattenDeep from 'lodash-es/flattenDeep';

import { _RelatedAdvanced as Related } from 'components/Related';

/*:: type Props = {
  data: Object,
}*/

class EntrySubPage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    const mainData = this.props.data.payload.results[0];
    mainData.length = mainData.sequenceLength;
    // massage data to make it look like what is needed for
    // a standard domain architecture subpage
    const data = {
      integrated: new Map(),
    };
    for (const match of mainData.matches) {
      if (!match.signature.entry) continue;
      const { accession, name, type } = match.signature.entry;
      const entry = data.integrated.get(accession) || {
        accession,
        source_database: 'InterPro',
        children: [],
        name,
        type,
      };
      entry.children.push({
        coordinates: [match.locations.map(l => [l.start, l.end])],
      });
      data.integrated.set(accession, entry);
    }
    data.integrated = Array.from(data.integrated.values()).map(m => {
      const coordinates = flattenDeep(m.children.map(s => s.coordinates));
      return {
        ...m,
        entry_protein_locations: [
          {
            fragments: [
              {
                start: Math.min(...coordinates),
                end: Math.max(...coordinates),
              },
            ],
          },
        ],
        matches: [
          {
            protein: {
              length: mainData.sequenceLength,
            },
          },
        ],
      };
    });
    return (
      <Related
        mainData={mainData}
        secondaryData={data.integrated}
        isStale={false}
        mainType="protein"
        focusType="entry"
        focusDB="InterPro"
        actualSize={data.integrated.length}
      />
    );
  }
}

export default EntrySubPage;
