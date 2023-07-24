import React from 'react';

import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, ipro);

const PfamDownloads = () => (
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.gz">
              Pfam-A models
            </Link>
          </td>
          <td>
            Pfam-A HMMs in an HMM library searchable with the hmmscan program.
          </td>
          <td className={css('xs-hide')}>Pfam-A.hmm.gz</td>
          <td className={css('xs-hide')}>gzipped</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.gz">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.dat.gz">
              Pfam-A HMM data
            </Link>
          </td>
          <td>Data associated with each HMM required for pfam_scan.pl</td>
          <td className={css('xs-hide')}>Pfam-A.hmm.dat.gz</td>
          <td className={css('xs-hide')}>gzipped</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.dat.gz">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.seed.gz">
              Pfam-A Seed alignment
            </Link>
          </td>
          <td>
            Annotation and seed alignments of all Pfam-A families in Pfam
            format.
          </td>
          <td className={css('xs-hide')}>Pfam-A.seed.gz</td>
          <td className={css('xs-hide')}>gzipped</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.seed.gz">
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
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.full.gz">
              Pfam-A Full alignment
            </Link>
          </td>
          <td>
            Annotation and full alignments of all Pfam-A families in Pfam
            format.
          </td>
          <td className={css('xs-hide')}>Pfam-A.full.gz</td>
          <td className={css('xs-hide')}>gzipped</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.full.gz">
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
      <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/">FTP Site</Link>
    </p>
  </>
);

export default PfamDownloads;
