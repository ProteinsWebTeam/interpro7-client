import React, { useEffect, useRef, useState } from 'react';

import loadData from 'higherOrder/loadData/ts';
import BFVDModel from 'components/Structure3DModel/3DModel';
import ProteinTable, {
  getUrl,
  mapStateToPropsForModels,
} from 'components/Structure3DModel/ProteinTable';
import ProteinViewerForPredictedStructure from 'components/Structure/ViewerAndEntries/ProteinViewerForPredictedStructure';
import { Selection } from 'components/Structure/ViewerAndEntries';
import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import forSplit from 'components/Structure/ViewerAndEntries/style.css';

const css = cssBinder(ipro, fonts, forSplit);

type Props = {
  description: InterProDescription;
};
interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<ProteinEntryPayload>> {}

const BFVDModelSubPage = ({ data, description }: LoadedProps) => {
  const mainAccession = description[description.main.key as Endpoint].accession;
  const mainType = description.main.key!.toLowerCase();
  const container = useRef<HTMLDivElement>(null);
  const [selectionsInModel, setSelectionsInModel] =
    useState<Array<Selection> | null>(null);
  const [proteinAcc, setProteinAcc] = useState('');

  const [modelId, setModelId] = useState<string | null>(null);
  const [isSplitScreen, setSplitScreen] = useState(false);
  const handleProteinChange = (value: string) => {
    setProteinAcc(value);
    setModelId(null);
    container.current?.scrollIntoView();
  };
  const handleModelChange = (value: string) => {
    setModelId(value);
  };

  // Set up initial protein accession
  useEffect(() => {
    if (mainType === 'entry') {
      // Take the list of matched UniProt matches and assign the first one to protein accession
      if ((data?.payload?.count || 0) > 0)
        setProteinAcc(data?.payload?.results[0].metadata.accession || '');
    } else setProteinAcc(mainAccession as string);
  }, [mainAccession, data]);

  if (data?.loading) return <Loading />;

  // Generate BFVD URL here but let the 3DModel component handle availability check
  const bfvdURL = proteinAcc
    ? `https://bfvd.steineggerlab.workers.dev/pdb/${proteinAcc}.pdb`
    : '';
  const hasMultipleProteins =
    mainType === 'entry' && (data?.payload?.count || 0) > 1;

  return (
    <div
      className={css('vf-stack', 'vf-stack-400', {
        'split-view': isSplitScreen,
      })}
      ref={container}
    >
      {proteinAcc && (
        <BFVDModel
          proteinAcc={proteinAcc}
          hasMultipleProteins={hasMultipleProteins}
          onModelChange={handleModelChange}
          modelId={modelId}
          bfvd={bfvdURL}
          selections={selectionsInModel}
          parentElement={container.current}
          isSplitScreen={isSplitScreen}
          onSplitScreenChange={(value: boolean) => setSplitScreen(value)}
        />
      )}
      {mainType === 'entry' ? (
        <ProteinTable onProteinChange={handleProteinChange} />
      ) : (
        <div
          data-testid="alphafold-protvista"
          className={css('protvista-container')}
        >
          <ProteinViewerForPredictedStructure
            bfvd={bfvdURL}
            protein={proteinAcc}
            onChangeSelection={(selection: null | Array<Selection>) => {
              setSelectionsInModel(selection);
            }}
            isSplitScreen={isSplitScreen}
          />
        </div>
      )}
    </div>
  );
};

export default loadData({
  getUrl: getUrl(false),
  mapStateToProps: mapStateToPropsForModels,
} as LoadDataParameters)(BFVDModelSubPage);
