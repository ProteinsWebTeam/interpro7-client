import React, { PureComponent } from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { createSelector } from 'reselect';
import { format } from 'url';

import Accession from 'components/Accession';
import Link from 'components/generic/Link';
import { PDBeLink } from 'components/ExtLink';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Literature from 'components/Entry/Literature';
import TimeAgo from 'components/TimeAgo';
import ViewerOnDemand from 'components/Structure/ViewerAndEntries';

import { foundationPartial } from 'styles/foundation';

import loadData from 'higherOrder/loadData';

import ebiStyles from 'ebi-framework/css/ebi-global.css';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { formatExperimentType } from 'components/Structure/utils';
import { formatShortDate } from 'utils/date';

const f = foundationPartial(ebiStyles);

/*:: type Data = {
  loading: boolean,
  payload?: Object,
} */

/*:: type Props = {
  data: Data,
  dataMatches: Data,
}; */

export class SummaryStructure extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: dataPropType.isRequired,
    dataMatches: dataPropType.isRequired,
  };

  render() {
    const {
      data: { loading, payload },
      dataMatches: { loading: loadingM, payload: payloadM },
    } = this.props;
    if (loading || loadingM || !payload) return null;
    const metadata = payload.metadata;
    const matches = payloadM?.results || [];
    const chains = Array.from(new Set(metadata.chains || []));
    const date = new Date(metadata.release_date);
    const literature = Object.entries(metadata.literature || {}).map((item) => {
      // DOI_URL for structure URL is not complete. It contains only the ID
      if (
        item.length === 2 &&
        item[1]?.DOI_URL !== null &&
        !item[1]?.DOI_URL?.startsWith('http')
      ) {
        const id = item[1].DOI_URL;
        item[1].DOI_URL = `https://www.doi.org/${id}`;
      }
      return item;
    });
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
              {chains.length && (
                <table className={f('light', 'table-sum')}>
                  <tbody>
                    <tr>
                      <td>Accession</td>
                      <td data-testid="structure-accession">
                        <Accession accession={metadata.accession} />
                      </td>
                    </tr>
                    <tr>
                      <td>Experiment type</td>
                      <td
                        className={f('text-cap')}
                        data-testid="structure-experiment-type"
                      >
                        <Link
                          to={{
                            description: {
                              main: { key: 'structure' },
                              structure: { db: 'PDB' },
                              entry: { isFilter: true, db: 'InterPro' },
                            },
                            search: {
                              experiment_type: metadata.experiment_type,
                            },
                          }}
                        >
                          {formatExperimentType(metadata.experiment_type)}
                        </Link>
                      </td>
                    </tr>
                    {metadata.resolution && (
                      <tr>
                        <td>Resolution</td>
                        <td data-testid="structure-resolution">
                          {metadata.resolution} Å
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>Chains</td>
                      <td data-testid="structure-chains">
                        {chains.join(', ')}
                      </td>
                    </tr>
                    <tr>
                      <td>Released</td>
                      <td data-testid="structure-date">
                        <TimeAgo
                          date={date}
                          noUpdate
                          title={formatShortDate(date)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            <div className={f('medium-3', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul
                  className={f('no-bullet')}
                  data-testid="structure-external-links"
                >
                  <li>
                    <PDBeLink
                      id={metadata.accession || ''}
                      className={f('ext')}
                    >
                      View {metadata.accession} in PDBe
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
                <ViewerOnDemand id={metadata.accession} matches={matches} />
              </div>
            </div>
          </ErrorBoundary>
        </section>
        <div>
          {literature.length ? (
            <section id="references">
              <div className={f('row')}>
                <div className={f('large-12', 'columns')}>
                  <h4>References</h4>
                </div>
              </div>
              {/* $FlowFixMe */}
              <Literature extra={literature} />
            </section>
          ) : null}
        </div>
      </div>
    );
  }
}

const getURLForMatches = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.structure,
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
      query: { page_size: 200 },
    }),
);

export default loadData({
  getUrl: getURLForMatches,
  propNamespace: 'Matches',
})(loadData()(SummaryStructure));
