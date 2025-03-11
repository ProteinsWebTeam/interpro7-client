import React, { useEffect, useRef, useState } from 'react';

import loadData from 'higherOrder/loadData/ts';
import {
  getUrl,
  mapStateToPropsForModels,
} from 'components/AlphaFold/ProteinTable';
import { Selection } from 'components/Structure/ViewerAndEntries';

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

  useEffect(() => {}, []);

  return <></>;
};

export default loadData({
  getUrl: getUrl(false),
  mapStateToProps: mapStateToPropsForModels,
} as LoadDataParameters)(BFVDModelSubPage);
