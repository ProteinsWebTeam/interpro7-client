import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import NumberLabel from 'components/NumberLabel';

import { singleEntity } from 'menuConfig';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

const singleEntityNames = new Map(
  Array.from(singleEntity).map(e => [e[1].name, e[0]]),
);

const whitelist = new Set(['Overview', 'Domain Architectures', 'Sequence']);

/*:: type Props = {
  to: Object | function,
  exact: ?boolean,
  name: string,
  counter: string,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
  isFirstLevel?: boolean,
  isSignature: boolean
}; */

const mapNameToClass = new Map([
  ['Domain', 'menu-domain'],
  ['Family', 'menu-family'],
  ['Repeat', 'menu-repeat'],
  ['Unknown', 'menu-unknown'],
  ['Conserved_site', 'menu-site'],
  ['Binding_site', 'menu-site'],
  ['Active_site', 'menu-site'],
  ['PTM', 'menu-site'],
]);

class EntryMenuLink extends PureComponent /*:: <Props> */ {
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
    isSignature: T.bool.isRequired,
  };

  render() {
    const {
      to,
      exact,
      name,
      counter,
      data: { loading, payload },
      isFirstLevel,
      isSignature,
    } = this.props;
    let value = null;
    if (!loading && payload && payload.metadata) {
      if (
        payload.metadata.counters &&
        Number.isFinite(payload.metadata.counters[counter])
      ) {
        value = payload.metadata.counters[counter];
      } // Enabling the menuitems that appear in the entry_annotations array.
      // i.e. only enable the menu item if there is info for it
      if (
        payload.metadata.entry_annotations &&
        payload.metadata.entry_annotations.includes(singleEntityNames.get(name))
      ) {
        value = NaN;
      }
      // TODO: find a generic way to deal with this:
      if (whitelist.has(name)) value = NaN;
      if (
        name === 'Domain Architectures' &&
        payload.metadata.counters &&
        !payload.metadata.counters.proteins
      ) {
        value = 0;
      }
      // TODO: find a generic way to deal with this:
      if (
        name === 'Domain Architectures' &&
        payload.metadata.source_database.toLowerCase() !== 'interpro'
      ) {
        value = null;
      }
    }

    if (!isFirstLevel && !isNaN(value) && !value) return null;

    return (
      <li className={f('tabs-title')}>
        <Link
          to={to}
          exact={exact}
          className={f(
            payload.metadata.source_database.toLowerCase() === 'interpro'
              ? mapNameToClass.get(payload.metadata.type)
              : null,
            'browse-tabs-link',
            { ['is-signature']: isSignature },
          )}
          activeClass={f('is-active', 'is-active-tab')}
          // disabled={!isFirstLevel && !isNaN(value) && !value}
        >
          {name}
          {value !== null && ' '}
          {value !== null &&
            !isNaN(value) && <NumberLabel loading={loading} value={value} />}
        </Link>
      </li>
    );
  }
}

export default EntryMenuLink;
