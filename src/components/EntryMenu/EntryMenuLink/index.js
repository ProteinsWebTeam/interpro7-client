// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';

import { singleEntity } from 'menuConfig';

import { foundationPartial } from 'styles/foundation';

import pages from 'pages/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import { createSelector } from 'reselect';

const f = foundationPartial(pages, fonts, local);

const singleEntityNames = new Map(
  Array.from(singleEntity).map((e) => [e[1].name, e[0]]),
);

const whitelist = new Set(['Overview', 'Sequence', 'Alignments']);

const icons = new Map([
  ['Overview', { icon: '\uF2BB', class: 'icon-common' }],
  ['Entries', { icon: '\uF1C0', class: 'icon-common' }],
  ['Proteins', { icon: 'P', class: 'icon-conceptual' }],
  ['Structures', { icon: 's', class: 'icon-conceptual' }],
  ['Domain Architectures', { icon: undefined, class: 'icon-count-ida' }],
  ['Taxonomy', { icon: undefined, class: 'icon-count-species' }],
  ['Proteomes', { icon: undefined, class: 'icon-count-proteome' }],
  ['Sets', { icon: undefined, class: 'icon-count-set' }],
  ['Signature', { icon: undefined, class: 'icon-count-hmm' }],
  ['Alignments', { icon: '\uF1DE', class: 'icon-common' }],
  ['Sequence', { icon: '\uF120', class: 'icon-common' }],
  ['Curation', { icon: undefined, class: 'icon-common' }],
  ['New Structural Model', { icon: undefined, class: 'icon-common' }],
]);

export const EntryMenuLinkWithoutData = (
  {
    name,
    value,
    loading,
    to,
    exact,
    usedOnTheSide,
  } /*: {
    name: string,
    value: ?number,
    loading: boolean,
    to: function,
    exact?: ?boolean,
    usedOnTheSide?: boolean
  }*/,
) => (
  <li
    className={f('tabs-title', { ['used-on-the-side']: usedOnTheSide })}
    data-testid={`menu-${name.toLowerCase().replace(/\s+/g, '_')}`}
  >
    <Link
      to={to}
      exact={exact}
      className={f('browse-tabs-link')}
      activeClass={f('is-active', 'is-active-tab')}
    >
      <span data-content={name} className={f('name')}>
        <i
          data-icon={(icons.get(name) || {}).icon}
          className={f(
            'icon',
            (icons.get(name) || {}).class,
            'icon-count-sm',
            'margin-right-medium',
          )}
          aria-label={`icon ${name}`}
          data-testid={`entry-menu-${name.toLowerCase().replace(/\s+/g, '_')}`}
        />
        {name}
      </span>
      {value !== null && ' '}
      {value !== null && !isNaN(value) && (
        <NumberComponent
          label
          loading={loading}
          abbr
          duration={usedOnTheSide ? 0 : undefined}
          className={f('counter')}
          noAnimation
        >
          {value}
        </NumberComponent>
      )}
    </Link>
  </li>
);
EntryMenuLinkWithoutData.propTypes = {
  name: T.string.isRequired,
  value: T.number,
  loading: T.bool,
  to: T.oneOfType([T.object, T.func]).isRequired,
  exact: T.bool,
  usedOnTheSide: T.bool,
};

const hasAlignments = (name, annotations) => {
  if (name !== 'Alignment') return false;
  for (const ann of annotations) {
    if (ann.startsWith('alignment:')) return true;
  }
  return false;
};
/*:: type Props = {
  to: Object | function,
  exact?: ?boolean,
  name: string,
  counter: string,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
  isFirstLevel?: boolean,
  usedOnTheSide?: boolean,
  mainKey ?: string,
  entryDB ?: string,
}; */

export class EntryMenuLink extends PureComponent /*:: <Props> */ {
  static propTypes = {
    to: T.oneOfType([T.object, T.func]).isRequired,
    exact: T.bool,
    name: T.string.isRequired,
    counter: T.string,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isFirstLevel: T.bool,
    usedOnTheSide: T.bool,
    mainKey: T.string,
    entryDB: T.string,
  };

  // eslint-disable-next-line
  render() {
    const {
      to,
      exact,
      name,
      counter,
      data: { loading, payload },
      isFirstLevel,
      usedOnTheSide,
      mainKey,
      entryDB,
    } = this.props;
    let value = null;
    if (!loading && payload && payload.metadata) {
      if (
        payload.metadata.counters &&
        Number.isFinite(payload.metadata.counters[counter])
      ) {
        value = payload.metadata.counters[counter];
        if (
          name.toLowerCase() === 'entries' &&
          mainKey &&
          mainKey.toLowerCase() !== 'set'
        ) {
          value = payload.metadata.counters.dbEntries.interpro
            ? payload.metadata.counters.dbEntries.interpro
            : value;
          if (entryDB) {
            value = payload.metadata.counters.dbEntries[entryDB.toLowerCase()];
          }
        }
      } // Enabling the menuitems that appear in the entry_annotations array.
      // i.e. only enable the menu item if there is info for it
      if (
        payload.metadata.entry_annotations &&
        (payload.metadata.entry_annotations.includes(
          singleEntityNames.get(name),
        ) ||
          hasAlignments(name, payload.metadata.entry_annotations))
      ) {
        value = NaN;
      }
      // TODO: find a generic way to deal with this:
      if (whitelist.has(name)) value = NaN;
      // TODO: find a generic way to deal with this:
      if (
        name === 'Pathways' &&
        payload.metadata.source_database.toLowerCase() !== 'interpro'
      ) {
        value = null;
      }

      if (
        name === 'Curation' &&
        payload.metadata.source_database.toLowerCase() === 'pfam'
      ) {
        value = NaN;
      }

      if (name === 'New Structural Model') {
        // TODO Add condition to display if there are structural models available for UniProt proteins that match InterPro entry
        if (payload.metadata.source_database.toLowerCase() === 'interpro') {
          value = NaN;
        } else if (mainKey && mainKey.toLowerCase() === 'protein') {
          // TODO display if the Uniprot accession has structural models
          value = NaN;
        }
      }
    }

    if (!isFirstLevel && !isNaN(value) && !value) return null;

    return (
      <EntryMenuLinkWithoutData
        name={name}
        value={value}
        loading={loading}
        to={to}
        exact={exact}
        usedOnTheSide={usedOnTheSide}
      />
    );
  }
}
const mapStateToProps = createSelector(
  (state) => state.customLocation.description.main.key,
  (state) => state.customLocation.description.entry.db,
  (mainKey, entryDB) => ({ mainKey, entryDB }),
);

export default connect(mapStateToProps)(EntryMenuLink);
