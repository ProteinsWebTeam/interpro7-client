import React, { useState, useEffect, PropsWithChildren } from 'react';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { createSelector } from 'reselect';
import { format } from 'url';

import TooltipForTrack from '../Tooltip/ForTrack';
import EntryPopup from '../Tooltip/EntryPopup';

type ProviderProps = {
  accession: string,
  type: string,
  source: string,
  onLoad: (x: () => React.JSX.Element) => void,
  databases: Record<string, { name: string }>,
  locations: Array<ProtVistaLocation>,
};

interface LoadedProps
  extends ProviderProps,
  LoadDataProps<{ metadata: EntryMetadata }> { }


const _DataProvider = (
  {
    data,
    onLoad,
    databases,
    locations,
  }: LoadedProps,
) => {
  useEffect(() => {
    if (data && !data.loading && data.payload && data.payload.metadata) {
      const {
        accession,
        name: { name },
        source_database: db,
      } = data.payload.metadata;

      onLoad(() => (
        <EntryPopup
          locations={locations}
          accession={accession}
          dbName={databases[db].name}
          name={name}
        />
      ));
    }
  });
  return null;
};

const getUrlFor = createSelector(
  (state: GlobalState) => state.settings.api,
  (_: GlobalState, props: Props) => props,
  ({ protocol, hostname, port, root }, props) => {
    const description = {
      main: { key: props.type },
      [props.type]: { accession: props.accession, db: props.source },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
    });
  },
);

const dataProviders: Record<string, React.ComponentType<LoadedProps>> = {};


type Props = PropsWithChildren<{
  accession: string,
  type: string,
  source: string,
  databases: Record<string, { name: string }>,
  locations: Array<ProtVistaLocation>
}>
const DynamicTooltip = (
  {
    type,
    source,
    accession,
    children,
    databases,
    locations,
  }: Props,
) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [message, setMessage] = useState(() => <b>{accession}</b>);
  const [DataProvider, setDataProvider] = useState<null | React.ComponentType<LoadedProps>>(null);
  const [currentLocation, setCurrentLocation] = useState<Array<ProtVistaLocation>>(locations);

  useEffect(() => {
    if (shouldLoad) {
      if (!(accession in dataProviders)) {
        dataProviders[accession] = loadData<{ metadata: Metadata }>(getUrlFor as Params)(_DataProvider);
      }
      setDataProvider(dataProviders[accession]);
    }
  });

  return (
    <>
      {DataProvider && (
        <DataProvider
          accession={accession}
          type={type}
          source={source}
          onLoad={setMessage}
          databases={databases}
          locations={currentLocation}
        />
      )}
      <TooltipForTrack
        message={message}
        onMouseOverFeature={(locations: Array<ProtVistaLocation>) => {
          setShouldLoad(true);
          setCurrentLocation(locations)
        }}
      >
        {children}
      </TooltipForTrack>
    </>
  );
};


export default DynamicTooltip;
