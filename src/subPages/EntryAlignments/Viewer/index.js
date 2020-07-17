import React, { useState, useEffect, useRef } from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';
import T from 'prop-types';

import loadWebComponent from 'utils/load-web-component';

import Stockholm from 'stockholm-js';
import { createSelector } from 'reselect';
import { format } from 'url';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import ProtVistaMSA from 'protvista-msa';
import ProtVistaManager from 'protvista-manager';
import ProtVistaNavigation from 'protvista-navigation';
import ProtvistaZoomTool from 'protvista-zoom-tool';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts);

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
  }
  return Promise.all(webComponents);
};

import Loading from 'components/SimpleCommonComponents/Loading';

const AlignmentViewer = ({
  data: { loading, payload },
  colorscheme,
  onConservationProgress,
  setColorMap,
  overlayConservation,
}) => {
  const msaTrack = useRef(null);
  const [align, setAlign] = useState(null);
  useEffect(() => {
    (async () => await loadProtVistaWebComponents())();
  }, []);
  useEffect(() => {
    if (payload) {
      setAlign(Stockholm.parse(payload));
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
    }
  }, [align]);

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
              <button
                id="zoom-in"
                className={f('zoom-button', 'icon', 'icon-common')}
                data-icon="&#xf0fe;"
                title="Click to zoom in      Ctrl+Scroll"
              />
              <button
                id="zoom-out"
                className={f('zoom-button', 'icon', 'icon-common')}
                data-icon="&#xf146;"
                title="Click to zoom out      Ctrl+Scroll"
              />
            </protvista-zoom-tool>
          </div>
          <protvista-navigation length={length} displayend="100" />
        </div>
        <protvista-msa
          length={length}
          height="400"
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
  data: dataPropType,
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
