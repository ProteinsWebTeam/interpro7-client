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
      <div className={f('title')}>
        {isEntry && (
          <interpro-type type={metadata.type.replace('_', ' ')} size="4em" />
        )}
        <Helmet>
          <title>{metadata.accession.toString()}</title>
        </Helmet>
        <h3>
          {metadata.name.name}
          <small
            className={f(
              metadata.type === 'Domain'
                ? 'title-id-domain'
                : null || metadata.type === 'Family'
                  ? 'title-id-family'
                  : null || metadata.type === 'Repeat'
                    ? 'title-id-repeat'
                    : null || metadata.type === 'unknow'
                      ? 'title-id-unknown'
                      : null ||
                        metadata.type === 'Conserved_site' ||
                        metadata.type === 'Binding_site' ||
                        metadata.type === 'Active_site' ||
                        metadata.type === 'PTM'
                        ? 'title-id-site'
                        : null,
            )}
          >
            {metadata.accession}
          </small>
        </h3>
        {isEntry &&
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
