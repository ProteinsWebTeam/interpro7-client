/* eslint-disable no-magic-numbers */
import React, { PureComponent } from 'react';
import loadWebComponent from 'utils/load-web-component';
import T from 'prop-types';
import { connect } from 'react-redux';
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

const ReleaseNotesSelectorWithData = ({
  data: { loading, payload },
  current,
}) => {
  if (loading || !payload) return <Loading />;
  return (
    <ul className={f('release-selector')}>
      {Object.entries(payload).map(([version, date]) => (
        <li key={version} className={f({ current: version === current })}>
          <Link
            to={{
              description: {
                other: ['release_notes', version],
              },
            }}
            disabled={version === current}
          >
            InterPro {version}{' '}
            <small>
              • <time dateTime={date}>{formatISODate(date)}</time>
            </small>
          </Link>
        </li>
      ))}
    </ul>
  );
};
ReleaseNotesSelectorWithData.propTypes = {
  data: T.shape({
    loading: T.bool.isRequired,
    payload: T.object,
  }).isRequired,
  current: T.string,
};

const getReleaseNotesListUrl = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    cleanUpMultipleSlashes(
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}/utils/release/`,
      }),
    ),
);

const ReleaseNotesSelector = loadData(getReleaseNotesListUrl)(
  ReleaseNotesSelectorWithData,
);
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
    description: T.object.isRequired,
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
    const totalIpro = content.interpro.entries;
    const newIpro = content.interpro.new_entries.length;
    const updates = Object.values(content.member_databases).filter(
      db => db.is_updated,
    );
    const perType = content.interpro.types;
    const perMemberDB = content.member_databases;
    const totalNewMethod = Object.values(perMemberDB).reduce(
      (agg, v) => agg + v.recently_integrated.length,
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
    const sets = Object.values(content.member_databases).filter(db => db.sets);
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
            <ReleaseNotesSelector current={version} />
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
                    {updates.map(({ name, recently_integrated: r }) => (
                      <span key={name}>
                        {name} ({r.length})
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
                {Object.entries(perMemberDB)
                  .filter(([_name, { recently_integrated: r }]) => r.length)
                  .map(([name, db], i) => (
                    <React.Fragment key={name}>
                      {i === 0 ? ' ' : ', '}
                      {name} (
                      <NumberComponent noTitle noAnimation>
                        {db.recently_integrated.length}
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

            <p>Interpro cites {content.citations} publications in PubMed.</p>

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
                {Object.values(perMemberDB)
                  .filter(db => !db.name.toLowerCase().startsWith('mobidb'))
                  .map(
                    ({
                      name,
                      version,
                      signatures,
                      integrated_signatures: integrated,
                    }) => {
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
                              <NumberComponent noTitle>
                                {signatures}
                              </NumberComponent>
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
                                ({((100 * integrated) / signatures).toFixed(1)}
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

            <h4>InterPro2GO</h4>
            <p>
              We have a total number of{' '}
              <NumberComponent noTitle>
                {content.interpro.go_terms}
              </NumberComponent>{' '}
              GO terms mapped to InterPro entries.
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

            <h3>Protein information</h3>

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
                {Object.entries(content.proteins)
                  .sort(([a], [b]) => (a > b ? 1 : -1))
                  .map(([name, detail]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{detail.version}</td>
                      <td>
                        <NumberComponent noTitle>
                          {detail.count}
                        </NumberComponent>
                      </td>
                      <td>
                        <NumberComponent noTitle>
                          {detail.signatures}
                        </NumberComponent>{' '}
                        <small>
                          (
                          {((100 * detail.signatures) / detail.count).toFixed(
                            1,
                          )}
                          %)
                        </small>
                      </td>
                      <td>
                        <NumberComponent noTitle>
                          {detail.integrated_signatures}
                        </NumberComponent>{' '}
                        <small>
                          (
                          {(
                            (100 * detail.integrated_signatures) /
                            detail.count
                          ).toFixed(1)}
                          %)
                        </small>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {['structures', 'proteomes', 'taxonomy'].map(key => (
              <section key={key}>
                <h3 style={{ textTransform: 'capitalize' }}>
                  {key} information
                </h3>

                <table className={f('light', 'margin-top-large')}>
                  <thead>
                    <tr>
                      <th>Version</th>
                      <th>Count</th>
                      <th>Integrated</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{content[key].version}</td>
                      <td>
                        <NumberComponent noTitle>
                          {content[key].total}
                        </NumberComponent>
                      </td>
                      <td>
                        <NumberComponent noTitle>
                          {content[key].integrated}
                        </NumberComponent>{' '}
                        <small>
                          (
                          {(
                            (100 * content[key].integrated) /
                            content[key].total
                          ).toFixed(1)}
                          %)
                        </small>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            ))}
            <section>
              <h3>Sets Information</h3>

              <table className={f('light', 'margin-top-large')}>
                <thead>
                  <tr>
                    <th>Database</th>
                    <th>Version</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {sets.map(({ name, sets, version }) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{version}</td>
                      <td>
                        <NumberComponent noTitle>{sets}</NumberComponent>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </section>
        </div>
      </div>
    );
  }
}
const getReleaseNotesUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.other,
  ({ protocol, hostname, port, root }, other) =>
    cleanUpMultipleSlashes(
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}/utils/release/${
          other.length > 1 ? other[1] : 'current'
        }`,
      }),
    ),
);

const mapStateToProps = createSelector(
  state => state.customLocation.description,
  description => ({ description }),
);
export default connect(mapStateToProps)(
  loadData(getReleaseNotesUrl)(ReleaseNotes),
);
