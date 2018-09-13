import React, { PureComponent } from 'react';
import T from 'prop-types';
import { sleep } from 'timing-functions/src';

import { webAnimations as supportsWebAnimations } from 'utils/support';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';
import localStyles from './style.css';

const s = foundationPartial(localStyles);

const GRANULARITY = 250; // 250ms, time frequency of ttl update
const ANIMATION_DURATION = 500; // 500ms
const ANIMATION_OPTIONS = {
  duration: ANIMATION_DURATION,
  easing: 'ease-in-out',
  fill: 'both',
};

export default class Toast extends PureComponent {
  static propTypes = {
    toastId: T.string.isRequired,
    paused: T.bool.isRequired,
    className: T.string,
    title: T.string,
    body: T.string,
    link: T.object,
    action: T.object,
    ttl: T.number,
    handleClose: T.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    const ttl = +this.props.ttl;
    if (ttl && !isNaN(ttl) && ttl >= 0 && ttl !== Infinity) {
      this._remaining = this.props.ttl;
      this._timeout = setTimeout(this._loop, GRANULARITY);
    }
    if (supportsWebAnimations && this._ref.current) {
      this._ref.current.animate(
        { transform: ['translateX(150%)', 'translateX(0)'] },
        ANIMATION_OPTIONS,
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  _loop = () => {
    if (!this.props.paused) this._remaining -= GRANULARITY;
    if (this._remaining < 0) {
      this._close();
      this._remaining = null;
      this._timeout = null;
      return;
    }
    this._timeout = setTimeout(this._loop, GRANULARITY);
  };

  _close = async e => {
    if (supportsWebAnimations && this._ref.current) {
      this._ref.current.animate(
        { transform: ['translateX(0)', 'translateX(150%)'] },
        ANIMATION_OPTIONS,
      );
      if (e) e.persist();
      await sleep(ANIMATION_DURATION);
    }
    this.props.handleClose(this.props.toastId, e);
  };

  render() {
    const {
      toastId,
      title,
      body,
      link,
      action,
      className,
      paused,
      ttl,
      handleClose,
      ...props // passed
    } = this.props;
    return (
      <li
        className={s('callout', 'toast', className || 'primary')}
        role="presentation"
        onClick={this._close}
        onKeyPress={this._close}
        ref={this._ref}
        {...props}
      >
        {title && <strong>{title}</strong>}
        <p>{body}</p>
        {link ? <Link {...link} /> : null}
        {action ? (
          <button type="button" className={s('button')} onClick={action.fn}>
            {action.text || 'Action'}
          </button>
        ) : null}
      </li>
    );
  }
}
