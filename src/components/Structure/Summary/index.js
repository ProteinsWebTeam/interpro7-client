// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import { PDBeLink } from 'components/ExtLink';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Literature from 'components/Entry/Literature';
import StructureView from 'components/Structure/Viewer';

import loadWebComponent from 'utils/load-web-component';

import { foundationPartial } from 'styles/foundation';

import loadData from 'higherOrder/loadData';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

const f = foundationPartial(ebiStyles);

const webComponents = [];

const loadPDBWebComponents = () => {
  if (!webComponents.length) {
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
  return Promise.all(webComponents);
};

/*:: type Data = {
  loading: boolean,
  payload?: Object,
} */

/*:: type Props = {
  data: Data,
  dataMatches: Data,
  customLocation: {
    description: Object,
  },
}; */

class SummaryStructure extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({}).isRequired,
    dataMatches: T.shape({}).isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
    }).isRequired,
  };

  componentDidMount() {
    loadPDBWebComponents();
  }

  render() {
    const {
      data: { loading, payload },
      dataMatches: { loading: loadingM, payload: payloadM },
    } = this.props;
    if (loading || loadingM || !payload || !payloadM) return null;
    const metadata = payload.metadata;
    const matches = payloadM.results;
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
                  {metadata.resolution && (
                    <div>Resolution: {metadata.resolution} Å </div>
                  )}
                  <div>Chains: {chains.join(', ')}</div>
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
                      // remove the PDB viewer as we already show info on page (duplication)
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
                <StructureView id={metadata.accession} matches={matches} />
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
              {/* $FlowFixMe */}
              <Literature extra={literature} />
            </section>
          )}
        </div>
      </div>
    );
  }
}

const getURLForMatches = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.structure,
  ({ protocol, hostname, port, root }, { accession }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}${descriptionToPath({
        main: { key: 'entry' },
        structure: { isFilter: true, db: 'pdb', accession },
        entry: { db: 'all' },
      })}`,
      query: { page_size: 100 },
    }),
);

export default loadData({
  getUrl: getURLForMatches,
  propNamespace: 'Matches',
})(loadData()(SummaryStructure));
