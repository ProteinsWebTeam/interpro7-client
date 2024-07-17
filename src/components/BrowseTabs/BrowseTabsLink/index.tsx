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

const getValue = (
  loading: boolean,
  payload: MetadataPayload<Metadata> | null,
  counter: string,
  name: string,
) => {
  if (loading || !payload || !payload.metadata) return NaN;
  if (name === 'Domain Architectures') {
    if (payload.metadata.source_database.toLowerCase() !== 'interpro') return 0;
    // TODO: find a generic way to deal with this:
    if (payload.metadata.counters && !payload.metadata.counters.proteins) {
      return NaN;
    }
  }
  // TODO: find a generic way to deal with this:
  if (whitelist.has(name)) return NaN;
  if (
    payload.metadata.counters &&
    Number.isFinite(payload.metadata.counters[counter])
  ) {
    return payload.metadata.counters[counter] as number;
  } // Enabling the menuitems that appear in the entry_annotations object.
  // i.e. only enable the menu item if there is info for it
  if (
    (payload.metadata as EntryMetadata).entry_annotations &&
    Object.prototype.hasOwnProperty.call(
      payload.metadata as EntryMetadata,
      singleEntityNames.get(name) || '',
    )
  ) {
    return NaN;
  }
  return NaN;
};

type Props = {
  to: InterProLocation | ((loc: InterProLocation) => InterProLocation);
  name: string;
  exact?: boolean;
  counter?: string;
  data: RequestedData<MetadataPayload<Metadata>>;
  isFirstLevel?: boolean;
  isSignature?: boolean;
};

const BrowseTabsLink = ({
  to,
  name,
  exact,
  counter,
  data: { loading, payload },
  isFirstLevel,
  isSignature,
}: Props) => {
  const value = getValue(loading, payload, counter || '', name);

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
        <NumberComponent label loading={loading} abbr>
          {value}
        </NumberComponent>
      )}
    </Link>
  );
};

export default BrowseTabsLink;
