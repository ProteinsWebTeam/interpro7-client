import React from 'react';
import styles from './style.css';


const Twit = ({data}) => (

  <a className="twitter-timeline"  height="100" data-dnt="true" href="https://twitter.com/InterProDB"
      data-widget-id="336436507277676547"
      data-chrome="nofooter noborders noheader noscrollbar transparent" data-tweet-limit="1"> Tweets by
                        @InterProDB</a>
  
);

!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");


export default Twit;
