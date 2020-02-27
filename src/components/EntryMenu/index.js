import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import EntryMenuLink from './EntryMenuLink';
import Loading from 'components/SimpleCommonComponents/Loading';
import config from 'config';
import { entities, singleEntity } from 'menuConfig';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Genome3dMenuLink from './EntryMenuLink/Genome3dMenuLink';
import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

import entryMenuLinkClasses from './EntryMenuLink/style.css';

const f = foundationPartial(styles);

const TRANSITION_DURATION = 500;

const mapNameToClass = new Map([
  ['domain', 'menu-domain'],
  ['family', 'menu-family'],
  ['repeat', 'menu-repeat'],
  ['conserved_site', 'menu-site'],
  ['binding_site', 'menu-site'],
  ['active_site', 'menu-site'],
  ['ptm', 'menu-site'],
  ['homologous_superfamily', 'menu-hh'],
]);

/*:: type Props = {
  mainType: ?string,
  mainDB: ?string,
  mainAccession: ?string,
  isSignature: boolean,
  data: {
    loading: boolean,
    payload?: ?Object,
  },
  children: ?any,
  className: ?string,
  lowGraphics: boolean,
  usedOnTheSide?: boolean,
  width?: number,
}; */

export class EntryMenuWithoutData extends PureComponent /*:: <Props> */ {
  /* ::
    _currentTransformTranslateX: number;
    _currentTransformScaleX: number;
    _ref: { current: null | React$ElementRef<'ul'> };
  */
  static propTypes = {
    mainType: T.string,
    mainDB: T.string,
    mainAccession: T.string,
    isSignature: T.bool.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    children: T.any,
    className: T.string,
    lowGraphics: T.bool.isRequired,
    usedOnTheSide: T.bool,
    width: T.number,
  };

  constructor(props /*: Props */) {
    super(props);

    this._currentTransformTranslateX = 0;
    this._currentTransformTranslateY = 0;
    this._currentTransformScaleX = 1;
    this._ref = React.createRef();
  }

  componentDidMount() {
    this._moveFakeBorder();
  }

  componentDidUpdate() {
    this._moveFakeBorder();
  }

  componentWillUnmount() {
    if (this._animation) this._animation.cancel();
  }

  _moveFakeBorder = () => {
    if (!this._ref.current) return;
    const newTarget = this._ref.current.querySelector(
      `a.${entryMenuLinkClasses['is-active-tab']}`,
    );
    if (!newTarget) return;
    const fakeBorder = this._ref.current.firstElementChild;

    const containerBoundingRect = this._ref.current.getBoundingClientRect();
    const boundingRect = newTarget.getBoundingClientRect();

    const countainerWidth = this.props.width;
    // current transform
    const currentTransform = `translateX(${this._currentTransformTranslateX}px) translateY(${this._currentTransformTranslateY}px) scaleX(${this._currentTransformScaleX})`;
    // next transform
    const nextTranslateX = boundingRect.left - containerBoundingRect.left;
    const nextTranslateY =
      boundingRect.top + boundingRect.height - containerBoundingRect.top;
    let nextScaleX = boundingRect.width / countainerWidth;
    if (Number.isNaN(nextScaleX)) nextScaleX = this._currentTransformScaleX;
    const nextTransform = `translateX(${nextTranslateX}px) translateY(${nextTranslateY}px) scaleX(${nextScaleX})`;
    if (!fakeBorder.animate) {
      fakeBorder.style.transform = nextTransform;
      return;
    }
    // middle transform
    let middleTranslateX = this._currentTransformTranslateX;
    let middleTranslateY = this._currentTransformTranslateY;
    let middleScaleX = this._currentTransformScaleX;
    if (nextTranslateX > this._currentTransformTranslateX) {
      // going right
      middleTranslateX = this._currentTransformTranslateX;
      middleTranslateY = this._currentTransformTranslateY;
      middleScaleX =
        (boundingRect.right -
          containerBoundingRect.left -
          this._currentTransformTranslateX) /
        countainerWidth;
    } else if (nextTranslateX < this._currentTransformTranslateX) {
      // going left
      middleTranslateX = nextTranslateX;
      middleTranslateY = nextTranslateY;
      middleScaleX =
        (this._currentTransformScaleX +
          this._currentTransformTranslateX -
          nextTranslateX) /
        countainerWidth;
    }
    const middleTransform = `translateX(${middleTranslateX}px) translateY(${middleTranslateY}px) scaleX(${middleScaleX})`;

    // cancel previous animation in case it's still running
    if (this._animation) this._animation.cancel();
    // trigger new animation
    this._animation = fakeBorder.animate(
      { transform: [currentTransform, middleTransform, nextTransform] },
      {
        duration: this.props.lowGraphics ? 0 : TRANSITION_DURATION,
        easing: 'cubic-bezier(0.215, 0.610, 0.175, 1.180)',
        fill: 'both',
      },
    );
    // stash end values inside this instance to use them as
    // the starting point of the next animation
    this._currentTransformTranslateX = nextTranslateX;
    this._currentTransformTranslateY = nextTranslateY;
    this._currentTransformScaleX = nextScaleX;
  };

