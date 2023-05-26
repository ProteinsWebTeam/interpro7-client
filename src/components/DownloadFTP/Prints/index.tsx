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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/FingerPRINTShierarchy21Feb2012">
              Hierarchy of PRINTS families
            </Link>
          </td>
          <td>Fingerprints hierarchy</td>
          <td className={css('xs-hide')}>FingerPRINTShierarchy21Feb2012</td>
          <td className={css('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/FingerPRINTShierarchy21Feb2012">
              <span
                className={css('icon', 'icon-common', 'font-l')}
                data-icon="&#x3d;"
              />
            </Link>
            <br />
          </td>
        </tr>
        <tr>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.kdat">
              PRINTS database
            </Link>
          </td>
          <td>Compendium of protein fingerprints</td>
          <td className={css('xs-hide')}>prints42_0.kdat</td>
          <td className={css('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.kdat">
              <span
                className={css('icon', 'icon-common', 'font-l')}
                data-icon="&#x3d;"
              />
            </Link>
            <br />
          </td>
        </tr>
        <tr>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.pval_blos62">
              BLOSUM62 matrices of PRINTS families
            </Link>
          </td>
          <td>Compact version of prints.dat</td>
          <td className={css('xs-hide')}>prints42_0.pval_blos62</td>
          <td className={css('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.pval_blos62">
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
      <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/">
        FTP Site
      </Link>
    </p>
  </>
);

export default PrintsDownloads;
