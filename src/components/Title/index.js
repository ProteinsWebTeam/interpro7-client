// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { Helmet } from 'react-helmet';

import Link from 'components/generic/Link';

import loadWebComponent from 'utils/loadWebComponent';

import ipro from 'styles/interpro-new.css';
import style from './style.css';

/*:: type Props = {
  metadata: {
    name: { name: string, short: ?string },
    accession: string | number,
    source_database: string,
    type: string,
    gene?: string,
    experiment_type?: string,
    source_organism?: Object,
    release_date?: string,
    chains?: Array<string>,
  },
  mainType: string,
}; */

export default class Title extends PureComponent /*:: <Props> */ {
  static propTypes = {
    metadata: T.object.isRequired,
    mainType: T.string.isRequired,
  };

  componentWillMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }

  render() {
    const { metadata, mainType } = this.props;
    const isEntry = mainType === 'entry';
    return (
      <div className={style.title}>
        {isEntry && <interpro-type type={metadata.type} size="4em" />}
        <Helmet>
          <title>{metadata.accession.toString()}</title>
        </Helmet>
        <h3>
          {metadata.name.name} <small>({metadata.accession})</small>
        </h3>
        {isEntry &&
          metadata.source_database.toLowerCase() !== 'interpro' && (
            <div className={ipro['md-hlight']}>
              <h5>
                Member database:&nbsp;
                <Link
                  newTo={{
                    description: {
                      mainType: 'entry',
                      mainDB: metadata.source_database,
                    },
                  }}
                >
                  {metadata.source_database}
                </Link>
              </h5>
            </div>
          )}
        {metadata.name.short && (
          <p>
            Short name:&nbsp;
            <i className="small" style={{ color: '#41647d' }}>
              {metadata.name.short}
            </i>
          </p>
        )}
      </div>
    );
  }
}
