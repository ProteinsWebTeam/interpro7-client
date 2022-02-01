import React, { useEffect, useRef, useState } from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { format } from 'url';
import { createSelector } from 'reselect';
import NightingaleSunburst from 'nightingale-sunburst';

import loadData from 'higherOrder/loadData';
import Loading from 'components/SimpleCommonComponents/Loading';
import Link from 'components/generic/Link';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadWebComponent from 'utils/load-web-component';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';

const f = foundationPartial(style, ipro, fonts);

const getDefaultMaxDepth = (numSpecies /*: number */) => {
  if (numSpecies < 2000) return 8;
  if (numSpecies < 10000) return 7;
  if (numSpecies < 25000) return 6;
  if (numSpecies < 40000) return 5;
  return 4;
};
// eslint-disable-next-line no-magic-numbers
const FONT_SIZES = [10, 12, 14, 16, 18];
const DEFAULT_FONT_SIZE = 14;

const LinkOrText = ({ id, name } /*: { id: string, name: string } */) => (
  <i>
    {isNaN(id) ? (
      <span>{name}</span>
    ) : (
      <Link
        to={{
          description: {
            main: { key: 'taxonomy' },
            taxonomy: {
              db: 'uniprot',
              accession: id,
            },
          },
        }}
      >
        {name}
      </Link>
    )}
  </i>
);
LinkOrText.propTypes = {
  id: T.string,
  name: T.string,
};

const weigthOptions = {
  proteins: 'Number of sequences',
  species: 'Number of species',
};

const Sunburst = ({ data, description }) => {
  const { loading, payload } = data;
  const sunburst =
    /* { current?: null | React$ElementRef<'nightingale-sunburst'>  }*/ useRef(
      null,
    );
  const [legends, setLegends] = useState(null);
  const [weightOption, setWeightOption] = useState('proteins');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [currentNode, setCurrentNode] = useState(null);
  const [maxDepth, setMaxDepth] = useState(4);

  useEffect(() => {
    loadWebComponent(() => NightingaleSunburst).as('nightingale-sunburst');
  }, []);
  useEffect(() => {
    if (loading || !payload || !sunburst.current) return;
    sunburst.current.data = payload.taxa;
    setMaxDepth(getDefaultMaxDepth(payload.taxa.species));
    setLegends(
      sunburst.current.superkingdoms.map((name) => [
        name,
        sunburst.current.getColorBySuperKingdom(name),
      ]),
    );
    sunburst.current.addEventListener('taxon-hover', (evt) => {
      setCurrentNode(evt.detail);
    });
  }, [loading, payload]);
  if (loading || !payload) {
    return <Loading />;
  }
  const currentName =
    currentNode?.name || (currentNode?.rank ? `[No ${currentNode.rank}]` : '-');

  return (
    <div>
      <div className={f('row', 'sunburst')}>
        <div className={f('column', 'small-12', 'medium-9')}>
          {(payload?.taxa?.species || 0) > 2000 && (
            <div className={f('callout', 'info', 'withicon')}>
              The number of species for this sunburst is{' '}
              {payload?.taxa?.species}. The depth of the visualisation has been
              limited. You can modify this with the controller in the right
              side. however, please note this might affect the performance in
              your browser.
            </div>
          )}

          <ResizeObserverComponent measurements={['width']} element="div">
            {({ width }) => {
              return (
                <nightingale-sunburst
                  side={width}
                  weight-attribute={weightOption}
                  weight-attribute-label="Number of proteins"
                  name-attribute="name"
                  id-attribute="id"
                  ref={sunburst}
                  max-depth={maxDepth}
                  font-size={fontSize}
                />
              );
            }}
          </ResizeObserverComponent>
        </div>
        <div className={f('column', 'small-12', 'medium-3')}>
          {legends && (
            <div>
              <h5>Legends</h5>
              <ul className={f('legends')}>
                {legends.map(([name, color]) => (
                  <li key={name || 'other'}>
                    <div
                      style={{
                        backgroundColor: color,
                        width: '1rem',
                        height: '1rem',
                        display: 'inline-block',
                        marginRight: '0.5rem',
                      }}
                    />
                    <span className={f('header')}>{name || 'Other'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h5>Weight Segments by</h5>
            <select
              onChange={(evt) => setWeightOption(evt.target.value)}
              onBlur={(evt) => setWeightOption(evt.target.value)}
              value={weightOption}
            >
              {Object.keys(weigthOptions).map((option) => (
                <option key={option} value={option}>
                  {weigthOptions[option]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h5>Font Size</h5>
            <select
              onChange={(evt) => setFontSize(evt.target.value)}
              onBlur={(evt) => setFontSize(evt.target.value)}
              value={fontSize}
            >
              {FONT_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h5>Sunburst Depth</h5>
            <div className={f('sunburst-depth')}>
              4
              <input
                type="range"
                value={maxDepth}
                min="4"
                max="8"
                onChange={(event) => setMaxDepth(event.target.value)}
              />
              8
            </div>
          </div>
          <hr />
          <div>
            <h5>Selected Taxon</h5>
            {currentNode && (
              <dl>
                <dt>Name</dt>
                <dd>
                  {isNaN(currentNode.id) ? (
                    currentName
                  ) : (
                    <i>
                      <Link
                        to={{
                          description: {
                            main: { key: 'taxonomy' },
                            taxonomy: {
                              db: 'uniprot',
                            },
                            entry: {
                              ...description.entry,
                              isFilter: true,
                              order: 1,
                            },
                          },
                          search: { search: currentNode.id },
                          hash: 'tree',
                        }}
                      >
                        {currentName}
                      </Link>
                    </i>
                  )}
                </dd>
                <dt>Number of sequences</dt>
                <dd>
                  {isNaN(currentNode.id) ? (
                    currentNode.proteins
                  ) : (
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: description.entry,
                          protein: {
                            db: 'uniprot',
                            isFilter: true,
                            order: 1,
                          },
                          taxonomy: {
                            db: 'uniprot',
                            accession: currentNode.id,
                            isFilter: true,
                            order: 2,
                          },
                        },
                      }}
                    >
                      {currentNode.proteins}
                    </Link>
                  )}
                </dd>
                <dt>Number of species</dt>
                <dd>{currentNode.species}</dd>
                <dt>Lineage</dt>
                <dd>
                  {currentNode.lineage
                    .filter(({ name }) => !!name)
                    .map(({ name, id }) => (
                      <span key={id}>
                        <LinkOrText name={name} id={id} />;{' '}
                      </span>
                    ))}
                </dd>
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.entry,
  ({ protocol, hostname, port, root }, { db, accession }) => {
    const desc = {
      main: { key: 'entry' },
      entry: { db, accession },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(desc),
      query: {
        taxa: '',
      },
    });
  },
);

Sunburst.propTypes = {
  data: dataPropType.isRequired,
  description: T.object,
};

const mapStateToProps = createSelector(
  (state) => state.customLocation.description,
  (description) => ({
    description,
  }),
);

export default loadData({
  getUrl,
  mapStateToProps,
})(Sunburst);
