import React, { useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';
import ReactDiffViewer from 'react-diff-viewer-continued';

import { connect } from 'react-redux';
import { setSequenceMismatch } from 'actions/creators';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { Button } from 'components/SimpleCommonComponents/Button';
import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';

type Props = {
  proteinAccession: string;
  alphaFoldSequence?: string;
  alphaFoldCreationDate?: string;
  setSequenceMismatch: typeof setSequenceMismatch;
};

interface LoadedProps
  extends Props,
    LoadDataProps<{ metadata: ProteinMetadata }> {}

const SequenceCheck = ({
  alphaFoldSequence,
  alphaFoldCreationDate,
  data,
  setSequenceMismatch,
}: LoadedProps) => {
  const { loading, payload } = data || {};
  const [showDiff, setShowDiff] = useState(false);

  const uniprotSequence = payload?.metadata?.sequence || '';
  const hasMismatch =
    !loading &&
    !!alphaFoldSequence &&
    alphaFoldSequence !== uniprotSequence + 'X';

  useEffect(() => {
    if (!loading && alphaFoldSequence) {
      setSequenceMismatch(hasMismatch);
    }
  }, [hasMismatch, loading, alphaFoldSequence]);

  useEffect(() => {
    return () => {
      setSequenceMismatch(false);
    };
  }, []);

  if (!alphaFoldSequence || loading) return <Loading inline />;
  if (!hasMismatch) return null;
  return (
    <Callout type="warning">
      <div>
        <b>AlphaFold Prediction Mismatch</b>
        <p>
          The AlphaFold prediction displayed below was generated on{' '}
          {new Date(alphaFoldCreationDate || '').toLocaleDateString()} using a
          sequence that has since been updated in the UniProt database. Please
          note that the displayed prediction may not accurately represent the
          current structure of the protein due to the sequence mismatch.
        </p>
        <Button
          type="secondary"
          onClick={() => setShowDiff(!showDiff)}
          style={{ width: '10rem' }}
        >
          {showDiff ? 'Hide' : 'Show'} Diff
        </Button>
        {showDiff && (
          <div style={{ overflow: 'scroll', maxWidth: 'min(65vw,60em)' }}>
            <ReactDiffViewer
              oldValue={alphaFoldSequence}
              newValue={uniprotSequence}
              splitView={false}
              leftTitle={'AlphaFold / Uniprot'}
              hideLineNumbers={true}
            />
          </div>
        )}
      </div>
    </Callout>
  );
};

const getUrlForProtein = createSelector(
  (state: GlobalState) => state.settings.api,
  (_state: GlobalState, props?: Props) => props?.proteinAccession || '',
  (server: ParsedURLServer, accession: string) => {
    if (!accession) return null;
    const { protocol, hostname, port, root } = server;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'protein' },
          protein: { db: 'uniprot', accession },
        }),
    });
  },
);

export default connect(null, { setSequenceMismatch })(
  loadData(getUrlForProtein as LoadDataParameters)(SequenceCheck),
);
