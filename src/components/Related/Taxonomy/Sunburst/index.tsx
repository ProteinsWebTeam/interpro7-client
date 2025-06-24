import React, { useEffect, useRef, useState } from 'react';

import { format } from 'url';
import { createSelector } from 'reselect';
import NightingaleSunburstCE from '@nightingale-elements/nightingale-sunburst';

import loadData from 'higherOrder/loadData/ts';
import NightingaleSunburst from 'components/Nightingale/Sunburst';
import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';
import Link from 'components/generic/Link';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';

const css = cssBinder(style, fonts);

// TODO: Use  and Fix the type from Nightingale Sequence
type TaxonNode = {
  id: string;
  name: string;
  numDomains: number;
  numSequences: number;
  numSpecies: number;
  value: number;
  node: string;
  children: TaxonNode[] | null;
  _children: TaxonNode[] | null;
  rank?: number;
};

const MAX_NUM_SPECIES_FOR_FULL_DEPTH = 2000;

/* eslint-disable no-magic-numbers */
const getDefaultMaxDepth = (numSpecies: number) => {
  if (numSpecies < MAX_NUM_SPECIES_FOR_FULL_DEPTH) return 8;
  if (numSpecies < 10000) return 7;
  if (numSpecies < 25000) return 6;
  if (numSpecies < 40000) return 5;
  return 4;
};

const FONT_SIZES = [10, 12, 14, 16, 18];
const DEFAULT_FONT_SIZE = 14;
const DEFAULT_DEPTH = 4;
/* eslint-enable no-magic-numbers */

const LinkOrText = ({ id, name }: { id: string; name: string }) => (
  <i>
    {isNaN(Number(id)) ? (
      <span>{name}</span>
    ) : (
      <Link
        to={{
          description: {
            main: { key: 'taxonomy' },
            taxonomy: {
              db: 'uniprot',
              accession: id,
            } as InterProPartialDescription,
          },
        }}
      >
        {name}
      </Link>
    )}
  </i>
);

const weigthOptions = {
  proteins: 'Number of sequences',
  species: 'Number of species',
};
type WeightOptions = keyof typeof weigthOptions;

type Props = {
  description: InterProDescription;
};
interface LoadedProps extends Props, LoadDataProps<TaxaPayload> {}

const Sunburst = ({ data, description }: LoadedProps) => {
  const { loading, payload } = data || {};
  const sunburst = useRef<NightingaleSunburstCE | null>(null);
  const [legends, setLegends] = useState<Array<[string, string]>>([]);
  const [weightOption, setWeightOption] = useState<WeightOptions>('proteins');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [currentNode, setCurrentNode] = useState<Taxon | null>(null);
  const [maxDepth, setMaxDepth] = useState(DEFAULT_DEPTH);

  useEffect(() => {
    const waitForWC = async () => {
      const promises = ['nightingale-sunburst'].map((localName) =>
        customElements.whenDefined(localName),
      );
      await Promise.all(promises);
    };
    waitForWC();
  }, []);
  useEffect(() => {
    if (loading || !payload || !sunburst.current) return;
    // TODO: Use  and Fix the type from Nightingale Sequence
    sunburst.current.data = payload.taxa as unknown as TaxonNode;
    setMaxDepth(getDefaultMaxDepth(payload.taxa.species));
    setLegends(
      sunburst.current?.topOptions?.map((name) => [
        name || '',
        sunburst.current?.getColorBySuperKingdom(name || '') || '',
      ]) || [],
    );
    sunburst.current.addEventListener('taxon-hover', (evt: Event) => {
      setCurrentNode((evt as CustomEvent).detail as Taxon);
    });
  }, [loading, payload]);
  if (loading || !payload) {
    return <Loading />;
  }
  const currentName =
    currentNode?.name || (currentNode?.rank ? `[No ${currentNode.rank}]` : '-');

  return (
    <div>
      {(payload?.taxa?.species || 0) > MAX_NUM_SPECIES_FOR_FULL_DEPTH && (
        <Callout type="info">
          There are {payload?.taxa?.species} species represented in this
          sunburst chart. The depth of the visualisation has been limited. You
          can modify this with the controller in the right side. however, please
          note this might affect the performance in your browser.
        </Callout>
      )}
      <div className={css('sunburst')}>
        <div className={css('panel-component')}>
          <ResizeObserverComponent measurements={['width']} element="div">
            {({ width }: { width: number }) => {
              return (
                <NightingaleSunburst
                  side={width}
                  // TODO: Fix type in nightingale-sunburst
                  weight-attribute={weightOption as unknown as 'value'}
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
        <div className={css('panel-legends')}>
          {/*legends && (
            <div>
              <h5>Legends</h5>
              <ul className={css('legends')}>
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
                    <span className={css('header')}>{name || 'Other'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )*/}
          <div>
            <h5>Weight Segments by</h5>
            <select
              onChange={(evt) =>
                setWeightOption(evt.target.value as WeightOptions)
              }
              onBlur={(evt) =>
                setWeightOption(evt.target.value as WeightOptions)
              }
              value={weightOption}
            >
              {Object.keys(weigthOptions).map((option) => (
                <option key={option} value={option}>
                  {weigthOptions[option as keyof typeof weigthOptions]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h5>Font Size</h5>
            <select
              onChange={(evt) => setFontSize(Number(evt.target.value))}
              onBlur={(evt) => setFontSize(Number(evt.target.value))}
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
            <h5>
              Sunburst Depth
              <br />
              <span className={css('small')}>{maxDepth} rings</span>
            </h5>
            <div className={css('sunburst-depth')}>
              2
              <input
                type="range"
                value={maxDepth}
                min="2"
                max="8"
                onChange={(event) => setMaxDepth(Number(event.target.value))}
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
                  {isNaN(Number(currentNode.id)) ? (
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
                          } as InterProPartialDescription,
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
                  {isNaN(Number(currentNode.id)) ? (
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
                        } as InterProPartialDescription,
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
                    ?.filter(({ name }) => !!name)
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
    const desc: InterProPartialDescription = {
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

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description,
  (description) => ({ description }),
);

export default loadData<TaxaPayload>({
  getUrl,
  mapStateToProps,
} as LoadDataParameters)(Sunburst);
