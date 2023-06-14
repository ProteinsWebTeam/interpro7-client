import React, { useState, useRef, ReactNode } from 'react';

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

import Header from './Header';
import Options from './Options';
import TracksInCategory from './TracksInCategory';

import cssBinder from 'styles/cssBinder';

import style from '../ProtVista/style.css';
import grid from '../ProtVista/grid.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import popper from '../ProtVista/popper.css';

const css = cssBinder(style, grid, fonts, popper);

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
export type ExtendedFeatureLocation = FeatureLocation & {
  confidence?: number;
  description?: string;
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
  children?: Array<ExtendedFeature>;
  warnings?: Array<string>;
};
export type ProteinViewerData = Array<
  [
    string,
    Array<Feature>,
    { component: string; attributes: Record<string, string> }
  ]
>;

type Zoomable = { zoomIn: () => void; zoomOut: () => void };

type Props = {
  protein: ProteinMetadata;
  title: string;
  data: ProteinViewerData;
};

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

const ProteinViewer = ({ protein, title, data }: Props) => {
  const [isPrinting, setPrinting] = useState(false);
  const [hideCategory, setHideCategory] = useState<CategoryVisibility>({
    'other residues': true,
  });

  const [_, setOverTooltip, overTooltipRef] = useStateRef(false);
  const arrowRef = useRef(null);
  const navigationRef = useRef(null);
  const idRef = useRef<string>(id('protein-viewer'));
  const mainRef = useRef<HTMLDivElement>(null);
  const componentsRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<NodeJS.Timer | null>(null);
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
    if (element) {
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
          <div className={css('protvista-grid')}>
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
              {data
                .filter(([_, tracks]) => tracks && tracks.length)

                .map(([type, entries, component]) => {
                  const LabelComponent = component?.component;
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
                      <TracksInCategory
                        entries={entries}
                        sequence={protein.sequence}
                        hideCategory={hideCategory[type]}
                        highlightColor={highlightColor}
                        enableTooltip={true}
                        openTooltip={openTooltip}
                        closeTooltip={closeTooltip}
                        isPrinting={isPrinting}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </NightingaleManager>
      </div>
    </div>
  );
};

export default ProteinViewer;
