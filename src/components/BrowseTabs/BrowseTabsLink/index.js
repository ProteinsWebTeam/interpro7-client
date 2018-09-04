// @flow
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

const getValue = (loading, payload, counter, name) => {
  if (loading || !payload || !payload.metadata) return null;
  if (name === 'Domain Architectures') {
    if (payload.metadata.source_database.toLowerCase() !== 'interpro') return 0;
    // TODO: find a generic way to deal with this:
    if (payload.metadata.counters && !payload.metadata.counters.proteins) {
      return null;
    }
  }
  // TODO: find a generic way to deal with this:
  if (whitelist.has(name)) return NaN;
  if (
    payload.metadata.counters &&
    Number.isFinite(payload.metadata.counters[counter])
  ) {
    return payload.metadata.counters[counter];
  } // Enabling the menuitems that appear in the entry_annotations array.
  // i.e. only enable the menu item if there is info for it
  if (
    payload.metadata.entry_annotations &&
    payload.metadata.entry_annotations.includes(singleEntityNames.get(name))
  ) {
    return NaN;
  }
  return null;
};

/*:: type Props = {
  to: Object | function,
  name: string,
  exact?: boolean,
  counter: string,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
  isFirstLevel?: boolean,
  isSignature: boolean
}; */

class BrowseTabsLink extends PureComponent /*:: <Props> */ {
  static propTypes = {
    to: T.oneOfType([T.object, T.func]).isRequired,
    name: T.string.isRequired,
    exact: T.bool,
    counter: T.string,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    isFirstLevel: T.bool,
    isSignature: T.bool,
  };

  render() {
    const {
      to,
      name,
      exact,
      counter,
      data: { loading, payload },
      isFirstLevel,
      isSignature,
    } = this.props;

    const value = getValue(loading, payload, counter, name);

    if (!isFirstLevel && !isNaN(value) && !value) return null;

    return (
      <Link
        to={to}
        exact={exact}
        className={f('browse-tabs-link', { ['is-signature']: isSignature })}
        activeClass={f('is-active', 'is-active-tab')}
        // disabled={!isFirstLevel && !isNaN(value) && !value}
      >
        {name}
        {value !== null && ' '}
        {value !== null &&
          !isNaN(value) && <NumberLabel value={value} loading={loading} abbr />}
      </Link>
    );
  }
}

export default BrowseTabsLink;
