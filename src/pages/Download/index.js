// @flow
import React from 'react';
import T from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import Tabs from 'components/Tabs';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';
// $FlowFixMe
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import InterProScanDownloads from 'components/DownloadFTP/InterProScan';
import InterProDownloads from 'components/DownloadFTP/InterPro';
import PfamDownloads from 'components/DownloadFTP/Pfam';
import PrintsDownloads from 'components/DownloadFTP/Prints';
import SFLDDownloads from '../../components/DownloadFTP/SFLD';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

/*::
  type Props = {
    currentTab?: string,
    goToCustomLocation: function,
  }
  */

const Download = ({ currentTab, goToCustomLocation }) => {
  return (
    <div className={f('row')}>
      <div className={f('columns')}>
        <section>
          <Helmet>
            <title>Download</title>
          </Helmet>
          <h3>
            Download <TooltipAndRTDLink rtdPage="download.html#download-page" />
          </h3>
          <SchemaOrgData
            data={{
              name: 'InterPro Download Page',
              description:
                'Includes links to pre-generated files for the current version of InterPro',
            }}
            processData={schemaProcessDataPageSection}
          />
          <Tabs
            selectedTab={currentTab || 'InterPro'}
            onTabSelected={(tabId) => {
              goToCustomLocation({
                description: { other: ['download', tabId] },
              });
            }}
          >
            <div title="InterPro">
              <InterProDownloads />
            </div>
            <div title="InterProScan">
              <InterProScanDownloads />
            </div>
            <div title="Pfam">
              <PfamDownloads />
            </div>
            <div title="Prints">
              <PrintsDownloads />
            </div>
            <div title="SFLD">
              <SFLDDownloads />
            </div>
          </Tabs>
        </section>
      </div>
    </div>
  );
};
Download.propTypes = {
  currentTab: T.string,
  goToCustomLocation: T.func,
};

const mapStateToProps = createSelector(
  customLocationSelector,
  (customLocation) => ({ currentTab: customLocation.description.other?.[1] }),
);

export default connect(mapStateToProps, { goToCustomLocation })(Download);
