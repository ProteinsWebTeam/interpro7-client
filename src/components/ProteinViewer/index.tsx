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
  typeNameToSectionName,
  standardizePTMData,
  firstHideCategories,
  ExtendedFeature,
} from './utils';

import {
  useFloating,
  FloatingArrow,
  autoPlacement,
  arrow,
  offset,
} from '@floating-ui/react';
import { chooseColor } from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';

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
  viewerType: string;
  changeSettingsRaw: typeof changeSettingsRaw;
  showMoreSettings: boolean;
  matchesAvailable?: Record<string, boolean>;
  colorDomainsBy?: string;
  matchTypeSettings?: MatchTypeUISettings;
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
  viewerType,
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
  colorDomainsBy,
  matchesAvailable,
  matchTypeSettings,
}: LoadedProps) => {
  const [isPrinting, setPrinting] = useState(false);

  const mainTracks = [
    'bfvd confidence',
    'alphafold confidence',
    'domain',
    'family',
    'residues',
    'intrinsically disordered regions',
    'pathogenic and likely pathogenic variants',
  ];

  /// STATE
  const [showMore, setShowMore] = useState(showMoreSettings);
  const [hideCategory, setHideCategory] =
    useState<CategoryVisibility>(firstHideCategories);
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

  // FUNCTIONS
  const openTooltip = (
    element: HTMLElement | undefined,
    content: ReactNode,
  ) => {
    if (element && tooltipEnabledRef.current) {
      refs.setReference(element);
      setTooltipContent((prevContent) => {
        return content;
        // // Only update if content has changed
        // if (prevContent !== content) {
        //   return content;
        // }
        // return prevContent; // No update, prevents re-render
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

  useEffect(() => {
    // Switch to default mode if any of either of InterPro or Intepro-N type of matches are not available.
    if (matchesAvailable && matchTypeSettings) {
      if (matchesAvailable[matchTypeSettings] === false) {
        changeSettingsRaw('ui', 'matchTypeSettings', 'best');
      }
    }

    /*
      Logic to handle default display settings for families and domains.
      There's cases where representative families or representative domains are not available.
      Examples: representative families still not supported in InterPro Scan, or there's just no representative match found in the data.
      This can create problems in the summary view, where the domains and families section are hidden by default and just the representative are shown.
      If the representative track is not available, nothing would be shown. This prevents it, showing all the matches anyway.
    */
    const changeVisibilityFor: string[] = [];
    ['family', 'domain'].forEach((type) => {
      const entries = data.find(([entryType]) => entryType === type)?.[1] || [];
      const hasRep = (entries as ExtendedFeature[]).some(
        (entry) => entry.representative === true,
      );
      if (hasRep) changeVisibilityFor.push(type);
    });

    // If in summary view, use changeVisibilityFor
    const newHideCategory = switchCategoryVisibilityShowMore(
      hideCategory,
      !showMoreSettings ? changeVisibilityFor : ['family', 'domain'],
      showMoreSettings ? false : true,
    );
    setHideCategory(newHideCategory);
  }, [showMoreSettings]);

  return (
    <div
      ref={mainRef}
      className={css(
        'fullscreenable',
        viewerType !== 'structures' ? 'margin-bottom-large' : '',
      )}
    >
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
                matchesAvailable={matchesAvailable || {}}
                setExpandedAllTracks={setExpandedAllTracks}
                tooltipEnabled={tooltipEnabled}
                setTooltipEnabled={setTooltipEnabled}
                loading={loading}
              >
                {children}
              </Options>

              {/* Hide display mode switcher for alphafold viewer due to:
              see comment in UseEffect above*/}
              {protein.accession && viewerType !== 'structures' && (
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
              {data &&
                (data as unknown as ProteinViewerData<ExtendedFeature>)
                  .filter(([_, tracks]) => tracks && tracks.length)
                  .map(([type, entries, component]) => {
                    entries.forEach((entry: ExtendedFeature) => {
                      entry.protein = protein.accession;
                    });

                    const LabelComponent = component?.component || 'span';
                    const reprEntries: ExtendedFeature[] = [];
                    const tedEntries: ExtendedFeature[] = [];
                    const otherEntries: ExtendedFeature[] = [];

                    if (type === 'domain' || type === 'family') {
                      entries.forEach((entry: ExtendedFeature) => {
                        if (entry.representative) reprEntries.push(entry);
                        else if (entry.source_database === 'TED')
                          tedEntries.push(entry);
                        else otherEntries.push(entry);
                      });
                    } else if (type === 'ptm')
                      standardizePTMData(entries, protein).forEach(
                        (entry: ExtendedFeature) => {
                          otherEntries.push(entry);
                        },
                      );
                    else
                      entries.forEach((entry: ExtendedFeature) => {
                        otherEntries.push(entry);
                      });

                    // A few sections (like Alphafold camel case) need to be named differently than simply capitalizing words in the type.
                    // This dict is used to go from type to section name
                    const sectionName = typeNameToSectionName[type];

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
                            {sectionName}
                          </button>
                        </header>
                        {component && (
                          <div className={css('track-accession')}>
                            <LabelComponent
                              {...(component?.attributes || {})}
                            />
                          </div>
                        )}{' '}
                        {reprEntries.length > 0 && (
                          <RepresentativeTrack
                            type={type}
                            hideCategory={false}
                            highlightColor={highlightColor}
                            entries={reprEntries}
                            length={protein.sequence.length}
                            openTooltip={openTooltip}
                            closeTooltip={closeTooltip}
                            isPrinting={isPrinting}
                          />
                        )}
                        {tedEntries.length > 0 && (
                          <TracksInCategory
                            entries={tedEntries}
                            sequence={protein.sequence}
                            hideCategory={false}
                            highlightColor={highlightColor}
                            openTooltip={openTooltip}
                            closeTooltip={closeTooltip}
                            isPrinting={isPrinting}
                          />
                        )}
                        {otherEntries.length > 0 && (
                          <TracksInCategory
                            entries={otherEntries}
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
    matchTypeSettings: ui.matchTypeSettings,
  }),
);

// Connect to the Redux store and inject `changeSettingsRaw` into the props of ProteinViewer
export default connect(mapStateToProps, { changeSettingsRaw })(
  loadData<RootAPIPayload, 'Base'>({
    getUrl: getUrlForMeta,
    propNamespace: 'Base',
  })(ProteinViewer),
);
