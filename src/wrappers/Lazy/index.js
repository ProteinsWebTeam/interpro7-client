// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import cancelable from 'utils/cancelable/index';
import getsInView from 'utils/gets-in-view/index';
import { schedule } from 'timing-functions/src';

/* :: type State = {| hasBeenVisible: boolean |}; */

/* :: type Props = {|
  visible?: boolean,
  rootMargin?: string,
  children: boolean => ?React$Element<any>,
|}; */

class Lazy extends PureComponent /*:: <Props, State> */ {
  /* ::
    _ref: { current: null | React$ElementRef<'span'> };
    _inView: ?{
      cancel: function,
      promise: Promise<any>,
    };
  */
  static propTypes = {
    visible: T.bool,
    rootMargin: T.string,
    children: T.func.isRequired,
  };

  static defaultProps = {
    visible: false,
    rootMargin: '10px',
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = { hasBeenVisible: !!props.visible };

    this._ref = React.createRef();
  }

  async componentDidMount() {
    if (this.state.hasBeenVisible) return;
    try {
      this._inView = cancelable(
        schedule().then(() => {
          if (!this._ref.current) return Promise.reject();
          return getsInView(this._ref.current, {
            rootMargin: this.props.rootMargin,
          });
        }),
      );
      await this._inView.promise;
      this.setState({ hasBeenVisible: true });
    } catch (_) {
      /**/
    }
  }

  componentWillUnmount() {
    if (this._inView) this._inView.cancel();
  }

  render() {
    return (
      <span ref={this._ref}>
        {this.props.children(this.state.hasBeenVisible)}
      </span>
    );
  }
}

export default Lazy;
