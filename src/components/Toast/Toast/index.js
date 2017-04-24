import React, {Component} from 'react';
import T from 'prop-types';

import {foundationPartial} from 'styles/foundation';
import localStyles from './style.css';
const s = foundationPartial(localStyles);

const GRANULARITY = 250;// 250ms, time frequency of ttl update

export default class extends Component {
  static propTypes = {
    toastId: T.string.isRequired,
    paused: T.bool.isRequired,
    className: T.string,
    title: T.string,
    body: T.string,
    ttl: T.number,
    handleClose: T.func.isRequired,
  };

  componentDidMount() {
    const ttl = +this.props.ttl;
    if (!ttl || isNaN(ttl) || ttl < 0 || ttl === Infinity) return;
    this._remaining = this.props.ttl;
    this._timeout = setTimeout(this._loop, GRANULARITY);
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

  _close = e => this.props.handleClose(this.props.toastId, e);

  render() {
    const {
      toastId, title, body, className, // used, or transformed before passed
      paused: _, ttl: __, handleClose: ___, // ignored
      ...props// passed
    } = this.props;
    return (
      <li
        className={s('callout', 'toast', className || 'primary')}
        onClick={this._close}
        {...props}
      >
        {title && <strong>{title} ({toastId})</strong>}
        <p>{body}</p>
      </li>
    );
  }
}
