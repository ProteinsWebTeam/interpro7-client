// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Title from 'components/Title';
import Link from 'components/generic/Link';
import { PDBeLink } from 'components/ExtLink';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Embed from 'components/Embed';

import loadWebComponent from 'utils/loadWebComponent';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';

const f = foundationPartial(ebiStyles);

const embedStyle = { width: '100%', height: '50vh' };

const webComponents = [];

/*:: type Props = {
  data: {
    metadata: Object,
  },
  location: {
    description: Object,
  },
}; */

class SummaryStructure extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }).isRequired,
    location: T.shape({
      description: T.object.isRequired,
    }).isRequired,
  };

  componentWillMount() {
    if (webComponents.length) return;
    const dataLoader = () =>
      import(/* webpackChunkName: "data-loader" */ 'data-loader');
    const pdbComponents = () =>
      import(/* webpackChunkName: "pdb-web-components" */ 'pdb-web-components');
    webComponents.push(loadWebComponent(() => dataLoader()).as('data-loader'));
    webComponents.push(
      loadWebComponent(() => pdbComponents().then(m => m.PdbDataLoader)).as(
        'pdb-data-loader',
      ),
    );
    webComponents.push(
      loadWebComponent(() => pdbComponents().then(m => m.PdbPrints)).as(
        'pdb-prints',
      ),
    );
  }

  render() {
    const { data: { metadata } } = this.props;
    const chains = Array.from(new Set(metadata.chains || []));
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-10', 'columns', 'margin-bottom-large')}>
              <Title metadata={metadata} mainType="structure" />
              <pdb-prints size="36">
                <pdb-data-loader pdbid={metadata.accession} />
              </pdb-prints>
              {chains.length && (
                <div className={f('margin-top-large')}>
                  <div>Accession: {metadata.accession}</div>
                  <div>Experiment type: {metadata.experiment_type}</div>
                  <div>
                    Chains:{' '}
                    {chains.map(chain => (
                      <Link
                        key={chain}
                        newTo={location => ({
                          ...location,
                          description: {
                            mainType: location.description.mainType,
                            mainDB: location.description.mainDB,
                            mainAccession: location.description.mainAccession,
                            mainChain: chain,
                          },
                        })}
                      >
                        {chain}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className={f('medium-2', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul className={f('no-bullet')}>
                  <li>
                    <PDBeLink id={metadata.accession} className={f('ext')}>
                      View this structure in PDBe
                    </PDBeLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ErrorBoundary>
            <div className={f('row')}>
              <div className={f('columns')}>
                <Embed
                  style={embedStyle}
                  src={`https://www.ebi.ac.uk/pdbe/entry/view3D/${
                    metadata.accession
                  }/?view=entry_index&viewer=litemol&controls=codename_hero`}
                >
                  <div
                    style={{
                      background: 'white',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={`//www.ebi.ac.uk/pdbe/static/entry/${metadata.accession.toLowerCase()}_entity_1_front_image-400x400.png`}
                      alt={`structure with accession ${metadata.accession.toUpperCase()}`}
                      style={{ maxWidth: '100%' }}
                    />
                  </div>
                </Embed>
              </div>
            </div>
          </ErrorBoundary>
        </section>
      </div>
    );
  }
}

export default SummaryStructure;
