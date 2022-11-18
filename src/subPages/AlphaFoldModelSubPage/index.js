// @flow
import React, { useEffect, useRef, useState } from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';

import AlphaFoldModel from 'components/AlphaFold/Model';
import ProteinTable, {
  getUrl,
  mapStateToPropsForModels,
} from 'components/AlphaFold/ProteinTable';
import ProtVistaForAlphaFold from 'components/Structure/ViewerAndEntries/ProtVistaForAlphaFold';
import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ipro, fonts);

const AlphaFoldModelSubPage = ({ data, description }) => {
  const mainAccession = description[description.main.key].accession;
  const mainType = description.main.key.toLowerCase();
  const container = useRef();
  const [selectionsInModel, setSelectionsInModel] = useState(null);
  const [proteinAcc, setProteinAcc] = useState('');
  const [modelId, setModelId] = useState(null);
  const [confidenceURL, setConfidenceURL] = useState(null);
  const handleProteinChange = (value) => {
    setProteinAcc(value);
    setModelId(null);
    (container.current /*: any */)
      .scrollIntoView();
  };
  const handleModelChange = (value) => {
    setModelId(value);
  };

  useEffect(() => {
    if (mainType === 'entry') {
      // Take the list of matched UniProt matches and assign the first one to protein accession
      if (data?.payload?.count > 0)
        setProteinAcc(data.payload.results[0].metadata.accession);
    } else setProteinAcc(mainAccession);
  }, [mainAccession, data]);

  if (data?.loading) return <Loading />;
  const hasMultipleProteins = mainType === 'entry' && data.payload.count > 1;
  return (
    <div className={f('row', 'column')} ref={container}>
      {proteinAcc && (
        <AlphaFoldModel
          proteinAcc={proteinAcc}
          hasMultipleProteins={hasMultipleProteins}
          onModelChange={handleModelChange}
          modelId={modelId}
          selections={selectionsInModel}
          onModelCifChange={(cif) => {
            const newURL = cif?.length
              ? cif.replace('-model', '-confidence').replace('.cif', '.json')
              : null;
            if (newURL !== confidenceURL) setConfidenceURL(newURL);
          }}
        />
      )}
      {mainType === 'entry' ? (
        <ProteinTable onProteinChange={handleProteinChange} />
      ) : (
        <div
          data-testid="alphafold-protvista"
          className={f('protvista-container')}
        >
          <ProtVistaForAlphaFold
            protein={proteinAcc}
            onChangeSelection={(selection) => {
              setSelectionsInModel(selection);
            }}
            confidenceURL={confidenceURL}
          />
        </div>
      )}
    </div>
  );
};
AlphaFoldModelSubPage.propTypes = {
  data: T.object,
  isStale: T.bool,
  description: T.object,
};

export default loadData({
  getUrl: getUrl(false),
  mapStateToProps: mapStateToPropsForModels,
})(AlphaFoldModelSubPage);
