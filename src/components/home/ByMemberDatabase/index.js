// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
// $FlowFixMe
import MemberSymbol from 'components/Entry/MemberSymbol';
import AnimatedEntry from 'components/AnimatedEntry';
import NumberComponent from 'components/NumberComponent';
import { memberDbURL } from 'utils/url-patterns';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from '../styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

import { schemaProcessDataForDB } from 'schema_org/processors';
// $FlowFixMe
import { NOT_MEMBER_DBS } from 'menuConfig';

/*:: type Props = {
  data: {
    payload: ?Object,
  },
  dataMeta: {
    payload: ?Object,
  },
}; */

export class ByMemberDatabase extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
    dataMeta: T.shape({
      payload: T.object,
    }).isRequired,
  };

  render() {
    const {
      data: { payload },
      dataMeta: { payload: payloadMeta },
    } = this.props;
    const counts = payload && payload.entries.member_databases;
    const memberDB = payloadMeta
      ? // prettier-ignore
        (Object.values(payloadMeta.databases)/*: any */).filter(
          (db) => db.type === 'entry' && db.canonical !== 'interpro',
        )
      : [];
    return (
      <div className={f('md-list')} data-testid="by-member-database-box">
        <AnimatedEntry className={f('row')} element="div">
          {memberDB
            .filter(
              ({ canonical }) =>
                !NOT_MEMBER_DBS.has(canonical) && canonical !== 'antifam',
            )
            .sort((a, b) => {
              // sort list by alphabetical order
              if (a.canonical.toUpperCase() > b.canonical.toUpperCase())
                return 1;
              if (a.canonical.toUpperCase() < b.canonical.toUpperCase())
                return -1;
              return 0;
            })
            .map(({ canonical, description, name, version, releaseDate }) => (
              <div className={f('memberdb-block', 'text-center')} key={name}>
                <SchemaOrgData
                  data={{
                    name,
                    version,
                    releaseDate,
                    description,
                    location: window.location,
                  }}
                  processData={schemaProcessDataForDB}
                />
                <Link
                  className={f('block')}
                  to={{
                    description: {
                      main: { key: 'entry' },
                      entry: { db: canonical },
                    },
                  }}
                  data-testid={`member-database-${canonical}`}
                >
                  <MemberSymbol type={canonical} svg={false} />
                </Link>
                <div className={f('name-row')}>
                  <div>
                    <Link
                      className={f('block')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: canonical },
                        },
                      }}
                      data-testid={`member-database-${canonical}`}
                    >
                      {' '}
                      <span className={f('title')}>{name} </span>
                    </Link>
                    <Tooltip title={description}>
                      <span
                        className={f('small', 'icon', 'icon-common')}
                        data-icon="&#xf129;"
                        role="definition"
                        aria-label={description}
                      />
                    </Tooltip>
                  </div>
                  {canonical.toLowerCase() !== 'pfam' &&
                    memberDbURL.get(canonical) && (
                      <Link href={memberDbURL.get(canonical)} target="_blank">
                        <span
                          role="link"
                          className={f('small', 'icon', 'icon-common')}
                          data-icon="&#xf35d;"
                          aria-label="link to external site"
                        />
                      </Link>
                    )}
                </div>
                <hr className={f('md', canonical)} />
                <small>{version}</small>

                <p className={f('margin-bottom-medium')}>
                  <span className={f('count', { visible: payload })}>
                    <NumberComponent abbr>
                      {(counts && counts[canonical.toLowerCase()]) || 0}
                    </NumberComponent>
                    {' entries'}
                  </span>
                </p>
              </div>
            ))}
        </AnimatedEntry>
      </div>
    );
  }
}

const mapStateToUrl = createSelector(
  (state) => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/entry`,
    }),
);

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'Meta',
})(loadData(mapStateToUrl)(ByMemberDatabase));
