import React from 'react';


const Twit = () => (
  <a
    className="twitter-timeline" height="100"
    data-dnt="true" data-widget-id="336436507277676547"
    data-chrome="nofooter noborders noheader noscrollbar transparent"
    data-tweet-limit="1"
    href="https://twitter.com/InterProDB"
  > Tweets by @InterProDB</a>
);

const twitter = (d, s, id) => {
  const fjs = d.getElementsByTagName(s)[0];
  if (!d.getElementById(id)){
    const js = d.createElement(s);
    js.id = id;
    js.src = '//platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);
  }
};
twitter(document, 'script', 'twitter-wjs');


export default Twit;