  render() {
    const {
      mainType,
      mainAccession,
      data,
      isSignature,
      children,
      data: { loading, payload },
      className,
      usedOnTheSide,
    } = this.props;
    let tabs = entities;
    if (mainAccession && mainType && config.pages[mainType]) {
      tabs = [singleEntity.get('overview')];
      for (const subPage of config.pages[mainType].subPages) {
        tabs.push(singleEntity.get(subPage));
      }
      tabs = tabs.filter(Boolean);
    }
    if (loading || !payload || !payload.metadata) {
      return <Loading />;
    }
    const genome3d = singleEntity.get('genome3d');
    return (
      <ul
        className={f('tabs', className, { sign: isSignature })}
        ref={this._ref}
        data-testid="menu"
      >
        <span
          data-testid="entry-menu"
          className={f(
            'fake-border',
            payload.metadata.source_database.toLowerCase() === 'interpro'
              ? mapNameToClass.get(payload.metadata.type)
              : null,
            { ['is-signature']: isSignature },
          )}
        />
        {children}
        {tabs.map(e => (
          <EntryMenuLink
            key={e.name}
            metadata={payload.metadata}
            to={e.to}
            exact={e.exact}
            activeClass={e.activeClass}
            name={e.name}
            data={data}
            counter={e.counter}
            isFirstLevel={!mainAccession}
            usedOnTheSide={usedOnTheSide}
          />
        ))}
        {mainType === 'entry' && !isSignature && genome3d && (
          <Genome3dMenuLink
            to={genome3d.to}
            exact={genome3d.exact}
            name={genome3d.name}
            usedOnTheSide={usedOnTheSide}
          />
        )}
      </ul>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.main.key,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  state =>
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  state =>
    state.customLocation.description[state.customLocation.description.main.key]
      .detail,
  state =>
    Object.entries(state.customLocation.description)
      .filter(([_, { isFilter }]) => isFilter)
      .map(([f]) => f),

  state => state.settings.ui.lowGraphics,
  (mainType, mainDB, mainAccession, mainDetail, filters, lowGraphics) => ({
    mainType,
    mainDB,
    mainAccession,
    mainDetail,
    filters,
    isSignature: !!(
      mainType === 'entry' &&
      mainDB !== 'InterPro' &&
      mainAccession
    ),
    lowGraphics,
  }),
);

const mapStateToUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.main.key,
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  state =>
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  ({ protocol, hostname, port, root }, mainType, db, accession) => {
    if (!accession) return;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: mainType },
          [mainType]: {
            db,
            accession,
          },
        }),
    });
  },
);

export default loadData({ getUrl: mapStateToUrl, mapStateToProps })(
  EntryMenuWithoutData,
);
