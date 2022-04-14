import React, { useState } from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';

import uniqueId from 'utils/cheap-unique-id';

import cn from 'classnames';

import styles from './style.css';

const images = {
  cathgene3d: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/cathgene3d_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/cathgene3d_logo.png'
    ),
  ],
  cdd: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/cdd_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/cdd_logo.png'
    ),
  ],
  hamap: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/hamap_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/hamap_logo.png'
    ),
  ],
  panther: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/panther_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/panther_logo.png'
    ),
  ],
  pfam: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/pfam_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/pfam_logo.png'
    ),
  ],
  pirsf: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/pirsf_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/pirsf_logo.png'
    ),
  ],
  prints: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/prints_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/prints_logo.png'
    ),
  ],
  prosite: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/prosite_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/prosite_logo.png'
    ),
  ],
  profile: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/profile_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/profile_logo.png'
    ),
  ],
  sfld: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/sfld_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/sfld_logo.png'
    ),
  ],
  smart: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/smart_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/smart_logo.png'
    ),
  ],
  ssf: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/ssf_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/ssf_logo.png'
    ),
  ],
  tigrfams: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/tigrfams_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/tigrfams_logo.png'
    ),
  ],
};

const f = foundationPartial(styles);

const classNames = new Map([
  ['INTERPRO', f('md-ip')],
  ['CATH', f('md-cg')],
  ['CATHGENE3D', f('md-cg')],
  ['CDD', f('md-cd')],
  ['HAMAP', f('md-ha')],
  ['MOBIDBLT', f('md-mo')],
  ['PANTHER', f('md-pa')],
  ['PFAM', f('md-pf')],
  ['PIRSF', f('md-pi')],
  ['PRINTS', f('md-pri')],
  ['PRODOM', f('md-pro')],
  ['PATTERNS', f('md-prpat')],
  ['PROSITE', f('md-prpat')],
  ['PROFILES', f('md-prpro')],
  ['PROFILE', f('md-prpro')],
  ['SFLD', f('md-sf')],
  ['SMART', f('md-sm')],
  ['SUPERFAMILIES', f('md-su')],
  ['SSF', f('md-su')],
  ['TIGRFAMS', f('md-ti')],
  ['NEW', f('md-new')],
  ['ALL', f('md-all')],
]);

const MemberSymbol = (
  {
    type,
    className = '',
    svg = true,
    filter = true,
  } /*: { type: string, className?: string, svg?: boolean , filter?: boolean } */,
) => {
  const id = uniqueId();
  const [png, setPng] = useState(null);
  const [avif, setAvif] = useState(null);
  if (!svg) {
    images[type][0].then((src) => setAvif(src.default));
    images[type][1].then((src) => setPng(src.default));
  }
  return (
    <span data-testid="entry-member-db-icon">
      {svg ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          id={`md-${type}`}
          className={cn(className, classNames.get(type.toUpperCase()))}
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
            style={{ clipPath: `url(#clip-${id})` }}
          >
            D
          </text>
        </svg>
      ) : (
        <div className={f('memberdb-logo', { filter })}>
          {avif || png ? (
            <picture>
              <source type="image/avif" srcSet={avif} />
              <img alt="Hut in the snow" src={png} />
            </picture>
          ) : null}
        </div>
      )}
    </span>
  );
};
MemberSymbol.propTypes = {
  type: T.string.isRequired,
  className: T.string,
  svg: T.bool,
  filter: T.bool,
};

export default MemberSymbol;
