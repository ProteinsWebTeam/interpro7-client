import React, { PureComponent } from 'react';

import Table, { Column } from 'components/Table';
import TimeAgo from 'components/TimeAgo';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Actions from 'components/IPScan/Actions';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(fonts, ipro);

class Summary extends PureComponent {
  render() {
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <div className={f('row')}>
            <h3 className={f('large-9', 'columns')}>Your download jobs</h3>
          </div>
          <Table dataTable={[]} contentType="files" actualSize={0}>
            <Column dataKey="localID">Job ID</Column>
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
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              renderer={(status /*: string */) => (
                <Tooltip title={`Job ${status}`}>
                  {(status === 'running' ||
                    status === 'created' ||
                    status === 'submitted') && (
                    <span
                      style={{ fontSize: '200%' }}
                      className={f('icon', 'icon-common', 'ico-progress')}
                      data-icon="&#x17;"
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

export default Summary;
