import React from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';

import classnames from 'classnames/bind';

import {openSideNav} from 'actions/creators';

import Link from 'components/generic/Link';
import DynamicMenu from 'components/Menu/DynamicMenu';
import Title from './Title';
import TextSearchBox from 'components/SearchByText/TextSearchBox';
import EBIHeader, {EbiSkipToDiv} from 'components/EBIHeader';

import {sticky as supportsSticky} from 'utils/support';

import {foundationPartial} from 'styles/foundation';
import styles from './style.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import ipro from 'styles/interpro-new.css';
const styleBundle = foundationPartial(ebiGlobalStyles, fonts, ipro, styles);
const reducedStyleBundle = classnames.bind(styles);

// const menuItems = {
//   dynamicPages: ['Entry', 'Protein', 'Structure', 'Proteome', 'Pathway'],
//   staticPages: ['About', 'Help', 'Contact', 'Settings'],
// };

const _HamburgerBtn = ({openSideNav, open, svg, stuck}) => {
  if (!svg) {
    return (
      <span>
        <button
          className={styles.top_level_hamburger}
          onClick={openSideNav}
        >
          ☰
        </button>
      </span>
    );
  }
  return (
    <button onClick={openSideNav}>
      <svg
        viewBox="0 0 12 10" width="2.5em" height="2.5em"
        className={reducedStyleBundle('top_level_hamburger', {stuck})}
      >
        <line
          x1="1" y1="2" x2="10" y2="2"
          className={open ? styles.hamb_1_open : styles.hamb_1}
        />
        <line
          x1="1" y1="5" x2="10" y2="5"
          className={open ? styles.hamb_2_open : styles.hamb_2}
        />
        <line
          x1="1" y1="8" x2="10" y2="8"
          className={open ? styles.hamb_3_open : styles.hamb_3}
        />
      </svg>
    </button>
  );
};
_HamburgerBtn.propTypes = {
  openSideNav: T.func.isRequired,
  open: T.bool.isRequired,
  svg: T.bool.isRequired,
  stuck: T.bool.isRequired,
};
const HamburgerBtn = connect(
  ({ui: {sideNav: open}}) => ({open}),
  {openSideNav}
)(_HamburgerBtn);

const _SideIcons = ({movedAway, stuck}) => (
  <div className={reducedStyleBundle('side-icons', {movedAway})}>
    <HamburgerBtn svg={true} stuck={stuck} />
    <label className={reducedStyleBundle('side-search', {stuck})}>
      <TextSearchBox
        maxLength="255"
        value=""
        name="search"
      />
      <Link
        to="/search"
      >
        <svg
          width="2em" height="2em" viewBox="0 0 490 490"
          style={{verticalAlign: 'middle'}}
        >
          <path
            fill="none" stroke="white" strokeWidth="40" strokeLinecap="round"
            d="m280,278a153,153 0 1,0-2,2l170,170m-91-117"
          />
        </svg>
      </Link>
    </label>
  </div>
);
_SideIcons.propTypes = {
  movedAway: T.bool.isRequired,
  stuck: T.bool.isRequired,
};

const SideIcons = connect(
  ({ui: {sideNav: open}}) => ({movedAway: open})
)(_SideIcons);

const MenuItem = ({active, children}) => (
  <Link
    to={`/${children.toLowerCase()}/`}
    className={reducedStyleBundle({active})}
  >
    {children}
  </Link>
);
MenuItem.propTypes = {
  children: T.string.isRequired,
  active: T.bool,
};

// const SubMediumLevel = ({pages, pageType}) => (
//   <span>
//     {pages.map(page => (
//       <MenuItem key={page}>
//         {page}
//       </MenuItem>
//     ))}
//   </span>
// );
// SubMediumLevel.propTypes = {
//   pages: T.arrayOf(T.string).isRequired,
//   pageType: T.string,
// };

// const MediumLevel = ({pageType}) => (
//   <div className={styles.medium_level}>
//     <SubMediumLevel pages={menuItems.dynamicPages} pageType={pageType} />
//     <SubMediumLevel pages={menuItems.staticPages} pageType={pageType} />
//   </div>
// );
// MediumLevel.propTypes = {
//   pageType: T.string,
// };

const styleForHeader = (supportsSticky, offset, stuck) => {
  const style = {top: `-${offset}px`};
  if (supportsSticky) {
    return {...style, position: 'sticky'};
  }
  if (stuck) {
    return {...style, position: 'fixed'};
  }
  return style;
};

const Header = ({pathname, stickyMenuOffset: offset, stuck}) => (
  <header
    id={ebiGlobalStyles['local-masthead']}
    className={styleBundle('header', 'local-masthead')}
    style={styleForHeader(false && supportsSticky, offset, stuck)}
  >
    <EbiSkipToDiv />
    <EBIHeader />
    <div className={styleBundle('masthead', 'row')}>
      <Title reduced={false} />
      <SideIcons reduced={false} stuck={stuck} />
      <DynamicMenu pathname={pathname} />
    </div>
  </header>
);
Header.propTypes = {
  pathname: T.string.isRequired,
  stickyMenuOffset: T.number.isRequired,
  stuck: T.bool.isRequired,
};

export default connect(
  ({ui: {stuck}, location: {pathname}}) => ({stuck, pathname})
)(Header);
