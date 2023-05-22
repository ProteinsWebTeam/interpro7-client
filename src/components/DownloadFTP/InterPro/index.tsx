import React from 'react';

import Link from 'components/generic/Link';
import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts, ipro);

const InterProDownloads = () => {
  return (
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
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/entry.list">
                InterPro entry list
              </Link>
            </td>
            <td>
              TSV file listing basic InterPro entry information - the
              accessions, types and names.
            </td>
            <td className={css('xs-hide')}>entry.list</td>
            <td className={css('xs-hide')}>TSV</td>
            <td style={{ whiteSpace: 'nowrap' }}>
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/entry.list">
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
              {' '}
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/interpro.xml.gz">
                InterPro entry details
              </Link>
            </td>
            <td>
              XML file listing each InterPro entry, the signatures that it
              contains, its abstract, GO terms, etc. - it contains the
              equivalent to the Entry pages on the web interface. A{' '}
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/interpro.dtd">
                DTD file
              </Link>{' '}
              exists describing the format.
            </td>
            <td className={css('xs-hide')}>interpro.xml.gz</td>
            <td className={css('xs-hide')}>gzipped</td>
            <td>
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/interpro.xml.gz">
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
              {' '}
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/match_complete.xml.gz">
                Protein matched complete
              </Link>
            </td>
            <td>
              All UniProtKB proteins and the InterPro entries and individual
              signatures they match, in XML format. Proteins without any matches
              to InterPro are also included. A{' '}
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/match_complete.dtd">
                DTD file
              </Link>{' '}
              exists describing the format.
            </td>
            <td className={css('xs-hide')}>match_complete.xml.gz</td>
            <td className={css('xs-hide')}>gzipped</td>
            <td>
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/match_complete.xml.gz">
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
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/uniparc_match.tar.gz">
                Uniparc sequences
              </Link>
            </td>
            <td>
              All uniparc (UniProt Archive) sequences and the InterPro entries
              and individual signatures they match, in XML format.
            </td>
            <td className={css('xs-hide')}>uniparc_match.tar.gz</td>
            <td className={css('xs-hide')}>gzipped</td>
            <td>
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/uniparc_match.tar.gz">
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
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/protein2ipr.dat.gz">
                UniProtKB proteins
              </Link>
            </td>
            <td>
              All UniProtKB proteins and the InterPro entries and individual
              signatures they match, in a tab-delimited format.
            </td>
            <td className={css('xs-hide')}>protein2ipr.dat.gz</td>
            <td className={css('xs-hide')}>gzipped</td>
            <td>
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/protein2ipr.dat.gz">
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
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/ParentChildTreeFile.txt">
                Entry relationships tree
              </Link>
            </td>
            <td>
              File describing the hierarchy of relationships between
              InterPro&quot;s entries (i.e. families and their subfamilies) in a
              simple text-based format.
            </td>
            <td className={css('xs-hide')}>ParentChildTreeFile.txt</td>
            <td className={css('xs-hide')}>TXT</td>
            <td>
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/ParentChildTreeFile.txt">
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
              {' '}
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/interpro2go">
                List of GO terms
              </Link>
            </td>
            <td>Mappings of InterPro entries to Gene Ontology (GO) terms.</td>
            <td className={css('xs-hide')}>interpro2go</td>
            <td className={css('xs-hide')}>TXT</td>
            <td>
              <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/interpro2go">
                <span
                  className={css('icon', 'icon-common', 'font-l')}
                  data-icon="&#x3d;"
                />
              </Link>
              <br />
            </td>
          </tr>

          {
            <tr>
              <td>
                <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/release_notes.txt">
                  Latest release note
                </Link>
              </td>
              <td>The current release notes, in text-based format.</td>
              <td>release_notes.txt</td>
              <td>TXT</td>
              <td>
                <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/current_release/release_notes.txt">
                  <span
                    className={css('icon', 'icon-common', 'font-l')}
                    data-icon="&#x3d;"
                  />
                </Link>
                <br />
              </td>
            </tr>
          }
        </tbody>
      </table>

      <p className={css('small', 'margin-top-small')}>
        See all downloads available on the{' '}
        <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/">
          FTP Site
        </Link>
      </p>

      <h5>From individual web pages</h5>
      <ul>
        <li>
          A JSON or TSV file containing all entries is available for download
          from the Browse Entry, Browse Protein, Browse Structure, Browse
          Taxonomy, Browse proteome and Browse Set result page
        </li>
      </ul>
    </>
  );
};

export default InterProDownloads;
