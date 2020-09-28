// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { Helmet } from 'react-helmet-async';

import MemberSymbol from 'components/Entry/MemberSymbol';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import loadWebComponent from 'utils/load-web-component';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import styles from './style.css';
import loadData from '../../higherOrder/loadData';
import { getUrlForMeta } from '../../higherOrder/loadData/defaults';

import { connect } from 'react-redux';
import { markFavourite, unmarkFavourite } from 'actions/creators';
import getTableAccess, { FavEntries } from 'storage/idb';

import config from 'config';

const f = foundationPartial(fonts, ipro, styles);

const mapNameToClass = new Map([
  ['domain', 'title-id-domain'],
  ['family', 'title-id-family'],
  ['repeat', 'title-id-repeat'],
  ['unknown', 'title-id-unknown'],
  ['conserved_site', 'title-id-site'],
  ['binding_site', 'title-id-site'],
  ['active_site', 'title-id-site'],
  ['ptm', 'title-id-site'],
  ['homologous_superfamily', 'title-id-hh'],
]);

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
  data?: Object,
  markFavourite: function,
  unmarkFavourite: function,
}; */

/*:: type State = {
  entries: Array<string>,
}; */

const accessionDisplay = new Set(['protein', 'structure', 'proteome']);

const EntryIcon = (
  {
    metadata,
  } /*: {metadata: {name: { name: string, short: ?string },
    accession: string | number,
    source_database: string,
    type: string,
    gene?: string,
    experiment_type?: string,
    source_organism?: Object,
    release_date?: string,
    chains?: Array<string>}} */,
) => (
  <Tooltip title={`${metadata.type.replace('_', ' ')} type`}>
    <interpro-type
      type={metadata.type.replace('_', ' ')}
      dimension="4em"
      aria-label="Entry type"
      data-testid="entry-type-icon"
    >
      {
        // IE11 fallback for icons
      }
      <span
        className={f('icon-type', {
          ['icon-family']: metadata.type === 'family',
          ['icon-domain']: metadata.type === 'domain',
          ['icon-repeat']: metadata.type === 'repeat',
          ['icon-hh']:
            metadata.type.replace('_', ' ') === 'homologous superfamily',
          ['icon-site']:
            metadata.type.replace('_', ' ') === 'conserved site' ||
            metadata.type.replace('_', ' ') === 'binding site' ||
            metadata.type.replace('_', ' ') === 'active site' ||
            metadata.type === 'ptm',
        })}
      >
        {metadata.type === 'family' ? 'F' : null}
        {metadata.type === 'domain' ? 'D' : null}
        {metadata.type === 'repeat' ? 'R' : null}
        {metadata.type.replace('_', ' ') === 'homologous superfamily'
          ? 'H'
          : null}
        {metadata.type.replace('_', ' ') === 'conserved site' ||
        metadata.type.replace('_', ' ') === 'binding site' ||
        metadata.type.replace('_', ' ') === 'active site' ||
        metadata.type === 'ptm'
          ? 'S'
          : null}
      </span>
    </interpro-type>
  </Tooltip>
);
EntryIcon.propTypes = {
  metadata: T.object.isRequired,
};

const rtdLinks = {
  entry: {
    interpro: 'entry-page',
    dbs: 'member-database-page',
  },
  protein: 'protein-entry-page',
  structure: 'structure-entry-page',
  taxonomy: 'taxonomy-entry-page',
  proteome: 'proteome-entry-page',
  set: 'set-entry-page',
};

const TitleTag = (
  {
    metadata,
    mainType,
    dbLabel,
  } /*: {metadata:
                    {
                      name: { name: string, short: ?string },
                      accession: string | number,
                      source_database: string,
                      type: string,
                      gene?: string,
                      experiment_type?: string,
                      source_organism?: Object,
                      release_date?: string,
                      chains?: Array<string>
                      },
                      mainType: string,
                      dbLabel: string
                     } */,
) => {
  const isEntry = mainType === 'entry';
  const isInterPro = metadata.source_database.toLowerCase() === 'interpro';
  let rtdLink = '';
  if (isEntry) {
    rtdLink = rtdLinks.entry[isInterPro ? 'interpro' : 'dbs'];
  } else {
    rtdLink = rtdLinks?.[mainType.toLowerCase()] || '';
  }
  return (
    <div className={f('title-tag')} data-testid="title">
      {metadata && metadata.source_database && (
        <div
          className={f('tag', {
            secondary: !isEntry || isInterPro,
            'md-p': isEntry && !isInterPro,
          })}
        >
          {dbLabel} {mainType}
          {
            // Set
            mainType === 'set' && (
              <Tooltip title="A Set is defined as a group of related entries">
                {' '}
                <span
                  className={f('small', 'icon', 'icon-common')}
                  data-icon="&#xf129;"
                />
              </Tooltip>
            )
          }
        </div>
      )}{' '}
      <TooltipAndRTDLink rtdPage={`browse.html#${rtdLink}`} />
    </div>
  );
};
TitleTag.propTypes = {
  metadata: T.object.isRequired,
  mainType: T.string.isRequired,
  dbLabel: T.string,
};

