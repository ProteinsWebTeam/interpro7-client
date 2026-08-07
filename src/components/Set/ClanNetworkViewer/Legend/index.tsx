import React from 'react';

import cssBinder from 'styles/cssBinder';

import {
  STATUS_COLOR,
  STATUS_LABEL,
  METHOD_LEGEND,
  getClanStatus,
  getMethodColor,
} from '../colorPalette';
import { getShapeForType } from '../buildNodes';
import {
  ClanNetworkLink,
  ClanNetworkNode,
  ClanMembershipStatus,
} from '../types';

import style from '../style.css';

const css = cssBinder(style);

type Props = {
  nodes: Array<ClanNetworkNode>;
  links: Array<ClanNetworkLink>;
  currentClanAccession: string;
};

const KNOWN_METHODS = new Set(METHOD_LEGEND.map(({ method }) => method));

const STATUS_ORDER: Array<ClanMembershipStatus> = [
  'current-clan',
  'other-clan',
  'no-clan',
];

// 'homologous_superfamily' -> 'Homologous superfamily',
// 'triangleDown' -> 'triangle down'
const humanize = (value: string): string =>
  value
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

const uniqueInOrder = <T,>(values: Array<T>, order: Array<T>): Array<T> => {
  const present = new Set(values);
  return order.filter((value) => present.has(value));
};

const Legend = ({ nodes, links, currentClanAccession }: Props) => {
  // Every section below is derived from what is actually drawn, so a clan
  // with, say, no DALI edges and no nested links gets no entries for them.
  const statuses = uniqueInOrder(
    nodes.map((node) => getClanStatus(node, currentClanAccession)),
    STATUS_ORDER,
  );
  const types = Array.from(
    new Set(nodes.map((node) => node.type).filter(Boolean)),
  ).sort();
  const methods = Array.from(
    new Set(links.map((link) => (link.method || 'unknown').toLowerCase())),
  ).sort();
  const otherMethods = methods.filter((method) => !KNOWN_METHODS.has(method));
  const knownMethodLegend = METHOD_LEGEND.filter(({ method }) =>
    methods.includes(method),
  );
  const hasNested = links.some((link) => link.nested);

  return (
    <section className={css('clan-network-legend')}>
      {statuses.length > 0 && (
        <div className={css('legend-block')}>
          <header>Node color (clan membership)</header>
          <ul className={css('no-bullet')}>
            {statuses.map((status) => (
              <li key={status}>
                <span
                  className={css('legend-swatch')}
                  style={{ backgroundColor: STATUS_COLOR[status].background }}
                />
                {STATUS_LABEL[status]}
              </li>
            ))}
          </ul>
        </div>
      )}
      {types.length > 0 && (
        <div className={css('legend-block')}>
          <header>Node shape (entry type)</header>
          <ul className={css('no-bullet')}>
            {types.map((type) => (
              <li key={type}>
                {capitalize(humanize(type))} ({humanize(getShapeForType(type))})
              </li>
            ))}
          </ul>
        </div>
      )}
      {(knownMethodLegend.length > 0 || otherMethods.length > 0) && (
        <div className={css('legend-block')}>
          <header>Edge color (comparison method)</header>
          {/* One column per method rather than one long stack: with four
              methods and three tiers each, a single list is taller than it
              is wide and pushes the rest of the page down. */}
          <div className={css('legend-methods')}>
            {knownMethodLegend.map(({ method, label, tiers }) => (
              <div key={method} className={css('legend-method')}>
                <span className={css('legend-method-name')}>{label}</span>
                <ul className={css('no-bullet')}>
                  {tiers.map((tier) => (
                    <li key={tier.label}>
                      <span
                        className={css('legend-swatch')}
                        style={{ backgroundColor: tier.color }}
                      />
                      {tier.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {otherMethods.length > 0 && (
              <div className={css('legend-method')}>
                <span className={css('legend-method-name')}>Other</span>
                <ul className={css('no-bullet')}>
                  {otherMethods.map((method) => (
                    <li key={method}>
                      <span
                        className={css('legend-swatch')}
                        style={{
                          backgroundColor: getMethodColor(
                            method === 'unknown' ? undefined : method,
                          ),
                        }}
                      />
                      {method}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {hasNested && (
        <div className={css('legend-block')}>
          <header>Edge style</header>
          <ul className={css('no-bullet')}>
            <li>
              <span className={css('legend-dashed-line')} />
              Nested domain relationship
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default Legend;
