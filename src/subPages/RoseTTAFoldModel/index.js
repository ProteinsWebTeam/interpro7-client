import React, { useState, useEffect, useRef } from 'react';
import T from 'prop-types';

import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import AlignmentViewer from '../EntryAlignments/Viewer';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import Loading from 'components/SimpleCommonComponents/Loading';
import PictureInPicturePanel from 'components/SimpleCommonComponents/PictureInPicturePanel';

import StructureViewer from 'components/Structure/ViewerOnDemand';
import '@nightingale-elements/nightingale-heatmap';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';

const f = foundationPartial(style, ipro, fonts);
const DEFAULT_MIN_PROBABILITY = 0.9;
const DEFAULT_MIN_DISTANCE = 5;
const RED = 0xff0000;
const BLUE = 0x0000ff;

const RoseTTAFoldModel = ({ data, dataContacts, urlForModel, accession }) => {
  const [minProbability, setMinProbability] = useState(DEFAULT_MIN_PROBABILITY);
  const [selections, setSelections] = useState(null);
  const [aln2str, setAln2str] = useState(null);

  const container = useRef();
  const heatmap = useRef(null);

  useEffect(() => {
    const waitForWC = async () => {
      const promises = ['nightingale-heatmap'].map((localName) =>
        customElements.whenDefined(localName),
      );
      await Promise.all(promises);
      // setReady(true);
    };
    waitForWC();
    // loadWebComponent(() => NightingaleHeatmap).as('nightingale-heatmap');
  }, []);

  useEffect(() => {
    if (dataContacts.payload && heatmap.current)
      heatmap.current.data = dataContacts.payload.map((p) => [
        p[0],
        p[1],
        p[4],
      ]);
  }, [heatmap.current]);

  useEffect(() => {
    if (container.current && aln2str) {
      container.current.addEventListener('change', (evt) => {
        if (evt?.target?.id === 'contacts-track') {
          if (evt.detail.type === 'mouseover') {
            const selected = +evt.target.selected;
            const linkedSelections = evt.detail.highlight
              .split(',')
              .map((sel) => sel.split(':').map(Number))
              .map(([x]) => +x)
              .sort((a, b) => a - b)
              .filter((x) => x !== selected)
              .map((x) => {
                return {
                  colour: BLUE,
                  start: aln2str?.get(x) || x,
                  end: aln2str?.get(x),
                  chain: 'A',
                };
              });
            const selections = [
              {
                colour: RED,
                start: aln2str?.get(selected) || selected,
                end: aln2str?.get(selected) || selected,
                chain: 'A',
              },
              ...linkedSelections,
            ];
            setSelections(selections);
          } else if (evt.detail.type === 'mouseout') {
            setSelections(null);
          }
        }
        if (evt?.target?.id === 'contact-map') {
          if (evt.detail.type === 'mousemove') {
            const x = evt.detail.point.xPoint;
            const y = evt.detail.point.yPoint;
            const selections = [
              {
                colour: RED,
                start: aln2str?.get(x) || x,
                end: aln2str?.get(x) || x,
                chain: 'A',
              },
              {
                colour: BLUE,
                start: aln2str?.get(y) || x,
                end: aln2str?.get(y) || y,
                chain: 'A',
              },
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

  if (!data || data.loading || !data.payload || !dataContacts?.payload)
    return <Loading />;

  const elementId = 'structure-model-viewer';

  const handleProbabilityChange = (evt) => {
    setMinProbability(+evt.target.value);
  };

  return (
    <div className={f('row', 'column')} ref={container}>
      <h3>RoseTTAFold structure prediction</h3>
      <div>
        The protein structure below has been predicted by{' '}
        <Link href={'//www.bakerlab.org'}>the Baker Lab</Link> with RoseTTAFold
        (
        <Link href={'//science.sciencemag.org/content/373/6557/871'}>
          Baek, M et al. 2021
        </Link>
        ) using the UniProt multiple sequence alignment from Pfam.
      </div>

      <PictureInPicturePanel
        className={f('structure-viewer')}
        testid="structure-3d-viewer"
        OtherButtons={
          <>
            <Link
              className={f('control')}
              href={`${urlForModel}`}
              download={`${accession || 'download'}.model.pdb`}
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
          id={'pfam'}
          url={urlForModel}
          elementId={elementId}
          ext="pdb"
          selections={selections}
          theme={'residue'}
        />
      </PictureInPicturePanel>

      <h3>SEED alignment with Contact Predictions</h3>
      <p>
        The visualizations show the contacts predicted with RoseTTAFold upon the
        Pfam SEED alignment. In the alignment viewer, click on the coloured
        circles above the alignment to view contact positions highlighted in the
        alignment and structural model. Hovering on the heatmap highlights the
        contacts in the 3D structural model.
      </p>
      <div className={f('nightingale-components')}>
        <div className={f('heatmap')}>
          <nightingale-heatmap
            id="contact-map"
            ref={heatmap}
            width={500}
            height={500}
            symmetric={true}
            margin-left={50}
            margin-bottom={30}
          />
        </div>
        <div className={f('alignment')}>
          <label>
            Probability threshold
            <Tooltip title="Probability threshold of residues being closer than 8Å. Use the slider to change the threshold.">
              <sup>
                <span
                  className={f('small', 'icon', 'icon-common')}
                  data-icon="&#xf129;"
                  aria-label={'description for probability threshold input'}
                />
              </sup>
            </Tooltip>
            :{' '}
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={minProbability}
              name="threshold"
              onChange={handleProbabilityChange}
            />
            <span>{minProbability}</span>
          </label>
          <AlignmentViewer
            setColorMap={() => null}
            onConservationProgress={() => null}
            type="alignment:seed"
            colorscheme="clustal2"
            contacts={dataContacts?.payload || []}
            contactMinDistance={DEFAULT_MIN_DISTANCE}
            contactMinProbability={minProbability}
            onAlignmentLoaded={getAlignmentToStructureMap}
          />
        </div>
      </div>
    </div>
  );
};

RoseTTAFoldModel.propTypes = {
  data: T.shape({
    loading: T.bool.isRequired,
    payload: T.arrayOf(T.number),
  }),
  dataContacts: T.shape({
    loading: T.bool.isRequired,
    payload: T.arrayOf(T.arrayOf(T.number)),
  }),
  urlForModel: T.string,
  accession: T.string,
};

const mapStateToPropsForModel = (
  typeOfData /*: 'contacts'|'lddt'|'structure' */,
) =>
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
      if (['contacts', 'lddt'].includes(typeOfData)) return urlForModel;
      return { urlForModel, accession: description.entry.accession };
    },
  );

export default loadData({
  getUrl: mapStateToPropsForModel('lddt'),
  mapStateToProps: mapStateToPropsForModel('structure'),
})(
  loadData({
    getUrl: mapStateToPropsForModel('contacts'),
    propNamespace: 'Contacts',
  })(RoseTTAFoldModel),
);
