// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { Helmet } from 'react-helmet';

import Link from 'components/generic/Link';

import loadWebComponent from 'utils/loadWebComponent';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import styles from './style.css';

const f = foundationPartial(ipro, styles);

const mapNameToClass = new Map([
  ['Domain', 'title-id-domain'],
  ['Family', 'title-id-family'],
  ['Repeat', 'title-id-repeat'],
  ['Unknown', 'title-id-unknown'],
  ['Conserved_site', 'title-id-site'],
  ['Binding_site', 'title-id-site'],
  ['Active_site', 'title-id-site'],
  ['PTM', 'title-id-site'],
]);

/*:: type Props = {
  metadata: {
    name: { name: string, short: ?string },
    accession: string | number,
    source_database?: string,
    type?: string,
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
      <div className={f('title')}>
        {isEntry &&
          metadata.type && (
            <interpro-type type={metadata.type.replace('_', ' ')} size="4em" />
          )}
        <Helmet>
          <title>{metadata.accession.toString()}</title>
        </Helmet>
        <h3>
          {metadata.name.name}{' '}
          {isEntry && metadata.type ? (
            <small className={f(mapNameToClass.get(metadata.type))}>
              {metadata.accession}
            </small>
          ) : (
            <small className={f('title-id-other')}>{metadata.accession}</small>
          )}
        </h3>
        {isEntry &&
          metadata.source_database &&
          metadata.source_database.toLowerCase() !== 'interpro' && (
            <div className={f('md-hlight')}>
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
            <i className={f('shortname')}>{metadata.name.short}</i>
          </p>
        )}
      </div>
    );
  }
}
