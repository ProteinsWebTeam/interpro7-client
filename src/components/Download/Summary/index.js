import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import filesize from 'filesize';

import Link from 'components/generic/Link';
import Table, { Column } from 'components/Table';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Actions from 'components/Download/Actions';

import { downloadSelector } from 'reducers/download';

import { foundationPartial } from 'styles/foundation';

import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(interproTheme, fonts, ipro);

const GoToNewDownload = () => (
  <Link
    to={{
      description: {
        main: { key: 'job' },
        job: { type: 'download' },
      },
      hash: '/entry/InterPro/|accession',
    }}
    className={f('button')}
  >
    Select and Download InterPro data
  </Link>
);

class Summary extends PureComponent {
  static propTypes = {
    download: T.arrayOf(T.object).isRequired,
  };

  render() {
    const { download } = this.props;
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <div className={f('row')}>
            <h3 className={f('large-10', 'columns', 'light')}>
              Your download jobs
            </h3>
            <div className={f('button-group', 'columns', 'large-2')}>
              <GoToNewDownload />
            </div>
          </div>
          <Table dataTable={download} contentType="files" actualSize={0}>
            <Column
              dataKey="localID"
              renderer={(localID /*: string */) => localID.split('|')[0]}
            >
              URL
            </Column>
            <Column
              dataKey="localID"
              defaultKey="type"
              renderer={(localID /*: string */) => localID.split('|')[1]}
            >
              Type
            </Column>
            <Column
              dataKey="progress"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              renderer={(
                progress /*: number */,
                { successful } /*: { successful?: boolean } */,
              ) => (
                <Tooltip title={`Job ${Math.floor(progress * 100)}% complete`}>
                  {progress === 1 ? null : (
                    <span
                      style={{ fontSize: '200%' }}
                      className={f('icon', 'icon-common', 'ico-neutral')}
                      data-icon="&#x17;"
                      aria-label={`Job ${Math.floor(progress * 100)}% complete`}
                    />
                  )}

                  {successful === false ? (
                    <span
                      style={{ fontSize: '160%' }}
                      className={f('icon', 'icon-common', 'ico-notfound')}
                      data-icon="&#x78;"
                      aria-label="Job failed or not found"
                    />
                  ) : null}

                  {successful === true && (
                    <span
                      style={{ fontSize: '160%' }}
                      className={f('icon', 'icon-common', 'ico-confirmed')}
                      data-icon="&#xf00c;"
                      aria-label="Job finished"
                    />
                  )}
                </Tooltip>
              )}
            >
              Status
            </Column>
            <Column
              dataKey="size"
              renderer={(size /*:: ?: number */) =>
                Number.isFinite(size)
                  ? filesize(size, { standard: 'iec' })
                  : size
              }
            >
              Size
            </Column>
            <Column
              dataKey="localID"
              defaultKey="actions"
              headerClassName={f('table-center')}
              cellClassName={f('table-center')}
              renderer={(
                localID /*: string */,
                { blobURL } /* { blobURL?: string } */,
              ) => <Actions localID={localID} blobURL={blobURL} />}
            >
              Actions
            </Column>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(downloadSelector, download => ({
  download: Object.entries(download).map(([localID, download]) => ({
    localID,
    ...download,
  })),
}));

export default connect(mapStateToProps)(Summary);
