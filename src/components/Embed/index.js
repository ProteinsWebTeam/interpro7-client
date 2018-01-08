// @flow
import React, { Component } from 'react';
import T from 'prop-types';

const defaultLoadingStyle = {
  background: 'white',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const Loading = () => (
  <div style={defaultLoadingStyle}>
    <span>Loading…</span>
  </div>
);

const containerStyle = {
  position: 'relative',
};

const placeholderStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

class Embed extends Component {
  static propTypes = {
    children: T.element,
    title: T.string,
  };

  constructor(props) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    this._iframe.addEventListener('load', this._onLoad, { once: true });
    this._mounted = true;
  }

  componentWillUnmount() {
    this._iframe.removeEventListener('load', this._onLoad);
    this._mounted = false;
  }

  _onLoad = () => {
    if (!this._mounted) return;
    this._placeholderContainer.style.pointerEvents = 'none';
    this._placeholderContainer.animate(
      { opacity: [1, 0] },
      {
        duration: 1000,
        easing: 'ease-in-out',
        fill: 'both',
      },
    ).onfinish = () => {
      if (this._mounted) this.setState({ loading: false });
    };
    // remove eventListener, in case {once: true} isn't supported
    this._iframe.removeEventListener('load', this._onLoad);
  };

  render() {
    const { children, title, ...props } = this.props;
    const { loading } = this.state;
    return (
      <div style={containerStyle}>
        {loading && (
          <span
            style={placeholderStyle}
            ref={node => (this._placeholderContainer = node)}
          >
            {children || <Loading />}
          </span>
        )}
        <iframe
          ref={node => (this._iframe = node)}
          {...props}
          title={`embedded iframe${title ? `: ${title}` : ''}`}
        />
      </div>
    );
  }
}

export default Embed;
