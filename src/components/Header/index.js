import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import classnames from 'classnames/bind';

// $FlowFixMe
import { stuckSelector } from 'reducers/ui/stuck';
// $FlowFixMe
import { sideNavSelector } from 'reducers/ui/sideNav';
// $FlowFixMe
import { toggleSideNav } from 'actions/creators';

import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

// $FlowFixMe
import getURLByAccession from 'utils/processDescription/getURLbyAccession';

import Link from 'components/generic/Link';
// $FlowFixMe
import DynamicMenu from 'components/Menu/DynamicMenu';
import Title from './Title';
import TextSearchBox, {
  DEBOUNCE_RATE_SLOW,
  // $FlowFixMe
} from 'components/SearchByText/TextSearchBox';

import { sticky as supportsSticky } from 'utils/support';

// $FlowFixMe
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import config from 'config';

const styleBundle = foundationPartial(ebiGlobalStyles, fonts, ipro, styles);
const reducedStyleBundle = classnames.bind(styles);

/*:: type Props = {
  toggleSideNav: function,
  open: boolean,
  svg: boolean,
  stuck: boolean
}; */

export class _HamburgerBtn extends PureComponent /*:: <Props> */ {
  static propTypes = {
    toggleSideNav: T.func.isRequired,
    open: T.bool.isRequired,
    svg: T.bool.isRequired,
    stuck: T.bool.isRequired,
  };

  render() {
    const { toggleSideNav, open, svg, stuck } = this.props;
    if (!svg) {
      return (
        <span>
          <button
            className={styles.top_level_hamburger}
            onClick={toggleSideNav}
            aria-label="Show the InterPro Menu"
          >
            ☰
          </button>
        </span>
      );
    }
    return (
      <svg
        onClick={toggleSideNav}
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

const mapStateToPropsHamburger = createSelector(sideNavSelector, (open) => ({
  open,
}));
const HamburgerBtn = connect(mapStateToPropsHamburger, { toggleSideNav })(
  _HamburgerBtn,
);

/*:: type SideIconsProps = {
  movedAway: boolean,
  stuck: boolean,
  lowGraphics: boolean,
  search: Object
}; */

export class _SideIcons extends PureComponent {
  static propTypes = {
    movedAway: T.bool.isRequired,
    stuck: T.bool.isRequired,
    lowGraphics: T.bool.isRequired,
    search: T.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  setSearchValue = (value) => {
    this.setState({ searchValue: value });
    const directLinkDescription = getURLByAccession(value);
    if (directLinkDescription) {
      const path = descriptionToPath(directLinkDescription);
      const basePath = new URL(config.root.website.href).pathname;
      const newPath = `${basePath}/${path}`.replaceAll(/\/{2,}/g, '/');
      const newUrl = new URL(newPath, window.location.origin);
      this.setState({ directLink: newUrl.toString() });
    } else {
      this.setState({ directLink: null });
    }
  };

  render() {
    const { movedAway, stuck, lowGraphics, search } = this.props;
    const { searchValue } = this.state;

    return (
      <div
        className={styleBundle('columns', 'small-6', 'medium-4', {
          lowGraphics,
        })}
      >
        <div className={reducedStyleBundle('side-icons', { movedAway })}>
          <HamburgerBtn svg stuck={stuck} aria-label="Show the InterPro Menu" />
          <label className={reducedStyleBundle('side-search', { stuck })}>
            <TextSearchBox
              name="search"
              delay={DEBOUNCE_RATE_SLOW}
              forHeader={true}
              setSearchValue={this.setSearchValue}
            />
            <Link
              to={
                !this.state.directLink
                  ? {
                      description: {
                        main: { key: 'search' },
                        search: {
                          ...search,
                          type: 'text',
                          value: searchValue,
                        },
                      },
                    }
                  : null
              }
              href={this.state.directLink}
            >
              <div role="button" aria-label="Search InterPro">
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
  sideNavSelector,
  (state) => state.settings.ui.lowGraphics,
  (state) => state.customLocation.description.search,
  (movedAway, lowGraphics, search) => ({ movedAway, lowGraphics, search }),
);
const SideIcons = connect(mapStateToPropsSideIcons)(_SideIcons);

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

/*:: type HeaderProps = {
  stickyMenuOffset: number,
  stuck: boolean,
  isSignature: boolean
}; */

export class Header extends PureComponent /*:: <HeaderProps> */ {
  static propTypes = {
    stickyMenuOffset: T.number.isRequired,
    stuck: T.bool.isRequired,
    isSignature: T.bool.isRequired,
  };

  // TODO: check why position:sticky banner in the page works just on top - pbm with container
  render() {
    const { stickyMenuOffset: offset, stuck, isSignature } = this.props;
    const shouldStuck = stuck;
    return (
      <div
        id={ebiGlobalStyles.masthead}
        className={styleBundle('masthead', 'tmp-header', { sign: isSignature })}
        style={styleForHeader(false && supportsSticky, offset, shouldStuck)}
      >
        <div className={styleBundle('masthead-inner', 'row')}>
          <Title />
          <SideIcons stuck={shouldStuck} />
          <ResizeObserverComponent element="nav" measurements="width">
            {({ width }) => <DynamicMenu width={width} />}
          </ResizeObserverComponent>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  stuckSelector,
  (state) => state.customLocation.description.main.key,
  (state) => state.customLocation.description.entry.db,
  (state) => state.customLocation.description.entry.accession,
  (state) => state.customLocation.description,
  (stuck, mainType, entryDB, entryAccession, description) => ({
    stuck,
    isSignature: !!(
      mainType === 'entry' &&
      entryDB !== 'InterPro' &&
      entryAccession
    ),
    path: descriptionToPath(description).split('/')?.[1],
  }),
);
export default connect(mapStateToProps)(Header);
