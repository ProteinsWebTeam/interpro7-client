import React from 'react';
import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, ipro);

const InterProDownloads = () => (
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
          <td>InterPro entry list</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/entry.list">
              text
            </Link>
          </td>
        </tr>
        <tr>
          <td>InterPro entry details</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/interpro.xml.gz">
              xml.gz
            </Link>
            ,{' '}
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/interpro.xml.gz.md5">
              md5
            </Link>
          </td>
        </tr>
        <tr>
          <td>Protein matched complete</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/match_complete.xml.gz">
              xml.gz
            </Link>
            ,{' '}
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/match_complete.xml.gz.md5">
              md5
            </Link>
          </td>
        </tr>
        <tr>
          <td>Uniparc sequences</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/uniparc_match.tar.gz">
              tar.gz
            </Link>
            ,{' '}
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/uniparc_match.tar.gz.md5">
              md5
            </Link>
          </td>
        </tr>
        <tr>
          <td>UniProtKB proteins</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/protein2ipr.dat.gz">
              dat.gz
            </Link>
            ,{' '}
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/protein2ipr.dat.gz.md5">
              md5
            </Link>
          </td>
        </tr>
        <tr>
          <td>Entry relationships tree</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/ParentChildTreeFile.txt">
              txt
            </Link>
          </td>
        </tr>
        <tr>
          <td>List of GO terms</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/interpro2go">
              txt
            </Link>
          </td>
        </tr>
        <tr>
          <td>Latest release note</td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/release_notes.txt">
              txt
            </Link>
          </td>
        </tr>
        <tr>
          <td>
            InterPro-N: matches predicted using a deep learning model developed
            by Google DeepMind
          </td>
          <td>
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/interpro-n.xml.gz">
              xml
            </Link>
            ,{' '}
            <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/releases/latest/interpro-n.xml.gz.md5">
              md5
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
    <p className={css('small', 'margin-top-small')}>
      See all downloads available on the{' '}
      <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/">FTP Site</Link>
    </p>

    <h5>From individual web pages</h5>
    <ul>
      <li>
        A JSON or TSV file containing all entries is available for download from
        the Browse Entry, Browse Protein, Browse Structure, Browse Taxonomy,
        Browse proteome and Browse Set result page
      </li>
    </ul>
  </>
);

export default InterProDownloads;
