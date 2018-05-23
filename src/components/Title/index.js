import React, { PureComponent } from 'react';
import T from 'prop-types';
import { Helmet } from 'react-helmet';
import MemberSymbol from 'components/Entry/MemberSymbol';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import loadWebComponent from 'utils/load-web-component';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import styles from './style.css';
import loadData from '../../higherOrder/loadData';
import { getUrlForMeta } from '../../higherOrder/loadData/defaults';

import config from 'config';

const f = foundationPartial(fonts, ipro, styles);

const mapNameToClass = new Map([
  ['Domain', 'title-id-domain'],
  ['Family', 'title-id-family'],
  ['Repeat', 'title-id-repeat'],
  ['Unknown', 'title-id-unknown'],
  ['Conserved_site', 'title-id-site'],
  ['Binding_site', 'title-id-site'],
  ['Active_site', 'title-id-site'],
  ['PTM', 'title-id-site'],
  ['Homologous_superfamily', 'title-id-hh'],
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
  data?: Object,
}; */

const accessionDisplay = new Set(['protein', 'structure', 'organism']);

class Title extends PureComponent /*:: <Props> */ {
  static propTypes = {
    metadata: T.object.isRequired,
    data: T.object.isRequired,
    mainType: T.string.isRequired,
  };

  componentDidMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }

  render() {
    const { metadata, mainType, data } = this.props;
    const isEntry = mainType === 'entry';
    const databases = data && data.payload && data.payload.databases;
    const dbLabel =
      databases && databases[metadata.source_database]
        ? databases[metadata.source_database].name
        : metadata.source_database;

    return (
      <div className={f('title')}>
        {// Entry icon
        isEntry &&
          metadata.type &&
          metadata.source_database &&
          metadata.source_database.toLowerCase() === 'interpro' && (
            <Tooltip title={`${metadata.type.replace('_', ' ')} type`}>
              <interpro-type
                type={metadata.type.replace('_', ' ')}
                dimension="4em"
              />
            </Tooltip>
          )}

        {// MD icon
        isEntry &&
          metadata.type &&
          metadata.source_database &&
          metadata.source_database.toLowerCase() !== 'interpro' && (
            <div className={f('icon-container')}>
              <MemberSymbol type={metadata.source_database} />
            </div>
          )}

        <Helmet>
          <title>{metadata.accession}</title>
        </Helmet>
        <h3>
          {metadata.name.name}{' '}
          {// Red, Green for domains,  Purple for sites, and Blue for Homologous accession: for InterPro page only
          isEntry &&
            metadata.type &&
            metadata.source_database &&
            metadata.source_database.toLowerCase() === 'interpro' && (
              <small className={f(mapNameToClass.get(metadata.type))}>
                {metadata.accession}
              </small>
            )}
          {// Blue accession: for Member Database and Unknown entry-type
          isEntry &&
            metadata.type &&
            metadata.source_database &&
            metadata.source_database.toLowerCase() !== 'interpro' && (
              <small
                style={{
                  backgroundColor: config.colors.get(metadata.source_database),
                }}
                className={f('title-id-md')}
              >
                {metadata.accession}
              </small>
            )}
          {// greyish accession: for protein , structure, and proteomes and no accession for tax
          accessionDisplay.has(mainType) &&
            metadata.source_database !== 'taxonomy' && (
              // no accession for Taxonomy but in blue for protein (reviewed), structure (pdb), and proteomes (proteome)
              <small className={f('title-id-other')}>
                {metadata.accession}
              </small>
            )}
        </h3>

        {// InterPro Entry
        isEntry &&
          metadata.type &&
          metadata.source_database &&
          metadata.source_database.toLowerCase() === 'interpro' && (
            <div className={f('tag', 'secondary')}>{dbLabel} entry</div>
          )}

        {// MD Entry -signature
        isEntry &&
          metadata.type &&
          metadata.source_database &&
          metadata.source_database.toLowerCase() !== 'interpro' && (
            <div className={f('tag', 'md-p')}>{dbLabel} Entry</div>
          )}

        {// protein page
        mainType === 'protein' && (
          <div className={f('tag', 'secondary', 'margin-bottom-large')}>
            Protein {dbLabel}
          </div>
        )}

        {// Structure
        mainType === 'structure' && (
          <div className={f('tag', 'secondary', 'margin-bottom-large')}>
            Structure
          </div>
        )}

        {// Species
        metadata.source_database !== 'proteome' &&
          mainType === 'organism' && (
            <div className={f('tag', 'secondary', 'margin-bottom-large')}>
              {dbLabel}
            </div>
          )}

        {// Proteome
        metadata.is_reference ? (
          <div className={f('tag', 'secondary', 'margin-bottom-large')}>
            Reference proteome{' '}
            <Tooltip title="Some proteomes have been (manually and algorithmically) selected as reference proteomes. They cover well-studied model organisms and other organisms of interest for biomedical research and phylogeny.">
              <span
                className={f('small', 'icon', 'icon-common')}
                data-icon="ℹ"
                aria-label="Some proteomes have been (manually and algorithmically) selected as reference proteomes. They cover well-studied model organisms and other organisms of interest for biomedical research and phylogeny."
              />
            </Tooltip>
          </div>
        ) : null}

        {// Set
        mainType === 'set' && (
          <div className={f('tag', 'secondary', 'margin-bottom-large')}>
            Set {dbLabel}{' '}
            <Tooltip title="A Set is defined as a group of related entries">
              <span
                className={f('small', 'icon', 'icon-common')}
                data-icon="ℹ"
              />
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}

export default loadData(getUrlForMeta)(Title);
