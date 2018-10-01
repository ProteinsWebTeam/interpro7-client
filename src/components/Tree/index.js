// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import TaxonomyVisualisation from 'taxonomy-visualisation';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import styles from './style.css';

import fisheyeOff from 'EBI-Icon-fonts/source/common/font-awesome/solid/dot-circle.svg';
import fisheyeOn from 'EBI-Icon-fonts/source/common/font-awesome/solid/bullseye.svg';

/*:: type Props = {
  data?: Object,
  focused?: string,
  changeFocus?: string => any,
  hideToggle?: boolean,
  initialFisheye?: boolean,
}; */
/*:: type State = {
  fisheye: boolean,
}; */

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
      classnames: {
        inPath: styles['in-path'],
        node: styles.node,
      },
    });

    this._vis.addEventListener('focus', this._handleFocus);
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

  _handleFocus = ({ detail: { id } }) => {
    if (!this._loadingVis && this.props.changeFocus) this.props.changeFocus(id);
  };

  _populateData = (data, focused) => {
    this._vis.data = data;
    this._vis.focusNodeWithID(focused);
  };

  render() {
    return (
      <>
        {this.props.hideToggle ? null : (
          <span className={styles.toggle}>
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
        <div
          style={{
            width: '100%',
            height: '50vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'center',
          }}
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
