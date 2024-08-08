import React from 'react';

import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';

import { singleEntity } from 'menuConfig';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';

const css = cssBinder(styles);

const singleEntityNames = new Map(
  Array.from(singleEntity).map((e) => [e[1].name, e[0]]),
);

const whitelist = new Set(['Overview', 'Domain Architectures', 'Sequence']);

const getValue = (metadata: Metadata, counter: string, name: string) => {
  if (!metadata) return NaN;
  if (name === 'Domain Architectures') {
    if (metadata.source_database.toLowerCase() !== 'interpro') return 0;
    // TODO: find a generic way to deal with this:
    if (metadata.counters && !metadata.counters.proteins) {
      return NaN;
    }
  }
  // TODO: find a generic way to deal with this:
  if (whitelist.has(name)) return NaN;
  if (metadata.counters && Number.isFinite(metadata.counters[counter])) {
    return metadata.counters[counter] as number;
  } // Enabling the menuitems that appear in the entry_annotations object.
  // i.e. only enable the menu item if there is info for it
  if (
    (metadata as EntryMetadata).entry_annotations &&
    Object.prototype.hasOwnProperty.call(
      metadata as EntryMetadata,
      singleEntityNames.get(name) || '',
    )
  ) {
    return NaN;
  }
  return NaN;
};

type Props = {
  to:
    | InterProPartialLocation
    | ((loc: InterProLocation) => InterProPartialLocation);
  name: string;
  exact?: boolean;
  counter?: string;
  metadata: Metadata;
  isFirstLevel?: boolean;
  isSignature?: boolean;
};

const BrowseTabsLink = ({
  to,
  name,
  exact,
  counter,
  metadata,
  isFirstLevel,
  isSignature,
}: Props) => {
  const value = getValue(metadata, counter || '', name);

  if (!isFirstLevel && !isNaN(value) && value < 0) return null;

  return (
    <Link
      to={to}
      exact={exact}
      className={css('browse-tabs-link', { ['is-signature']: isSignature })}
      activeClass={css('is-active', 'is-active-tab')}
      data-testid={`browse-tab-${name.toLowerCase().replace(/\s+/g, '_')}`}
    >
      {name}
      {value !== null && ' '}
      {value !== null && !isNaN(value) && value > 0 && (
        <NumberComponent label abbr>
          {value}
        </NumberComponent>
      )}
    </Link>
  );
};

export default BrowseTabsLink;
