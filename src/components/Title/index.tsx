import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet-async';

import MemberSymbol from 'components/Entry/MemberSymbol';
import loadWebComponent from 'utils/load-web-component';

import loadData from 'higherOrder/loadData/ts';
import { getUrlForMeta } from '../../higherOrder/loadData/defaults';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { markFavourite, unmarkFavourite } from 'actions/creators';

import EntryIcon from './EntryIcon';
import AccessionTag from './AccessionTag';
import TitleTag, { FragmentTag } from './TitleTag';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-vf.css';
import styles from './style.css';
import { getTooltipContentFormMetadata, MiniBadgeAI } from '../Entry/BadgeAI';

const css = cssBinder(fonts, ipro, styles);

type Props = {
  /**
   * The metadata object from the payload of the respective entity.
   */
  metadata: Metadata;
  /**
   * The endpoint of the entity, i.e. `'entry' | 'protein' | 'structure' | 'taxonomy' | 'proteome' | 'set'`
   */
  mainType: Endpoint;
  /**
   * List of previously tagged as favourite entries
   */
  entries?: Array<string>;
  /**
   * function to call when the entry needs to be marked as favourite
   */
  markFavourite?: typeof markFavourite;
  /**
   * function to call when the entry needs to be unmarked as favourite
   */
  unmarkFavourite?: typeof unmarkFavourite;
};

interface LoadedProps extends Props, LoadDataProps<RootAPIPayload> {}

export class Title extends PureComponent<LoadedProps> {
  componentDidMount() {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
    ).as('interpro-type');
  }

  manageFavourites(metadata: Metadata) {
    if ((this.props.entries || []).includes(metadata.accession)) {
      this.props.unmarkFavourite?.(metadata.accession);
    } else {
      this.props.markFavourite?.(metadata.accession, { metadata });
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

    const longName =
      typeof (metadata as ProteinMetadata).name === 'string'
        ? (metadata as ProteinMetadata).name
        : (metadata as EntryMetadata).name.name ||
          (metadata as EntryMetadata).name.short ||
          (metadata as EntryMetadata).accession;
    const isIPScanResult = longName === 'InterProScan Search Result';

    const entryMetadata = metadata as EntryMetadata;

    return (
      <div className={css('title')} data-testid="titlebar">
        {isEntry &&
          entryMetadata.type &&
          entryMetadata &&
          entryMetadata.source_database.toLowerCase() === 'interpro' && (
            <>
              <EntryIcon type={(metadata as EntryMetadata).type} />
              <Helmet
                titleTemplate={`${longName} ${metadata.accession} - Entry - InterPro`}
              >
                <title>InterPro</title>
              </Helmet>
            </>
          )}

        {
          // MD icon
          isEntry &&
            entryMetadata.type &&
            entryMetadata.source_database &&
            entryMetadata.source_database.toLowerCase() !== 'interpro' && (
              <div className={css('icon-container')}>
                <MemberSymbol
                  type={entryMetadata.source_database as MemberDB}
                  svg={false}
                  filter={false}
                  includeLink={true}
                />
              </div>
            )
        }
        {metadata && (
          <Helmet
            titleTemplate={`${longName} (${metadata.accession}) - ${
              isEntry ? dbLabel : ' '
            } ${mainType} - InterPro`}
          >
            <title>InterPro</title>
          </Helmet>
        )}

        <div
          className={css('title-name', {
            ipscan: isIPScanResult,
          })}
        >
          <div className={css('title-fav')}>
            <AccessionTag
              accession={metadata.accession}
              db={metadata.source_database}
              type={(metadata as EntryMetadata).type}
              mainType={mainType}
              isIPScanResult={isIPScanResult}
            />

            <h3
              className={css({
                'margin-bottom-large': isIPScanResult,
              })}
            >
              {longName}{' '}
              {(metadata as EntryMetadata).is_llm && (
                <MiniBadgeAI
                  tooltipText={getTooltipContentFormMetadata(
                    metadata as EntryMetadata,
                  )}
                />
              )}
            </h3>
            {
              // Showing Favourites only for InterPro entries for now
              isEntry &&
                entryMetadata.type &&
                entryMetadata.source_database &&
                entryMetadata.source_database.toLowerCase() === 'interpro' && (
                  <span
                    className={css('fav-icon')}
                    role="button"
                    onClick={() => this.manageFavourites(metadata)}
                    onKeyDown={() => this.manageFavourites(metadata)}
                    tabIndex={0}
                  >
                    <span
                      className={css(
                        'icon',
                        'icon-common',
                        (this.props.entries || []).includes(metadata.accession)
                          ? 'favourite'
                          : 'normal',
                      )}
                      data-icon="&#xf005;"
                    />
                  </span>
                )
            }
          </div>

          <TitleTag
            db={metadata?.source_database}
            mainType={mainType}
            dbLabel={dbLabel}
          />
        </div>
        <FragmentTag
          isFragment={!!(metadata as ProteinMetadata)?.is_fragment}
        />
      </div>
    );
  }
}
const mapStateToProps = createSelector(
  (state: { favourites: { entries: string[] } }) => state.favourites.entries,
  (entries: string[]) => ({ entries }),
);

export default connect(mapStateToProps, { markFavourite, unmarkFavourite })(
  loadData(getUrlForMeta)(Title),
);
