import React, { useState, useEffect, useRef } from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import T from 'prop-types';

import { goToCustomLocation } from 'actions/creators';

import Stockholm from 'stockholm-js';
import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import '@nightingale-elements/nightingale-manager';
import '@nightingale-elements/nightingale-navigation';
import '@nightingale-elements/nightingale-msa';
import '@nightingale-elements/nightingale-links';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(fonts, local);

import Loading from 'components/SimpleCommonComponents/Loading';

const defaultContactMinDistance = 5;
const defaultContactMinProbability = 0.9;
const numberOfBasesToDisplay = 200;

const AlignmentViewer = ({
  data: { loading, payload },
  colorscheme,
  onConservationProgress,
  setColorMap,
  overlayConservation,
  contacts = null,
  contactMinDistance = defaultContactMinDistance,
  contactMinProbability = defaultContactMinProbability,
  onAlignmentLoaded = () => null,
  goToCustomLocation,
}) => {
  const msaTrack = useRef(null);
  const linksTrack = useRef(null);
  const navigationTrack = useRef(null);
  const [align, setAlign] = useState(null);
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    const waitForWC = async () => {
      const promises = [
        'nightingale-manager',
        'nightingale-navigation',
        'nightingale-msa',
        'nightingale-links',
      ].map((localName) => customElements.whenDefined(localName));
      await Promise.all(promises);
      setReady(true);
    };
    waitForWC();
  }, []);
  useEffect(() => {
    if (payload && isReady) {
      const aln = Stockholm.parse(payload);
      setAlign(aln);
      onAlignmentLoaded(aln);
    }
  }, [payload]);
  useEffect(() => {
    if (align) {
      const formatedSeqs = align.seqname.map((name) => ({
        name,
        sequence: align.seqdata[name],
      }));
      requestAnimationFrame(() => (msaTrack.current.data = formatedSeqs));
      msaTrack.current.addEventListener('conservationProgress', (evt) => {
        onConservationProgress(evt.detail.progress);
      });
      msaTrack.current.addEventListener('drawCompleted', () => {
        const { map } = msaTrack.current.getColorMap();
        setColorMap(map || {});
      });
      msaTrack.current.addEventListener('msa-active-label', (event) => {
        const name = event.detail.label;
        const accession = align.gs.AC[name]?.[0]?.replace(/\.\d$/, '');
        if (accession) {
          goToCustomLocation({
            description: {
              main: { key: 'protein' },
              protein: { db: 'uniprot', accession },
            },
          });
        }
      });

      if (contacts && linksTrack.current) {
        linksTrack.current.contacts = contacts.map((p) => [p[2], p[3], p[4]]);
      }
    }
  }, [align, contacts]);

  if (loading || !payload || !align) {
    return <Loading />;
  }

  const labelWidth = 200;
  const length = align.columns();

  const conservationOptions = {
    'calculate-conservation': true,
    'sample-size-conservation': 100,
  };
  if (overlayConservation) {
    conservationOptions['overlay-conservation'] = true;
  }
  return (
    <>
      <nightingale-manager id="example">
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: labelWidth,
              flexShrink: 0,
              fontWeight: 'bold',
              textAlign: 'center',
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
              height: '80px',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <span>{align.rows().toLocaleString()} sequences</span>
            <div>
              <button
                className={f('icon', 'icon-common', 'zoom-button')}
                data-icon="&#xf146;"
                title={'Click or use CTRL + mouse wheel down to zoom out'}
                onClick={() => {
                  navigationTrack.current /*: any */
                    ?.zoomOut();
                }}
              />

              <button
                className={f('icon', 'icon-common', 'zoom-button')}
                data-icon="&#xf0fe;"
                title={'Click or use CTRL + mouse wheel up to to zoom in'}
                onClick={() => {
                  navigationTrack.current /*: any */
                    ?.zoomIn();
                }}
              />
            </div>
          </div>
          <nightingale-navigation
            ref={navigationTrack}
            length={length}
            display-end={Math.min(numberOfBasesToDisplay, length)}
            height={80}
          />
        </div>
        {contacts && (
          <div style={{ display: 'flex' }}>
            <div
              style={{
                width: labelWidth,
                flexShrink: 0,
                fontWeight: 'bold',
              }}
            >
              Contacts{' '}
              <Tooltip
                title={`
                  <p>
                    The color of the nodes indicates if there are less <span style="color:orange; background:white;">●</span>
                    or more <span style="color:blue; background:white;">●</span> predicted contacts.
                  </p>`}
              >
                <sup>
                  <span
                    className={f('small', 'icon', 'icon-common')}
                    data-icon="&#xf129;"
                    aria-label={'description for contact track'}
                  />
                </sup>
              </Tooltip>
            </div>
            <nightingale-links
              id="contacts-track"
              length={length}
              ref={linksTrack}
              height={60}
              min-probability={contactMinProbability}
              min-distance={contactMinDistance}
              use-ctrl-to-zoom
            />
          </div>
        )}
        <nightingale-msa
          length={length}
          height="600"
          display-end={Math.min(numberOfBasesToDisplay, length)}
          use-ctrl-to-zoom
          label-width={labelWidth}
          ref={msaTrack}
          color-scheme={colorscheme}
          {...conservationOptions}
        />
      </nightingale-manager>
    </>
  );
};
AlignmentViewer.propTypes = {
  type: T.string.isRequired,
  colorscheme: T.string,
  onConservationProgress: T.func,
  setColorMap: T.func,
  contacts: T.array,
  contactMinDistance: T.number,
  contactMinProbability: T.number,
  data: dataPropType,
  onAlignmentLoaded: T.func,
  goToCustomLocation: T.func,
  overlayConservation: T.bool,
};

const mapStateToPropsForAlignment = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (_, props) => props.type,
  ({ protocol, hostname, port, root }, description, type) => {
    // omit elements from description
    const { ...copyOfDescription } = description;
    if (description.main.key) {
      copyOfDescription[description.main.key] = {
        ...description[description.main.key],
        detail: null,
      };
    }
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(copyOfDescription),
      query: { annotation: type },
    });
  },
);

export default loadData({
  getUrl: mapStateToPropsForAlignment,
  fetchOptions: {
    responseType: 'gzip',
  },
  mapDispatchToProps: { goToCustomLocation },
})(AlignmentViewer);
