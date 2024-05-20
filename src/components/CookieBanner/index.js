import React, { PureComponent } from 'react';

import AnimatedEntry from 'components/AnimatedEntry';
import Link from 'components/generic/Link';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

import config from 'config';

import foundation from 'styles/foundation';

class CookieBanner extends PureComponent /*:: <{}, { display: ?boolean }> */ {
  /*:: _ref: { current: null | React$ElementRef<'div'> }; */
  constructor(props /*: {} */) {
    super(props);

    this.state = {
      // If cookies are already accepted, display -> false
      display:
        !!document &&
        !(document.cookie.match(/cookies-accepted=true/i) || [])[1],
    };

    this._ref = React.createRef();
  }

  handleClick = () => {
    const expires = new Date();
    // Set expire date to now + 1 year
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `cookies-accepted=true;expires=${expires.toUTCString()};path=${
      config.root.website.path
    }`;
    if (this._ref.current && this._ref.current.animate) {
      this._ref.current.parentElement.animate(
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
    const { display } = this.state;
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
          background: 'rgb(112, 115, 114)',
          color: '#eee',
          padding: '0.75em',
          zIndex: 101,
        }}
      >
        <div
          className={foundation('row')}
          style={{ display: 'flex', alignItems: 'baseline' }}
          ref={this._ref}
        >
          <div
            className={foundation(
              'columns',
              'medium-8',
              'large-9',
              'white-color',
            )}
          >
            This website requires cookies, and the limited processing of your
            personal data in order to function. By using the site you are
            agreeing to this as outlined in our{' '}
            <Link
              target="_blank"
              href="https://www.ebi.ac.uk/data-protection/privacy-notice/embl-ebi-public-website"
              style={{ color: '#f8f8f8' }}
            >
              Privacy Notice
            </Link>
            {' and '}
            <Link
              target="_blank"
              href="https://www.ebi.ac.uk/about/terms-of-use"
              style={{ color: '#f8f8f8' }}
            >
              Terms of Use
            </Link>
            .
          </div>
          <div
            className={foundation(
              'columns',
              'medium-4',
              'large-3',
              'text-right',
              'white-color',
            )}
          >
            <Button onClick={this.handleClick}>
              I agree, dismiss this banner
            </Button>
          </div>
        </div>
      </AnimatedEntry>
    );
  }
}

export default CookieBanner;
