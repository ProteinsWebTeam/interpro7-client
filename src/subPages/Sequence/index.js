import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

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
            xref: {
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
    data: dataPropType.isRequired,
    localPayload: T.object,
  };

  render() {
    let accession;
    let sequence;
    let name;
    let payload = this.props.data.payload;
    if (payload && !payload.metadata)
      payload = this.props.data.payload.results
        ? this.props.data.payload.results[0]
        : this.props.localPayload;
    if (!payload) return null;
    if (payload.metadata) {
      accession = payload.metadata.accession;
      sequence = payload.metadata.sequence;
      name = payload.metadata.name.name;
    } else {
      accession = payload.xref[0].identifier || '';
      sequence = payload.sequence;
    }
    return <Sequence accession={accession} sequence={sequence} name={name} />;
  }
}

export default SequenceSubPage;
