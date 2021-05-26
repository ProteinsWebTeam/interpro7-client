import React, { useState, useEffect, useRef } from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import T from 'prop-types';

import loadWebComponent from 'utils/load-web-component';

import Stockholm from 'stockholm-js';
import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import ProtVistaMSA from 'protvista-msa';
import ProtVistaManager from 'protvista-manager';
import ProtVistaNavigation from 'protvista-navigation';
import ProtvistaZoomTool from 'protvista-zoom-tool';
import ProtvistaLinks from 'protvista-links';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(fonts, local);

const webComponents = [];

const loadProtVistaWebComponents = () => {
  if (!webComponents.length) {
    webComponents.push(
      loadWebComponent(() => ProtVistaManager).as('protvista-manager'),
    );
    webComponents.push(
      loadWebComponent(() => ProtVistaMSA).as('protvista-msa'),
    );
    webComponents.push(
      loadWebComponent(() => ProtVistaNavigation).as('protvista-navigation'),
    );
    webComponents.push(
      loadWebComponent(() => ProtvistaZoomTool).as('protvista-zoom-tool'),
    );
    webComponents.push(
      loadWebComponent(() => ProtvistaLinks).as('protvista-links'),
    );
  }
  return Promise.all(webComponents);
};

import Loading from 'components/SimpleCommonComponents/Loading';

const defaultContactMinDistance = 5;
const defaultContactMinProbability = 0.9;

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
}) => {
  const msaTrack = useRef(null);
  const linksTrack = useRef(null);
  const [align, setAlign] = useState(null);
  useEffect(() => {
    (async () => await loadProtVistaWebComponents())();
  }, []);
  useEffect(() => {
    if (payload) {
      const aln = Stockholm.parse(payload);
      setAlign(aln);
      onAlignmentLoaded(aln);
    }
  }, [payload]);
  useEffect(() => {
    if (align) {
      msaTrack.current.data = align.seqname.map((name) => ({
        name,
        sequence: align.seqdata[name],
      }));
      msaTrack.current.addEventListener('conservationProgress', (evt) => {
        onConservationProgress(evt.detail.progress);
      });
      msaTrack.current.addEventListener('drawCompleted', () => {
        const { map } = msaTrack.current.getColorMap();
        setColorMap(map || {});
      });
      if (contacts && linksTrack.current) {
        linksTrack.current.data = contacts;
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
      <protvista-manager
        attributes="length displaystart displayend highlight"
        id="example"
      >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: labelWidth,
              flexShrink: 0,
              fontWeight: 'bold',
              textAlign: 'center',
              alignSelf: 'center',
            }}
          >
            {align.rows()} Sequences
            <protvista-zoom-tool
              length={length}
              displaystart="1"
              displayend="100"
            >
              <span
                slot="zoom-out"
                className={f('icon', 'icon-common', 'zoom-button')}
                data-icon="&#xf146;"
                title={'Click to zoom out      Ctrl+Scroll'}
              />
              <span
                slot="zoom-in"
                className={f('icon', 'icon-common', 'zoom-button')}
                data-icon="&#xf0fe;"
                title={'Click to zoom in      Ctrl+Scroll'}
                // style={{ marginRight: '0.4rem' }}
              />
            </protvista-zoom-tool>
          </div>
          <protvista-navigation length={length} displayend="100" />
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
            <protvista-links
              id="contacts-track"
              length={length}
              ref={linksTrack}
              minprobability={contactMinProbability}
              mindistance={contactMinDistance}
            />
          </div>
        )}
        <protvista-msa
          length={length}
          height="600"
          displayend="100"
          use-ctrl-to-zoom
          labelWidth={labelWidth}
          ref={msaTrack}
          colorscheme={colorscheme}
          {...conservationOptions}
        />
      </protvista-manager>
    </>
  );
};
AlignmentViewer.propTypes = {
  type: T.string.isRequired,
  colorscheme: T.string,
  onConservationProgress: T.func,
  setColorMap: T.func,
  overlayConservation: T.bool,
  contacts: T.array,
  contactMinDistance: T.number,
  contactMinProbability: T.number,
  data: dataPropType,
  onAlignmentLoaded: T.func,
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
})(AlignmentViewer);
