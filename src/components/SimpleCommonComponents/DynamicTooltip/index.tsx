import React, { useState, useEffect, PropsWithChildren } from 'react';

import loadData from 'higherOrder/loadData/ts';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { createSelector } from 'reselect';
import { format } from 'url';

import TooltipForTrack from '../Tooltip/ForTrack';
import EntryPopup from '../Tooltip/EntryPopup';

type ProviderProps = {
  accession: string;
  type: string;
  source: string;
  onLoad: (x: () => React.JSX.Element) => void;
  databases: Record<string, { name: string }>;
  locations: Array<ProtVistaLocation>;
  shouldLoad: boolean;
};

interface LoadedProps
  extends ProviderProps,
    LoadDataProps<{ metadata: EntryMetadata }> {}

const _DataProvider = ({ data, onLoad, databases, locations }: LoadedProps) => {
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
  (_: GlobalState, props: ProviderProps) => props,
  ({ protocol, hostname, port, root }, props) => {
    if (!props.shouldLoad) return null;
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

const DataProvider = loadData<{ metadata: Metadata }>(
  getUrlFor as LoadDataParameters,
)(_DataProvider);

type Props = PropsWithChildren<{
  accession: string;
  type: string;
  source: string;
  databases: Record<string, { name: string }>;
  locations: Array<ProtVistaLocation>;
}>;
const DynamicTooltip = ({
  type,
  source,
  accession,
  children,
  databases,
  locations,
}: Props) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [message, setMessage] = useState(() => <b>{accession}</b>);
  const [currentLocation, setCurrentLocation] =
    useState<Array<ProtVistaLocation>>(locations);

  return (
    <>
      <TooltipForTrack
        message={message}
        onMouseOverFeature={(locations: Array<ProtVistaLocation>) => {
          setShouldLoad(true);
          setCurrentLocation(locations);
        }}
      >
        {children}
      </TooltipForTrack>
      <DataProvider
        accession={accession}
        type={type}
        source={source}
        onLoad={setMessage}
        databases={databases}
        locations={currentLocation}
        shouldLoad={shouldLoad}
      />
    </>
  );
};

export default DynamicTooltip;
