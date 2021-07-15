import React, { useEffect, useRef, useState } from 'react';
import T from 'prop-types';

import { createSelector } from 'reselect';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';

import Link from 'components/generic/Link';
import { UniProtLink } from 'components/ExtLink';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import PictureInPicturePanel from 'components/SimpleCommonComponents/PictureInPicturePanel';
import Loading from 'components/SimpleCommonComponents/Loading';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Table, {
  Column,
  PageSizeSelector,
  // SearchBox,
} from 'components/Table';

import StructureViewer from 'components/Structure/ViewerOnDemand';

// import modelQuality from 'images/structural_model_quality.jpeg';
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

const getUrl = (includeSearch) =>
  createSelector(
    (state) => state.settings.api,
    (state) => state.customLocation.description,
    (state) => state.customLocation.search,
    ({ protocol, hostname, port, root }, description, search) => {
      if (
        description.main.key === 'entry' &&
        description[description.main.key].db.toLowerCase() === 'interpro'
      ) {
        const _description = {
          main: {
            key: 'protein',
            numberOfFilters: 1,
          },
          protein: { db: description.protein.db || 'UniProt' },
          entry: {
            isFilter: true,
            db: description.entry.db || 'interpro',
            accession: description.entry.accession,
          }
        };
        let query;
        if (includeSearch)
          query = { ...search, has_model: true };
        else
          query = { has_model: true };
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(_description),
          query: query,
        });
      }

      return {
        accession: description[description.main.key].accession,
      };
    }
  );

const mapStateToPropsForModels = createSelector(
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  (description, search) => ({ description, search }),
);

const _NewStructuralModel = ({ proteinAcc, hasMultipleProteins, onModelChange, modelId, data}) => {
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
      <h3>Structure prediction{models.length > 1 || hasMultipleProteins ? 's' : ''}</h3>
      {hasMultipleProteins ? (
        <div className={f('callout', 'primary', 'info')}>
          <p>
            <i className={f('icon', 'icon-common', 'icon-info')} data-icon="&#xf129;"/>
            This entry matches several proteins with structure predictions.
            Use the table below the structure viewer to select another protein.
          </p>
        </div>
      ) : ''}
      <div className={f('row')}>
        <div className={f('column', 'small-12', 'medium-3')}>
          <h5>Information</h5>
          <ul className={f('information')}>
            <li>
              <span className={f('header')}>Protein</span>
              {modelInfo.uniprotAccession}
              <span className={f('footer')}>
                View on{' '}
                <UniProtLink id={modelInfo.uniprotAccession} className={f('ext')}>
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
                  onChange={() => onModelChange(event.target.value)}
                  onBlur={() => onModelChange(event.target.value)}
                >
                  {models.map((model) => (
                    <option key={model.entryId}>
                      {model.entryId}
                    </option>
                  ))}
                </select>
              </li>
            ) : '' }
          </ul>
          <h5>Model confidence</h5>
          <ul className={f('legend')}>
            {confidenceColors.map((item) => (
              <li key={item.category}>
                <span style={{backgroundColor: item.color}}>&nbsp;</span> {item.category} ({item.range})
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
              url={`${modelInfo.cifUrl}`}
              //  url={`http://localhost/example/AF-${proteinAcc}-F1-model_v1.cif`}
              elementId={elementId}
              ext="mmcif"
              theme={'af'}
            />
          </PictureInPicturePanel>
        </div>
      </div>
    </div>
  );
};
_NewStructuralModel.propTypes = {
  proteinAcc: T.string,
  hasMultipleProteins: T.bool,
  onModelChange: T.func,
  modelId: T.string,
  modelUrl: T.string,
  data: T.object,
};

const getModelInfoUrl = (isUrlToApi) =>
  createSelector(
    (state) => state.settings.modelAPI,
    (_, props) => props.proteinAcc,
    ({ protocol, hostname, port, root, query }, accession) => {
      const modelUrl = format({
        protocol,
        hostname,
        port,
        pathname: isUrlToApi ? `${root}api/prediction/${accession}` : `${root}entry/${accession}`,
        query: query,
      });
      if (isUrlToApi) return modelUrl;
      return { modelUrl };
    },
  );

const NewStructuralModel = loadData({
  getUrl: getModelInfoUrl(true),
  mapStateToProps: getModelInfoUrl(false)
})(_NewStructuralModel);

const _ProteinTable = ({ data, isStale, search, onProteinChange }) => {
  if (data?.loading) return <Loading />;

  return (
    <div>
      <Table
        dataTable={data.payload.results.map(e => e.metadata)}
        contentType="protein"
        loading={data.loading}
        ok={data.ok}
        status={data.status}
        actualSize={data.payload.count}
        query={search}
        // notFound={notFound}
        // databases={databases}
        nextAPICall={data.payload.next}
        previousAPICall={data.payload.previous}
        currentAPICall={data.url}
        isStale={isStale}
      >
        <PageSizeSelector />
        {/* <SearchBox loading={false}>Search proteins</SearchBox> */}
        <Column
          dataKey="accession"
          cellClassName={'nowrap'}
          renderer={(accession, row) => (
            <>
              <Link
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: {
                      db: row.source_database,
                      accession,
                    },
                  },
                  search: {},
                }}
                className={f('acc-row')}
              >
                {accession}
              </Link>
              {row.source_database === 'reviewed' ? (
                <>
                  {'\u00A0' /* non-breakable space */}
                  <Tooltip title="Reviewed by UniProt curators (Swiss-Prot)">
                        <span
                          className={f('icon', 'icon-common')}
                          data-icon="&#xf00c;"
                          aria-label="reviewed"
                        />
                  </Tooltip>
                </>
              ) : null}
            </>
          )}
        />
        <Column
          dataKey="name"
          renderer={(name, row) => {
            return (
              <Link
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: {
                      db: row.source_database,
                      accession: row.accession,
                    },
                  },
                  search: {},
                }}
                className={f('acc-row')}
              >
                {name}
              </Link>
            );
          }
          }
        >
          Name
        </Column>
        <Column
          dataKey="source_organism"
          renderer={({ fullName, taxId }) => (
            <Link
              to={{
                description: {
                  main: { key: 'taxonomy' },
                  taxonomy: {
                    db: 'uniprot',
                    accession: `${taxId}`,
                  },
                },
              }}
            >
              {fullName}
            </Link>
          )}
        >
          Species
        </Column>
        <Column
          dataKey="length"
          headerClassName={f('text-right')}
          cellClassName={f('text-right')}
          renderer={(length) => length.toLocaleString()}
        >
          Length
        </Column>
        <Column
          headerClassName={f('text-right')}
          cellClassName={f('text-right')}
          renderer={(_, row) => {
            return (
              <button
                className={f('button')}
                onClick={() => onProteinChange(row.accession)}
              >
                Show prediction
              </button>);
          }}
        />
      </Table>
    </div>
  );
};
_ProteinTable.propTypes = {
  data: T.object,
  isStale: T.bool,
  search: T.object,
  onProteinChange: T.func,
};

