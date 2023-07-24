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
          <th className={css('min-width-sm')}>Name</th>
          <th>Description</th>
          <th className={css('xs-hide')}>File name</th>
          <th className={css('xs-hide')}>Format</th>
          <th className={css('xs-hide')}>Links</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/AntiFam/current/Antifam.tar.gz">
              AntiFam families
            </Link>
          </td>
          <td>Seed alignments and profile-HMMs</td>
          <td className={css('xs-hide')}>Antifam.tar.gz</td>
          <td className={css('xs-hide')}>Stockholm (seed files) and HMMER (hmm files)</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/AntiFam/current/Antifam.tar.gz">
              <span
                className={css('icon', 'icon-common', 'font-l')}
                data-icon="&#x3d;"
              />
            </Link>
            <br />
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
