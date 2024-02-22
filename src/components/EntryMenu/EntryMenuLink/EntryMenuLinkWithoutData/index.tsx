import React from 'react';

import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';

import cssBinder from 'styles/cssBinder';

import pages from 'pages/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';

const css = cssBinder(pages, fonts, local);

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

type Props = {
  name: string;
  loading: boolean;
  to:
    | InterProPartialLocation
    | ((location: InterProPartialLocation) => InterProPartialLocation);
  value?: number;
  exact?: boolean;
  collapsed?: boolean;
  usedOnTheSide?: boolean;
};
export const EntryMenuLinkWithoutData = ({
  name,
  value,
  loading,
  to,
  exact,
  usedOnTheSide,
  collapsed,
}: Props) => {
  const hasValue = value !== null && value !== undefined;
  return (
    <li
      className={css('tabs-title', {
        ['used-on-the-side']: usedOnTheSide,
        collapsed,
      })}
      data-testid={`menu-${name.toLowerCase().replace(/\s+/g, '_')}`}
    >
      <Link
        to={to}
        exact={exact}
        className={css('browse-tabs-link', {
          'withuot-counter': !hasValue || isNaN(value as unknown as number),
        })}
        activeClass={css('is-active', 'is-active-tab')}
      >
        <span data-content={name} className={css('name')}>
          <i
            data-icon={(icons.get(name) || {}).icon}
            className={css(
              'icon',
              (icons.get(name) || {}).class,
              'icon-count-sm',
              'margin-right-medium',
            )}
            aria-label={`icon ${name}`}
            data-testid={`entry-menu-${name
              .toLowerCase()
              .replace(/\s+/g, '_')}`}
          />
          {name}
        </span>
        {hasValue && ' '}
        {hasValue && !isNaN(value) && (
          <NumberComponent
            label
            loading={loading}
            abbr
            duration={usedOnTheSide ? 0 : undefined}
            className={css('counter')}
            noAnimation
          >
            {value}
          </NumberComponent>
        )}
      </Link>
    </li>
  );
};

export default EntryMenuLinkWithoutData;
