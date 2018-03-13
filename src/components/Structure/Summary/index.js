// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import { PDBeLink } from 'components/ExtLink';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Literature from 'components/Entry/Literature';
import StructureView from 'components/Structure/Viewer';

import loadWebComponent from 'utils/loadWebComponent';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';

const f = foundationPartial(ebiStyles);

const webComponents = [];

/*:: type Props = {
  data: {
    metadata: Object,
  },
  customLocation: {
    description: Object,
  },
}; */

class SummaryStructure extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }).isRequired,
    customLocation: T.shape({
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
    const date = new Date(metadata.release_date);
    const literature = Object.entries(metadata.literature);
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
              {chains.length && (
                <div className={f('margin-top-large')}>
                  <div>Accession: {metadata.accession}</div>
                  <div>Experiment type: {metadata.experiment_type}</div>
                  {metadata.resolution !== null ? (
                    <div>Resolution: {metadata.resolution} Å </div>
                  ) : (
                    ''
                  )}

                  <div>
                    Chains:{' '}
                    {chains.map(chain => (
                      <Link
                        key={chain}
                        to={customLocation => ({
                          ...customLocation,
                          description: {
                            ...customLocation.description,
                            structure: {
                              ...customLocation.description.structure,
                              chain,
                            },
                          },
                        })}
                      >
                        {chain}
                      </Link>
                    ))}
                  </div>
                  <div>
                    Released: <time>{date.toLocaleDateString()}</time>
                  </div>
                </div>
              )}
            </div>
            <div className={f('medium-3', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul className={f('no-bullet')}>
                  <li>
                    <PDBeLink id={metadata.accession} className={f('ext')}>
                      View this structure in PDBe
                    </PDBeLink>
                    {
                      //remove the PDB viewer as we already show info on page (duplication)
                      // <pdb-prints size="36">
                      // <pdb-data-loader pdbid={metadata.accession} />
                      // </pdb-prints>
                    }
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ErrorBoundary>
            <div className={f('row')}>
              <div className={f('columns')}>
                <StructureView id={metadata.accession} />
              </div>
            </div>
          </ErrorBoundary>
        </section>
        <div>
          {literature.length && (
            <section id="references">
              <div className={f('row')}>
                <div className={f('large-12', 'columns')}>
                  <h4>References</h4>
                </div>
              </div>
              <Literature extra={literature} />
            </section>
          )}
        </div>
      </div>
    );
  }
}

export default SummaryStructure;
