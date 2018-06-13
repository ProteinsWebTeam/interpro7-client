import React, { PureComponent } from 'react';
import loadWebComponent from 'utils/load-web-component';

import Link from 'components/generic/Link';
import { NumberComponent } from 'components/NumberLabel';
import MemberSymbol from 'components/Entry/MemberSymbol';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiGlobalStyles, fonts, local, ipro);

class Release_notes extends PureComponent /*:: <{}> */ {
  componentDidMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }
  render() {
    return (
      <div className={f('row')}>
        <div className={f('columns', 'release')}>
          <section>
            <h3>Release notes</h3>
            <p>This page records all release notes, most recent first.</p>
            <hr />
            <div
              className={f(
                'flex-box',
                'margin-bottom-xlarge',
                'margin-top-large',
              )}
            >
              <h3>
                InterPro 68.0 <small> &bull; 26th April 2018</small>
              </h3>
            </div>

            <p>Features include:</p>

            <ul>
              <li>The addition of 240 InterPro entries.</li>
              <li>
                An update to HAMAP (2018_03), PROSITE patterns (2018_02) and
                PROSITE profiles (2018_02).
              </li>
              <li>
                Integration of 381 new methods from the CATH-Gene3D (2), CDD
                (17), HAMAP (29), PANTHER (298), Pfam (16), ProDom (1), PROSITE
                profiles (16) and SUPERFAMILY (2) databases.
              </li>
            </ul>

            <h4>Contents and coverage</h4>
            <p className={f('margin-bottom-small')}>
              InterPro protein matches are now calculated for all UniProtKB and
              UniParc proteins. InterPro release 68.0 contains{' '}
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: 'InterPro' },
                  },
                }}
              >
                <NumberComponent value={33947} />
                entries
              </Link>, representing:
            </p>

            <table className={f('light', 'small', 'margin-bottom-xlarge')}>
              <thead>
                {' '}
                <tr>
                  <th />
                  <th>type</th>
                  <th className={f('text-right')}>Total entries</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="Family"
                      aria-label="Entry type"
                    />
                  </td>
                  <td>Family</td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro' },
                        },
                        search: { type: 'family' },
                      }}
                    >
                      <NumberComponent value={20795} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="Domain"
                      aria-label="Entry type"
                    />
                  </td>
                  <td>Domain</td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro' },
                        },
                        search: { type: 'domain' },
                      }}
                    >
                      <NumberComponent value={9099} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="homologous superfamily"
                      aria-label="Entry type"
                    />
                  </td>
                  <td>Homologous superfamily</td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro' },
                        },
                        search: { type: 'homologous_superfamily' },
                      }}
                    >
                      <NumberComponent value={2862} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="repeat"
                      aria-label="Entry type"
                    />
                  </td>
                  <td>Repeat</td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro' },
                        },
                        search: { type: 'repeat' },
                      }}
                    >
                      <NumberComponent value={276} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="site"
                      aria-label="Entry type"
                    />
                  </td>
                  <td>Active site</td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro' },
                        },
                        search: { type: 'active_site' },
                      }}
                    >
                      <NumberComponent value={132} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="site"
                      aria-label="Entry type"
                    />
                  </td>
                  <td>Binding site</td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro' },
                        },
                        search: { type: 'binding_site' },
                      }}
                    >
                      <NumberComponent value={76} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="site"
                      aria-label="Entry type"
                    />
                  </td>
                  <td>Conserved site</td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro' },
                        },
                        search: { type: 'conserved_site' },
                      }}
                    >
                      <NumberComponent value={687} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="PTM"
                      aria-label="Entry type"
                    />
                  </td>
                  <td>PTM</td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'InterPro' },
                        },
                        search: { type: 'ptm' },
                      }}
                    >
                      <NumberComponent value={17} />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            <h4>Member database information</h4>

            <table className={f('light')}>
              <thead>
                <tr>
                  <th />
                  <th>Signature database</th>
                  <th className={f('text-center')}>Version</th>
                  <th className={f('text-right')}>Signatures*</th>
                  <th className={f('text-right')}>Integrated signatures**</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol
                      type={'cathgene3d'}
                      className={f('md-small')}
                    />
                  </td>
                  <td>CATH-Gene3D</td>
                  <td className={f('text-center')}>4.2.0</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('no-underline')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'cathgene3d' },
                        },
                      }}
                    >
                      <NumberComponent value={6119} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('no-underline')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'cathgene3d',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={2140} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'cdd'} className={f('md-small')} />
                  </td>
                  <td>CDD</td>
                  <td className={f('text-center')}>3.16</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('no-underline')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'cdd' },
                        },
                      }}
                    >
                      <NumberComponent value={12805} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'cdd',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={2790} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'hamap'} className={f('md-small')} />
                  </td>
                  <td>HAMAP</td>
                  <td className={f('text-center')}>2018_03</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'hamap' },
                        },
                      }}
                    >
                      <NumberComponent value={2246} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'hamap',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={2244} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'panther'} className={f('md-small')} />
                  </td>
                  <td>PANTHER</td>
                  <td className={f('text-center')}>12.0</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'panther' },
                        },
                      }}
                    >
                      <NumberComponent value={90742} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'panther',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={7868} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'pfam'} className={f('md-small')} />
                  </td>
                  <td>Pfam</td>
                  <td className={f('text-center')}>31.0</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'Pfam' },
                        },
                      }}
                    >
                      <NumberComponent value={16712} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'Pfam',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={16114} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'pirsf'} className={f('md-small')} />
                  </td>
                  <td>PIRSF</td>
                  <td className={f('text-center')}>3.02</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'pirsf' },
                        },
                      }}
                    >
                      <NumberComponent value={3285} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'pirsf',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={3223} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'prints'} className={f('md-small')} />
                  </td>
                  <td>PRINTS</td>
                  <td className={f('text-center')}>42.0</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'prints' },
                        },
                      }}
                    >
                      <NumberComponent value={2106} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'prints',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={1968} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'prodom'} className={f('md-small')} />
                  </td>
                  <td>ProDom</td>
                  <td className={f('text-center')}>2006.1</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'prodom' },
                        },
                      }}
                    >
                      <NumberComponent value={1894} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'prodom',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={1307} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'prosite'} className={f('md-small')} />
                  </td>
                  <td>PROSITE patterns</td>
                  <td className={f('text-center')}>2018_02</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'prosite' },
                        },
                      }}
                    >
                      <NumberComponent value={1309} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'prosite',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={1288} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'profile'} className={f('md-small')} />
                  </td>
                  <td>PROSITE profiles</td>
                  <td className={f('text-center')}>2018_02</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'profile' },
                        },
                      }}
                    >
                      <NumberComponent value={1210} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'profile',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={1176} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'sfld'} className={f('md-small')} />
                  </td>
                  <td>SFLD</td>
                  <td className={f('text-center')}>3</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'sfld' },
                        },
                      }}
                    >
                      <NumberComponent value={303} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'sfld',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={147} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'smart'} className={f('md-small')} />
                  </td>
                  <td>SMART</td>
                  <td className={f('text-center')}>7.1</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'smart' },
                        },
                      }}
                    >
                      <NumberComponent value={1312} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'smart',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={1263} />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'ssf'} className={f('md-small')} />
                  </td>
                  <td>SUPERFAMILY</td>
                  <td className={f('text-center')}>1.75</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'ssf' },
                        },
                      }}
                    >
                      <NumberComponent value={2019} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'ssf',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={1601} />
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'tigrfams'} className={f('md-small')} />
                  </td>
                  <td>TIGRFAMs</td>
                  <td className={f('text-center')}>15.0</td>
                  <td className={f('text-right')}>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: 'tigrfams' },
                        },
                      }}
                    >
                      <NumberComponent value={4488} />
                    </Link>
                  </td>
                  <td className={f('text-right')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            integration: 'integrated',
                            db: 'tigrfams',
                          },
                        },
                      }}
                    >
                      <NumberComponent value={4445} />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            <p className={f('small', 'margin-top-small')}>
              * Some signatures may not have matches to UniProtKB proteins.<br />
              ** Not all signatures of a member database may be integrated at
              the time of an InterPro release
            </p>
            <p className={f('small', 'margin-top-small')}>
              We use{' '}
              <Link
                href="http://protein.bio.unipd.it/mobidblite/"
                className={f('ext')}
                target="_blank"
              >
                MobiDB-lite
              </Link>, a derivative of the
              <Link
                href="http://mobidb.bio.unipd.it/"
                className={f('ext')}
                target="_blank"
              >
                MobiDB
              </Link>{' '}
              database, to provide consensus annotation of long-range intrinsic
              disorder in protein sequences. Read more about MobiDB-lite in{' '}
              <i>Bioinformatics</i>, 33(9), 2017, 1402–1404, (<Link
                href="https://doi.org/10.1093/bioinformatics/btx015"
                className={f('ext')}
                target="_blank"
              >
                doi: 10.1093/bioinformatics/btx015
              </Link>).
            </p>

            <table className={f('light')}>
              <thead>
                <tr>
                  <th>Sequence database</th>
                  <th>Version</th>
                  <th>Count</th>
                  <th colSpan="2">Count of proteins matching</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td />
                  <td />
                  <td />
                  <td>
                    <strong>any signature</strong>
                  </td>
                  <td>
                    <strong>integrated signatures</strong>
                  </td>
                </tr>
                <tr>
                  <td>UniProtKB</td>
                  <td>2018_04</td>
                  <td>115316915</td>
                  <td>101076817 (87.7%)</td>
                  <td>93075570 (80.7%)</td>
                </tr>
                <tr>
                  <td>UniProtKB/TrEMBL</td>
                  <td>2018_04</td>
                  <td>114759640</td>
                  <td>100531651 (87.6%)</td>
                  <td>92537241 (80.6%)</td>
                </tr>
                <tr>
                  <td>UniProtKB/Swiss-Prot</td>
                  <td>2018_04</td>
                  <td>557275</td>
                  <td>545166 (97.8%)</td>
                  <td>538329 (96.6%)</td>
                </tr>
              </tbody>
            </table>

            <h3>InterPro2GO</h3>
            <p>
              We have a total number of 33944 GO terms mapped to InterPro
              entries.
            </p>

            <p>
              <Link href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/interpro2go">
                List of InterPro2GO mappings
              </Link>. These are also available through the EBI GO browser{' '}
              <Link
                href="http://www.ebi.ac.uk/QuickGO/"
                className={f('ext')}
                target="_blank"
              >
                QuickGO
              </Link>
            </p>
          </section>
        </div>
      </div>
    );
  }
}

export default Release_notes;
