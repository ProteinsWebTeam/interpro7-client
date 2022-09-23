// @flow
import React from 'react';

import Link from 'components/generic/Link';
import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

const PfamDownloads = () => (
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.gz">
              Pfam-A models
            </Link>
          </td>
          <td>
            Pfam-A HMMs in an HMM library searchable with the hmmscan program.
          </td>
          <td className={f('xs-hide')}>Pfam-A.hmm.gz</td>
          <td className={f('xs-hide')}>gzipped</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.gz">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.dat.gz">
              Pfam-A HMM data
            </Link>
          </td>
          <td>Data associated with each HMM required for pfam_scan.pl</td>
          <td className={f('xs-hide')}>Pfam-A.hmm.dat.gz</td>
          <td className={f('xs-hide')}>gzipped</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.dat.gz">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.seed.gz">
              Pfam-A Seed alignment
            </Link>
          </td>
          <td>
            Annotation and seed alignments of all Pfam-A families in Pfam
            format.
          </td>
          <td className={f('xs-hide')}>Pfam-A.seed.gz</td>
          <td className={f('xs-hide')}>gzipped</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.seed.gz">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.full.gz">
              Pfam-A Full alignment
            </Link>
          </td>
          <td>
            Annotation and full alignments of all Pfam-A families in Pfam
            format.
          </td>
          <td className={f('xs-hide')}>Pfam-A.full.gz</td>
          <td className={f('xs-hide')}>gzipped</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.full.gz">
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
      <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/">FTP Site</Link>
    </p>
  </>
);

export default PfamDownloads;
