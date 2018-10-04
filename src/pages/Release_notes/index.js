/* eslint-disable no-magic-numbers */
import React, { PureComponent } from 'react';
import loadWebComponent from 'utils/load-web-component';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';
import MemberSymbol from 'components/Entry/MemberSymbol';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';
import Loading from 'components/SimpleCommonComponents/Loading';
import { formatISODate } from 'utils/date';

const f = foundationPartial(ebiGlobalStyles, fonts, local, ipro);

const StatsPerType = ({ iconType, label, type, count, child = false }) => (
  <tr>
    <td>
      {iconType && (
        <interpro-type dimension="2em" type={iconType} aria-label="Entry type">
          {
            // IE11 fallback for icons
          }
          <span className={f('icon-type', `icon-${iconType}`)}>{label[0]}</span>
        </interpro-type>
      )}
    </td>
    <td>
      {child && <span className={f('ico-rel')} />}
      {label}
    </td>
    {count && (
      <td className={f('text-right')}>
        <Link
          to={{
            description: {
              main: { key: 'entry' },
              entry: { db: 'InterPro' },
            },
            search: { type: type },
          }}
        >
          <NumberComponent noTitle>{count}</NumberComponent>
        </Link>
      </td>
    )}
  </tr>
);
StatsPerType.propTypes = {
  iconType: T.string,
  label: T.string.isRequired,
  type: T.string.isRequired,
  count: T.number,
  child: T.bool,
};

