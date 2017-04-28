// @flow
import React, {Component} from 'react';

import AnimatedEntry from 'components/AnimatedEntry';

import foundation from 'styles/foundation';

class CookieBanner extends Component {
  /* ::
    state: {display: ?bool}
    _banner: ?any
  */
  componentWillMount() {
    if (document) {
      this.setState({
        // If cookies are already accepted, display -> false
        display: !(document.cookie.match(/cookies-accepted=(true)/i) || [])[1],
      });
    }
  }

  handleClick = () => {
    document.cookie = 'cookies-accepted=true';
    if (this._banner && this._banner.animate) {
      this._banner
        .animate([
          {transform: 'translateY(0)', opacity: 1},
          {transform: 'translateY(100%)', opacity: 0.5},
        ], {duration: 300, fill: 'forwards', easing: 'ease-in'})
        .onfinish = () => this.setState({display: false});
    } else {
      this.setState({display: false});
    }
  };

  render() {
    const {display = false} = this.state;
    if (!display) return null;
    return (
      <AnimatedEntry
        animateSelf={true}
        keyframes={{
          opacity: [0, 1],
          transform: ['translateY(100%)', 'translateY(0)'],
        }}
        element="div"
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100vw',
          background: 'rgba(0, 0, 0, 0.85)',
          color: '#eee',
          padding: '0.75em',
          zIndex: 101,
        }}
      >
        <div className={foundation('row')}>
        <span style={{marginRight: '2em', flex: 1}} >
          This website uses cookies.
          By continuing to browse this site,
          you are agreeing to the use of our site cookies.
          To find out more, see our{' '}
          <a
            target="_blank"
            href="https://www.ebi.ac.uk/about/terms-of-use"
          >
            Terms of Use
          </a>.
        </span>
        <button
          style={{fontWeight: 'bold', padding: '0.5em'}}
          onClick={this.handleClick}
        >
          ×
        </button>
        </div>
      </AnimatedEntry>
    );
  }
}

export default CookieBanner;
