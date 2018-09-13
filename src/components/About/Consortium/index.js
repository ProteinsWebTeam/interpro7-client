import React, { PureComponent } from 'react';
import T from 'prop-types';

import MemberSymbol from 'components/Entry/MemberSymbol';
import Link from 'components/generic/Link';
import TimeAgo from 'components/TimeAgo';
import Loading from 'components/SimpleCommonComponents/Loading';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import sortFn from 'utils/sort-functions/basic';

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

const lut = new Map([
  ['cdd', '//www.ncbi.nlm.nih.gov/Structure/cdd/cdd.shtml'],
  ['cathgene3d', 'http://www.cathdb.info/'],
  ['hamap', '//hamap.expasy.org/'],
  ['mobidblt', 'http://mobidb.bio.unipd.it/'],
  ['panther', 'http://www.pantherdb.org/'],
  ['pfam', '//pfam.xfam.org/'],
  ['pirsf', '//pir.georgetown.edu/pirwww/dbinfo/pirsf.shtml'],
  ['prints', 'http://130.88.97.239/PRINTS/'],
  ['prodom', 'http://prodom.prabi.fr/'],
  ['profile', '//prosite.expasy.org/'],
  ['prosite', '//prosite.expasy.org/'],
  ['sfld', 'http://sfld.rbvi.ucsf.edu/django/'],
  ['smart', 'http://smart.embl-heidelberg.de/'],
  ['ssf', 'http://supfam.org/'],
  ['tigrfams', 'http://tigrfams.jcvi.org/cgi-bin/index.cgi'],
]);

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
    if (loading || !payload) return <Loading />;
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
            {memberDBs
              .sort(sortFn({ selector: item => item.canonical.toUpperCase() }))
              .map(db => {
                const date = db.releaseDate && new Date(db.releaseDate);
                const md = db.canonical;
                const href = lut.get(md);
                return (
                  <tr key={md}>
                    <td>
                      <MemberSymbol type={md} className={f('md-small')} />
                    </td>
                    <td>
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href={href}
                        disabled={!href}
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    </td>

                    <td>{db.version}</td>

                    <td>
                      <p>{db.description}</p>
                      {db.releaseDate ? (
                        // TEMP - to re-add when update to latest icon set
                        // <small className={f('icon', 'icon-common')} data-icon="&#xf073;">
                        <small
                          className={f('icon', 'icon-common')}
                          data-icon="&#xf073;"
                        >
                          {' '}
                          {'Released '}
                          <TimeAgo date={date} noUpdate />
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
