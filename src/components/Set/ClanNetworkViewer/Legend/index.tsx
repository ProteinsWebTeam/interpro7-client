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
  // The keys anything still on the canvas answers to, which is what decides
  // which entries are worth drawing (see nodeVisibility.ts).
  visible: Set<FilterKey>;
  onToggle: (keys: Array<FilterKey>) => void;
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
//
// An entry can stand for several keys (a method for all of its tiers); it
// reads as off only when every one of them is.
const Toggle = ({
  filterKeys,
  disabled,
  available,
  onToggle,
  children,
}: {
  filterKeys: Array<FilterKey>;
  disabled: Set<FilterKey>;
  // Whether anything on the canvas still answers to this entry. One that
  // nothing does is greyed out and stops responding, rather than leaving the
  // legend -- entries coming and going would change the size of the legend, and
  // with it (in full screen, where it shares the height with the canvas) the
  // size of the network itself.
  available: boolean;
  onToggle: (keys: Array<FilterKey>) => void;
  children: React.ReactNode;
}) => {
  const isOff = filterKeys.every((key) => disabled.has(key));
  return (
    <button
      type="button"
      className={css('legend-toggle', {
        'legend-toggle-off': isOff,
        'legend-toggle-unavailable': !available,
      })}
      aria-pressed={!isOff}
      disabled={!available}
      onClick={() => onToggle(filterKeys)}
      title={
        available
          ? `Click to ${isOff ? 'show' : 'hide'}`
          : 'Nothing on the network matches this'
      }
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
  visible,
  onToggle,
}: Props) => {
  // Whether anything on the canvas still answers to an entry. One the user has
  // switched off counts as available too: it is the only way of switching it
  // back on again, so it has to stay live.
  const isAvailable = (key: FilterKey) => visible.has(key) || disabled.has(key);

  // Every section is derived from the whole clan, so the legend holds the same
  // entries however the network is filtered -- a clan with no DALI edges gets
  // no entry for them, but one whose DALI edges are merely filtered away keeps
  // its entry, greyed out until they are back.
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
    <div className={css('clan-network-legend-root')}>
      {/* What the legend is, and what clicking any of it does -- said in a line
          of text rather than tucked behind something to open, so it reads the
          same floating over the canvas or laid out under it in full screen. */}
      <header className={css('clan-network-legend-header')}>
        <h5 className={css('clan-network-legend-title')}>Interactive legend</h5>
        <p className={css('clan-network-legend-hint')}>
          Click any item below to hide it, and again to bring it back
        </p>
      </header>
      <section className={css('clan-network-legend')}>
        {statuses.length > 0 && (
          <div className={css('legend-block')}>
            <header>Clan membership</header>
            <ul className={css('no-bullet')}>
              {statuses.map((status) => (
                <li key={status}>
                  <Toggle
                    filterKeys={[statusKey(status)]}
                    disabled={disabled}
                    available={isAvailable(statusKey(status))}
                    onToggle={onToggle}
                  >
                    <span
                      className={css('legend-swatch')}
                      style={{
                        backgroundColor: STATUS_COLOR[status].background,
                      }}
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
                    filterKeys={[typeKey(type)]}
                    disabled={disabled}
                    available={isAvailable(typeKey(type))}
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
                  {/* The method name switches all of its tiers at once, so the
                    tiers below always show what is actually hidden. */}
                  <span className={css('legend-method-name')}>
                    <Toggle
                      filterKeys={tiers.map((_, tierIndex) =>
                        tierKey(method, tierIndex),
                      )}
                      disabled={disabled}
                      available={tiers.some((_, tierIndex) =>
                        isAvailable(tierKey(method, tierIndex)),
                      )}
                      onToggle={onToggle}
                    >
                      {label}
                    </Toggle>
                  </span>
                  <ul className={css('no-bullet')}>
                    {tiers.map((tier, tierIndex) => (
                      <li key={tier.label}>
                        <Toggle
                          filterKeys={[tierKey(method, tierIndex)]}
                          disabled={disabled}
                          available={isAvailable(tierKey(method, tierIndex))}
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
                          filterKeys={[methodKey(method)]}
                          disabled={disabled}
                          available={isAvailable(methodKey(method))}
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
                  filterKeys={[NESTED_KEY]}
                  disabled={disabled}
                  available={isAvailable(NESTED_KEY)}
                  onToggle={onToggle}
                >
                  <span className={css('legend-line', 'legend-line-dashed')} />
                  Nested domain relationship
                </Toggle>
              </li>
            </ul>
          </div>
        )}
        {/* No "reset filters" here: the reset button on the canvas clears the
            filters along with everything else the view has been set to. */}
      </section>
    </div>
  );
};

export default Legend;
