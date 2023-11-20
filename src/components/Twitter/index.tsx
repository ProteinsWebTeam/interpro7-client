import React from 'react';

import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
const css = cssBinder(fonts, local);

const Twitter = () => {
  return (
    <div className={css('twitter-block', 'callout')}>
      <div className={css('icon', 'icon-common')} data-icon="&#xf099;" />
      <Link
        data-dnt="true"
        data-chrome={'nofooter noborders noheader noscrollbar transparent'}
        data-tweet-limit="1"
        className={css('twitter-timeline')}
        href="https://twitter.com/InterProDB"
        target="_blank"
      >
        Tweets by @InterProDB
      </Link>
    </div>
  );
};

export default Twitter;
