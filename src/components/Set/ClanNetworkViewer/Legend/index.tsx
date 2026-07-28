import React from 'react';

import cssBinder from 'styles/cssBinder';

import {
  STATUS_COLOR,
  STATUS_LABEL,
  METHOD_LEGEND,
  getMethodColor,
} from '../colorPalette';
import { ClanNetworkLink, ClanMembershipStatus } from '../types';

import style from '../style.css';

const css = cssBinder(style);

const SHAPE_LEGEND: Array<{ label: string }> = [
  { label: 'Domain (square)' },
  { label: 'Family (dot)' },
  { label: 'Homologous superfamily (hexagon)' },
  { label: 'Repeat (triangle)' },
  { label: 'Conserved site (diamond)' },
  { label: 'Active site (star)' },
  { label: 'Binding site (triangle down)' },
  { label: 'PTM (box)' },
];

type Props = {
  links: Array<ClanNetworkLink>;
};

const KNOWN_METHODS = new Set(METHOD_LEGEND.map(({ method }) => method));

const Legend = ({ links }: Props) => {
  const methods = Array.from(
    new Set(links.map((link) => link.method || 'unknown')),
  ).sort();
  const otherMethods = methods.filter(
    (method) => !KNOWN_METHODS.has(method.toLowerCase()),
  );

  return (
    <section className={css('clan-network-legend')}>
      <ul className={css('no-bullet')}>
        <header>Node color (clan membership)</header>
        {(Object.keys(STATUS_COLOR) as Array<ClanMembershipStatus>).map(
          (status) => (
            <li key={status}>
              <span
                className={css('legend-swatch')}
                style={{ backgroundColor: STATUS_COLOR[status].background }}
              />
              {STATUS_LABEL[status]}
            </li>
          ),
        )}
      </ul>
      <ul className={css('no-bullet')}>
        <header>Node shape (family type)</header>
        {SHAPE_LEGEND.map(({ label }) => (
          <li key={label}>{label}</li>
        ))}
      </ul>
      <ul className={css('no-bullet')}>
        <header>Edge color (comparison method)</header>
        {METHOD_LEGEND.filter(({ method }) => methods.includes(method)).map(
          ({ method, label, tiers }) => (
            <li key={method}>
              {label}
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
            </li>
          ),
        )}
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
      <ul className={css('no-bullet')}>
        <li>
          <span className={css('legend-dashed-line')} />
          Nested domain relationship
        </li>
      </ul>
    </section>
  );
};

export default Legend;
