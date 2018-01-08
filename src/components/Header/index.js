// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import classnames from 'classnames/bind';

import { openSideNav } from 'actions/creators';

import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import Link from 'components/generic/Link';
import DynamicMenu from 'components/Menu/DynamicMenu';
import Title from './Title';
import TextSearchBox from 'components/SearchByText/TextSearchBox';

import { sticky as supportsSticky } from 'utils/support';

import { foundationPartial } from 'styles/foundation';
import styles from './style.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
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
    const { openSideNav, open, svg, stuck } = this.props;
    if (!svg) {
      return (
        <span>
          <button
            className={styles.top_level_hamburger}
            onClick={openSideNav}
            aria-label="Show the InterPro Menu"
          >
            ☰
          </button>
        </span>
      );
    }
    return (
      <svg
        onClick={openSideNav}
        viewBox="0 0 10 10"
        width="2em"
        height="2em"
        className={reducedStyleBundle('top_level_hamburger', { stuck })}
      >
        <line
          x1="1"
          y1="2"
          x2="9"
          y2="2"
          className={open ? styles.hamb_1_open : styles.hamb_1}
        />
        <line
          x1="1"
          y1="5"
          x2="9"
          y2="5"
          className={open ? styles.hamb_2_open : styles.hamb_2}
        />
        <line
          x1="1"
          y1="8"
          x2="9"
          y2="8"
          className={open ? styles.hamb_3_open : styles.hamb_3}
        />
      </svg>
    );
  }
}

const getSideNav = state => state.ui.sideNav;
const mapStateToPropsHamburger = createSelector(getSideNav, open => ({ open }));
const HamburgerBtn = connect(mapStateToPropsHamburger, { openSideNav })(
  _HamburgerBtn,
);

class _SideIcons extends PureComponent {
  static propTypes = {
    movedAway: T.bool.isRequired,
    stuck: T.bool.isRequired,
    lowGraphics: T.bool.isRequired,
  };

  render() {
    const { movedAway, stuck, lowGraphics } = this.props;
    return (
      <div
        className={styleBundle('columns', 'small-6', 'medium-4', {
          lowGraphics,
        })}
      >
        <div className={reducedStyleBundle('side-icons', { movedAway })}>
          <HamburgerBtn
            svg={true}
            stuck={stuck}
            aria-label="Show the InterPro Menu"
          />
          <label className={reducedStyleBundle('side-search', { stuck })}>
            <div>
              <TextSearchBox name="search" />
            </div>
            <Link to={{ description: { other: ['search'] } }}>
              <div aria-label="Search InterPro">
                <svg
                  width="2.2em"
                  height="2.2em"
                  className={reducedStyleBundle('icon', 'icon--search')}
                  viewBox="0 0 480 480"
                >
                  <path
                    transform="rotate(-45, 328, 222)"
                    fill="none"
                    stroke="white"
                    strokeWidth="50"
                    strokeLinecap="round"
                    d="M0,10 m250,250 a110,110 0 1,0-1,0 l0,140"
                  />
                </svg>
              </div>
            </Link>
          </label>
        </div>
      </div>
    );
  }
}

const mapStateToPropsSideIcons = createSelector(
  getSideNav,
  state => state.settings.ui.lowGraphics,
  (movedAway, lowGraphics) => ({ movedAway, lowGraphics }),
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
  const style = { top: `-${offset}px` };
  if (supportsSticky) {
    return { ...style, position: 'sticky' };
  }
  if (stuck) {
    return { ...style, position: 'fixed' };
  }
  return style;
};

class Header extends PureComponent {
  static propTypes = {
    stickyMenuOffset: T.number.isRequired,
    stuck: T.bool.isRequired,
    isSignature: T.bool.isRequired,
  };

  // TODO: check why position:sticky banner in the page works just on top - pbm with container
  render() {
    const { stickyMenuOffset: offset, stuck, isSignature } = this.props;
    return (
      <div
        id={ebiGlobalStyles.masthead}
        className={styleBundle('masthead', { sign: isSignature })}
        style={styleForHeader(false && supportsSticky, offset, stuck)}
      >
        <div className={styleBundle('masthead-inner', 'row')}>
          <Title />
          <SideIcons stuck={stuck} />
          <ResizeObserverComponent element="nav" measurements="width">
            <DynamicMenu />
          </ResizeObserverComponent>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.ui.stuck,
  state => state.customLocation.description.main.key,
  state => state.customLocation.description.entry.db,
  state => state.customLocation.description.entry.accession,
  (stuck, mainType, entryDB, entryAccession) => ({
    stuck,
    isSignature: !!(
      mainType === 'entry' &&
      entryDB !== 'InterPro' &&
      entryAccession
    ),
  }),
);
export default connect(mapStateToProps)(Header);
