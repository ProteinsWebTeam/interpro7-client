import React, {
  useState,
  useRef,
  ReactNode,
  PropsWithChildren,
  useEffect,
} from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { changeSettingsRaw } from 'actions/creators';

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
import RepresentativeTrack from './RepresentativeDomainsTrack';
import ShowMoreTracks from './ShowMoreTracks';

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
  representative?: boolean;
  confidence?: number;
  description?: string;
  seq_feature?: string;
};
export type ExtendedFeature = Feature & {
  data?: unknown;
  representative?: boolean;
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
  /** data for the protein to display */
  protein: MinimalProteinMetadata;
  /** The title at the top left corner */
  title: string;
  /** The data of the entry matches */
  data: ProteinViewerData;
  /** `DISABLED` - conservation data is currently disabled */
  showConservationButton?: boolean;
  /** `DISABLED` - conservation data is currently disabled */
  handleConservationLoad?: () => void;
  /** `DISABLED` - conservation data is currently disabled */
  conservationError?: string;
  /** TO include loading animation in the header */
  loading: boolean;

  changeSettingsRaw: typeof changeSettingsRaw;
  showMoreSettings: boolean;

  mainTracks: string[];

  hideCategories: Record<string, boolean>;
}>;
interface LoadedProps extends Props, LoadDataProps<RootAPIPayload, 'Base'> {}

type CategoryVisibility = { [name: string]: boolean };

const switchCategoryVisibility = (
  categories: CategoryVisibility,
  names: string[],
): CategoryVisibility => {
  return names.reduce((updatedCategories, name) => {
    return {
      ...updatedCategories,
      [name]: !updatedCategories[name],
    };
  }, categories);
};

const switchCategoryVisibilityShowMore = (
  categories: CategoryVisibility,
  names: string[],
  hide: boolean,
): CategoryVisibility => {
  return names.reduce((updatedCategories, name) => {
    return {
      ...updatedCategories,
      [name]: hide,
    };
  }, categories);
};

export const ProteinViewer = ({
  mainTracks,
  hideCategories,
  protein,
  title,
  data,
  showConservationButton,
  changeSettingsRaw,
  showMoreSettings,
  handleConservationLoad,
  conservationError,
  dataBase,
  loading = false,
  children,
}: LoadedProps) => {
  const [isPrinting, setPrinting] = useState(false);

  // State variable to show/hide "secondary" tracks
  const [showMore, setShowMore] = useState(showMoreSettings);

  const [hideCategory, setHideCategory] =
    useState<CategoryVisibility>(hideCategories);

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

  useEffect(() => {
    const newHideCategory = switchCategoryVisibilityShowMore(
      hideCategory,
      ['families', 'domains'],
      showMoreSettings ? false : true,
    );
    setHideCategory(newHideCategory);
  }, [showMoreSettings]);

  const openTooltip = (
    element: HTMLElement | undefined,
    content: ReactNode,
  ) => {
    if (element && tooltipEnabledRef.current) {
      refs.setReference(element);
      setTooltipContent((prevContent) => {
        // Only update if content has changed
        if (prevContent !== content) {
          return content;
        }
        return prevContent; // No update, prevents re-render
      });
      if (intervalId.current) {
        clearInterval(intervalId.current as unknown as number);
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
            clearInterval(intervalId.current as unknown as number);
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
      {/* Tooltip */}
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
              {protein.accession &&
                !protein.accession.startsWith('iprscan') &&
                mainTracks.length !== Object.entries(hideCategories).length && (
                  <ShowMoreTracks
                    showMore={showMore}
                    changeSettingsRaw={changeSettingsRaw}
                    showMoreChanged={setShowMore}
                    setHideCategory={setHideCategory}
                    switchCategoryVisibilityShowMore={
                      switchCategoryVisibilityShowMore
                    }
                    hideCategory={hideCategory}
                  />
                )}
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
                  let representativeEntries: ExtendedFeature[] | null = null;
                  let nonRepresentativeEntries: ExtendedFeature[] | null = null;

                  if (type === 'domains' || type === 'families') {
                    representativeEntries = entries.filter(
                      (entry) => entry.representative === true,
                    );
                    nonRepresentativeEntries = entries.filter(
                      (entry) => entry.representative !== true,
                    );
                  }

                  // Show only the main tracks unless button "Show more" is clicked
                  let hideDiv: string = '';
                  if (!showMore && !mainTracks.includes(type)) {
                    hideDiv = 'none';
                  }

                  return (
                    <div
                      key={type}
                      // Conditioanally display the div containing the track
                      style={{ display: hideDiv }}
                      className={css(
                        'tracks-container',
                        'track-sized',
                        'protvista-grid',
                        {
                          printing: isPrinting,
                        },
                      )}
                    >
                      <header>
                        <button
                          onClick={() =>
                            setHideCategory(
                              switchCategoryVisibility(hideCategory, [type]),
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
                                : 'icon-caret-down',
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
                      {representativeEntries ? (
                        <>
                          {representativeEntries.length > 0 ? (
                            <RepresentativeTrack
                              type={type}
                              hideCategory={false}
                              highlightColor={highlightColor}
                              entries={representativeEntries}
                              length={protein.sequence.length}
                              openTooltip={openTooltip}
                              closeTooltip={closeTooltip}
                              isPrinting={isPrinting}
                            />
                          ) : (
                            ' '
                          )}
                          <TracksInCategory
                            entries={nonRepresentativeEntries || []}
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
                        </>
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

// Map the Redux state and actions to props
const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui) => ({
    showMoreSettings: ui.showMoreSettings,
  }),
);

// Connect to the Redux store and inject `changeSettingsRaw` into the props of ProteinViewer
export default connect(mapStateToProps, { changeSettingsRaw })(
  loadData<RootAPIPayload, 'Base'>({
    getUrl: getUrlForMeta,
    propNamespace: 'Base',
  })(ProteinViewer),
);
