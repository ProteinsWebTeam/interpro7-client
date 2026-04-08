import React, { useEffect, useState } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData/ts';
import config from 'config';

import Link from 'components/generic/Link';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import PictureInPicturePanel from 'components/SimpleCommonComponents/PictureInPicturePanel';
import PIPToggleButton from 'components/SimpleCommonComponents/PictureInPicturePanel/ToggleButton';
import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';
import Button from 'components/SimpleCommonComponents/Button';

import StructureViewer from 'components/Structure/ViewerOnDemand';
import { Selection } from 'components/Structure/ViewerAndEntries';

import SequenceCheck from './SequenceCheck';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';
import buttonBar from 'components/Structure/ViewerAndEntries/button-bar.css';
import AlphaFoldStructuresTable from '../AlphaFoldStructuresTable';

const css = cssBinder(style, buttonBar, ipro, fonts);

const confidenceColors = [
  {
    category: 'Very High',
    range: 'pLDDT > 90',
    color: '#0053d6',
  },
  {
    category: 'Confident',
    range: '90 > pLDDT > 70',
    color: '#65cbf3',
  },
  {
    category: 'Low',
    range: '70 > pLDDT > 50',
    color: '#ffdb13',
  },
  {
    category: 'Very Low',
    range: 'pLDDT < 50',
    color: '#ff7d45',
  },
];

type PredictionLoaderProps = {
  entryId: string | null;
  onLoaded: (model: AlphafoldModelInfo) => void;
};
interface LoadedPredictionProps
  extends PredictionLoaderProps,
    LoadDataProps<AlphafoldModelInfo[]> {}

const PredictionLoader = ({ data, onLoaded }: LoadedPredictionProps) => {
  useEffect(() => {
    const model = data?.payload?.[0];
    if (model) onLoaded(model);
  }, [data?.payload]);
  return null;
};

