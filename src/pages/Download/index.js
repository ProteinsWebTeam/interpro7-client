// @flow
import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet-async';

import Link from 'components/generic/Link';
import { FTPLink } from 'components/ExtLink';
import DownloadTable from 'components/IPScan/DownloadTable';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

class Download extends PureComponent /*:: <{}> */ {
  render() {
    const IS_UNIPARC_READY = true;
    const UniparcLink = IS_UNIPARC_READY ? Link : 'span';
    return (
      <div className={f('row')}>
        <div className={f('columns')}>
          <section>
            <Helmet>
              <title>Download</title>
            </Helmet>
            <h3>
              Download{' '}
              <TooltipAndRTDLink rtdPage="download.html#download-page" />
            </h3>
            <SchemaOrgData
              data={{
                name: 'InterPro Download Page',
                description:
                  'Includes links to pre-generated files for the current version of InterPro',
              }}
              processData={schemaProcessDataPageSection}
            />

            <DownloadTable />
            <h4>InterProScan</h4>

            <p className={f('small', 'margin-top-small')}>
              To ensure you have the latest data and software enhancements we
              always recommend you download the latest version of InterProScan.
              However all previous releases are archived on the{' '}
              <FTPLink href="ftp://ftp.ebi.ac.uk/pub/software/unix/iprscan/5/">
                FTP Site
              </FTPLink>
              . You can find, clone, and download the full InterProScan source
              code on the{' '}
              <Link
                href="//github.com/ebi-pf-team/interproscan"
                className={f('ext')}
                target="_blank"
              >
                Github repository
              </Link>
              .
            </p>
          </section>

          <section>
            <h4>InterPro</h4>
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
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/entry.list">
                      InterPro entry list
                    </Link>
                  </td>
                  <td>
                    TSV file listing basic InterPro entry information - the
                    accessions, types and names.
                  </td>
                  <td className={f('xs-hide')}>entry.list</td>
                  <td className={f('xs-hide')}>TSV</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/entry.list">
                      <span
                        className={f('icon', 'icon-common', 'font-l')}
                        data-icon="&#x3d;"
                      />
                    </Link>{' '}
                    <FTPLink href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/entry.list">
                      FTP
                    </FTPLink>
                  </td>
                </tr>

                <tr>
                  <td>
                    {' '}
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/interpro.xml.gz">
                      InterPro entry details
                    </Link>
                  </td>
                  <td>
                    XML file listing each InterPro entry, the signatures that it
                    contains, its abstract, GO terms, etc. - it contains the
                    equivalent to the Entry pages on the web interface. A{' '}
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/interpro.dtd">
                      DTD file
                    </Link>{' '}
                    exists describing the format.
                  </td>
                  <td className={f('xs-hide')}>interpro.xml.gz</td>
                  <td className={f('xs-hide')}>gzipped</td>
                  <td>
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/interpro.xml.gz">
                      <span
                        className={f('icon', 'icon-common', 'font-l')}
                        data-icon="&#x3d;"
                      />
                    </Link>{' '}
                    <FTPLink href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/interpro.xml.gz">
                      FTP
                    </FTPLink>
                  </td>
                </tr>

                <tr>
                  <td>
                    {' '}
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/match_complete.xml.gz">
                      Protein matched complete
                    </Link>
                  </td>
                  <td>
                    All UniProtKB proteins and the InterPro entries and
                    individual signatures they match, in XML format. Proteins
                    without any matches to InterPro are also included. A{' '}
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/match_complete.dtd">
                      DTD file
                    </Link>{' '}
                    exists describing the format.
                  </td>
                  <td className={f('xs-hide')}>match_complete.xml.gz</td>
                  <td className={f('xs-hide')}>gzipped</td>
                  <td>
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/match_complete.xml.gz">
                      <span
                        className={f('icon', 'icon-common', 'font-l')}
                        data-icon="&#x3d;"
                      />
                    </Link>{' '}
                    <FTPLink href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/match_complete.xml.gz">
                      FTP
                    </FTPLink>
                  </td>
                </tr>

                <tr>
                  <td>
                    <UniparcLink href="https://ftp.ebi.ac.uk/pub/databases/interpro/uniparc_match.tar.gz">
                      Uniparc sequences
                    </UniparcLink>
                  </td>
                  <td>
                    All uniparc (UniProt Archive) sequences and the InterPro
                    entries and individual signatures they match, in XML format.
                    {!IS_UNIPARC_READY && (
                      <div>
                        <br />
                        <b>Note:</b>The Uniparc file is still been generated for
                        this version. We will update this link once is ready.
                      </div>
                    )}
                  </td>
                  <td className={f('xs-hide')}>uniparc_match.tar.gz</td>
                  <td className={f('xs-hide')}>gzipped</td>
                  <td>
                    <UniparcLink href="https://ftp.ebi.ac.uk/pub/databases/interpro/uniparc_match.tar.gz">
                      <span
                        className={f('icon', 'icon-common', 'font-l')}
                        data-icon="&#x3d;"
                      />
                    </UniparcLink>{' '}
                    <FTPLink href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/uniparc_match.xml.gz">
                      FTP
                    </FTPLink>
                  </td>
                </tr>

                <tr>
                  <td>
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/protein2ipr.dat.gz">
                      UniProtKB proteins
                    </Link>
                  </td>
                  <td>
                    All UniProtKB proteins and the InterPro entries and
                    individual signatures they match, in a tab-delimited format.
                  </td>
                  <td className={f('xs-hide')}>protein2ipr.dat.gz</td>
                  <td className={f('xs-hide')}>gzipped</td>
                  <td>
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/protein2ipr.dat.gz">
                      <span
                        className={f('icon', 'icon-common', 'font-l')}
                        data-icon="&#x3d;"
                      />
                    </Link>{' '}
                    <FTPLink href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/protein2ipr.dat.gz">
                      FTP
                    </FTPLink>
                  </td>
                </tr>

                <tr>
                  <td>
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/ParentChildTreeFile.txt">
                      Entry relationships tree
                    </Link>
                  </td>
                  <td>
                    File describing the hierarchy of relationships between
                    InterPro&quot;s entries (i.e. families and their
                    subfamilies) in a simple text-based format.
                  </td>
                  <td className={f('xs-hide')}>ParentChildTreeFile.txt</td>
                  <td className={f('xs-hide')}>TXT</td>
                  <td>
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/ParentChildTreeFile.txt">
                      <span
                        className={f('icon', 'icon-common', 'font-l')}
                        data-icon="&#x3d;"
                      />
                    </Link>{' '}
                    <FTPLink href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/ParentChildTreeFile.txt">
                      FTP
                    </FTPLink>
                  </td>
                </tr>

                <tr>
                  <td>
                    {' '}
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/interpro2go">
                      List of GO terms
                    </Link>
                  </td>
                  <td>
                    Mappings of InterPro entries to Gene Ontology (GO) terms.
                  </td>
                  <td className={f('xs-hide')}>interpro2go</td>
                  <td className={f('xs-hide')}>TXT</td>
                  <td>
                    <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/interpro2go">
                      <span
                        className={f('icon', 'icon-common', 'font-l')}
                        data-icon="&#x3d;"
                      />
                    </Link>{' '}
                    <FTPLink href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/interpro2go">
                      FTP
                    </FTPLink>
                  </td>
                </tr>

                {
                  <tr>
                    <td>
                      <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/release_notes.txt">
                        Latest release note
                      </Link>
                    </td>
                    <td>The current release notes, in text-based format.</td>
                    <td>release_notes.txt</td>
                    <td>TXT</td>
                    <td>
                      <Link href="https://ftp.ebi.ac.uk/pub/databases/interpro/release_notes.txt">
                        <span
                          className={f('icon', 'icon-common', 'font-l')}
                          data-icon="&#x3d;"
                        />
                      </Link>{' '}
                      <FTPLink href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/release_notes.txt">
                        FTP
                      </FTPLink>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

            <p className={f('small', 'margin-top-small')}>
              See all downloads available on the{' '}
              <FTPLink href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/">
                FTP Site
              </FTPLink>
            </p>

            <h5>From individual web pages</h5>
            <ul>
              <li>
                A JSON or TSV file containing all entries is available for
                download from the Browse Entry, Browse Protein, Browse
                Structure, Browse Taxonomy, Browse proteome and Browse Set
                result page
              </li>
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

export default Download;
