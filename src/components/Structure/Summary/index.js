// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Title from 'components/Title';
import Link from 'components/generic/Link';
import { PDBeLink } from 'components/ExtLink';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Embed from 'components/Embed';

import loadWebComponent from 'utils/loadWebComponent';

import f from 'styles/foundation';
import pdbLogo from 'images/pdbe.png';

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
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-8', 'large-8', 'columns')}>
              <Title metadata={metadata} mainType={'structure'} />
              <h4>Summary</h4>
              <pdb-prints size="48">
                <pdb-data-loader pdbid={metadata.accession} />
              </pdb-prints>
              {metadata.chains && (
                <div>
                  <h4>Chains:</h4>
                  {metadata.chains.map(chain => (
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
              )}
            </div>
            <div className={f('medium-4', 'large-4', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul className={f('chevron')}>
                  <li>
                    <PDBeLink id={metadata.accession}>
                      <img src={pdbLogo} alt="Uniprot logo" />
                    </PDBeLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ErrorBoundary>
            <Embed
              style={embedStyle}
              src={`https://www.ebi.ac.uk/pdbe/entry/view3D/${metadata.accession}/?view=entry_index&viewer=litemol&controls=codename_hero`}
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
          </ErrorBoundary>
        </section>
      </div>
    );
  }
}

export default SummaryStructure;
