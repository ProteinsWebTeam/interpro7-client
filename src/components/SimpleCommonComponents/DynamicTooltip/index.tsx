import React, { useState, useRef, useEffect, PropsWithChildren } from 'react';

import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';
import {
  useFloating,
  FloatingArrow,
  FloatingPortal,
  autoPlacement,
  arrow,
  offset,
} from '@floating-ui/react';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { createSelector } from 'reselect';
import { format } from 'url';
import cssBinder from 'styles/cssBinder';
import style from 'components/SimpleCommonComponents/Tooltip/style.css';

const css = cssBinder(style);

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

      const message = () => (
        <section className={css('entry-popup')}>
          <h6>
            {databases[db].name} - {accession}
          </h6>
          <h6>{name}</h6>
          {locations?.length && (
            <ul>
              {locations.map((l, i) => (
                <li key={i}>
                  <button className={css('button', 'secondary', 'coordinates')}>
                    {l.fragments
                      .map(({ start, end }) => `${start}-${end}`)
                      .join(',')}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      );

      onLoad(message);
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
    ...rest
  }: Props,
) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [message, setMessage] = useState(() => <b>{accession}</b>);
  const [showTooltip, setShowTooltip] = useState(false);
  const popupTargetClass = 'feature';
  const [DataProvider, setDataProvider] = useState<null | React.ComponentType<LoadedProps>>(null);
  const [currentLocation, setCurrentLocation] = useState<Array<ProtVistaLocation>>(locations);
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    middleware: [
      autoPlacement(),
      offset({
        mainAxis: 10,
      }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  useEffect(() => {
    if (shouldLoad) {
      if (!(accession in dataProviders)) {
        dataProviders[accession] = loadData<{ metadata: Metadata }>(getUrlFor as Params)(_DataProvider);
      }
      setDataProvider(dataProviders[accession]);
    }
  });
  const _handleMouseOver = (e: React.MouseEvent | React.FocusEvent) => {
    const target = e.target as SVGElement & { __data__: ProtVistaLocation };
    if (target?.classList?.contains(popupTargetClass)) {
      // d3 sets the data of an elemen in __data__ - This needs to be check on major updates of d3
      if (target?.__data__) {
        setCurrentLocation([target.__data__]);
      }
      refs.setReference(target);
      setShowTooltip(true);
    }
    setShouldLoad(true);
  };

  const _handleMouseOut = () => {
    setShowTooltip(false);
  };

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
      <div
        style={{ display: 'inline' }}
        {...rest}
        onMouseOver={(e: React.MouseEvent) => _handleMouseOver(e)}
        onFocus={(e: React.FocusEvent) => _handleMouseOver(e)}
        onMouseOut={_handleMouseOut}
        onBlur={_handleMouseOut}
      >
        {children}
      </div>
      <FloatingPortal>
        {showTooltip ? (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={css('popper')}
          >
            <FloatingArrow ref={arrowRef} context={context} />
            <div>{message}</div>
          </div>
        ) : null}
      </FloatingPortal>
    </>
  );
};


export default DynamicTooltip;
