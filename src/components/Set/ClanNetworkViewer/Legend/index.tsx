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

// The node shapes as drawn, so the legend can show one rather than name it.
const SHAPES: Record<string, React.ReactNode> = {
  dot: <circle cx="8" cy="8" r="7" />,
  square: <rect x="1" y="1" width="14" height="14" />,
  box: <rect x="1" y="3" width="14" height="10" rx="3" />,
  triangle: <polygon points="8,1 15,15 1,15" />,
  triangleDown: <polygon points="1,1 15,1 8,15" />,
  diamond: <polygon points="8,0 16,8 8,16 0,8" />,
  hexagon: <polygon points="12,1 4,1 0,8 4,15 12,15 16,8" />,
  star: (
    <polygon points="8,0 9.9,5.4 15.6,5.5 11,9 12.7,14.5 8,11.2 3.3,14.5 5,9 0.4,5.5 6.1,5.4" />
  ),
};

const ShapeSwatch = ({ type }: { type: string }) => (
  <svg
    className={css('legend-shape')}
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="currentColor"
    aria-hidden="true"
  >
    {SHAPES[getShapeForType(type)] || SHAPES.dot}
  </svg>
);

const STATUS_ORDER: Array<ClanMembershipStatus> = [
  'current-clan',
  'other-clan',
  'no-clan',
];

// 'homologous_superfamily' -> 'homologous superfamily'
const humanize = (value: string): string =>
  value.replace(/_/g, ' ').toLowerCase();

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
          <header>Clan membership</header>
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
          <header>Entry type</header>
          <ul className={css('no-bullet')}>
            {types.map((type) => (
              <li key={type}>
                <ShapeSwatch type={type} />
                {capitalize(humanize(type))}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(knownMethodLegend.length > 0 || otherMethods.length > 0) && (
        <div className={css('legend-block')}>
          <header>Predicted by</header>
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
                        className={css('legend-line')}
                        style={{ borderTopColor: tier.color }}
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
                        className={css('legend-line')}
                        style={{
                          borderTopColor: getMethodColor(
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
          <header>Relationship</header>
          <ul className={css('no-bullet')}>
            <li>
              <span className={css('legend-line', 'legend-line-dashed')} />
              Nested domain relationship
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};

export default Legend;
