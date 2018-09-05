// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';

import { singleEntity } from 'menuConfig';

import { foundationPartial } from 'styles/foundation';

import pages from 'pages/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(pages, fonts, local);

const singleEntityNames = new Map(
  Array.from(singleEntity).map(e => [e[1].name, e[0]]),
);

const whitelist = new Set(['Overview', 'Sequence']);

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
  usedOnTheSide?: boolean,
}; */

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
    usedOnTheSide: T.bool,
  };

  render() {
    const {
      to,
      exact,
      name,
      counter,
      data: { loading, payload },
      isFirstLevel,
      usedOnTheSide,
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
      // if (
      //   name === 'Domain Architectures' &&
      //   payload.metadata.counters &&
      //   !payload.metadata.counters.proteins
      // ) {
      //   value = 0;
      // }
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
      <li className={f('tabs-title', { ['used-on-the-side']: usedOnTheSide })}>
        <Link
          to={to}
          exact={exact}
          className={f('browse-tabs-link')}
          activeClass={f('is-active', 'is-active-tab')}
        >
          <span data-content={name} className={f('name')}>
            {name === 'Entries' && (
              <i
                data-icon="D"
                className={f(
                  'icon',
                  'icon-generic',
                  'icon-count-sm',
                  'margin-right-medium',
                )}
                aria-label="icon entry matches"
              />
            )}
            {name === 'Proteins' && (
              <i
                data-icon="&#x50;"
                className={f(
                  'icon',
                  'icon-conceptual',
                  'icon-count-sm',
                  'margin-right-medium',
                )}
                aria-label="icon proteins"
              />
            )}
            {name === 'Structures' && (
              <i
                data-icon="s"
                className={f(
                  'icon',
                  'icon-conceptual',
                  'icon-count-sm',
                  'margin-right-medium',
                )}
                aria-label="icon structures"
              />
            )}
            {name === 'Domain Architectures' && (
              <i
                className={f(
                  'icon',
                  'icon-count-ida',
                  'icon-count-sm',
                  'margin-right-medium',
                )}
                aria-label="icon domain architectures"
              />
            )}
            {name === 'Taxonomy' && (
              <i
                className={f(
                  'icon',
                  'icon-count-species',
                  'icon-count-sm',
                  'margin-right-medium',
                )}
                aria-label="icon taxonomy"
              />
            )}
            {name === 'Proteomes' && (
              <i
                className={f(
                  'icon',
                  'icon-count-proteome',
                  'icon-count-sm',
                  'margin-right-medium',
                )}
                aria-label="icon proteomes"
              />
            )}
            {name === 'Sets' && (
              <i
                className={f(
                  'icon',
                  'icon-count-set',
                  'icon-count-sm',
                  'margin-right-medium',
                )}
                aria-label="icon set"
              />
            )}
            {name === 'Signature' && (
              <i
                className={f(
                  'icon',
                  'icon-count-hmm',
                  'icon-count-sm',
                  'margin-right-medium',
                )}
                aria-label="icon signature"
              />
            )}
            {name}
          </span>
          {value !== null && ' '}
          {value !== null &&
            !isNaN(value) && (
              <NumberComponent
                label
                loading={loading}
                abbr
                duration={usedOnTheSide ? 0 : undefined}
                className={f('counter')}
              >
                {value}
              </NumberComponent>
            )}
        </Link>
      </li>
    );
  }
}

export default EntryMenuLink;
