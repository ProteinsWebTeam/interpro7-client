import React, { useState } from 'react';
import {
  Feature,
  FeatureLocation,
} from '@nightingale-elements/nightingale-track';

import NightingaleManager from 'components/Nightingale/Manager';

import Header from './Header';
import TracksInCategory from './TracksInCategory';

import cssBinder from 'styles/cssBinder';

import style from '../ProtVista/style.css';
import grid from '../ProtVista/grid.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(style, grid, fonts);

const highlightColor = '#607D8B50';

type Residue = {
  locations: Array<
    FeatureLocation & {
      accession: string;
      description: string;
    }
  >;
};
export type ExtendedFeatureLocation = FeatureLocation & { confidence?: number };
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

  return (
    <div
      // ref={this._mainRef}
      className={css('fullscreenable', 'margin-bottom-large')}
    >
      <div
        // ref={this._popperRef}
        className={css('popper', 'hide')}
      >
        <div className={css('popper__arrow')} />
        <div
        // ref={this._popperContentRef}
        />
      </div>
      <div>
        <NightingaleManager id="pv-manager">
          <div className={css('protvista-grid')}>
            <div className={css('view-options-wrap', 'track-sized')}>
              <h5>Options: {title}</h5>
            </div>
          </div>
          <div
            className={css('protvista-grid', {
              printing: isPrinting,
            })}
            // ref={this._protvistaRef}
            // id={`${this.state.optionsID}ProtvistaDiv`}
          >
            <Header
              length={protein.length}
              sequence={protein.sequence}
              highlightColor={highlightColor}
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
                    />
                  </div>
                );
              })}
          </div>
        </NightingaleManager>
      </div>
    </div>
  );
};

export default ProteinViewer;
