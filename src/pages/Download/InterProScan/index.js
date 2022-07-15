// @flow
import React from 'react';

import Link from 'components/generic/Link';
import DownloadTable from 'components/IPScan/DownloadTable';
import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

const InterProScanDownloads = () => (
  <>
    <DownloadTable />
    <p className={f('small', 'margin-top-small')}>
      To ensure you have the latest data and software enhancements we always
      recommend you download the latest version of InterProScan. However all
      previous releases are archived on the{' '}
      <Link href="https://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/">
        FTP Site
      </Link>
      . InterProScan's source code is available on{' '}
      <Link
        href="//github.com/ebi-pf-team/interproscan"
        className={f('ext')}
        target="_blank"
      >
        Github
      </Link>
      .
    </p>
  </>
);

export default InterProScanDownloads;
