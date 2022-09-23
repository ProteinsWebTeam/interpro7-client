// @flow
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
  };

  render() {
    let accession;
    let sequence;
    let name;
    const local = this.props.localPayload;
    let payload = null;
    const { loading, ok } = this.props.data;
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
    } else {
      accession = local.xref[0].identifier || '';
      name = this.props.localTitle || local.xref[0].name || '';
      sequence = local.sequence;
    }
    return (
      <>
        <Sequence accession={accession} sequence={sequence} name={name} />
        {local?.orf?.dnaSequence && (
          <section id="nucleotides">
            <header>
              Nucleotide Sequence - {local.group} [{local?.orf?.start}-
              {local?.orf?.end}]
            </header>
            <InnerSequence
              sequence={local?.orf?.dnaSequence}
              start={local?.orf?.start}
              end={local?.orf?.end}
            />
          </section>
        )}
      </>
    );
  }
}

export default SequenceSubPage;
