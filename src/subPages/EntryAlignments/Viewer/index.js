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
  }
  return Promise.all(webComponents);
};

import Loading from 'components/SimpleCommonComponents/Loading';

const AlignmentViewer = ({ data: { loading, payload } }) => {
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
    }
  }, [align]);

  if (loading || !payload || !align) {
    return <Loading />;
  }

  const labelWidth = 200;
  const length = align.columns();

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
          </div>
          <protvista-navigation length={length} />
        </div>
        <protvista-msa
          length={length}
          height="400"
          use-ctrl-to-zoom
          labelWidth={labelWidth}
          ref={msaTrack}
        />
      </protvista-manager>
    </>
  );
};
AlignmentViewer.propTypes = {
  type: T.string.isRequired,
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
