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
  ['cdd', 'https://www.ncbi.nlm.nih.gov/Structure/cdd/cdd.shtml'],
  ['cathgene3d', 'http://www.cathdb.info/'],
  ['hamap', 'https://hamap.expasy.org/'],
  ['mobidblt', 'https://mobidb.org/'],
  ['panther', 'http://www.pantherdb.org/'],
  ['pfam', 'https://pfam.xfam.org/'],
  ['pirsf', 'https://pir.georgetown.edu/pirwww/dbinfo/pirsf.shtml'],
  ['prints', 'http://130.88.97.239/PRINTS/'],
  ['profile', 'https://prosite.expasy.org/'],
  ['prosite', 'https://prosite.expasy.org/'],
  ['sfld', 'http://sfld.rbvi.ucsf.edu/django/'],
  ['smart', 'http://smart.embl-heidelberg.de/'],
  ['ssf', 'http://supfam.org/'],
  ['tigrfams', 'http://tigrfams.jcvi.org/cgi-bin/index.cgi'],
]);

/*:: type DB = {
  type: string,
  name: string,
  version: ?string,
  releaseDate: ?string,
  canonical: string,
};

type Props = {
  data: {
    loading: boolean,
    payload?: ?{
      databases: {
        [key: ?string]: DB
      }
    }
  }
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
      (db /*: DB */) => db.type === 'entry' && db.canonical !== 'interpro',
    );
    return (
      <section>
        <h3>The InterPro Consortium</h3>
        <p>The following databases make up the InterPro Consortium:</p>

        <table className={f('light', 'responsive')}>
          <tbody>
            {memberDBs
              .sort(sortFn({ selector: item => item.canonical.toUpperCase() }))
              .map(db => {
                const date = db.releaseDate && new Date(db.releaseDate);
                const md = db.canonical;
                const href = lut.get(md);
                return (
                  <tr id={md} key={md}>
                    <td className={f('sm-inline')}>
                      <MemberSymbol type={md} className={f('md-small')} />
                    </td>
                    <td className={f('sm-inline')}>
                      <Link
                        className={f('ext')}
                        target="_blank"
                        href={href}
                        disabled={!href}
                      >
                        <span className={f('h5')}>{db.name}</span>
                      </Link>
                    </td>

                    <td className={f('sm-inline')}>{db.version}</td>

                    <td>
                      <p>{db.description}</p>
                      {db.releaseDate ? (
                        <small
                          className={f('icon', 'icon-common')}
                          data-icon="&#xf073;"
                        >
                          {' '}
                          {'Released '}
                          <TimeAgo date={date} noUpdate />
                        </small>
                      ) : null}
                      {databases && databases[db.type.toUpperCase()] && (
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
