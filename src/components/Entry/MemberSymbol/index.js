// @flow
import React from 'react';
import T from 'prop-types';
import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

import uniqueId from 'utils/cheapUniqueId';

const f = foundationPartial(ipro);

const classNames = {
  CATH: f('md-cg'),
  CATHGENE3D: f('md-cg'),
  CDD: f('md-cd'),
  HAMAP: f('md-ha'),
  INTERPRO: f('md-ip'),
  MOBIDBLT: f('md-mo'),
  PANTHER: f('md-pa'),
  PFAM: f('md-pf'),
  PIRSF: f('md-pi'),
  PRINTS: f('md-pri'),
  PRODOM: f('md-pro'),
  PATTERNS: f('md-prpat'),
  PROSITE: f('md-prpat'),
  PROFILES: f('md-prpro'),
  PROFILE: f('md-prpro'),
  SFLD: f('md-sf'),
  SMART: f('md-sm'),
  SUPERFAMILIES: f('md-su'),
  SSF: f('md-su'),
  TIGRFAMS: f('md-ti'),
  NEW: f('md-new'),
};

const MemberSymbol = (
  { type, className = '' } /*: { type: string, className?: string }*/,
) => {
  const id = uniqueId();
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        id={`md-${type}`}
        className={`${className} ${classNames[type.toUpperCase()]}`}
      >
        <defs>
          <clipPath id={`clip-${id}`}>
            <rect x="33%" y="38%" width="68" height="68" />
          </clipPath>
        </defs>

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dx="-0.01em"
          dy="0.4em"
          className={f('md-server')}
        >
          D
        </text>

        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dx="-0.01em"
          dy="0.4em"
          className={f('md-color')}
          style={{
            clipPath: `url(#clip-${id})`,
          }}
        >
          D
        </text>
      </svg>
    </div>
  );
};
MemberSymbol.propTypes = {
  type: T.string.isRequired,
  className: T.string,
};

export default MemberSymbol;
