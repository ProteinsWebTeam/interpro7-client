import React, {Component} from 'react';
import T from 'prop-types';
import {TweenLite} from 'gsap';

import {foundationPartial} from 'styles/foundation';
import style from './style.css';

const f = foundationPartial(style);

class NumberLabel extends Component {
  static propTypes = {
    value: T.number,
    delay: T.number,
    className: T.string,
  };

  static defaultProps = {
    delay: 1,
  };

  constructor(props/*: ?any */) {
    super(props);
    this.state = {value: 0};
  }

  componentWillMount() {
    const {value} = this.props;
    this._animateTo(value);
  }

  componentWillReceiveProps({value}) {
    const {value: prevValue} = this.state;
    const canAnimate = (
      prevValue !== value &&
      Number.isFinite(prevValue) &&
      Number.isFinite(value)
    );
    if (canAnimate) {
      return this._animateTo(value);
    }
    this.setState({value});
  }

  _animateTo = to => {
    if (this._animation) this._animation.kill();
    const animatable = {value: this.state.value};
    this._animation = TweenLite.to(
      animatable,
      this.props.delay,
      {
        value: to,
        onUpdate: () => this.setState({value: Math.round(animatable.value)}),
      }
    );
  };

  render() {
    const {value: _, delay: __, className, ...props} = this.props;
    let {value: _value} = this.state;
    if (isNaN(_value)) _value = 'N/A';
    if (Number.isFinite(_value)) _value = _value.toLocaleString();
    return (
      <span className={f('label', className)} {...props}>
        {_value}
      </span>
    );
  }
}

export default NumberLabel;
