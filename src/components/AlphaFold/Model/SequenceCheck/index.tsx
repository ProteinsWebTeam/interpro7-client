import React, { useState } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';
import ReactDiffViewer from 'react-diff-viewer';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(ipro, fonts);

type Props = {
  proteinAccession: string;
  alphaFoldSequence?: string;
};

interface LoadedProps
  extends Props,
    LoadDataProps<{ metadata: ProteinMetadata }> {}

const SequenceCheck = ({
  alphaFoldSequence,
  data: { loading, payload },
}: LoadedProps) => {
  const [showDiff, setShowDiff] = useState(false);
  if (!alphaFoldSequence || loading) return <Loading inline />;
  const uniprotSequence = payload?.metadata?.sequence || '';
  if (alphaFoldSequence === uniprotSequence) return null;
  return (
    <div className={css('callout', 'warning', 'margin-bottom-medium')}>
      <span className={css('icon', 'icon-common')} data-icon="&#xf35a;"></span>{' '}
      <b>Mismatched Sequence.</b>
      <p>
        The sequence used by AlphaFold when generating the model is different to
        the one in the InterPro database.
      </p>
      <button
        className={css('vf-button', 'vf-button--secondary', 'vf-button--sm')}
        onClick={() => setShowDiff(!showDiff)}
      >
        {showDiff ? 'Hide' : 'Show'} Diff
      </button>
      {showDiff && (
        <div style={{ overflow: 'scroll', maxWidth: '70vw' }}>
          <ReactDiffViewer
            // oldValue={JSON.stringify(fav.differences.old)}
            oldValue={alphaFoldSequence}
            // newValue={JSON.stringify(fav.differences.newData)}
            newValue={uniprotSequence}
            splitView={false}
            leftTitle={'AlphaFold / Uniprot'}
            hideLineNumbers={true}
          />
        </div>
      )}
    </div>
  );
};
const getUrlForProtein: GetUrl<Props> = createSelector(
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
  }
);

export default loadData(getUrlForProtein as Params)(SequenceCheck);
