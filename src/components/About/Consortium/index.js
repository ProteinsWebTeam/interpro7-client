import React, { PureComponent } from 'react';
import T from 'prop-types';

import MemberSymbol from 'components/Entry/MemberSymbol';
import Link from 'components/generic/Link';
import TimeAgo from 'components/TimeAgo';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { schemaProcessDataForDB } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import ipro from 'styles/interpro-new.css';
import entry from 'components/Entry/Literature/style.css';

const f = foundationPartial(ipro, local, entry);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

/*:: type Props = {
  data: {
    loading: boolean,
    payload?: {
      databases: {},
    }
  },
}; */

export const Consortium = class extends PureComponent /*:: <Props> */ {
  static displayName = 'Consortium';

  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };

  render() {
    const { loading, payload } = this.props.data;
    if (loading || !payload) return 'Loading…';
    const databases = payload && payload.databases;
    const memberDBs = Object.values(payload.databases).filter(
      db => db.type === 'entry' && db.canonical !== 'interpro',
    );
    return (
      <section>
        <h3>The InterPro Consortium</h3>
        <p>The following databases make up the InterPro Consortium:</p>
        <table className={f('light')}>
          <tbody>
            {memberDBs.map(db => {
              const date = db.releaseDate && new Date(db.releaseDate);
              return (
                <tr key={db.canonical}>
                  <td>
                    <MemberSymbol
                      type={db.canonical}
                      className={f('md-small')}
                    />
                  </td>
                  <td>
                    {' '}
                    <Link
                      className={f('ext')}
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: { db: db.canonical },
                        },
                      }}
                    >
                      {db.name}
                    </Link>
                  </td>
                  <td>{db.version}</td>

                  <td>
                    {' '}
                    {db.description} <br />{' '}
                    {db.releaseDate ? (
                      <small>
                        {'Released '}
                        <time
                          dateTime={db.releaseDate}
                          title={date.toLocaleDateString()}
                        >
                          <TimeAgo date={date} noUpdate />
                        </time>
                      </small>
                    ) : null}
                    {databases &&
                      databases[db.type.toUpperCase()] && (
                        <SchemaOrgData
                          data={{
                            name: db.name,
                            version: db.version,
                            releaseDate: db.releaseDate,
                            location: window.location,
                          }}
                          processData={schemaProcessDataForDB}
                        />
                      )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    );
  }
};

export default loadData(getUrlForMeta)(Consortium);
