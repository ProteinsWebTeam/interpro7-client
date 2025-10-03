import React, { useEffect, useRef, useState } from 'react';

import loadData from 'higherOrder/loadData/ts';
import AlphaFoldModel from 'components/Structure3DModel/3DModel';
import ProteinTable, {
  getUrl,
  mapStateToPropsForModels,
} from 'components/Structure3DModel/ProteinTable';
import ProteinViewerForPredictedStructure from 'components/Structure/ViewerAndEntries/ProteinViewerForPredictedStructure';
import { Selection } from 'components/Structure/ViewerAndEntries';
import Loading from 'components/SimpleCommonComponents/Loading';

import { connect } from 'react-redux';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { createSelector } from 'reselect';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import forSplit from 'components/Structure/ViewerAndEntries/style.css';
import { changeSettingsRaw } from 'actions/creators';
import { chooseColor } from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';

const css = cssBinder(ipro, fonts, forSplit);

type Props = {
  customLocation: InterProLocation;
  matchTypeSettings: MatchTypeUISettings;
  colorDomainsBy: string;
};
interface LoadedProps
  extends Props,
    LoadDataProps<InterProNMatches, 'InterProNMatches'>,
    LoadDataProps<PayloadList<ProteinEntryPayload>> {}

const AlphaFoldModelSubPage = ({
  data,
  customLocation,
  dataInterProNMatches,
  matchTypeSettings,
  colorDomainsBy,
}: LoadedProps) => {
  const { description } = customLocation;
  const mainAccession = description[description.main.key as Endpoint].accession;
  const mainType = description.main.key!.toLowerCase();
  const container = useRef<HTMLDivElement>(null);
  const [selectionsInModel, setSelectionsInModel] =
    useState<Array<Selection> | null>(null);
  const [proteinAcc, setProteinAcc] = useState('');
  const [interproNData, setInterProNData] = useState({});
  const [modelId, setModelId] = useState<string | null>(null);
  const [isSplitScreen, setSplitScreen] = useState(false);
  const [colorBy, setColorBy] = useState('confidence');
  const [colorSelections, setColorSelections] = useState<Feature[]>([]);

  const handleProteinChange = (value: string) => {
    setProteinAcc(value);
    setModelId(null);
    container.current?.scrollIntoView();
  };
  const handleModelChange = (value: string) => {
    setModelId(value);
  };

  const onColorChange = (value: string) => {
    setColorBy(value);
  };

  const getColorSelection = (color: string, selectionsData: unknown) => {
    console.log(color, selectionsData);
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
      className={css('vf-stack', 'vf-stack-400', {
        'split-view': isSplitScreen,
      })}
      ref={container}
    >
      {proteinAcc && (
        <AlphaFoldModel
          proteinAcc={proteinAcc}
          hasMultipleProteins={hasMultipleProteins}
          onModelChange={handleModelChange}
          onColorChange={onColorChange}
          colorBy={colorBy}
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
          <ProteinViewerForPredictedStructure
            protein={proteinAcc}
            matchTypeSettings={matchTypeSettings}
            getColorSelection={getColorSelection}
            colorBy={colorBy}
            colorDomainsBy={colorDomainsBy}
            dataInterProNMatches={dataInterProNMatches?.payload || {}}
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

// Define the selector to fetch the InterPro N matches
const getInterProNMatches = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }: ParsedURLServer, description) => {
    if (description.main.key === 'protein') {
      const newDesc: InterProPartialDescription = {
        main: { key: 'protein' },
        protein: { db: 'uniprot', accession: description.protein.accession },
      };

      const url = format({
        protocol,
        hostname,
        port,
        pathname: root + descriptionToPath(newDesc),
        query: {
          interpro_n: '',
        },
      });

      return url;
    } else
      return format({
        protocol,
        hostname,
        port,
        pathname: '',
      });
  },
);

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (state: GlobalState) => state.settings.ui,
  (api, ui) => ({
    api,
    matchTypeSettings: ui.matchTypeSettings,
    colorDomainsBy: ui.colorDomainsBy,
  }),
);

export default connect(mapStateToProps)(
  loadData({
    getUrl: getUrl(false),
  } as LoadDataParameters)(
    loadData<InterProNMatches, 'InterProNMatches'>({
      getUrl: getInterProNMatches,
      propNamespace: 'InterProNMatches',
    } as LoadDataParameters)(AlphaFoldModelSubPage),
  ),
);
