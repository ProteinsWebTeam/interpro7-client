import React, { useState, useEffect, useRef } from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import AlignmentViewer from '../EntryAlignments/Viewer';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import PictureInPicturePanel from 'components/SimpleCommonComponents/PictureInPicturePanel';

import StructureViewer from 'components/Structure/ViewerOnDemand';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);
const DEFAULT_TRESHOLD = 0.7;

const StructuralModel = ({ data, urlForModel }) => {
  const [threshold, setThreshold] = useState(DEFAULT_TRESHOLD);
  const [selections, setSelections] = useState(null);
  const [aln2str, setAln2str] = useState(null);

  const container = useRef();

  useEffect(() => {
    if (container.current && aln2str) {
      container.current.addEventListener('change', (evt) => {
        if (evt?.target?.id === 'contacts-track') {
          if (evt.detail.type === 'mouseover') {
            const selected = +evt.target._data.selected;
            const linkedSelections = evt.detail.highlight
              .split(',')
              .map((sel) => sel.split(':').map(Number))
              .map(([x]) => +x)
              .sort((a, b) => a - b)
              .filter((x) => x !== selected)
              .map((x) => [
                'blue',
                `${aln2str?.get(x) || x}-${aln2str?.get(x) || x}:A`,
              ]);
            const selections = [
              [
                'red',
                `${aln2str?.get(selected) || selected}-${
                  aln2str?.get(selected) || selected
                }:A`,
              ],
              ...linkedSelections,
            ];
            setSelections(selections);
          } else if (evt.detail.type === 'mouseout') {
            setSelections(null);
          }
        }
      });
    }
  }, [container.current, aln2str]);

  const getAlignmentToStructureMap = (alignment) => {
    const firstSeq = alignment?.seqdata?.[alignment?.seqname?.[0]] || '';
    const a2s = new Map();
    let posStr = 0;
    for (let posAln = 1; posAln <= firstSeq.length; posAln++) {
      const res = firstSeq[posAln - 1];
      if (res !== '.') {
        posStr++;
      }
      a2s.set(posAln, posStr);
    }
    setAln2str(a2s);
  };

  if (!data || data.loading || !data.payload) return null;
  const elementId = 'structure-model-viewer';

  const handleThresholdChange = (evt) => {
    setThreshold(+evt.target.value);
  };

  return (
    <div className={f('row', 'column')} ref={container}>
      <h3>Predicted Model</h3>
      <PictureInPicturePanel
        className={f('structure-viewer')}
        testid="structure-3d-viewer"
        OtherButtons={
          <FullScreenButton
            className={f('icon', 'icon-common')}
            tooltip="View the structure in full screen mode"
            element={elementId}
          />
        }
      >
        <StructureViewer
          id={'pfam'}
          url={urlForModel}
          elementId={elementId}
          ext="pdb"
          selections={selections}
        />
      </PictureInPicturePanel>
      <h3>SEED alignment</h3>
      <p>
        The model above was predicted by estimating the likelyhood of contacts
        between the residues in the alignment of the Pfam entry, The
        visualization below shows the contacts with higher probability.
      </p>
      <label>
        Probability threshold:
        <input
          type="range"
          min="0.5"
          max="1"
          step="0.01"
          value={threshold}
          name="threshold"
          onChange={handleThresholdChange}
        />
        <span>{threshold}</span>
      </label>
      <AlignmentViewer
        setColorMap={() => null}
        onConservationProgress={() => null}
        type="alignment:seed"
        colorscheme="clustal2"
        contacts={data.payload}
        contactThreshold={threshold}
        onAlignmentLoaded={getAlignmentToStructureMap}
      />
    </div>
  );
};
StructuralModel.propTypes = {
  data: T.shape({
    loading: T.bool.isRequired,
    payload: T.arrayOf(T.arrayOf(T.number)),
  }),
  urlForModel: T.string,
};
const mapStateToPropsForModel = (typeOfData /*: 'contacts'|'structure' */) =>
  createSelector(
    (state) => state.settings.api,
    (state) => state.customLocation.description,
    ({ protocol, hostname, port, root }, description) => {
      const newDescription = {
        main: { key: 'entry' },
        entry: {
          db: description.entry.db || 'pfam',
          accession: description.entry.accession,
        },
      };
      const key = `model:${typeOfData}`;
      const urlForModel = format({
        protocol,
        hostname,
        port,
        pathname: root + descriptionToPath(newDescription),
        query: { [key]: null },
      });
      if (typeOfData === 'contacts') return urlForModel;
      return { urlForModel };
    },
  );

export default loadData({
  getUrl: mapStateToPropsForModel('contacts'),
  mapStateToProps: mapStateToPropsForModel('structure'),
})(StructuralModel);
