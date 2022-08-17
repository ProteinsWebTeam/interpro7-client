// @flow
import React, { useEffect, useState } from 'react';
import T from 'prop-types';

import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData';

import Link from 'components/generic/Link';
import { UniProtLink } from 'components/ExtLink';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import PictureInPicturePanel from 'components/SimpleCommonComponents/PictureInPicturePanel';
import Loading from 'components/SimpleCommonComponents/Loading';

import StructureViewer from 'components/Structure/ViewerOnDemand';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';

const f = foundationPartial(style, ipro, fonts);

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

const AlphaFoldModel = ({
  proteinAcc,
  hasMultipleProteins,
  onModelChange,
  modelId,
  modelUrl,
  data,
  selections,
}) => {
  const [shouldResetViewer, setShouldResetViewer] = useState(false);
  useEffect(() => {
    if (shouldResetViewer) {
      requestAnimationFrame(() => setShouldResetViewer(false));
    }
  }, [shouldResetViewer]);
  useEffect(() => {
    if (!selections) setShouldResetViewer(true);
  }, [selections]);

  if (data?.loading) return <Loading />;
  if (!data.loading && Object.keys(data.payload).length !== 1) {
    return (
      <div>
        <h3>Structure prediction</h3>
        <p>There is no structural model associated to {proteinAcc}.</p>
      </div>
    );
  }

  const models = data.payload;
  // const [modelInfo] = modelId === null ? models.slice(0, 1) : models.filter(x => x.entryId === modelId);
  const [modelInfo] = models.slice(0, 1);
  const elementId = 'new-structure-model-viewer';
  return (
    <div>
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
      {hasMultipleProteins ? (
        <div className={f('callout', 'primary', 'info')}>
          <p>
            <span
              className={f('icon', 'icon-common', 'icon-info')}
              data-icon="&#xf129;"
            />
            This entry matches several proteins with structure predictions. Use
            the table below the structure viewer to select another protein.
          </p>
        </div>
      ) : (
        ''
      )}
      <div className={f('row')}>
        <div className={f('column', 'small-12', 'medium-3')}>
          <h5>Information</h5>
          <ul className={f('information')}>
            <li>
              <span className={f('header')}>Protein</span>
              {modelInfo.uniprotAccession}
              <span className={f('footer')}>
                View on{' '}
                <Link href={modelUrl} className={f('ext')}>
                  AlphaFold DB
                </Link>{' '}
                or{' '}
                <UniProtLink
                  id={modelInfo.uniprotAccession}
                  className={f('ext')}
                >
                  UniProtKB
                </UniProtLink>
              </span>
            </li>
            <li>
              <span className={f('header')}>Organism</span>
              <i>{modelInfo.organismScientificName}</i>
            </li>
            {models.length > 1 ? (
              <li>
                <span className={f('header')}>Prediction</span>
                <select
                  value={modelId}
                  className={f('protein-list')}
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
          <ul className={f('legend')}>
            {confidenceColors.map((item) => (
              <li key={item.category}>
                <span style={{ backgroundColor: item.color }}>&nbsp;</span>{' '}
                {item.category} ({item.range})
              </li>
            ))}
          </ul>
        </div>
        <div className={f('column', 'small-12', 'medium-9')}>
          <PictureInPicturePanel
            className={f('structure-viewer')}
            testid="structure-3d-viewer"
            OtherButtons={
              <>
                <Link
                  className={f('control')}
                  href={modelInfo.pdbUrl}
                  download={`${proteinAcc || 'download'}.model.pdb`}
                >
                  <span
                    className={f('icon', 'icon-common', 'icon-download')}
                    data-icon="&#xf019;"
                  />
                  &nbsp;PDB file
                </Link>
                <Link
                  className={f('control')}
                  href={modelInfo.cifUrl}
                  download={`${proteinAcc || 'download'}.model.cif`}
                >
                  <span
                    className={f('icon', 'icon-common', 'icon-download')}
                    data-icon="&#xf019;"
                  />
                  &nbsp;mmCIF file
                </Link>
                <button
                  className={f('icon', 'icon-common', 'control')}
                  onClick={() => setShouldResetViewer(true)}
                  data-icon="}"
                  title="Reset image"
                />
                <FullScreenButton
                  className={f('icon', 'icon-common', 'control')}
                  tooltip="View the structure in full screen mode"
                  element={elementId}
                />{' '}
              </>
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
            />
          </PictureInPicturePanel>
        </div>
      </div>
    </div>
  );
};
AlphaFoldModel.propTypes = {
  proteinAcc: T.string,
  hasMultipleProteins: T.bool,
  onModelChange: T.func,
  modelId: T.string,
  modelUrl: T.string,
  data: T.object,
  selections: T.arrayOf(T.object),
};

const getModelInfoUrl = (isUrlToApi) =>
  createSelector(
    (state) => state.settings.alphafold,
    (_, props) => props.proteinAcc,
    ({ protocol, hostname, port, root, query }, accession) => {
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
    },
  );

export default loadData({
  getUrl: getModelInfoUrl(true),
  mapStateToProps: getModelInfoUrl(false),
})(AlphaFoldModel);
