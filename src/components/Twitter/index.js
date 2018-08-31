import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';

import cancelable from 'utils/cancelable';
import loadResource from 'utils/load-resource';
import getsInView from 'utils/gets-in-view';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, local);

let bound = false;

const noPadding = { padding: 0 };

class Twitter extends PureComponent /*:: <{}> */ {
  /* ::
    _ref: { current: null | React$ElementRef<'div'> };
    _linkRef: { current: null | React$ElementRef<Link> };
    _twitterScript: ?{
      cancel: function,
      promise: Promise<any>,
    };
  */

  constructor(props) {
    super(props);

    this._ref = React.createRef();
    this._linkRef = React.createRef();
  }

  async componentDidMount() {
    try {
      await getsInView(this._ref.current, { rootMargin: '10px' });
      this._twitterScript = cancelable(
        loadResource('//platform.twitter.com/widgets.js'),
      );
      await this._twitterScript.promise;
      if (!window.twttr) return;
      if (!bound) {
        // Only need to bind this once
        window.twttr.events.bind('rendered', ({ target }) => {
          target.style.opacity = 1;
          target.style.transform = 'translateX(0)';
        });
        bound = true;
      }
      if (this._LinkRef.current)
        window.twttr.widgets.load(this._LinkRef.current);
    } catch {
      /**/
    }
  }

  componentWillUnmount() {
    if (this._twitterScript) this._twitterScript.cancel();
  }

  render() {
    return (
      <div className={f('expanded', 'row')}>
        <div className={f('columns')} style={noPadding}>
          <div className={f('jumbo-news')}>
            <div className={f('jumbo-news-container')} ref={this._ref}>
              <div className={f('icon', 'icon-common')} data-icon="🐦" />
              <Link
                ref={this._LinkRef}
                data-dnt="true"
                data-chrome={
                  'nofooter noborders noheader noscrollbar transparent'
                }
                data-tweet-limit="1"
                className={f('twitter-timeline')}
                href="https://twitter.com/InterProDB"
                target="_blank"
              >
                Tweets by @InterProDB
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Twitter;
