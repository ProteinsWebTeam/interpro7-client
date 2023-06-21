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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld.hmm">
              SFLD models
            </Link>
          </td>
          <td>HMMs for SFLD</td>
          <td className={css('xs-hide')}>sfld.hmm</td>
          <td className={css('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld.hmm">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_hierarchy_flat.txt">
              SFLD hierarchy
            </Link>
          </td>
          <td className={css('xs-hide')}>SFLD hierarchy</td>
          <td>sfld_hierarchy_flat.txt</td>
          <td className={css('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_hierarchy_flat.txt">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_sites.annot">
              Sites annotations
            </Link>
          </td>
          <td>MSA feature annotation file</td>
          <td className={css('xs-hide')}>sfld_sites.annot</td>
          <td className={css('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_sites.annot">
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
      <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/">
        FTP Site
      </Link>
    </p>
  </>
);

export default SFLDDownloads;
