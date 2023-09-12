import React, { useState, useRef, ReactNode, PropsWithChildren } from 'react';

import loadData from 'higherOrder/loadData/ts';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import {
  Feature,
  FeatureLocation,
} from '@nightingale-elements/nightingale-track';

import {
  useFloating,
  FloatingArrow,
  autoPlacement,
  arrow,
  offset,
} from '@floating-ui/react';

import useStateRef from 'utils/hooks/useStateRef';

import NightingaleManager from 'components/Nightingale/Manager';
import id from 'utils/cheap-unique-id';
import ConservationMockupTrack from './ConservationMockupTrack';

import Header from './Header';
import Options from './Options';
import TracksInCategory, { ExpandedHandle } from './TracksInCategory';

import cssBinder from 'styles/cssBinder';

import style from './style.css';
import grid from './grid.css';
import tooltip from 'components/SimpleCommonComponents/Tooltip/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import RepresentativeDomainsTrack from './RepresentativeDomainsTrack';

TracksInCategory.displayName = 'TracksInCategory';
Header.displayName = 'TracksHeader';

const css = cssBinder(style, grid, fonts, tooltip);

const highlightColor = '#607D8B50';
const TOOLTIP_DELAY = 300;

type Residue = {
  locations: Array<
    FeatureLocation & {
      accession: string;
      description: string;
    }
  >;
};
export type ExtendedFeatureLocation = {
  fragments: Array<{
    start: number;
    end: number;
    [annotation: string]: unknown;
  }>;
} & {
  confidence?: number;
  description?: string;
  seq_feature?: string;
};
export type ExtendedFeature = Feature & {
  data?: unknown;
  entry_protein_locations?: Array<ExtendedFeatureLocation>;
  locations?: Array<ExtendedFeatureLocation>;
  name?: string;
  short_name?: string;
  source_database?: string;
  entry_type?: string;
  residues?: Array<Residue>;
  location2residue?: unknown;
  chain?: string;
  protein?: string;
  integrated?: string;
  children?: Array<ExtendedFeature>;
  warnings?: Array<string>;
};

type Zoomable = { zoomIn: () => void; zoomOut: () => void };

type Props = PropsWithChildren<{
  protein: { accession: string; length: number; sequence: string };
  title: string;
  data: ProteinViewerData;
  showConservationButton?: boolean;
  handleConservationLoad?: () => void;
  conservationError?: string;
  loading: boolean;
}>;
interface LoadedProps extends Props, LoadDataProps<RootAPIPayload, 'Base'> {}

type CategoryVisibility = { [name: string]: boolean };

const switchCategoryVisibility = (
  categories: CategoryVisibility,
  name: string
): CategoryVisibility => {
  return {
    ...categories,
    [name]: !categories[name],
  };
};

