// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';

// $FlowFixMe
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
  { name, value, loading, to, exact, usedOnTheSide, collapsed } /*: {
    name: string,
    value: ?number,
    loading: boolean,
    to: function,
    exact?: ?boolean,
    collapsed?: ?boolean,
    usedOnTheSide?: boolean
  }*/,
) => (
  <li
    className={f('tabs-title', {
      ['used-on-the-side']: usedOnTheSide,
      collapsed,
    })}
    data-testid={`menu-${name.toLowerCase().replace(/\s+/g, '_')}`}
  >
    <Link
      to={to}
      exact={exact}
      className={f('browse-tabs-link', {
        'withuot-counter': value === null || isNaN(value),
      })}
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
  collapsed: T.bool,
};

const hasAlignments = (name, db, annotations) => {
  if (name !== 'Alignment' || db === 'InterPro') return false;
  for (const ann of Object.keys(annotations)) {
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
  collapsed?: boolean,
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
    collapsed: T.bool,
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
      collapsed,
      mainKey,
      entryDB,
    } = this.props;
    let value = null;
    let shouldPointToAll = false;
    if (!loading && payload && payload.metadata) {
      if (payload.metadata.counters) {
        if (counter) {
          // Some tabs do not have counter
          let counterValue;
          counter.split('.').forEach((key, index) => {
            if (index === 0) counterValue = payload.metadata.counters[key];
            else if (typeof counterValue === 'object')
              counterValue = counterValue[key];
          });

          if (Number.isFinite(counterValue)) value = counterValue;
        }
        if (
          name.toLowerCase() === 'entries' &&
          mainKey &&
          mainKey.toLowerCase() !== 'set'
        ) {
          if (payload.metadata.counters.dbEntries.interpro) {
            value = payload.metadata.counters.dbEntries.interpro;
          } else {
            shouldPointToAll = true;
          }
          if (entryDB) {
            value = payload.metadata.counters.dbEntries[entryDB.toLowerCase()];
          }
        }
      }

      /**
       * Enabling the menuitems that appear in the entry_annotations array,
       * i.e. only enable the menu item if there is info for it.
       */
      if (
        payload.metadata.entry_annotations &&
        (payload.metadata.entry_annotations.hasOwnProperty(
          singleEntityNames.get(name),
        ) ||
          hasAlignments(name, entryDB, payload.metadata.entry_annotations))
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
    }

    if (!isFirstLevel && !isNaN(value) && !value) return null;
    const newTo = shouldPointToAll
      ? (customLocation) => {
          const newLocation = to(customLocation);
          newLocation.description.entry.db = 'all';
          return newLocation;
        }
      : to;
    return (
      <EntryMenuLinkWithoutData
        name={name}
        value={value}
        loading={loading}
        to={newTo}
        exact={exact}
        usedOnTheSide={usedOnTheSide}
        collapsed={collapsed}
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
