import React from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import Tabs from 'components/Tabs';
import InterProScanDownloads from 'components/DownloadFTP/InterProScan';
import InterProDownloads from 'components/DownloadFTP/InterPro';
import PfamDownloads from 'components/DownloadFTP/Pfam';
import PrintsDownloads from 'components/DownloadFTP/Prints';
import SFLDDownloads from 'components/DownloadFTP/SFLD';
import AntiFamDownloads from 'components/DownloadFTP/AntiFam';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

type Props = {
  currentTab?: string;
  goToCustomLocation: typeof goToCustomLocation;
};

const Download = ({ currentTab, goToCustomLocation }: Props) => {
  return (
    <div className={css('vf-stack', 'vf-stack-400')}>
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
          onTabSelected={(tabId: string) => {
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
          <div title="PRINTS">
            <PrintsDownloads />
          </div>
          <div title="SFLD">
            <SFLDDownloads />
          </div>
          <div title="AntiFam">
            <AntiFamDownloads />
          </div>
        </Tabs>
      </section>
    </div>
  );
};

const mapStateToProps = createSelector(
  customLocationSelector,
  (customLocation) => ({ currentTab: customLocation.description.other?.[1] }),
);

export default connect(mapStateToProps, { goToCustomLocation })(Download);
