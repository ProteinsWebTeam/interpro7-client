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
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import entry from 'components/Entry/Literature/style.css';

const f = foundationPartial(fonts, ipro, local, entry);

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
              const md = db.canonical;
              return (
                <tr key={md}>
                  <td>
                    <MemberSymbol type={md} className={f('md-small')} />
                  </td>
                  <td>
                    {' '}
                    {md === 'cdd' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//www.ncbi.nlm.nih.gov/Structure/cdd/cdd.shtml"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'cathgene3d' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//www.cathdb.info/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'hamap' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//hamap.expasy.org/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'mobidblt' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//mobidb.bio.unipd.it/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'panther' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//www.pantherdb.org/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'pfam' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//pfam.xfam.org/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'pirsf' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//pir.georgetown.edu/pirwww/dbinfo/pirsf.shtml"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'prints' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//130.88.97.239/PRINTS/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'prodom' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//prodom.prabi.fr/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'profile' || md === 'prosite' ? (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//prosite.expasy.org/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    ) : (
                      ''
                    )}
                    {md === 'sfld' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//sfld.rbvi.ucsf.edu/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'smart' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//smart.embl-heidelberg.de/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'ssf' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//supfam.org/"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                    {md === 'tigrfams' && (
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href="//tigrfams.jcvi.org/cgi-bin/index.cgi"
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    )}
                  </td>
                  <td>{db.version}</td>

                  <td>
                    {' '}
                    {db.description} <br />{' '}
                    {db.releaseDate ? (
                      // TEMP - to re-add when update to latest icon set
                      // <small className={f('icon', 'icon-common')} data-icon="&#xf073;">
                      <small
                        className={f('icon', 'icon-generic')}
                        data-icon="r"
                      >
                        {' '}
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
