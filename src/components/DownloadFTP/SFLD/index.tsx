import React from 'react';
import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, ipro);

const SFLDDownloads = () => (
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
          <td>SFLD models</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld.hmm">
              hmm
            </Link>
          </td>
        </tr>
        <tr>
          <td>SFLD hierarchy</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_hierarchy_flat.txt">
              text
            </Link>
          </td>
        </tr>
        <tr>
          <td>Sites annotations</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_sites.annot">
              text
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
    <p className={css('small', 'margin-top-small')}>
      See all downloads available on the{' '}
      <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/">
        FTP site
      </Link>
    </p>
  </>
);

export default SFLDDownloads;