const getPredictionUrl = createSelector(
  (state: GlobalState) => state.settings.alphafold,
  (_: GlobalState, props?: PredictionLoaderProps) => props?.entryId,
  (
    { protocol, hostname, port, root }: ParsedURLServer,
    entryId: string | null | undefined,
  ) => {
    if (!entryId) return null;
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}api/prediction/${entryId}`,
    });
  },
);

const ConnectedPredictionLoader = loadData({
  getUrl: getPredictionUrl,
} as LoadDataParameters)(PredictionLoader);

type Props = {
  proteinAcc: string;
  hasMultipleProteins: boolean;
  onModelChange: (value: string) => void;
  onColorChange?: (value: string) => void;
  colorBy?: string;
  colorMap?: Record<number, number>;
  hasTED: boolean;
  hasRepresentativeData?: { family: boolean | null; domain: boolean | null };
  modelId: string | null;
  modelUrl?: string;
  selections: Selection[] | null;
  parentElement?: HTMLElement | null;
  isSplitScreen: boolean;
  onSplitScreenChange?: (v: boolean) => void;
  onModelLoaded?: (cifUrl: string) => void;
};
interface LoadedProps extends Props, LoadDataProps<MultimerAlphafoldPayload> {}

const Structure3DModel = ({
  proteinAcc,
  hasMultipleProteins,
  onModelChange,
  onColorChange,
  colorBy,
  colorMap,
  hasTED,
  hasRepresentativeData,
  modelId,
  modelUrl,
  data,
  selections,
  parentElement,
  isSplitScreen,
  onSplitScreenChange,
  onModelLoaded,
}: LoadedProps) => {
  const [shouldResetViewer, setShouldResetViewer] = useState(false);
  const [isReady, setReady] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AlphafoldModelInfo | null>(
    null,
  );

  useEffect(() => {
    const selectedValueToKey: Record<string, 'family' | 'domain'> = {
      repr_families: 'family',
      repr_domains: 'domain',
    };
    if (
      colorBy &&
      hasRepresentativeData &&
      hasRepresentativeData[selectedValueToKey[colorBy]] === null &&
      onColorChange
    ) {
      onColorChange('af');
    }
  }, [colorBy, hasRepresentativeData]);

  const renderLegend = (display: string = '') => {
    return (
      <div className={css(display ? 'inline-legend-container' : '')}>
        {colorBy === 'af' && (
          <>
            <b> Model Confidence </b>
            <ul className={css('legend', display)}>
              {confidenceColors.map((item) => (
                <li key={item.category}>
                  <span style={{ backgroundColor: item.color }}>&nbsp;</span>{' '}
                  {item.category} ({item.range})
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (shouldResetViewer) {
      requestAnimationFrame(() => setShouldResetViewer(false));
    }
  }, [shouldResetViewer]);

  useEffect(() => {
    const docs = data?.payload?.docs || [];
    if (docs.length > 0 && selectedEntryId === null) {
      const first = docs[0];
      setSelectedEntryId(first.entryId);
    }
  }, [data]);

  if (data?.loading) return <Loading />;

  if ((data?.payload?.docs || []).length === 0) {
    return (
      <div>
        <h3>Structure prediction</h3>
        <p>There is no structural model associated to {proteinAcc}.</p>
      </div>
    );
  }

  const elementId = 'new-structure-model-viewer';

  // Derive cifUrl immediately from the already-loaded search doc so the
  // structure viewer updates on click without waiting for the prediction API.
  const selectedDoc = (data?.payload?.docs || []).find(
    (d) => d.entryId === selectedEntryId,
  );
  const selectedCifUrl = selectedDoc
    ? `${config.root.alphafold.href}files/${selectedDoc.entryId}-model_v${selectedDoc.latestVersion}.cif`
    : selectedModel?.cifUrl;

  return (
    <div className={css('alphafold-model')}>
      {!isSplitScreen && (
        <>
          <h3>
            AlphaFold Structure Prediction
            {(data?.payload?.docs || []).length > 1 || hasMultipleProteins
              ? 's'
              : ''}
          </h3>
          <p>
            The protein structure below has been predicted by{' '}
            <Link href={'//deepmind.google/'}>Google DeepMind</Link> using
            AlphaFold (
            <Link href={'//www.nature.com/articles/s41586-021-03819-2'}>
              Jumper, J et al. 2021
            </Link>
            )
          </p>
        </>
      )}
      {hasMultipleProteins && !isSplitScreen ? (
        <Callout type="info">
          This entry matches several proteins with structure predictions. Use
          the table below the structure viewer to select another protein.
        </Callout>
      ) : null}

      <SequenceCheck
        proteinAccession={proteinAcc}
        alphaFoldSequence={selectedModel?.sequence}
        alphaFoldCreationDate={selectedModel?.modelCreatedDate}
      />

      <div className={css('af-container')}>
        {!isSplitScreen && (
          <div className={css('panel-legends')}>
            <h5>Information</h5>
            <ul className={css('information')}>
              <li>
                <span className={css('header')}>Protein</span>
                <Link
                  to={{
                    description: {
                      main: { key: 'protein' },
                      protein: {
                        db: 'uniprot',
                        accession: proteinAcc,
                      },
                    },
                  }}
                >
                  {proteinAcc}
                </Link>
                <span className={css('footer')}>
                  View on{' '}
                  <Link
                    href={config.root.alphafold.href + 'entry/' + proteinAcc}
                    className={css('ext')}
                    target="_blank"
                  >
                    Alphafold DB
                  </Link>
                  <br />
                  Find similar structures with{' '}
                  <Link
                    href={`//search.foldseek.com/search?accession=${proteinAcc}&source=AlphaFoldDB`}
                    className={css('ext')}
                    target="_blank"
                  >
                    Foldseek
                  </Link>
                </span>
              </li>
              <li>
                {selectedModel !== null ? (
                  <>
                    <span className={css('header')}>Organism</span>
                    <i> {selectedModel.organismScientificName} </i>
                  </>
                ) : (
                  ''
                )}
              </li>
              <li> {renderLegend()} </li>
            </ul>
          </div>
        )}

        <div className={css('panel-component')}>
          <PictureInPicturePanel
            className={css({ 'structure-viewer-split': isSplitScreen })}
            data-testid="structure-3d-viewer"
            OtherButtons={
              <div
                style={{
                  display: isSplitScreen ? 'none' : 'block',
                }}
                className={css('button-bar')}
              >
                <Link
                  className={css('control')}
                  href={
                    selectedCifUrl && selectedCifUrl.replace('.cif', '.pdb')
                  }
                  download={`${proteinAcc || 'download'}.model.pdb`}
                >
                  <span
                    className={css('icon', 'icon-common', 'icon-download')}
                    data-icon="&#xf019;"
                  />
                  &nbsp;PDB file
                </Link>
                <Link
                  className={css('control')}
                  href={selectedCifUrl}
                  download={`${proteinAcc || 'download'}.model.cif`}
                >
                  <span
                    className={css('icon', 'icon-common', 'icon-download')}
                    data-icon="&#xf019;"
                  />
                  &nbsp;mmCIF file
                </Link>
                <Button
                  type="inline"
                  icon="icon-redo"
                  className={css('control')}
                  onClick={() => setShouldResetViewer(true)}
                  title="Reset image"
                />
                <FullScreenButton
                  className={css('icon', 'icon-common', 'control')}
                  tooltip="Split full screen"
                  dataIcon="icon-columns"
                  element={parentElement}
                  onFullScreenHook={() => onSplitScreenChange?.(true)}
                  onExitFullScreenHook={() => onSplitScreenChange?.(false)}
                />{' '}
                <FullScreenButton
                  className={css('icon', 'icon-common', 'control')}
                  tooltip="View the structure in full screen mode"
                  element={isReady ? elementId : null}
                />{' '}
                <PIPToggleButton
                  className={css('icon', 'icon-common', 'control')}
                />
              </div>
            }
          >
            {!hasMultipleProteins && (
              <>
                <b>Colour by</b>
                <select
                  className={css('color-theme-select')}
                  value={colorBy}
                  onChange={(event) => {
                    if (onColorChange) onColorChange(event.target.value);
                  }}
                >
                  <option value={'af'}>Model confidence</option>
                  {hasTED && <option value="ted">TED domains</option>}
                  {hasRepresentativeData && hasRepresentativeData['family'] && (
                    <option value="repr_families">
                      Representative families
                    </option>
                  )}
                  {hasRepresentativeData && hasRepresentativeData['domain'] && (
                    <option value="repr_domains">Representative domains</option>
                  )}
                </select>
              </>
            )}

            <StructureViewer
              id={'fullSequence'}
              url={selectedCifUrl}
              elementId={elementId}
              ext={'mmcif'}
              theme={colorBy}
              colorMap={colorMap}
              shouldResetViewer={shouldResetViewer}
              selections={selections}
              onStructureLoaded={() => {
                setReady(true);
              }}
            />
            {isSplitScreen && renderLegend('inline-legend')}
          </PictureInPicturePanel>
          <>
            <ConnectedPredictionLoader
              entryId={selectedEntryId}
              onLoaded={(model) => {
                setSelectedModel(model);
                onModelLoaded?.(model.cifUrl);
              }}
            />
            <AlphaFoldStructuresTable
              docs={data?.payload?.docs || []}
              onSelect={setSelectedEntryId}
              selectedId={selectedEntryId}
            />
          </>
        </div>
      </div>
    </div>
  );
};

