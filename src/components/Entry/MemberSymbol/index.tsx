import React, { useState, useEffect } from 'react';

import Link from 'components/generic/Link';
import { memberDbURL } from 'utils/url-patterns';

import cssBinder from 'styles/cssBinder';

import uniqueId from 'utils/cheap-unique-id';

import cn from 'classnames';

import styles from './style.css';
const css = cssBinder(styles);

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
  ncbifam: [
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/nih_nlm_logo.avif'
    ),
    import(
      /* webpackChunkName: "member-logos" */ '../../../images/member_databases/nih_nlm_logo.png'
    ),
  ],
};

const classNames = new Map([
  ['INTERPRO', css('md-ip')],
  ['CATH', css('md-cg')],
  ['CATHGENE3D', css('md-cg')],
  ['CDD', css('md-cd')],
  ['HAMAP', css('md-ha')],
  ['MOBIDBLT', css('md-mo')],
  ['PANTHER', css('md-pa')],
  ['PFAM', css('md-pf')],
  ['PIRSF', css('md-pi')],
  ['PRINTS', css('md-pri')],
  ['PRODOM', css('md-pro')],
  ['PATTERNS', css('md-prpat')],
  ['PROSITE', css('md-prpat')],
  ['PROFILES', css('md-prpro')],
  ['PROFILE', css('md-prpro')],
  ['SFLD', css('md-sf')],
  ['SMART', css('md-sm')],
  ['SUPERFAMILIES', css('md-su')],
  ['SSF', css('md-su')],
  ['TIGRFAMS', css('md-ti')],
  ['NCBIFAM', css('md-nf')],
  ['NEW', css('md-new')],
  ['ALL', css('md-all')],
  ['REMOVED', css('md-removed')],
]);

type Props = {
  type: MemberDB;
  className?: string;
  svg?: boolean;
  filter?: boolean;
  includeLink?: boolean;
};

const MemberSymbol = ({
  type,
  className = '',
  svg = true,
  filter = true,
  includeLink = false,
}: Props) => {
  const id = uniqueId();
  const [png, setPng] = useState(null);
  const [avif, setAvif] = useState(null);
  useEffect(() => {
    setPng(null);
    setAvif(null);
  }, [type]);
  useEffect(() => {
    if (!svg) {
      if (!avif) images?.[type]?.[0].then((src) => setAvif(src.default));
      if (!png) images?.[type]?.[1].then((src) => setPng(src.default));
    }
  }, [svg, avif, png]);
  const MaybeLink = includeLink ? Link : 'span';
  return (
    <MaybeLink href={memberDbURL.get(type)} target="_blank">
      <span
        data-testid="entry-member-db-icon"
        className={css('entry-member-db-icon')}
      >
        {svg || (!png && !avif) ? (
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
              className={css('md-server')}
            >
              D
            </text>

            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dx="-0.01em"
              dy="0.4em"
              className={css('md-color')}
              style={{ clipPath: `url(#clip-${id})` }}
            >
              D
            </text>
          </svg>
        ) : (
          <div className={css('memberdb-logo', { filter })}>
            {avif || png ? (
              <picture>
                <source type="image/avif" srcSet={avif || ''} />
                <img alt="Hut in the snow" src={png || ''} />
              </picture>
            ) : null}
          </div>
        )}
      </span>
    </MaybeLink>
  );
};

export default MemberSymbol;