const AccessionTag = (
  {
    metadata,
    mainType,
  } /*: {metadata:
                    {
                      name: { name: string, short: ?string },
                      accession: string | number,
                      source_database: string,
                      type: string,
                      gene?: string,
                      experiment_type?: string,
                      source_organism?: Object,
                      release_date?: string,
                      chains?: Array<string>
                      },
                      mainType: string
                      } */,
) => {
  const isEntry = mainType === 'entry';
  return (
    <div className={f('title-id')} data-testid="accession">
      {
        // Red, Green for domains,  Purple for sites, and Blue for Homologous accession: for InterPro page only
        isEntry &&
          metadata.type &&
          metadata.source_database &&
          metadata.source_database.toLowerCase() === 'interpro' && (
            <span className={f(mapNameToClass.get(metadata.type))}>
              {metadata.accession}
            </span>
          )
      }
      {
        // Blue accession: for Member Database and Unknown entry-type
        isEntry &&
          metadata.type &&
          metadata.source_database &&
          metadata.source_database.toLowerCase() !== 'interpro' && (
            <span
              style={{
                backgroundColor: config.colors.get(metadata.source_database),
              }}
              className={f('title-id-md')}
            >
              {metadata.accession}
            </span>
          )
      }
      {
        // greyblueish accession: for protein , structure, and proteomes and no accession for tax
        accessionDisplay.has(mainType) &&
          metadata.source_database !== 'taxonomy' &&
          metadata.name.name !== 'InterProScan Search Result' && (
            // for proteins, structures and proteomes (no accession in title for taxonomy and sets)
            <span className={f('title-id-other')}>{metadata.accession}</span>
          )
      }
    </div>
  );
};
AccessionTag.propTypes = {
  metadata: T.object.isRequired,
  mainType: T.string.isRequired,
};

class Title extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    metadata: T.object.isRequired,
    data: T.object.isRequired,
    mainType: T.string.isRequired,
    markFavourite: T.func.isRequired,
    unmarkFavourite: T.func.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {
      entries: [],
    };
  }
  componentDidMount() {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
    this.getFavourites();
  }

  componentDidUpdate() {
    this.getFavourites();
  }

  getFavourites = async () => {
    const favTA = await getTableAccess(FavEntries);
    const content = await favTA.getAll();
    const keys = Object.keys(content);
    this.setState({ entries: keys });
  };

  manageFavourites(metadata) {
    if (this.state.entries.includes(metadata.accession)) {
      this.props.unmarkFavourite(metadata.accession);
    } else {
      this.props.markFavourite(metadata.accession, { metadata });
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const { metadata, mainType, data } = this.props;
    const isEntry = mainType === 'entry';
    const databases = data && data.payload && data.payload.databases;
    const dbLabel =
      databases && databases[metadata.source_database]
        ? databases[metadata.source_database].name
        : metadata.source_database;

    return (
      <div className={f('title')} data-testid="titlebar">
        {isEntry &&
          metadata.type &&
          metadata.source_database &&
          metadata.source_database.toLowerCase() === 'interpro' && (
            <>
              <EntryIcon metadata={metadata} />
              <Helmet
                titleTemplate={`${metadata.name.name} ${metadata.accession} - Entry - InterPro`}
              >
                <title>InterPro</title>
              </Helmet>
            </>
          )}

        {
          // MD icon
          isEntry &&
            metadata.type &&
            metadata.source_database &&
            metadata.source_database.toLowerCase() !== 'interpro' && (
              <div className={f('icon-container')}>
                <MemberSymbol type={metadata.source_database} />
              </div>
            )
        }
        {metadata && (
          <Helmet
            titleTemplate={`${
              metadata.name.name || metadata.name.short || metadata.accession
            } (${metadata.accession}) - ${
              isEntry ? dbLabel : ' '
            } ${mainType} - InterPro`}
          >
            <title>InterPro</title>
          </Helmet>
        )}

        <div className={f('title-name')}>
          {
            // add margin only for IPSCAN result page
            metadata.name.name === 'InterProScan Search Result' ? (
              <h3 className={f('margin-bottom-large')}>
                {metadata.name.name}{' '}
              </h3>
            ) : (
              <h3>{metadata.name.name}</h3>
            )
          }
          <TitleTag metadata={metadata} mainType={mainType} dbLabel={dbLabel} />
          {
            // Showing Favourites only for InterPro entries for now
            isEntry &&
              metadata.type &&
              metadata.source_database &&
              metadata.source_database.toLowerCase() === 'interpro' && (
                <button
                  className={f('button')}
                  onClick={() => this.manageFavourites(metadata)}
                >
                  {this.state.entries.includes(metadata.accession)
                    ? 'Remove from Favourites'
                    : 'Mark as Favourite'}
                </button>
              )
          }
        </div>
        <AccessionTag metadata={metadata} mainType={mainType} />
      </div>
    );
  }
}

export default connect(null, { markFavourite, unmarkFavourite })(
  loadData(getUrlForMeta)(Title),
);
