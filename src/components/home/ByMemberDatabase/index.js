import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';
import AnimatedEntry from 'components/AnimatedEntry';
import { NumberComponent } from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from '../styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessDataForDB = ({ name, version, releaseDate, location }) => ({
  '@type': 'Dataset',
  '@id': '@dataset',
  name,
  identifier: name,
  version,
  releaseDate,
  url: `${location.href}/entry/${name}`,
});

/*:: type Props = {
  data: {
    payload: ?Object,
  },
  dataMeta: {
    payload: ?Object,
  },
}; */

class ByMemberDatabase extends PureComponent /*:: <Props> */ {
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
      ? Object.values(payloadMeta.databases).filter(
          db => db.type === 'entry' && db.canonical !== 'INTERPRO',
        )
      : [];
    return (
      <div className={f('md-list')}>
        <AnimatedEntry className={f('row')} element="div">
          {memberDB.map(
            ({ canonical, description, name, version, releaseDate }) => (
              <div
                className={f(
                  'column',
                  'small-3',
                  'medium-2',
                  'large-4',
                  'text-center',
                )}
                key={name}
              >
                <SchemaOrgData
                  data={{
                    name,
                    version,
                    releaseDate,
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
                >
                  <MemberSymbol type={canonical} />

                  <h6>
                    {name}{' '}
                    <Tooltip title={description}>
                      <span
                        className={f('small', 'icon', 'icon-generic')}
                        data-icon="i"
                        aria-label={description}
                      />
                    </Tooltip>
                  </h6>

                  <small>{version}</small>

                  <p className={f('margin-bottom-medium')}>
                    <span className={f('count', { visible: payload })}>
                      <NumberComponent
                        value={(counts && counts[canonical.toLowerCase()]) || 0}
                      />
                      {' entries'}
                    </span>
                  </p>
                </Link>
              </div>
            ),
          )}
        </AnimatedEntry>
        <Link
          to={{
            description: { main: { key: 'entry' } },
          }}
          className={f('button')}
        >
          View all entries
        </Link>
      </div>
    );
  }
}

const mapStateToUrlForMeta = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}`,
    }),
);

const mapStateToUrl = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/entry`,
    }),
);

export default loadData({
  getUrl: mapStateToUrlForMeta,
  propNamespace: 'Meta',
})(loadData(mapStateToUrl)(ByMemberDatabase));
