import React from 'react';
import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, ipro);

const PrintsDownloads = () => (
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
          <td>Hierarchy of PRINTS families</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/FingerPRINTShierarchy21Feb2012">
              text
            </Link>
          </td>
        </tr>
        <tr>
          <td>PRINTS database</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.kdat">
              text
            </Link>
          </td>
        </tr>
        <tr>
          <td>BLOSUM62 matrices</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.pval_blos62">
              text
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
    <p className={css('small', 'margin-top-small')}>
      See all downloads available on the{' '}
      <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/">
        FTP site
      </Link>
    </p>
  </>
);

export default PrintsDownloads;
