// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import TaxonomyVisualisation from 'taxonomy-visualisation';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';

import styles from './style.css';

import fisheyeOff from 'EBI-Icon-fonts/source/common/font-awesome/solid/dot-circle.svg';
import fisheyeOn from 'EBI-Icon-fonts/source/common/font-awesome/solid/bullseye.svg';

import fonts from 'EBI-Icon-fonts/fonts.css';
import { foundationPartial } from 'styles/foundation';

/*:: type Props = {
  data?: Object,
  focused?: string,
  changeFocus?: string => any,
  labelClick?: string => any,
  hideToggle?: boolean,
  initialFisheye?: boolean,
}; */
/*:: type State = {
  fisheye: boolean,
}; */

const f = foundationPartial(fonts);

export default class Tree extends PureComponent /*:: <Props, State> */ {
  /* ::
    _ref: { current: null | React$ElementRef<'svg'> };
    _loadingVis: ?boolean;
    _vis: TaxonomyVisualisation;
  */
  static propTypes = {
    data: T.object,
    focused: T.string,
    changeFocus: T.func,
    labelClick: T.func,
    hideToggle: T.bool,
    initialFisheye: T.bool,
  };

  static defaultProps = {
    initialFisheye: true,
  };

  constructor(props /*: Props */) {
    super(props);

    const fisheye = !!props.initialFisheye;

    this._vis = new TaxonomyVisualisation(undefined, {
      initialMaxNodes: +Infinity,
      fisheye,
      fixedNodeSize: 5,
      classnames: {
        inPath: styles['in-path'],
        node: styles.node,
      },
      enableZooming: true,
      // shouldCorrectNodesOutside: true,
    });

    this._vis.addEventListener('focus', this._handleFocus);
    this._vis.addEventListener('click', this._handleLabelClick);
    this._loadingVis = false;
    this._ref = React.createRef();

    this.state = { fisheye };
  }

  componentDidMount() {
    this._vis.tree = this._ref.current;
    this._loadingVis = true;
    this._populateData(this.props.data, this.props.focused);
    this._loadingVis = false;
  }

  componentDidUpdate({ data, focused } /*: Props */) {
    if (data !== this.props.data) {
      this._loadingVis = true;
      this._populateData(this.props.data, this.props.focused);
      this._loadingVis = false;
    }
    if (focused !== this.props.focused) {
      this._vis.focusNodeWithID(this.props.focused);
    }
    this._vis.fisheye = this.state.fisheye;
  }

  componentWillUnmount() {
    this._vis.cleanup();
  }

  _handleClick = () => this.setState(({ fisheye }) => ({ fisheye: !fisheye }));

  _recenter = () => {
    this._vis.resetZoom();
  };

  _handleFocus = ({ detail: { id } }) => {
    if (!this._loadingVis && this.props.changeFocus) this.props.changeFocus(id);
  };
  _handleLabelClick = evt => {
    const {
      detail: { id },
    } = evt;
    if (!this._loadingVis && this.props.labelClick) this.props.labelClick(id);
    else this._handleFocus(evt);
  };

  _populateData = (data, focused) => {
    this._vis.data = data;
    this._vis.focusNodeWithID(focused);
  };

  render() {
    return (
      <>
        <div className={styles.buttons}>
          <span className={styles.fullscreen}>
            <FullScreenButton
              element={this._ref.current}
              tooltip="View the taxonomy tree in full screen mode"
            />
          </span>
          {this.props.hideToggle ? null : (
            <span>
              <Tooltip title="toggle fisheye view">
                <button onClick={this._handleClick}>
                  <img
                    src={this.state.fisheye ? fisheyeOff : fisheyeOn}
                    alt="toggle-fisheye"
                  />
                </button>
              </Tooltip>
            </span>
          )}
          <span>
            <Tooltip title="Recenter">
              <button
                onClick={this._recenter}
                className={f('icon', 'icon-common', 'font-l')}
                data-icon="&#xf05b;"
              />
            </Tooltip>
          </span>
        </div>

        <div
          // style={{
          //   width: '100%',
          //   height: '50vh',
          //   display: 'flex',
          //   flexDirection: 'column',
          //   alignItems: 'stretch',
          //   justifyContent: 'center',
          //   border: '2px solid black',
          // }}
          className={styles.tree}
          data-testid="data-tree"
        >
          <svg
            className={styles.container}
            ref={this._ref}
            style={{ flex: '1' }}
          />
        </div>
      </>
    );
  }
}
