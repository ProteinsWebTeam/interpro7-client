import React, { PureComponent } from 'react';
import T from 'prop-types';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { schemaProcessDataForDB } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
import entry from 'components/Entry/Literature/style.css';

const f = foundationPartial(local, entry);

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

export const Tutorial = class extends PureComponent /*:: <Props> */ {
  static displayName = 'Tutorial';

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
        <h3>Training &amp; tutorials</h3>
        <p>A number of online tutorials relating to InterPro are available.</p>
        <p>lorem ipsum</p>
      </section>
    );
  }
};

export default loadData(getUrlForMeta)(Tutorial);
