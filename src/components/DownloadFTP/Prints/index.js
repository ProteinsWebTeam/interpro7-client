// @flow
import React from 'react';

import Link from 'components/generic/Link';
import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

const PrintsDownloads = () => (
  <>
    <table className={f('classic')}>
      <thead>
        <tr>
          <th className={f('min-width-sm')}>Name</th>
          <th>Description</th>
          <th className={f('xs-hide')}>File name</th>
          <th className={f('xs-hide')}>Format</th>
          <th className={f('xs-hide')}>Links</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/FingerPRINTShierarchy21Feb2012">
              Prints hierarchy
            </Link>
          </td>
          <td>Fingerprints hierarchy 21 Feb 2012</td>
          <td className={f('xs-hide')}>FingerPRINTShierarchy21Feb2012</td>
          <td className={f('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/FingerPRINTShierarchy21Feb2012">
              <span
                className={f('icon', 'icon-common', 'font-l')}
                data-icon="&#x3d;"
              />
            </Link>
            <br />
          </td>
        </tr>
        <tr>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.kdat">
              Prints data
            </Link>
          </td>
          <td>Compendium of protein fingerprints</td>
          <td className={f('xs-hide')}>prints42_0.kdat</td>
          <td className={f('xs-hide')}>bin</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.kdat">
              <span
                className={f('icon', 'icon-common', 'font-l')}
                data-icon="&#x3d;"
              />
            </Link>
            <br />
          </td>
        </tr>
        <tr>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.pval_blos62">
              Blos62
            </Link>
          </td>
          <td>Compact version of prints.dat</td>
          <td className={f('xs-hide')}>prints42_0.pval_blos62</td>
          <td className={f('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/42.0/prints42_0.pval_blos62">
              <span
                className={f('icon', 'icon-common', 'font-l')}
                data-icon="&#x3d;"
              />
            </Link>
            <br />
          </td>
        </tr>
      </tbody>
    </table>
    <p className={f('small', 'margin-top-small')}>
      See all downloads available on the{' '}
      <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/prints/">
        FTP Site
      </Link>
    </p>
  </>
);

export default PrintsDownloads;
