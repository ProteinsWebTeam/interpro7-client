import React from 'react';
import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import DownloadTable from 'components/IPScan/DownloadTable';

const css = cssBinder(fonts, ipro);

const InterProScanDownloads = () => (
  <>
    <DownloadTable />
  </>
);

export default InterProScanDownloads;
