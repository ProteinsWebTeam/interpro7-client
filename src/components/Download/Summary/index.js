// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { filesize } from 'filesize';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import Link from 'components/generic/Link';
// $FlowFixMe
import Table, { Column } from 'components/Table';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Actions from 'components/Download/Actions';
// $FlowFixMe
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';
// $FlowFixMe
import { formatLongDate } from 'utils/date';
// $FlowFixMe
import { downloadSelector } from 'reducers/download';

import { foundationPartial } from 'styles/foundation';

import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import VersionCheck from './VersionCheck';
import tableStyles from 'components/Table/style.css';

const f = foundationPartial(interproTheme, fonts, ipro, tableStyles);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const GoToNewDownload = () => (
  <Link
    to={{
      description: {
        main: { key: 'result' },
        result: { type: 'download' },
      },
      hash: '/entry/InterPro/|accession',
    }}
    buttonType="primary"
  >
    Select and Download InterPro data
  </Link>
);

class Summary extends PureComponent /*:: < {download: Array<Object>} > */ {
  static propTypes = {
    download: T.arrayOf(T.object).isRequired,
  };

  render() {
    const { download } = this.props;
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <div className={f('row')}>
            <SchemaOrgData
              data={{
                name: 'Your Download Jobs',
                description: 'The status of all the download jobs',
              }}
              processData={schemaProcessDataPageSection}
            />
            <h3 className={f('large-10', 'columns', 'light')}>
              Your download jobs{' '}
              <TooltipAndRTDLink rtdPage="download.html#your-downloads" />
            </h3>
            <div className={f('button-group', 'columns', 'large-2')}>
              <GoToNewDownload />
            </div>
          </div>
          <Table dataTable={download} contentType="files" actualSize={0}>
            <Column
              dataKey="localID"
              renderer={(localID /*: string */) => (
                <Link target="_blank" href={localID.split('|')[0]}>
                  {' '}
                  {localID.split('|')[0]}{' '}
                </Link>
              )}
            >
              URL
            </Column>
            <Column dataKey="fileType">Type</Column>
            <Column
              dataKey="version"
              renderer={(version /*: number */, { localID }) => (
                <>
                  {version.toLocaleString(undefined, {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}{' '}
                  <VersionCheck downloadVersion={version} localID={localID} />
                </>
              )}
            >
              InterPro Version
            </Column>
            <Column
              dataKey="date"
              defaultKey="date"
              renderer={(
                date /*: string */,
                { progress } /*: { progress: number } */,
              ) => {
                if (progress < 1) return 'Currently running';
                return formatLongDate(new Date(date));
              }}
            >
              Date
            </Column>
            <Column
              dataKey="progress"
              headerClassName={f('table-header-center')}
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
              headerClassName={f('table-header-center')}
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

const mapStateToProps = createSelector(downloadSelector, (download) => ({
  download: Object.entries(download).map(([localID, download]) => ({
    localID,
    ...download,
  })),
}));

export default connect(mapStateToProps)(Summary);
