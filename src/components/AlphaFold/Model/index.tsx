import React, { useEffect, useState } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

import Link from 'components/generic/Link';
import { UniProtLink } from 'components/ExtLink/patternLinkWrapper';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import PictureInPicturePanel from 'components/SimpleCommonComponents/PictureInPicturePanel';
import PIPToggleButton from 'components/SimpleCommonComponents/PictureInPicturePanel/ToggleButton';
import Loading from 'components/SimpleCommonComponents/Loading';

import StructureViewer from 'components/Structure/ViewerOnDemand';
import { Selection } from 'components/Structure/ViewerAndEntries';

import SequenceCheck from './SequenceCheck';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';
import buttonBar from 'components/Structure/ViewerAndEntries/button-bar.css';

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

type Props = {
  proteinAcc: string;
  hasMultipleProteins: boolean;
  onModelChange: (value: string) => void;
  modelId: string | null;
  modelUrl?: string;
  selections: Selection[] | null;
  parentElement?: HTMLElement | null;
  isSplitScreen: boolean;
  onSplitScreenChange?: (v: boolean) => void;
};
interface LoadedProps extends Props, LoadDataProps<AlphafoldPayload> {}

const AlphaFoldModel = ({
  proteinAcc,
  hasMultipleProteins,
  onModelChange,
  modelId,
  modelUrl,
  data,
  selections,
  parentElement,
  isSplitScreen,
  onSplitScreenChange,
}: LoadedProps) => {
  const [shouldResetViewer, setShouldResetViewer] = useState(false);
  const [isReady, setReady] = useState(false);
  useEffect(() => {
    if (shouldResetViewer) {
      requestAnimationFrame(() => setShouldResetViewer(false));
    }
  }, [shouldResetViewer]);
  useEffect(() => {
    if (!selections) setShouldResetViewer(true);
  }, [selections]);
  if (data?.loading) return <Loading />;
  if ((data?.payload || []).length === 0) {
    return (
      <div>
        <h3>Structure prediction</h3>
        <p>There is no structural model associated to {proteinAcc}.</p>
      </div>
    );
  }

  const models = data?.payload || [];
  const [modelInfo] =
    modelId === null
      ? models.slice(0, 1)
      : models.filter((x) => x.entryId === modelId);
  const elementId = 'new-structure-model-viewer';
  return (
    <div className={css('alphafold-model')}>
      {!isSplitScreen && (
        <>
          <h3>
            AlphaFold structure prediction
            {models.length > 1 || hasMultipleProteins ? 's' : ''}
          </h3>
          <p>
            The protein structure below has been predicted by{' '}
            <Link href={'//deepmind.com/'}>DeepMind</Link> with AlphaFold (
            <Link href={'//www.nature.com/articles/s41586-021-03819-2'}>
              Jumper, J et al. 2021
            </Link>
            ). For more information and additional features, please visit this
            sequence&apos;s page at <Link href={modelUrl}>AlphaFold DB</Link>.
          </p>
        </>
      )}
      {hasMultipleProteins && !isSplitScreen ? (
        <div className={css('callout', 'primary', 'info')}>
          <p>
            <span
              className={css('icon', 'icon-common', 'icon-info')}
              data-icon="&#xf129;"
            />
            This entry matches several proteins with structure predictions. Use
            the table below the structure viewer to select another protein.
          </p>
        </div>
      ) : null}
      <SequenceCheck
        proteinAccession={proteinAcc}
        alphaFoldSequence={models?.[0]?.uniprotSequence}
        alphaFoldCreationDate={models?.[0]?.modelCreatedDate}
      />

      <div className={css('row')}>
        {!isSplitScreen && (
          <div className={css('column', 'small-12', 'medium-3')}>
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
                        accession: modelInfo.uniprotAccession,
                      },
                    },
                  }}
                >
                  {modelInfo.uniprotAccession}
                </Link>
                <span className={css('footer')}>
                  View on{' '}
                  <Link href={modelUrl} className={css('ext')} target="_blank">
                    AlphaFold DB
                  </Link>{' '}
                  or{' '}
                  <UniProtLink
                    id={modelInfo.uniprotAccession}
                    className={css('ext')}
                    target="_blank"
                  >
                    UniProtKB
                  </UniProtLink>
                </span>
              </li>
              <li>
                <span className={css('header')}>Organism</span>
                <i>{modelInfo.organismScientificName}</i>
              </li>
              {models.length > 1 ? (
                <li>
                  <span className={css('header')}>Prediction</span>
                  <select
                    value={modelId || ''}
                    className={css('protein-list')}
                    onChange={(event) => onModelChange(event.target.value)}
                    onBlur={(event) => onModelChange(event.target.value)}
                  >
                    {models.map((model) => (
                      <option key={model.entryId}>{model.entryId}</option>
                    ))}
                  </select>
                </li>
              ) : (
                ''
              )}
            </ul>
            <h5>Model confidence</h5>
            <ul className={css('legend')}>
              {confidenceColors.map((item) => (
                <li key={item.category}>
                  <span style={{ backgroundColor: item.color }}>&nbsp;</span>{' '}
                  {item.category} ({item.range})
                </li>
              ))}
            </ul>
          </div>
        )}
        <div
          className={css({
            column: !isSplitScreen,
            'small-12': !isSplitScreen,
            'medium-9': !isSplitScreen,
          })}
        >
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
                  href={modelInfo.pdbUrl}
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
                  href={modelInfo.cifUrl}
                  download={`${proteinAcc || 'download'}.model.cif`}
                >
                  <span
                    className={css('icon', 'icon-common', 'icon-download')}
                    data-icon="&#xf019;"
                  />
                  &nbsp;mmCIF file
                </Link>
                <button
                  className={css('icon', 'icon-common', 'control')}
                  onClick={() => setShouldResetViewer(true)}
                  data-icon="}"
                  title="Reset image"
                />
                <FullScreenButton
                  className={css('icon', 'icon-common', 'control')}
                  tooltip="Split full screen"
                  dataIcon={'\uF0DB'}
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
            <StructureViewer
              id={'fullSequence'}
              url={modelInfo.cifUrl}
              elementId={elementId}
              ext="mmcif"
              theme={'af'}
              shouldResetViewer={shouldResetViewer}
              selections={selections}
              onStructureLoaded={() => {
                setReady(true);
              }}
            />
          </PictureInPicturePanel>
        </div>
      </div>
    </div>
  );
};

const getModelInfoUrl = (isUrlToApi: boolean) =>
  createSelector(
    (state: GlobalState) => state.settings.alphafold,
    (_: GlobalState, props?: Props) => {
      const proteinFromPayload =
        (props as LoadedProps)?.data?.payload?.[0]?.uniprotAccession || '';
      return props?.proteinAcc || proteinFromPayload;
    },
    (
      { protocol, hostname, port, root, query }: ParsedURLServer,
      accession: string
    ) => {
      const modelUrl = format({
        protocol,
        hostname,
        port,
        pathname: isUrlToApi
          ? `${root}api/prediction/${accession}`
          : `${root}entry/${accession}`,
        query: query,
      });
      if (isUrlToApi) return modelUrl;
      return { modelUrl };
    }
  );

export default loadData({
  getUrl: getModelInfoUrl(true),
  mapStateToProps: getModelInfoUrl(false),
} as Params)(AlphaFoldModel);
