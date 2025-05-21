import React from 'react';
import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, ipro);

const InterProScanDownloads = () => (
  <>
    <table className={css('classic')}>
      <thead>
        <tr>
          <th>Resource</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Latest InterProScan release</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/">
              ftp
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
    <p className={css('small', 'margin-top-small')}>
      To ensure you have the latest data and software enhancements we always
      recommend you download the latest version of InterProScan. However, all
      previous releases are archived on the{' '}
      <Link href="https://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/">
        FTP site
      </Link>
      . InterProScan&#39;s source code is available on{' '}
      <Link
        href="//github.com/ebi-pf-team/interproscan"
        className={css('ext')}
        target="_blank"
      >
        Github
      </Link>
      .
    </p>
  </>
);

export default InterProScanDownloads;
