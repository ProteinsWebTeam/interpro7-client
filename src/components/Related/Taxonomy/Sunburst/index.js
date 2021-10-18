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
  const [currentNode, setCurrentNode] = useState(null);

  useEffect(() => {
    loadWebComponent(() => NightingaleSunburst).as('nightingale-sunburst');
  }, []);
  useEffect(() => {
    if (loading || !payload || !sunburst.current) return;
    sunburst.current.data = payload.taxa;
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
      <h4>SunBurst</h4>
      <div className={f('row', 'sunburst')}>
        <div className={f('column', 'small-12', 'medium-9')}>
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
                  max-depth={8}
                  // show-label
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
            <select onBlur={(evt) => setWeightOption(evt.target.value)}>
              {Object.keys(weigthOptions).map((option) => (
                <option key={option} value={option}>
                  {weigthOptions[option]}
                </option>
              ))}
            </select>
          </div>
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
