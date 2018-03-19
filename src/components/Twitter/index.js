import React, { PureComponent } from 'react';

import cancelable from 'utils/cancelable';
import loadResource from 'utils/loadResource';
import Link from 'components/generic/Link';

import getsInView from 'utils/getsInView';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, local);

let bound = false;

const noPadding = { padding: 0 };

class Twitter extends PureComponent /*:: <{}> */ {
  /* ::
    _domNode: ?Element
    _node: ?Element
    _twitterScript: ?{
      cancel: function,
      promise: Promise<any>,
    }
  */
  async componentDidMount() {
    try {
      await getsInView(this._domNode, { rootMargin: '10px' });
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
      if (this._node) window.twttr.widgets.load(this._node);
    } catch (_) {
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
            <div
              className={f('jumbo-news-container')}
              ref={node => (this._domNode = node)}
            >
              <div
                className={f('icon', 'icon-socialmedia', 'icon-s2')}
                data-icon="T"
              />
              <Link
                ref={node => (this._node = node)}
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
