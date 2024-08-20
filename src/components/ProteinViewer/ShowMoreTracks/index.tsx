import React from 'react';
import cssBinder from 'styles/cssBinder';
import styles from './style.css';

import tooltip from 'components/SimpleCommonComponents/Tooltip/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(styles, fonts, tooltip);

type Props = {
  showMore: boolean;
  showMoreChanged: (v: boolean) => void;
};

{
  /* Button to show/hide all secondary tracks (maintains internal view/show state of the specific track)*/
}
const ShowMoreTracks = ({ showMore, showMoreChanged }: Props) => {
  return (
    <div className={css('showmore-btn')}>
      <button
        style={{ boxShadow: 'none' }}
        className={css('vf-button vf-button--link vf-button--sm')}
        onClick={() => {
          showMoreChanged(!showMore);
        }}
      >
        {showMore ? 'Show less tracks' : 'Show more tracks'}
      </button>
    </div>
  );
};

export default ShowMoreTracks;
