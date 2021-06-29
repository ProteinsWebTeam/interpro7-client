import React, { useEffect, useRef, useState } from 'react';
import T from 'prop-types';

import { createSelector } from 'reselect';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';

import Link from 'components/generic/Link';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import PictureInPicturePanel from 'components/SimpleCommonComponents/PictureInPicturePanel';
import Loading from 'components/SimpleCommonComponents/Loading';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

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

const _NewStructuralModel = ({ protein, data }) => {
  const elementId = 'new-structure-model-viewer';
  if (data.loading) return <Loading />;

  if (!data.loading && Object.keys(data.payload).length === 0) {
    return (
      <div>
        <h3>Predicted Model</h3>
        <p>There is no structural model associated with {protein}</p>
      </div>
    );
  }

  const [modelInfo] = data.payload;
  return (
    <div>
      <h3>Predicted Model</h3>
      <div>
        The structural model below was generated by{' '}
        {/* TODO link to be updated */}
        <Link href="https://www.bakerlab.org/" target="_blank">
          XXX
        </Link>{' '}
        using the mysterious software . The model represents the entire sequence
        from UniProtKB: {protein} from <i>{modelInfo.organismScientificName}</i>
        .
      </div>
      <div className={f('legend')}>
        Model confidence
        <sup>
          <Tooltip
            title={
              'XXX’s per-residue confidence corresponds to the model’s prediction of its score on the local Distance ' +
              'Difference Test (LDDT-Cα). The viewer summarises this as confidence bands, but the exact pLDDT for each ' +
              'residue can be found in the B factors of the downloadable coordinate files.'
            }
          >
            <span
              className={f('small', 'icon', 'icon-common')}
              data-icon="&#xf129;"
            />
          </Tooltip>
        </sup>
        :
        {confidenceColors.map((item) => (
          <>
            <Tooltip title={item.range}>
              <div className={f('legend-tooltip')}>
                <div
                  className={f('score-box')}
                  style={{ backgroundColor: item.color }}
                />{' '}
                {item.category}
              </div>
            </Tooltip>
          </>
        ))}
      </div>
      <PictureInPicturePanel
        className={f('structure-viewer')}
        testid="structure-3d-viewer"
        // OtherControls={{
        //   bottom: (
        //     <section className={f('lddt')}>
        //       <header>
        //         lDDT{' '}
        //         <Tooltip title="Quality score lDDT: Local Distance Difference Test">
        //           <sup>
        //             <span
        //               className={f('small', 'icon', 'icon-common')}
        //               data-icon="&#xf129;"
        //               aria-label={'Citation to trRosetta paper'}
        //             />
        //           </sup>
        //         </Tooltip>
        //         :{' '}
        //       </header>
        //       <code>
        //         {(
        //           data.payload.reduce((acc, cur) => acc + cur, 0) /
        //           data.payload.length
        //         )
        //           // eslint-disable-next-line no-magic-numbers
        //           .toFixed(6)}
        //       </code>
        //     </section>
        //   ),
        // }}
        OtherButtons={
          <>
            <Link
              className={f('control')}
              href={`${modelInfo.cifUrl}`}
              download={`${protein || 'download'}.model.cif`}
            >
              <span
                className={f('icon', 'icon-common', 'icon-download')}
                data-icon="&#xf019;"
              />{' '}
              Download
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
          //  url={`http://localhost/example/AF-${protein}-F1-model_v1.cif`}
          elementId={elementId}
          ext="mmcif"
          theme={'af'}
        />
      </PictureInPicturePanel>
    </div>
  );
};
_NewStructuralModel.propTypes = {
  protein: T.string,
  data: T.object,
};

const getModelInfoUrl = createSelector(
  (state) => state.settings.modelAPI,
  (_, props) => props.protein,
  ({ protocol, hostname, port, root, query }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}api/prediction/${accession}`,
      query: query,
    });
  },
);

const NewStructuralModel = loadData(getModelInfoUrl)(_NewStructuralModel);

const NewStructuralModelSubPage = ({ accession, data }) => {
  const [proteinAcc, setProteinAcc] = useState('');
  const container = useRef();

  useEffect(() => {
    if (accession.toLowerCase().startsWith('ipr')) {
      // Take the list of matched UniProt matches and assign the first one to protein accession
      if (data?.payload?.count > 0)
        setProteinAcc(data.payload.results[0].metadata.accession);
    } else setProteinAcc(accession);
  }, [accession, data]);

  if (data?.loading) {
    return <Loading />;
  }

  return (
    <div className={f('row', 'column')} ref={container}>
      {accession.toLowerCase().startsWith('ipr') && data?.payload?.count > 1 ? (
        <div>
          The InterPro entry {accession} has matched the following UniProt
          proteins
          <select
            value={proteinAcc}
            className={f('protein-list')}
            onChange={() => setProteinAcc(event.target.value)}
            onBlur={() => setProteinAcc(event.target.value)}
          >
            {data.payload.results.map((protein) => (
              <option key={protein.metadata.accession}>
                {protein.metadata.accession}
              </option>
            ))}
          </select>
        </div>
      ) : null}
      {proteinAcc && <NewStructuralModel protein={proteinAcc} />}
    </div>
  );
};

NewStructuralModelSubPage.propTypes = {
  accession: T.string,
  data: T.object,
};

const mapStateToPropsForModel = (typeOfData /*: 'match'|'structure' */) =>
  createSelector(
    (state) => state.settings.api,
    (state) => state.customLocation.description,
    ({ protocol, hostname, port, root }, description) => {
      if (
        description.main.key === 'entry' &&
        description[description.main.key].db.toLowerCase() === 'interpro'
      ) {
        const newDescription = {
          main: {
            key: 'protein',
            numberOfFilters: 1,
          },
          protein: { db: 'UniProt' },
          entry: {
            isFilter: true,
            db: description.entry.db || 'interpro',
            accession: description.entry.accession,
          }
        };

        if (typeOfData === 'match') {
          return format({
            protocol,
            hostname,
            port,
            pathname: root + descriptionToPath(newDescription),
            query: { hasModel: null },
          });
        }
      }
      return {
        accession: description[description.main.key].accession,
      };
    },
  );

export default loadData({
  getUrl: mapStateToPropsForModel('match'),
  mapStateToProps: mapStateToPropsForModel('structure'),
})(NewStructuralModelSubPage);
