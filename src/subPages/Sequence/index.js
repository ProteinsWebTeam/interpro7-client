import React, { PureComponent } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import Sequence, { InnerSequence } from 'components/Protein/Sequence';

/*::
type LocalPayload = {
  sequence: string,
  xref: {
      identifier: string,
      name: string,
    }[],
  orf: {
    dnaSequence: string,
    start: number,
    end: number,
  },
  group: string,
};
type RemotePayload= {
  metadata?: {
    accession: string,
    sequence: string,
    name?: {
      name?: string,
    },
  },
  results?: {
    xref:{
      identifier: string,
      name: string,
    }[]
  }
};
type Props = {
  localPayload: LocalPayload,
  localTitle: string,
  data: {
    loading: boolean,
    ok: boolean,
    payload: RemotePayload,
  }
}; */

class SequenceSubPage extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: dataPropType.isRequired,
    localPayload: T.object,
    localTitle: T.string,
    orf: T.number,
  };

  render() {
    let accession;
    let sequence;
    let name;
    const local = this.props.localPayload;
    let payload = null;
    const { loading, ok } = this.props.data;
    const hasORF =
      local?.openReadingFrames?.length && typeof this.props.orf !== 'undefined';
    const currentORF = local?.openReadingFrames?.[this.props.orf];
    const protein = currentORF?.protein;

    if (ok && !loading && !payload && this.props.data?.payload) {
      payload = this.props.data?.payload;
    }
    if (!payload && !local) return null;
    if (payload?.metadata) {
      accession = payload.metadata?.accession;
      sequence = payload.metadata?.sequence;
      name = payload.metadata?.name?.name;
    } else if (payload?.results) {
      accession = payload.results?.[0]?.xref?.accession;
      sequence = payload.results?.[0]?.xref?.sequence;
      name = payload.results?.[0]?.xref?.name?.name;
    } else if (hasORF) {
      accession = protein.xref[0].identifier || '';
      name = protein.xref[0].name || '';
      sequence = protein.sequence;
    } else {
      accession = local.xref[0].identifier || '';
      name = this.props.localTitle || local.xref[0].name || '';
      sequence = local.sequence;
    }
    return (
      <>
        <Sequence accession={accession} sequence={sequence} name={name} />
        {hasORF && protein && (
          <section id="nucleotides">
            <header>
              Nucleotide Sequence - [{currentORF.start}-{currentORF.end}]
            </header>
            <InnerSequence
              sequence={local?.sequence}
              start={currentORF.start}
              end={currentORF.end}
              name={protein.xref[0].name}
            />
          </section>
        )}
      </>
    );
  }
}

export default SequenceSubPage;
