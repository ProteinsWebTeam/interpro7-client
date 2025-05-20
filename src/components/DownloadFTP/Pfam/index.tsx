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
          <th>Resource</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Pfam-A models</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.gz">
              gzipped
            </Link>
          </td>
        </tr>
        <tr>
          <td>Pfam-A HMM data</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.hmm.dat.gz">
              gzipped
            </Link>
          </td>
        </tr>
        <tr>
          <td>Pfam-A Seed alignment</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.seed.gz">
              gzipped
            </Link>
          </td>
        </tr>
        <tr>
          <td>Pfam-A Full alignment</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/Pfam-A.full.gz">
              gzipped
            </Link>
          </td>
        </tr>
        <tr>
          <td>Checksums</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/md5_checksums">
              md5
            </Link>
          </td>
        </tr>
        <tr>
          <td>Release Notes</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/Pfam/current_release/relnotes.txt">
              txt
            </Link>
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