const ProteinTable = loadData({
  getUrl: getUrl(true),
  mapStateToProps: mapStateToPropsForModels
})(_ProteinTable);

const NewStructuralModelSubPage = ({ data, description }) => {
  const mainAccession = description[description.main.key].accession;
  const mainDB = description[description.main.key].db;
  const container = useRef();
  const [proteinAcc, setProteinAcc] = useState('');
  const [modelId, setModelId] = useState(null);
  const handleProteinChange = (value) => {
    setProteinAcc(value);
    setModelId(null);
    container.current.scrollIntoView();
  };
  const handleModelChange = (value) => {
    setModelId(value);
  };

  useEffect(() => {
    if (mainDB.toLowerCase() === 'interpro') {
      // Take the list of matched UniProt matches and assign the first one to protein accession
      if (data?.payload?.count > 0)
        setProteinAcc(data.payload.results[0].metadata.accession);
    } else setProteinAcc(mainAccession);
  }, [mainAccession, data]);

  if (data?.loading) return <Loading />;
  const hasMultipleProteins = mainDB.toLowerCase() === 'interpro' && data.payload.count > 0;
  return (
    <div className={f('row', 'column')} ref={container}>
      {proteinAcc && <NewStructuralModel proteinAcc={proteinAcc} hasMultipleProteins={hasMultipleProteins} onModelChange={handleModelChange} modelId={modelId} />}
      {mainDB.toLowerCase() === 'interpro' ? (
        <ProteinTable onProteinChange={handleProteinChange} />
      ) : null}
    </div>
  );
};
NewStructuralModelSubPage.propTypes = {
  data: T.object,
  isStale: T.bool,
  description: T.object,
};

export default loadData({
  getUrl: getUrl(false),
  mapStateToProps: mapStateToPropsForModels,
})(NewStructuralModelSubPage);
