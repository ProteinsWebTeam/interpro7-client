import React, { useEffect, useState } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData/ts';
import config from 'config';

import Link from 'components/generic/Link';
import { UniProtLink } from 'components/ExtLink/patternLinkWrapper';
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
  onColorChange?: (value: string) => void;
  colorBy?: string;
  modelId: string | null;
  modelUrl?: string;
  bfvd?: string;
  selections: Selection[] | null;
  parentElement?: HTMLElement | null;
  isSplitScreen: boolean;
  onSplitScreenChange?: (v: boolean) => void;
};
interface LoadedProps extends Props, LoadDataProps<AlphafoldPayload> {}

const Structure3DModel = ({
  proteinAcc,
  hasMultipleProteins,
  onModelChange,
  onColorChange,
  colorBy,
  modelId,
  modelUrl,
  bfvd,
  data,
  selections,
  parentElement,
  isSplitScreen,
  onSplitScreenChange,
}: LoadedProps) => {
  const [shouldResetViewer, setShouldResetViewer] = useState(false);
  const [isReady, setReady] = useState(false);

  // Added states for PDB availability check (moved from BFVDModelSubPage)
  const [isPDBLoading, setIsPDBLoading] = useState(false);
  const [isPDBAvailable, setIsPDBAvailable] = useState(false);
  const [bfvdURL, setBfvdURL] = useState(bfvd || '');

  // Effect to check PDB availability (moved from BFVDModelSubPage)
  useEffect(() => {
    setIsPDBLoading(true);
    if (bfvd && proteinAcc.length > 0) {
      setBfvdURL(bfvd);
      fetch(bfvd, { method: 'GET' })
        .then((res) => {
          if (res.ok) {
            setIsPDBAvailable(true);
          }
          setIsPDBLoading(false);
        })
        .catch((error) => {
          setIsPDBLoading(false);
          setIsPDBAvailable(false);
        });
    }
  }, [proteinAcc, bfvd]);

  useEffect(() => {
    if (shouldResetViewer) {
      requestAnimationFrame(() => setShouldResetViewer(false));
    }
  }, [shouldResetViewer]);

  // Show warning if PDB is not available
  if (bfvd) {
    if (isPDBLoading) {
      return <Loading />;
    } else {
      if (!isPDBAvailable) {
        return (
          <Callout type="warning">
            Structure Viewer currently not available for this entry.
          </Callout>
        );
      }
    }
  } else {
    if (data?.loading) return <Loading />;

    if ((data?.payload || []).length === 0) {
      return (
        <div>
          <h3>Structure prediction</h3>
          <p>There is no structural model associated to {proteinAcc}.</p>
        </div>
      );
    }
  }

  const models = data?.payload || [];

  const modelInfo = models.find((x) => x.uniprotAccession === proteinAcc);

  const elementId = 'new-structure-model-viewer';
  return (
    <div className={css('alphafold-model')}>
      {!isSplitScreen && (
        <>
          <h3>
            {bfvd
              ? 'BFVD Structure Prediction'
              : 'AlphaFold Structure Prediction'}
            {models.length > 1 || hasMultipleProteins ? 's' : ''}
          </h3>
          <p>
            The protein structure below has been predicted{' '}
            {bfvd ? (
              <>
                by the{' '}
                <Link href={'//steineggerlab.com/en'}>Steinegger Lab</Link>{' '}
                using ColabFold (
                <Link href={'//doi.org/10.1093/nar/gkae1119'}>
                  Kim, R et al. 2024
                </Link>
                )
              </>
            ) : (
              <>
                by <Link href={'//deepmind.google/'}>Google DeepMind</Link>{' '}
                using AlphaFold (
                <Link href={'//www.nature.com/articles/s41586-021-03819-2'}>
                  Jumper, J et al. 2021
                </Link>
                )
              </>
            )}
            .
          </p>
        </>
      )}
      {hasMultipleProteins && !isSplitScreen ? (
        <Callout type="info">
          This entry matches several proteins with structure predictions. Use
          the table below the structure viewer to select another protein.
        </Callout>
      ) : null}

      {!bfvd && (
        <SequenceCheck
          proteinAccession={proteinAcc}
          alphaFoldSequence={models?.[0]?.sequence}
          alphaFoldCreationDate={models?.[0]?.modelCreatedDate}
        />
      )}

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
                    href={
                      bfvd
                        ? `//bfvd.foldseek.com/cluster/${proteinAcc}`
                        : modelUrl
                    }
                    className={css('ext')}
                    target="_blank"
                  >
                    {bfvd ? 'BFVD' : 'AlphaFold DB'}
                  </Link>
                  <br />
                  Find similar structures with{' '}
                  <Link
                    href={`//search.foldseek.com/search?accession=${proteinAcc}&source=${
                      bfvd ? 'BFVD' : 'AlphaFoldDB'
                    }`}
                    className={css('ext')}
                    target="_blank"
                  >
                    Foldseek
                  </Link>
                </span>
              </li>
              <li>
                {modelInfo !== undefined ? (
                  <>
                    <span className={css('header')}>Organism</span>
                    <i> {modelInfo.organismScientificName} </i>
                  </>
                ) : (
                  ''
                )}
              </li>
              {/*models.length > 1 ? (
                <li>
                  <span className={css('header')}>Prediction</span>
                  <select
                    value={modelId || ''}
                    className={css('protein-list')}
                    onChange={(event) => onModelChange(event.target.value)}
                    onBlur={(event) => onModelChange(event.target.value)}
                  >
                    {models.map((model) => (
                      <option key={model.modelEntityId}>{model.modelEntityId}</option>
                    ))}
                  </select>
                </li>
              ) : (
                ''
              )*/}
              <li>
                <span className={css('header')}>Color</span>
                <select
                  value={colorBy}
                  className={css('protein-list')}
                  onChange={(event) =>
                    onColorChange && onColorChange(event.target.value)
                  }
                >
                  <option value="confidence">Model confidence</option>
                  <option value="ted">TED domains</option>
                  <option value="repr_families">Representative families</option>
                  <option value="repr_domains">Representative domains</option>
                </select>
              </li>
            </ul>

            {/* <h5>Model confidence</h5>
            <ul className={css('legend')}>
              {confidenceColors.map((item) => (
                <li key={item.category}>
                  <span style={{ backgroundColor: item.color }}>&nbsp;</span>{' '}
                  {item.category} ({item.range})
                </li>
              ))}
            </ul> */}
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
                  href={!bfvd && modelInfo ? modelInfo.pdbUrl : bfvdURL}
                  download={`${proteinAcc || 'download'}.model.pdb`}
                >
                  <span
                    className={css('icon', 'icon-common', 'icon-download')}
                    data-icon="&#xf019;"
                  />
                  &nbsp;PDB file
                </Link>
                {!bfvd && (
                  <Link
                    className={css('control')}
                    href={!bfvd && modelInfo ? modelInfo.cifUrl : bfvdURL}
                    download={`${proteinAcc || 'download'}.model.cif`}
                  >
                    <span
                      className={css('icon', 'icon-common', 'icon-download')}
                      data-icon="&#xf019;"
                    />
                    &nbsp;mmCIF file
                  </Link>
                )}
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
            <StructureViewer
              id={'fullSequence'}
              url={!bfvd && modelInfo ? modelInfo.cifUrl : bfvdURL}
              elementId={elementId}
              ext={bfvd ? 'pdb' : 'mmcif'}
              theme={bfvd ? 'bfvd' : 'af'}
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
    (state: GlobalState) => state.customLocation.description,
    (_: GlobalState, props?: Props) => {
      const proteinFromPayload =
        (props as LoadedProps)?.data?.payload?.[0]?.uniprotAccession || '';
      return props?.proteinAcc || proteinFromPayload;
    },
    (
      { protocol, hostname, port, root, query }: ParsedURLServer,
      description: InterProDescription,
      accession: string,
    ) => {
      let modelUrl = null;

      if (
        description['main']['key'] === 'entry' ||
        description['main']['key'] === 'protein'
      ) {
        if (description[description['main']['key']]['detail'] === 'alphafold') {
          modelUrl = format({
            protocol,
            hostname,
            port,
            pathname: isUrlToApi
              ? `${root}api/prediction/${accession}`
              : `${root}entry/${accession}`,
          });
        }
      }

      if (isUrlToApi) return modelUrl;
      return { modelUrl };
    },
  );

export default loadData({
  getUrl: getModelInfoUrl(true),
  mapStateToProps: getModelInfoUrl(false),
} as LoadDataParameters)(Structure3DModel);
