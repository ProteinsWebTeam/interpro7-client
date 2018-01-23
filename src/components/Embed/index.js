// @flow
import React, { PureComponent } from 'react';
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

const mounted = new WeakSet();

class Embed extends PureComponent {
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
    mounted.add(this);
  }

  componentWillUnmount() {
    this._iframe.removeEventListener('load', this._onLoad);
    mounted.delete(this);
  }

  _onLoad = () => {
    if (!mounted.has(this)) return;
    this._placeholderContainer.style.pointerEvents = 'none';
    this._placeholderContainer.animate(
      { opacity: [1, 0] },
      {
        duration: 1000,
        easing: 'ease-in-out',
        fill: 'both',
      },
    ).onfinish = () => {
      if (mounted.has(this)) this.setState({ loading: false });
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
