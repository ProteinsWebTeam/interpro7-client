import React from 'react';
import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, ipro);

const AntiFamDownloads = () => (
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
          <td>AntiFam families</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/AntiFam/current/Antifam.tar.gz">
              tar
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
    <p className={css('small', 'margin-top-small')}>
      See all downloads available on the{' '}
      <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/AntiFam/">
        FTP Site
      </Link>
    </p>
  </>
);

export default AntiFamDownloads;
