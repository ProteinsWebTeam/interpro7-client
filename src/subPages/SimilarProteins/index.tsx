import React, { useState } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Loading from 'components/SimpleCommonComponents/Loading';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import ToggleSwitch from 'components/ToggleSwitch';

import SimilarProteinsTable from './Table';
import SimilarProteinsHeader from './Header';

import cssBinder from 'styles/cssBinder';

import localStyle from './style.css';

const css = cssBinder(localStyle);

type Props = {
  data: RequestedData<{ metadata: ProteinMetadata }>;
  dataBase: RequestedData<RootAPIPayload>;
  proteinAccession?: string;
};

const SimilarProteins = ({
  data: { loading, payload },
  dataBase,
  proteinAccession,
}: Props) => {
  const { ida_accession: ida } = payload?.metadata || {};
  const [similarProtDb, setSimilarProtDb] = useState('uniprot');
  if (loading) return <Loading />;

  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      <SimilarProteinsHeader
        accession={proteinAccession || ''}
        databases={(dataBase.payload && dataBase.payload.databases) || {}}
      />

      <div className={css('similar-proteins-selector-panel')}>
        <p>The table below lists similar proteins from</p>
        <Tooltip title="Switch to view similar proteins from UniProt or Reviewed databases">
          <ToggleSwitch
            switchCond={similarProtDb === 'uniprot'}
            name={'proteinDB'}
            id={'proteinDB-input'}
            SRLabel={'View proteins from'}
            onValue={'UniProtKB'}
            offValue={'Reviewed (Swiss-Prot)'}
            handleChange={() =>
              setSimilarProtDb(
                similarProtDb === 'uniprot' ? 'reviewed' : 'uniprot',
              )
            }
            addAccessionStyle={true}
          />
        </Tooltip>
      </div>

      <SimilarProteinsTable ida={ida || ''} db={similarProtDb} />
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description.protein.accession,
  (proteinAccession) => ({ proteinAccession }),
);

export default connect(mapStateToProps)(SimilarProteins);
