import React, { PureComponent } from 'react';
import T from 'prop-types';
import { Helmet } from 'react-helmet';
import MemberSymbol from 'components/Entry/MemberSymbol';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import loadWebComponent from 'utils/loadWebComponent';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import styles from './style.css';
import loadData from '../../higherOrder/loadData';
import { getUrlForMeta } from '../../higherOrder/loadData/defaults';

const f = foundationPartial(fonts, ipro, styles);

const softcolors = {
  // opacity 0.6 normal colors
  cdd: '#cbeb98',
  cathgene3d: '#c9b6db',
  hamap: '#87e5e6',
  mobidblt: '#d6dc94',
  panther: '#d8ccbb',
  pfam: '#9fb4cf',
  pirsf: '#ecccec',
  prints: '#97de9c',
  prodom: '#b8bdee',
  profile: '#fac5a9',
  prosite: '#f7dea0',
  sfld: '#79cde3',
  smart: '#ffadac',
  ssf: '#a3a3a3',
  tigrfams: '#99d3c7',
};

const getcolor = db => {
  let color = softcolors[db.toLowerCase()];
  if (!color) {
    color = softcolors[db];
  }
  return color;
};

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
  dataBase?: Object,
}; */

const accessionDisplay = new Set(['protein', 'structure', 'organism']);

class Title extends PureComponent /*:: <Props> */ {
  static propTypes = {
    metadata: T.object.isRequired,
    dataBase: T.object.isRequired,
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
    const { metadata, mainType, dataBase } = this.props;
    const isEntry = mainType === 'entry';
    const databases =
      dataBase && dataBase.payload && dataBase.payload.databases;
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
                size="4em"
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
          <title>{metadata.accession.toString()}</title>
        </Helmet>
        <h3>
          {metadata.name.name}{' '}
          {// Red, Green for domains and Purple for sites accession: for InterPro page only
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
                style={{ backgroundColor: getcolor(metadata.source_database) }}
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
                className={f('small', 'icon', 'icon-generic')}
                data-icon="i"
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
                className={f('small', 'icon', 'icon-generic')}
                data-icon="i"
              />
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}
export default loadData({ getUrl: getUrlForMeta, propNamespace: 'Base' })(
  Title,
);
