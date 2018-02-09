import React, { PureComponent } from 'react';

import AnimatedEntry from 'components/AnimatedEntry';
import Link from 'components/generic/Link';

import config from 'config';

import foundation from 'styles/foundation';

class CookieBanner extends PureComponent /*:: <{}, { display: ?boolean }> */ {
  /* ::
    _banner: ?any
  */
  componentWillMount() {
    if (document) {
      this.setState({
        // If cookies are already accepted, display -> false
        display: !(document.cookie.match(/cookies-accepted=true/i) || [])[1],
      });
    }
  }

  handleClick = () => {
    const expires = new Date();
    // Set expire date to now + 1 year
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `cookies-accepted=true;expires=${expires.toUTCString()};path=${
      config.root.website.path
    }`;
    if (this._banner && this._banner.animate) {
      this._banner.parentElement.animate(
        [
          { transform: 'translateY(0)', opacity: 1 },
          { transform: 'translateY(100%)', opacity: 0.5 },
        ],
        { duration: 300, fill: 'forwards', easing: 'ease-in' },
      ).onfinish = () => this.setState({ display: false });
    } else {
      this.setState({ display: false });
    }
  };

  render() {
    const { display = false } = this.state;
    if (!display) return null;
    return (
      <AnimatedEntry
        animateSelf
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
        <div className={foundation('row')} ref={node => (this._banner = node)}>
          <span style={{ marginRight: '2em', flex: 1 }}>
            This website uses cookies. By continuing to browse this site, you
            are agreeing to the use of our site cookies. To find out more, see
            our{' '}
            <Link
              target="_blank"
              href="https://www.ebi.ac.uk/about/terms-of-use"
              style={{ color: '#f8f8f8', borderBottom: '1px dotted' }}
            >
              Terms of Use
            </Link>.
          </span>
          <button
            style={{
              fontWeight: 'bold',
              padding: '0.5em',
              color: '#fff',
              position: 'absolute',
              top: '1ch',
              right: '1ch',
            }}
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