export const ProteinViewer = ({
  protein,
  title,
  data,
  showConservationButton,
  handleConservationLoad,
  conservationError,
  dataBase,
  loading = false,
  children,
}: LoadedProps) => {
  const [isPrinting, setPrinting] = useState(false);
  const [hideCategory, setHideCategory] = useState<CategoryVisibility>({
    'other residues': true,
    'external sources': true,
  });
  const categoryRefs = useRef<ExpandedHandle[]>([]);

  const [_, setOverTooltip, overTooltipRef] = useStateRef(false);
  const arrowRef = useRef(null);
  const navigationRef = useRef(null);
  const idRef = useRef<string>(id('protein-viewer'));
  const mainRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<NodeJS.Timer | null>(null);
  const [tooltipEnabled, setTooltipEnabled, tooltipEnabledRef] =
    useStateRef(true);
  const [tooltipContent, setTooltipContent] = useState<ReactNode>(null);
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

  const openTooltip = (
    element: HTMLElement | undefined,
    content: ReactNode
  ) => {
    if (element && tooltipEnabledRef.current) {
      refs.setReference(element);
      setTooltipContent(content);
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    }
  };
  const closeTooltip = () => {
    if (!intervalId.current)
      intervalId.current = setInterval(() => {
        if (!overTooltipRef.current) {
          setTooltipContent(null);
          if (intervalId.current) {
            clearInterval(intervalId.current);
            intervalId.current = null;
          }
        }
      }, TOOLTIP_DELAY);
  };
  const setExpandedAllTracks = (expanded: boolean) => {
    for (const category of categoryRefs.current) {
      category?.setExpandedAllTracks(expanded);
    }
  };

  return (
    <div ref={mainRef} className={css('fullscreenable', 'margin-bottom-large')}>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className={css('popper', { hide: !tooltipContent })}
        onMouseEnter={() => setOverTooltip(true)}
        onMouseLeave={() => setOverTooltip(false)}
      >
        <FloatingArrow ref={arrowRef} context={context} />
        {tooltipContent}
      </div>
      <div>
        <NightingaleManager id="pv-manager">
          <div
            className={css('protvista-grid', {
              printing: isPrinting,
            })}
          >
            <div className={css('view-options-wrap', 'track-sized')}>
              <Options
                setPrintingMode={setPrinting}
                onZoomIn={() =>
                  (navigationRef.current as unknown as Zoomable)?.zoomIn()
                }
                onZoomOut={() =>
                  (navigationRef.current as unknown as Zoomable)?.zoomOut()
                }
                title={title}
                parentReferences={{
                  mainRef,
                  componentsRef,
                }}
                setExpandedAllTracks={setExpandedAllTracks}
                tooltipEnabled={tooltipEnabled}
                setTooltipEnabled={setTooltipEnabled}
                loading={loading}
              >
                {children}
              </Options>
            </div>
          </div>
          <div ref={componentsRef} id={idRef.current}>
            <div
              className={css('protvista-grid', {
                printing: isPrinting,
              })}
            >
              <Header
                length={protein.length}
                sequence={protein.sequence}
                highlightColor={highlightColor}
                ref={navigationRef}
              />
              {(data as unknown as ProteinViewerData<ExtendedFeature>)
                .filter(([_, tracks]) => tracks && tracks.length)

                .map(([type, entries, component]) => {
                  entries.forEach((entry: ExtendedFeature) => {
                    entry.protein = protein.accession;
                  });

                  const LabelComponent = component?.component || 'span';
                  return (
                    <div
                      key={type}
                      className={css(
                        'tracks-container',
                        'track-sized',
                        'protvista-grid',
                        {
                          printing: isPrinting,
                        }
                      )}
                    >
                      <header>
                        <button
                          onClick={() =>
                            setHideCategory(
                              switchCategoryVisibility(hideCategory, type)
                            )
                          }
                          className={css('as-text')}
                        >
                          <span
                            className={css(
                              'icon',
                              'icon-common',
                              hideCategory[type]
                                ? 'icon-caret-right'
                                : 'icon-caret-down'
                            )}
                          />{' '}
                          {type}
                        </button>
                      </header>
                      {component && (
                        <div className={css('track-accession')}>
                          <LabelComponent {...(component?.attributes || {})} />
                        </div>
                      )}{' '}
                      {type === 'representative domains' ? (
                        <RepresentativeDomainsTrack
                          hideCategory={hideCategory[type]}
                          highlightColor={highlightColor}
                          entries={entries}
                          length={protein.sequence.length}
                          openTooltip={openTooltip}
                          closeTooltip={closeTooltip}
                          isPrinting={isPrinting}
                        />
                      ) : (
                        <TracksInCategory
                          entries={entries}
                          sequence={protein.sequence}
                          hideCategory={hideCategory[type]}
                          highlightColor={highlightColor}
                          openTooltip={openTooltip}
                          closeTooltip={closeTooltip}
                          isPrinting={isPrinting}
                          ref={(ref: ExpandedHandle) =>
                            categoryRefs.current.push(ref)
                          }
                          databases={dataBase?.payload?.databases}
                        />
                      )}
                    </div>
                  );
                })}
              <ConservationMockupTrack
                showConservationButton={showConservationButton}
                handleConservationLoad={handleConservationLoad}
                conservationError={conservationError}
                isPrinting={isPrinting}
              />
            </div>
          </div>
        </NightingaleManager>
      </div>
    </div>
  );
};

export default loadData<RootAPIPayload, 'Base'>({
  getUrl: getUrlForMeta,
  propNamespace: 'Base',
})(ProteinViewer);