const getModelsInfoUrl = (isUrlToApi: boolean) =>
  createSelector(
    (state: GlobalState) => state.settings.alphafold,
    (state: GlobalState) => state.customLocation.description,
    (_: GlobalState, props?: Props) => {
      const proteinFromPayload =
        (props as LoadedProps)?.data?.payload?.docs[0]?.uniprotAccession || '';
      return props?.proteinAcc || proteinFromPayload;
    },
    (
      { protocol, hostname, port, root, query }: ParsedURLServer,
      description: InterProDescription,
      accession: string,
    ) => {
      let modelsUrl = null;

      const url = new URL(`${root}api/search`, window.location.origin);
      url.searchParams.set('q', `(uniprotAccession:${accession})`);
      url.searchParams.set('type', 'main');

      if (
        description['main']['key'] === 'entry' ||
        description['main']['key'] === 'protein'
      ) {
        if (description[description['main']['key']]['detail'] === 'alphafold') {
          modelsUrl = format({
            protocol,
            hostname,
            port,
            pathname: isUrlToApi
              ? `${root}api/search`
              : `${root}entry/${accession}`,
            search: isUrlToApi
              ? `?q=(uniprotAccession:${accession})&type=main`
              : undefined,
          });
        }
      }

      if (isUrlToApi) return modelsUrl;
      return { modelsUrl };
    },
  );

export default loadData({
  getUrl: getModelsInfoUrl(true),
  mapStateToProps: getModelsInfoUrl(false),
} as LoadDataParameters)(Structure3DModel);
