// @flow
import React from 'react';

import Link from 'components/generic/Link';
import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

const SFLDDownloads = () => (
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld.hmm">
              SFLD models
            </Link>
          </td>
          <td>HMMs for SFLD</td>
          <td className={f('xs-hide')}>sfld.hmm</td>
          <td className={f('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld.hmm">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_hierarchy_flat.txt">
              SFLD hierarchy
            </Link>
          </td>
          <td className={f('xs-hide')}>SFLD hierarchy</td>
          <td>sfld_hierarchy_flat.txt</td>
          <td className={f('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_hierarchy_flat.txt">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_sites.annot">
              Sites annotations
            </Link>
          </td>
          <td>MSA feature annotation file</td>
          <td className={f('xs-hide')}>sfld_sites.annot</td>
          <td className={f('xs-hide')}>text</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/4/sfld_sites.annot">
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
      <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/databases/sfld/">
        FTP Site
      </Link>
    </p>
  </>
);

export default SFLDDownloads;