class ReleaseNotes extends PureComponent /*:: <{}> */ {
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        version: T.string.isRequired,
        release_date: T.string.isRequired,
        content: T.object.isRequired,
      }),
      loading: T.bool.isRequired,
    }).isRequired,
  };
  componentDidMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }
  render() {
    if (!this.props.data || this.props.data.loading) {
      return <Loading />;
    }
    const { version, release_date: date, content } = this.props.data.payload;
    const totalIpro = content.interpro.types.reduce(
      (agg, v) => agg + v.count,
      0,
    );
    const newIpro = 1; // TODO: Take this value from the release notes.
    const updates = []; // TODO: Take this value from the release notes.
    const perType = content.interpro.types.reduce((agg, v) => {
      agg[v.type] = v.count;
      return agg;
    }, {});
    const perMemberDB = content.member_databases.reduce((agg, v) => {
      agg[v.name] = {
        ...v,
        new: Math.floor(Math.random() * 100),
      };
      return agg;
    }, {});
    delete perMemberDB['MobiDB Lite'];

    const totalNewMethod = Object.values(perMemberDB).reduce(
      (agg, v) => agg + v.new,
      0,
    );
    const types = [
      { label: 'Family', key: 'family' },
      { label: 'Domain', key: 'domain' },
      { label: 'Homologous Superfamily', key: 'homologous_superfamily' },
      { label: 'Repeat', key: 'repeat' },
      {
        label: 'Site',
        key: 'site',
        children: [
          { label: 'Active Site', key: 'active_site' },
          { label: 'Binding Site', key: 'binding_site' },
          { label: 'Conserved Site', key: 'conserved_site' },
          { label: 'PTM', key: 'ptm' },
        ],
      },
    ];
    const dbMap = new Map([
      ['PROSITE patterns', 'prosite'],
      ['PROSITE profiles', 'profile'],
      ['SUPERFAMILY', 'ssf'],
    ]);
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
                InterPro {version}{' '}
                <small>
                  • <time dateTime={date}>{formatISODate(date)}</time>
                </small>
              </h3>
            </div>

            <p>Features include:</p>

            <ul>
              <li>
                The addition of{' '}
                <NumberComponent noTitle noAnimation>
                  {newIpro}
                </NumberComponent>{' '}
                InterPro entries.
              </li>
              {updates &&
                !!updates.length && (
                  <li>
                    An update to{' '}
                    {updates.map(([db, count]) => (
                      <span key={db}>
                        {db} ({count})
                      </span>
                    ))}
                    .
                  </li>
                )}
              <li>
                Integration of{' '}
                <NumberComponent noTitle noAnimation>
                  {totalNewMethod}
                </NumberComponent>{' '}
                new methods from the
                {Object.entries(perMemberDB).map(([name, db], i) => (
                  <React.Fragment key={name}>
                    {i === 0 ? ' ' : ', '}
                    {name} (
                    <NumberComponent noTitle noAnimation>
                      {db.new}
                    </NumberComponent>
                    )
                  </React.Fragment>
                ))}{' '}
                databases.
              </li>
            </ul>

            <h4>Contents and coverage</h4>
            <p className={f('margin-bottom-small')}>
              InterPro protein matches are now calculated for all UniProtKB and
              UniParc proteins. InterPro release {version} contains{' '}
              <Link
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: 'InterPro' },
                  },
                }}
              >
                <NumberComponent noTitle>{totalIpro}</NumberComponent> entries
              </Link>
              , representing:
            </p>

            <table
              className={f(
                'light',
                'small',
                'margin-top-large',
                'margin-bottom-xlarge',
              )}
            >
              <tbody>
                {types.map(({ label, key, children }) => {
                  const type = label.toLowerCase();
                  return (
                    <React.Fragment key={key}>
                      <StatsPerType
                        label={label}
                        iconType={type}
                        type={key}
                        count={perType[key]}
                      />
                      {children &&
                        children.map(child => (
                          <StatsPerType
                            label={child.label}
                            key={child.key}
                            type={child.key}
                            count={perType[child.key]}
                            child={true}
                          />
                        ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            <h4>Member database information</h4>

            <table className={f('light', 'margin-top-large')}>
              <thead>
                <tr>
                  <th />
                  <th>Signature database</th>
                  <th className={f('text-center')}>Version</th>
                  <th className={f('text-right')}>
                    Signatures{' '}
                    <Tooltip title="Some signatures may not have matches to UniProtKB proteins">
                      <span
                        className={f('small', 'icon', 'icon-common')}
                        data-icon="&#xf129;"
                        aria-label="Some signatures may not have matches to UniProtKB proteins"
                      />
                    </Tooltip>
                  </th>
                  <th className={f('text-right')}>
                    Integrated signatures{' '}
                    <Tooltip title="Not all signatures of a member database may be integrated at the time of an InterPro release">
                      <span
                        className={f('small', 'icon', 'icon-common')}
                        data-icon="&#xf129;"
                        aria-label="Not all signatures of a member database may be integrated at the time of an InterPro release"
                      />
                    </Tooltip>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.values(perMemberDB).map(
                  ({ name, version, integrated, count }) => {
                    const db =
                      dbMap.get(name) || name.toLowerCase().replace('-', '');
                    return (
                      <tr key={name}>
                        <td className={f('no-lineheight')}>
                          <MemberSymbol type={db} className={f('md-small')} />
                        </td>
                        <td>{name}</td>
                        <td className={f('text-center')}>{version}</td>
                        <td className={f('text-right')}>
                          <Link
                            className={f('no-underline')}
                            to={{
                              description: {
                                main: { key: 'entry' },
                                entry: { db: db },
                              },
                            }}
                          >
                            <NumberComponent noTitle>{count}</NumberComponent>
                          </Link>
                        </td>
                        <td className={f('text-right')}>
                          <Link
                            className={f('no-underline')}
                            to={{
                              description: {
                                main: { key: 'entry' },
                                entry: {
                                  db: db,
                                  integration: 'integrated',
                                },
                              },
                            }}
                          >
                            <NumberComponent noTitle>
                              {integrated}
                            </NumberComponent>{' '}
                            <small>
                              ({(integrated / count).toFixed(1)}
                              %)
                            </small>
                          </Link>
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>

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

            <table className={f('light', 'margin-top-large')}>
              <thead>
                <tr>
                  <th>Sequence database</th>
                  <th>Version</th>
                  <th>Count</th>
                  <th colSpan="2" className={f('text-center')}>
                    Count of proteins matching
                  </th>
                </tr>
                <tr>
                  <td colSpan="3" />
                  <td>Any signature</td>
                  <td>Integrated signatures</td>
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
                    <NumberComponent noTitle>{104705922}</NumberComponent>{' '}
                    <small>
                      ({Math.floor((1000 * 104705922) / 125355233) / 10}
                      %)
                    </small>
                  </td>
                  <td>
                    <NumberComponent noTitle>{101460097}</NumberComponent>{' '}
                    <small>
                      ({Math.floor((1000 * 101460097) / 125355233) / 10}
                      %)
                    </small>
                  </td>
                </tr>
                <tr>
                  <td>UniProtKB/TrEMBL</td>
                  <td>2018_08</td>
                  <td>
                    <NumberComponent noTitle>{124797108}</NumberComponent>
                  </td>
                  <td>
                    <NumberComponent noTitle>{104163101}</NumberComponent>{' '}
                    <small>
                      ({Math.floor((1000 * 104163101) / 124797108) / 10}
                      %)
                    </small>
                  </td>
                  <td>
                    <NumberComponent noTitle>{100920355}</NumberComponent>{' '}
                    <small>
                      ({Math.floor((1000 * 100920355) / 124797108) / 10}
                      %)
                    </small>
                  </td>
                </tr>
                <tr>
                  <td>UniProtKB/Swiss-Prot</td>
                  <td>2018_08</td>
                  <td>
                    <NumberComponent noTitle>{558125}</NumberComponent>
                  </td>
                  <td>
                    <NumberComponent noTitle>{542821}</NumberComponent>{' '}
                    <small>
                      ({Math.floor((1000 * 542821) / 558125) / 10}
                      %)
                    </small>
                  </td>
                  <td>
                    <NumberComponent noTitle>{539742}</NumberComponent>{' '}
                    <small>
                      ({Math.floor((1000 * 539742) / 558125) / 10}
                      %)
                    </small>
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
const getReleaseNotesUrl = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    cleanUpMultipleSlashes(
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}/utils/release/current`,
      }),
    ),
);

export default loadData(getReleaseNotesUrl)(ReleaseNotes);
