import React, { useEffect, useRef, useState } from 'react';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import AlphaFoldModel from 'components/AlphaFold/Model';
import ProteinTable, {
  getUrl,
  mapStateToPropsForModels,
} from 'components/AlphaFold/ProteinTable';
import ProtVistaForAlphaFold from 'components/Structure/ViewerAndEntries/ProtVistaForAlphaFold';
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

const AlphaFoldModelSubPage = ({ data, description }: LoadedProps) => {
  const mainAccession = description[description.main.key as Endpoint].accession;
  const mainType = description.main.key.toLowerCase();
  const container = useRef<HTMLDivElement>(null);
  const [selectionsInModel, setSelectionsInModel] =
    useState<Array<unknown> | null>(null);
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

  useEffect(() => {
    if (mainType === 'entry') {
      // Take the list of matched UniProt matches and assign the first one to protein accession
      if ((data?.payload?.count || 0) > 0)
        setProteinAcc(data?.payload?.results[0].metadata.accession || '');
    } else setProteinAcc(mainAccession as string);
  }, [mainAccession, data]);

  if (data?.loading) return <Loading />;
  const hasMultipleProteins =
    mainType === 'entry' && (data?.payload?.count || 0) > 1;
  return (
    <div
      className={css('row', 'column', { 'split-view': isSplitScreen })}
      ref={container}
    >
      {proteinAcc && (
        <AlphaFoldModel
          proteinAcc={proteinAcc}
          hasMultipleProteins={hasMultipleProteins}
          onModelChange={handleModelChange}
          modelId={modelId}
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
          <ProtVistaForAlphaFold
            // @ts-ignore
            protein={proteinAcc}
            onChangeSelection={(selection: Array<unknown>) => {
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
} as Params)(AlphaFoldModelSubPage);
