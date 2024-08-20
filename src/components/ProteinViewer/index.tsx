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
}>;
interface LoadedProps extends Props, LoadDataProps<RootAPIPayload, 'Base'> {}

type CategoryVisibility = { [name: string]: boolean };

const switchCategoryVisibility = (
  categories: CategoryVisibility,
  name: string,
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

  // State variable to show/hide "secondary" tracks
  const [showMore, setShowMore] = useState(false);

  // List of "main" tracks to be displayed, the rest are hidden by default
  const mainTracks = [
    'AlphaFold confidence',
    'representative domains',
    'representative families',
    'variants',
    'disordered regions',
    'residues',
  ];

  const [hideCategory, setHideCategory] = useState<CategoryVisibility>({
    'secondary structure': true,
    family: true,
    domain: true,
    'homologous superfamily': true,
    repeat: true,
    'conserved site': true,
    'active site': true,
    'binding site': true,
    unintegrated: true,
    PTMs: true,
    'other features': true,
    'other residues': true,
    features: true,
    predictions: true,
    'match conservation': true,
    'Clinical significance: pathogenic and likely pathogenic variants': true,
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
    content: ReactNode,
  ) => {
    if (element && tooltipEnabledRef.current) {
      refs.setReference(element);
      setTooltipContent(content);
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

  const residuesToLocations = (
    residues: Residue[] | undefined,
  ): ExtendedFeatureLocation[] => {
    const newLocations: ExtendedFeatureLocation[] = [];
    const tempResidues = residues?.slice(0);

    if (tempResidues) {
      tempResidues.map((residue) => {
        residue.locations.map((location) => {
          newLocations.push(location);
        });
      });
    }
    return newLocations;
  };

  type PTM = {
    position: number;
    name: string;
    sources: string[];
  };

  type PTMFeature = {
    begin: string;
    end: string;
    ptms: PTM[];
    peptide: string;
    evidences: [];
    type: string;
    description: string;
    accession: string;
  };

  type PTMData = {
    accession: string;
    entryName: string;
    protein: string;
    features: [];
  };

  const ptmsFeaturesToLocations = (
    accession: string,
    ptmFeatures: PTMFeature[],
  ): ExtendedFeatureLocation[] => {
    const newPTMLocations: ExtendedFeatureLocation[] = [];

    ptmFeatures.map((feature) => {
      const newPTMLocation: ExtendedFeatureLocation & {
        accession: string;
        description: string;
      } = {
        accession: accession,
        description: accession,
        fragments: [],
      };

      feature.ptms.map((ptm) => {
        newPTMLocation.fragments.push({
          ptm: [feature.peptide[ptm.position - 1]],
          ptm_type: ptm.name,
          evidences: feature.evidences,
          position: ptm.position,
          peptide: feature.peptide,
          source: ptm.sources.join(', '),
          start: parseInt(feature.begin) + ptm.position - 1,
          end: parseInt(feature.begin) + ptm.position - 1,
        });
      });

      newPTMLocations.push(newPTMLocation);
    });

    return newPTMLocations;
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
            <div className={css('track-sized')}>
              <ShowMoreTracks
                showMore={showMore}
                showMoreChanged={setShowMore}
              />
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
              []
              {(data as unknown as ProteinViewerData<ExtendedFeature>)
                .filter(([_, tracks]) => tracks && tracks.length)

                .map(([type, entries, component]) => {
                  entries.forEach((entry: ExtendedFeature) => {
                    entry.protein = protein.accession;
                  });

                  const LabelComponent = component?.component || 'span';

                  // Show only the main tracks unless button "Show more" is clicked
                  let hideDiv: string = '';
                  if (!showMore && !mainTracks.includes(type)) {
                    hideDiv = 'none';
                  }

                  // Restructure residue data to unlink residues from domains
                  if (type == 'residues') {
                    const residuesEntries: ExtendedFeature[] = [];
                    entries.map((entry) => {
                      const tempFeature: ExtendedFeature = {
                        accession: entry.accession,
                        name: entry.name,
                        protein: entry.protein,
                        source_database: entry.source_database,
                        type: 'residue',
                        locations: residuesToLocations(entry.residues),
                      };
                      residuesEntries.push(tempFeature);
                    });

                    entries = residuesEntries;
                  }

                  // Transform PTM data to track-like data
                  if (type == 'PTMs') {
                    const ptmEntries: ExtendedFeature[] = [];
                    entries.map((entry) => {
                      const tempFeature: ExtendedFeature = {
                        accession: (entry.data as PTMData).accession,
                        protein: (entry.data as PTMData).accession,
                        type: 'ptm',
                        source_database: 'ptm',
                        locations: ptmsFeaturesToLocations(
                          (entry.data as PTMData).accession,
                          (entry.data as PTMData).features,
                        ),
                      };
                      ptmEntries.push(tempFeature);
                    });
                    entries = ptmEntries;
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
                              switchCategoryVisibility(hideCategory, type),
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
                      ) : type === 'representative families' ? (
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
