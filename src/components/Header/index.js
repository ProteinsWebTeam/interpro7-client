import React, {PureComponent} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

import classnames from 'classnames/bind';

import {openSideNav} from 'actions/creators';

import Link from 'components/generic/Link';
import InterproMenu from 'components/Menu/InterproMenu';
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

class _HamburgerBtn extends PureComponent {
  static propTypes = {
    openSideNav: T.func.isRequired,
    open: T.bool.isRequired,
    svg: T.bool.isRequired,
    stuck: T.bool.isRequired,
  };

  render() {
    const {openSideNav, open, svg, stuck} = this.props;
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
            x1="1" y1="2" x2="9" y2="2"
            className={open ? styles.hamb_1_open : styles.hamb_1}
          />
          <line
            x1="1" y1="5" x2="9" y2="5"
            className={open ? styles.hamb_2_open : styles.hamb_2}
          />
          <line
            x1="1" y1="8" x2="9" y2="8"
            className={open ? styles.hamb_3_open : styles.hamb_3}
          />
        </svg>
      </button>
    );
  }
}

const getSideNav = state => state.ui.sideNav;
const mapStateToPropsHamburger = createSelector(
  getSideNav,
  open => ({open})
);
const HamburgerBtn = connect(
  mapStateToPropsHamburger,
  {openSideNav}
)(_HamburgerBtn);

class _SideIcons extends PureComponent {
  static propTypes = {
    movedAway: T.bool.isRequired,
    stuck: T.bool.isRequired,
  };

  render() {
    const {movedAway, stuck} = this.props;
    return (
      <div className={reducedStyleBundle('side-icons', {movedAway})}>
        <HamburgerBtn svg={true} stuck={stuck} />
        <label className={reducedStyleBundle('side-search', {stuck})}>
          <TextSearchBox
            maxLength="255"
            value=""
            name="search"
          />
          <Link newTo={{description: {other: 'search'}}}>
            <svg
              width="2.2em" height="2.2em"
              className={reducedStyleBundle('icon','icon--search')}
              viewBox="0 0 480 480"
            >
              <path
                fill="none"
                stroke="white"
                strokeWidth="50"
                strokeLinecap="round"
                d="M5,20 m280,278 a110,110 0 1,0-3,2 l90,112m-91-117"></path>
            </svg>
          </Link>
        </label>
      </div>
    );
  }
}

const mapStateToPropsSideIcons = createSelector(
  getSideNav,
  movedAway => ({movedAway})
);
const SideIcons = connect(mapStateToPropsSideIcons)(_SideIcons);

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

class Header extends PureComponent {
  static propTypes = {
    stickyMenuOffset: T.number.isRequired,
    stuck: T.bool.isRequired,
  };

  render() {
    const {stickyMenuOffset: offset, stuck} = this.props;
    return (
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
          <InterproMenu className={styleBundle('menu', 'interpro-menu')} />
        </div>
      </header>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.ui.stuck,
  (stuck) => ({stuck})
);
export default connect(mapStateToProps)(Header);
