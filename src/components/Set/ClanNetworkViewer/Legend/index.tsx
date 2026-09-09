import React from 'react';

import cssBinder from 'styles/cssBinder';

import {
  STATUS_COLOR,
  STATUS_LABEL,
  METHOD_LEGEND,
  getClanStatus,
  getMethodColor,
  isDefaultFilterState,
} from '../colorPalette';
import { getShapeForType } from '../buildNodes';
import {
  FilterKey,
  methodKey,
  NESTED_KEY,
  statusKey,
  tierKey,
  typeKey,
} from '../filterKeys';
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
  disabled: Set<FilterKey>;
  onToggle: (key: FilterKey) => void;
  onReset: () => void;
};

const KNOWN_METHODS = new Set(METHOD_LEGEND.map(({ method }) => method));

// The node shapes as drawn, so the legend can show one rather than name it.
const SHAPES: Record<string, React.ReactNode> = {
  dot: <circle cx="8" cy="8" r="7" />,
  ellipse: <ellipse cx="8" cy="8" rx="7.5" ry="5" />,
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

// Every legend entry is the filter for what it describes: clicking one hides
// those nodes or edges and strikes the entry through. A button rather than a
// styled span so it is reachable by keyboard and announces its state.
const Toggle = ({
  filterKey,
  disabled,
  onToggle,
  children,
}: {
  filterKey: FilterKey;
  disabled: Set<FilterKey>;
  onToggle: (key: FilterKey) => void;
  children: React.ReactNode;
}) => {
  const isOff = disabled.has(filterKey);
  return (
    <button
      type="button"
      className={css('legend-toggle', { 'legend-toggle-off': isOff })}
      aria-pressed={!isOff}
      onClick={() => onToggle(filterKey)}
      title={isOff ? 'Click to show' : 'Click to hide'}
    >
      {children}
    </button>
  );
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

const Legend = ({
  nodes,
  links,
  currentClanAccession,
  disabled,
  onToggle,
  onReset,
}: Props) => {
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
                <Toggle
                  filterKey={statusKey(status)}
                  disabled={disabled}
                  onToggle={onToggle}
                >
                  <span
                    className={css('legend-swatch')}
                    style={{ backgroundColor: STATUS_COLOR[status].background }}
                  />
                  {STATUS_LABEL[status]}
                </Toggle>
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
                <Toggle
                  filterKey={typeKey(type)}
                  disabled={disabled}
                  onToggle={onToggle}
                >
                  <ShapeSwatch type={type} />
                  {capitalize(humanize(type))}
                </Toggle>
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
                {/* The method name switches the whole method off, since each of
                    its edges carries the method key as well as its tier key. */}
                <span className={css('legend-method-name')}>
                  <Toggle
                    filterKey={methodKey(method)}
                    disabled={disabled}
                    onToggle={onToggle}
                  >
                    {label}
                  </Toggle>
                </span>
                <ul className={css('no-bullet')}>
                  {tiers.map((tier, tierIndex) => (
                    <li key={tier.label}>
                      <Toggle
                        filterKey={tierKey(method, tierIndex)}
                        disabled={disabled}
                        onToggle={onToggle}
                      >
                        <span
                          className={css('legend-line')}
                          style={{ borderTopColor: tier.color }}
                        />
                        {tier.label}
                      </Toggle>
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
                      <Toggle
                        filterKey={methodKey(method)}
                        disabled={disabled}
                        onToggle={onToggle}
                      >
                        <span
                          className={css('legend-line')}
                          style={{
                            borderTopColor: getMethodColor(
                              method === 'unknown' ? undefined : method,
                            ),
                          }}
                        />
                        {method}
                      </Toggle>
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
              <Toggle
                filterKey={NESTED_KEY}
                disabled={disabled}
                onToggle={onToggle}
              >
                <span className={css('legend-line', 'legend-line-dashed')} />
                Nested domain relationship
              </Toggle>
            </li>
          </ul>
        </div>
      )}
      {!isDefaultFilterState(disabled) && (
        <div className={css('legend-block')}>
          <header>Filters</header>
          <button
            type="button"
            className={css('legend-reset')}
            onClick={onReset}
          >
            Reset filters
            {disabled.size > 0 ? ` (${disabled.size} hidden)` : ''}
          </button>
        </div>
      )}
    </section>
  );
};

export default Legend;
