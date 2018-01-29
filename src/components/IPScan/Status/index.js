// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Table, { Column } from 'components/Table';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Actions from 'components/IPScan/Actions';

import { updateJobStatus } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts, ipro);

class IPScanStatus extends PureComponent {
  static propTypes = {
    jobs: T.arrayOf(T.object).isRequired,
    updateJobStatus: T.func.isRequired,
  };

  componentDidMount() {
    this.props.updateJobStatus();
  }

  render() {
    const { jobs } = this.props;
    if (!jobs.length)
      return (
        <React.Fragment>
          <p>Nothing to see here.</p>
          <Link
            to={{
              description: {
                main: { key: 'search' },
                search: { type: 'sequence' },
              },
            }}
            className={f('button')}
          >
            Submit a new search
          </Link>
        </React.Fragment>
      );
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <h3>Your InterProScan searches</h3>
          <Table dataTable={jobs} actualSize={jobs.length}>
            <Column
              dataKey="localID"
              renderer={(localID /*: string */, row /*: Object */) => (
                <Link
                  to={{
                    description: {
                      main: { key: 'job' },
                      job: {
                        type: 'InterProScan',
                        accession: row.remoteID || localID,
                      },
                    },
                  }}
                >
                  {row.remoteID || localID}
                </Link>
              )}
            >
              Job ID
            </Column>
            <Column
              dataKey="times.created"
              renderer={(created /*: string */) => {
                const parsed = new Date(created);
                return (
                  <Tooltip
                    title={`Created on ${parsed.toLocaleDateString()} at ${parsed.toLocaleTimeString()}`}
                  >
                    <time dateTime={parsed.toISOString()}>
                      <TimeAgo date={parsed} />
                    </time>
                  </Tooltip>
                );
              }}
            >
              Created
            </Column>
            <Column
              dataKey="status"
              cellClassName={f('table-center')}
              renderer={(status /*: string */) => (
                <Tooltip title={`Job ${status}`}>
                  {(status === 'running' ||
                    status === 'created' ||
                    status === 'submitted') && (
                    <span
                      style={{ fontSize: '200%' }}
                      className={f('icon', 'icon-generic', 'ico-progress')}
                      data-icon="{"
                      aria-label={`Job ${status}`}
                    />
                  )}

                  {status === 'not found' ||
                  status === 'failure' ||
                  status === 'error' ? (
                    <span
                      style={{ fontSize: '160%' }}
                      className={f('icon', 'icon-functional', 'ico-notfound')}
                      data-icon="x"
                      aria-label="Job failed or not found"
                    />
                  ) : null}
                  {status === 'finished' && (
                    <span
                      style={{ fontSize: '160%' }}
                      className={f('icon', 'icon-functional', 'ico-confirmed')}
                      data-icon="/"
                      aria-label="Job finished"
                    />
                  )}
                </Tooltip>
              )}
            >
              Status
            </Column>
            <Column
              dataKey="localID"
              defaultKey="actions"
              renderer={(localID /*: string */) => (
                <Actions localID={localID} />
              )}
            >
              Actions
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const mapsStateToProps = createSelector(
  state =>
    Object.values(state.jobs)
      .map(j => j.metadata)
      .sort((a, b) => b.times.created - a.times.created),
  jobs => ({ jobs }),
);

export default connect(mapsStateToProps, { updateJobStatus })(IPScanStatus);
