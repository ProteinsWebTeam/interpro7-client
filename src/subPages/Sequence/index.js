import React, { PureComponent } from 'react';
import T from 'prop-types';

import Sequence from 'components/Protein/Sequence';

/* type Props = {
  data: {
    payload: (
      {
        metadata: {
          accession?: string,
          sequence: string,
          name?: {
            name?: string,
          },
        },
      } | {
        results: {
          0: {
            sequence: string,
            crossReferences: {
              0: {
                identifier: ?string,
              },
            }.
          },
        },
      },
    ),
  },
}; */

class SequenceSubPage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      payload: T.oneOfType([
        T.shape({
          metadata: T.shape({
            accession: T.string,
            sequence: T.string.isRequired,
            name: T.shape({
              name: T.string,
            }),
          }).isRequired,
        }),
        T.shape({
          results: T.shape(
            {
              0: T.shape({
                sequence: T.string.isRequired,
                crossReferences: T.shape({
                  0: T.shape({
                    identifier: T.string,
                  }).isRequired,
                }).isRequired,
              }).isRequired,
            }.isRequired,
          ),
        }),
      ]).isRequired,
    }).isRequired,
  };

  render() {
    let accession;
    let sequence;
    let name;
    const { payload } = this.props.data;
    if (payload.metadata) {
      accession = payload.metadata.accession;
      sequence = payload.metadata.sequence;
      name = payload.metadata.name.name;
    } else {
      accession = payload.results[0].crossReferences[0].identifier;
      sequence = payload.results[0].sequence;
    }
    return <Sequence accession={accession} sequence={sequence} name={name} />;
  }
}

export default SequenceSubPage;
