/* eslint-disable no-magic-numbers */
import React, { PureComponent } from 'react';
import loadWebComponent from 'utils/load-web-component';

import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';
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
                The addition of{' '}
                <NumberComponent noTitle noAnimation>
                  {662}
                </NumberComponent>{' '}
                InterPro entries.
              </li>
              <li>An update to SFLD (4).</li>
              <li>
                Integration of{' '}
                <NumberComponent noTitle noAnimation>
                  {886}
                </NumberComponent>{' '}
                new methods from the CATH-Gene3D (
                <NumberComponent noTitle noAnimation>
                  {5}
                </NumberComponent>
                ), CDD (
                <NumberComponent noTitle noAnimation>
                  {17}
                </NumberComponent>
                ), HAMAP (
                <NumberComponent noTitle noAnimation>
                  {1}
                </NumberComponent>
                ), PANTHER (
                <NumberComponent noTitle noAnimation>
                  {689}
                </NumberComponent>
                ), Pfam (
                <NumberComponent noTitle noAnimation>
                  {119}
                </NumberComponent>
                ), PIRSF (
                <NumberComponent noTitle noAnimation>
                  {1}
                </NumberComponent>
                ), PRINTS (
                <NumberComponent noTitle noAnimation>
                  {2}
                </NumberComponent>
                ), ProDom (
                <NumberComponent noTitle noAnimation>
                  {3}
                </NumberComponent>
                ), SFLD (
                <NumberComponent noTitle noAnimation>
                  {22}
                </NumberComponent>
                ) and SMART (
                <NumberComponent noTitle noAnimation>
                  {1}
                </NumberComponent>
                ) databases.
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
                <NumberComponent noTitle>{35020}</NumberComponent> entries
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
                      <NumberComponent noTitle>{21695}</NumberComponent>
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
                      <NumberComponent noTitle>{9268}</NumberComponent>
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
                      <NumberComponent noTitle>{2865}</NumberComponent>
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
                      <NumberComponent noTitle>{280}</NumberComponent>
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
                      <NumberComponent noTitle>{132}</NumberComponent>
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
                      <NumberComponent noTitle>{76}</NumberComponent>
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
                      <NumberComponent noTitle>{687}</NumberComponent>
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
                      <NumberComponent noTitle>{17}</NumberComponent>
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
                      <NumberComponent noTitle>{6119}</NumberComponent>
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
                      <NumberComponent noTitle>{2147}</NumberComponent> (
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
                      <NumberComponent noTitle>{12805}</NumberComponent>
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
                      <NumberComponent noTitle>{2910}</NumberComponent> (
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
                      <NumberComponent noTitle>{2246}</NumberComponent>
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
                      <NumberComponent noTitle>{2245}</NumberComponent> (
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
                      <NumberComponent noTitle>{90742}</NumberComponent>
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
                      <NumberComponent noTitle>{8974}</NumberComponent> (
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
                      <NumberComponent noTitle>{16712}</NumberComponent>
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
                      <NumberComponent noTitle>{16235}</NumberComponent> (
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
                      <NumberComponent noTitle>{3285}</NumberComponent>
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
                      <NumberComponent noTitle>{3223}</NumberComponent> (
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
                      <NumberComponent noTitle>{2106}</NumberComponent>
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
                      <NumberComponent noTitle>{1965}</NumberComponent> (
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
                      <NumberComponent noTitle>{1894}</NumberComponent>
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
                      <NumberComponent noTitle>{1311}</NumberComponent> (
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
                      <NumberComponent noTitle>{1309}</NumberComponent>
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
                      <NumberComponent noTitle>{1287}</NumberComponent> (
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
                      <NumberComponent noTitle>{1210}</NumberComponent>
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
                      <NumberComponent noTitle>{1174}</NumberComponent> (
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
                      <NumberComponent noTitle>{303}</NumberComponent>
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
                      <NumberComponent noTitle>{164}</NumberComponent> (
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
                      <NumberComponent noTitle>{1312}</NumberComponent>
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
                      <NumberComponent noTitle>{1264}</NumberComponent> (
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
                      <NumberComponent noTitle>{2019}</NumberComponent>
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
                      <NumberComponent noTitle>{1601}</NumberComponent> (
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
                      <NumberComponent noTitle>{4488}</NumberComponent>
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
                      <NumberComponent noTitle>{4438}</NumberComponent> (
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
                    <NumberComponent noTitle>{125355233}</NumberComponent>
                  </td>
                  <td>
                    <NumberComponent noTitle>{104705922}</NumberComponent> (
                    {Math.floor((1000 * 104705922) / 125355233) / 10}
                    %)
                  </td>
                  <td>
                    <NumberComponent noTitle>{101460097}</NumberComponent> (
                    {Math.floor((1000 * 101460097) / 125355233) / 10}
                    %)
                  </td>
                </tr>
                <tr>
                  <td>UniProtKB/TrEMBL</td>
                  <td>2018_08</td>
                  <td>
                    <NumberComponent noTitle>{124797108}</NumberComponent>
                  </td>
                  <td>
                    <NumberComponent noTitle>{104163101}</NumberComponent> (
                    {Math.floor((1000 * 104163101) / 124797108) / 10}
                    %)
                  </td>
                  <td>
                    <NumberComponent noTitle>{100920355}</NumberComponent> (
                    {Math.floor((1000 * 100920355) / 124797108) / 10}
                    %)
                  </td>
                </tr>
                <tr>
                  <td>UniProtKB/Swiss-Prot</td>
                  <td>2018_08</td>
                  <td>
                    <NumberComponent noTitle>{558125}</NumberComponent>
                  </td>
                  <td>
                    <NumberComponent noTitle>{542821}</NumberComponent> (
                    {Math.floor((1000 * 542821) / 558125) / 10}
                    %)
                  </td>
                  <td>
                    <NumberComponent noTitle>{539742}</NumberComponent> (
                    {Math.floor((1000 * 539742) / 558125) / 10}
                    %)
                  </td>
                </tr>
              </tbody>
            </table>

            <h3>InterPro2GO</h3>
            <p>
              We have a total number of{' '}
              <NumberComponent noTitle>{34550}</NumberComponent> GO terms mapped
              to InterPro entries.
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
