/* eslint-disable no-magic-numbers */
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

class ReleaseNotes extends PureComponent /*:: <{}> */ {
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
                InterPro 70.0{' '}
                <small>
                  • <time dateTime="2018-09-13">13th September 2018</time>
                </small>
              </h3>
            </div>

            <p>Features include:</p>

            <ul>
              <li>
                The addition of <NumberComponent duration={0} value={662} />{' '}
                InterPro entries.
              </li>
              <li>An update to SFLD (4).</li>
              <li>
                Integration of <NumberComponent duration={0} value={886} /> new
                methods from the CATH-Gene3D (
                <NumberComponent duration={0} value={5} />
                ), CDD (<NumberComponent duration={0} value={17} />
                ), HAMAP (<NumberComponent duration={0} value={1} />
                ), PANTHER (<NumberComponent duration={0} value={689} />
                ), Pfam (<NumberComponent duration={0} value={119} />
                ), PIRSF (<NumberComponent duration={0} value={1} />
                ), PRINTS (<NumberComponent duration={0} value={2} />
                ), ProDom (<NumberComponent duration={0} value={3} />
                ), SFLD (<NumberComponent duration={0} value={22} />) and SMART
                (<NumberComponent duration={0} value={1} />) databases.
              </li>
            </ul>

            <h4>Contents and coverage</h4>
            <p className={f('margin-bottom-small')}>
              InterPro protein matches are now calculated for all UniProtKB and
              UniParc proteins. InterPro release 70.0 contains{' '}
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: 'InterPro' },
                  },
                }}
              >
                <NumberComponent value={35020} /> entries
              </Link>
              , representing:
            </p>

            <table className={f('light', 'small', 'margin-bottom-xlarge')}>
              <thead>
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
                    >
                      {
                        // IE11 fallback for icons
                      }
                      <span className={f('icon-type', 'icon-family')}>F</span>
                    </interpro-type>
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
                      <NumberComponent value={21695} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="Domain"
                      aria-label="Entry type"
                    >
                      <span className={f('icon-type', 'icon-domain')}>D</span>
                    </interpro-type>
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
                      <NumberComponent value={9268} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="homologous superfamily"
                      aria-label="Entry type"
                    >
                      <span className={f('icon-type', 'icon-hh')}>H</span>
                    </interpro-type>
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
                      <NumberComponent value={2865} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="repeat"
                      aria-label="Entry type"
                    >
                      <span className={f('icon-type', 'icon-repeat')}>R</span>
                    </interpro-type>
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
                      <NumberComponent value={280} />
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td>
                    <interpro-type
                      dimension="2em"
                      type="site"
                      aria-label="Entry type"
                    >
                      <span className={f('icon-type', 'icon-site')}>S</span>
                    </interpro-type>
                  </td>
                  <td>Site</td>
                  <td />
                </tr>

                <tr>
                  <td />
                  <td>╰ Active site</td>
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
                  <td />
                  <td>╰ Binding site</td>
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
                  <td />
                  <td>╰ Conserved site</td>
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
                  <td />
                  <td>
                    ╰ <abbr title="post-translational modification">PTM</abbr>
                  </td>
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
                      <NumberComponent value={2147} /> (
                      {Math.floor((1000 * 2147) / 6119) / 10}
                      %)
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
                      <NumberComponent value={2910} /> (
                      {Math.floor((1000 * 2910) / 12805) / 10}
                      %)
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
                      <NumberComponent value={2245} /> (
                      {Math.floor((1000 * 2245) / 2246) / 10}
                      %)
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
                      <NumberComponent value={8974} /> (
                      {Math.floor((1000 * 8974) / 90742) / 10}
                      %)
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
                      <NumberComponent value={16235} /> (
                      {Math.floor((1000 * 16235) / 16712) / 10}
                      %)
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
                      <NumberComponent value={3223} /> (
                      {Math.floor((1000 * 3223) / 3285) / 10}
                      %)
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
                      <NumberComponent value={1965} /> (
                      {Math.floor((1000 * 1965) / 2106) / 10}
                      %)
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
                      <NumberComponent value={1311} /> (
                      {Math.floor((1000 * 1311) / 1894) / 10}
                      %)
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
                      <NumberComponent value={1287} /> (
                      {Math.floor((1000 * 1287) / 1309) / 10}
                      %)
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
                      <NumberComponent value={1174} /> (
                      {Math.floor((1000 * 1174) / 1210) / 10}
                      %)
                    </Link>
                  </td>
                </tr>

                <tr>
                  <td className={f('no-lineheight')}>
                    <MemberSymbol type={'sfld'} className={f('md-small')} />
                  </td>
                  <td>SFLD</td>
                  <td className={f('text-center')}>4</td>
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
                      <NumberComponent value={164} /> (
                      {Math.floor((1000 * 164) / 303) / 10}
                      %)
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
                      <NumberComponent value={1264} /> (
                      {Math.floor((1000 * 1264) / 1312) / 10}
                      %)
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
                      <NumberComponent value={1601} /> (
                      {Math.floor((1000 * 1601) / 2019) / 10}
                      %)
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
                      <NumberComponent value={4438} /> (
                      {Math.floor((1000 * 4438) / 4488) / 10}
                      %)
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            <p className={f('small', 'margin-top-small')}>
              * Some signatures may not have matches to UniProtKB proteins.
              <br />
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
              </Link>
              , a derivative of the
              <Link
                href="http://mobidb.bio.unipd.it/"
                className={f('ext')}
                target="_blank"
              >
                MobiDB
              </Link>{' '}
              database, to provide consensus annotation of long-range intrinsic
              disorder in protein sequences. Read more about MobiDB-lite in{' '}
              <i>Bioinformatics</i>, 33(9), 2017, 1402–1404, (
              <Link
                href="https://doi.org/10.1093/bioinformatics/btx015"
                className={f('ext')}
                target="_blank"
              >
                doi: 10.1093/bioinformatics/btx015
              </Link>
              ).
            </p>

            <table className={f('light')}>
              <thead>
                <tr>
                  <th rowSpan="2">Sequence database</th>
                  <th rowSpan="2">Version</th>
                  <th rowSpan="2">Count</th>
                  <th colSpan="2">Count of proteins matching</th>
                </tr>
                <tr>
                  <td>
                    <strong>any signature</strong>
                  </td>
                  <td>
                    <strong>integrated signatures</strong>
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>UniProtKB</td>
                  <td>2018_08</td>
                  <td>
                    <NumberComponent value={125355233} />
                  </td>
                  <td>
                    <NumberComponent value={104705922} /> (
                    {Math.floor((1000 * 104705922) / 125355233) / 10}
                    %)
                  </td>
                  <td>
                    <NumberComponent value={101460097} /> (
                    {Math.floor((1000 * 101460097) / 125355233) / 10}
                    %)
                  </td>
                </tr>
                <tr>
                  <td>UniProtKB/TrEMBL</td>
                  <td>2018_08</td>
                  <td>
                    <NumberComponent value={124797108} />
                  </td>
                  <td>
                    <NumberComponent value={104163101} /> (
                    {Math.floor((1000 * 104163101) / 124797108) / 10}
                    %)
                  </td>
                  <td>
                    <NumberComponent value={100920355} /> (
                    {Math.floor((1000 * 100920355) / 124797108) / 10}
                    %)
                  </td>
                </tr>
                <tr>
                  <td>UniProtKB/Swiss-Prot</td>
                  <td>2018_08</td>
                  <td>
                    <NumberComponent value={558125} />
                  </td>
                  <td>
                    <NumberComponent value={542821} /> (
                    {Math.floor((1000 * 542821) / 558125) / 10}
                    %)
                  </td>
                  <td>
                    <NumberComponent value={539742} /> (
                    {Math.floor((1000 * 539742) / 558125) / 10}
                    %)
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>InterPro2GO</h3>
            <p>
              We have a total number of <NumberComponent value={34550} /> GO
              terms mapped to InterPro entries.
            </p>

            <p>
              <Link href="ftp://ftp.ebi.ac.uk/pub/databases/interpro/interpro2go">
                List of InterPro2GO mappings
              </Link>
              . These are also available through the EBI GO browser{' '}
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

export default ReleaseNotes;
