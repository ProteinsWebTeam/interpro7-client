import React, {Component} from 'react';

import {foundationPartial} from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme);

const loadTwitterScript = () => new Promise((res, rej) => {
  const script = document.createElement('script');
  script.async = true;
  script.onload = res;
  script.onerror = rej;
  script.src = '//platform.twitter.com/widgets.js';
  document.head.appendChild(script);
}).then(() => window.twttr.events.bind(
  'rendered',
  ({target}) => {
    // eslint-disable-next-line no-param-reassign
    target.style.opacity = 1;
    // eslint-disable-next-line no-param-reassign
    target.style.transform = 'translateX(0)';
  }
));
let twitterScript;

class Twitter extends Component {
  componentDidMount() {
    if (!twitterScript) twitterScript = loadTwitterScript();
    twitterScript.then(() => {
      if (!window.twttr) return;
      window.twttr.widgets.load(this._node);
    });
  }

  render() {
    return (
      <div className={f('expanded', 'row')}>
        <div className={f('columns')}>
          <div className={'jumbo-news'} >
            <div className={'jumbo-news-container'} >
              <h3
                className={f('icon', 'icon-socialmedia', 'icon-s2')}
                data-icon="T"
              />
              <a
                ref={node => this._node = node}
                data-dnt="true"
                data-chrome={
                  'nofooter noborders noheader noscrollbar transparent'
                }
                data-tweet-limit="1"
                className="twitter-timeline"
                href="https://twitter.com/InterProDB"
                target="_blank"
                rel="noopener"
              >
                Tweets by @InterProDB
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Twitter;
