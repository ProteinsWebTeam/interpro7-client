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
    <div>
      <button
        style={{
          boxShadow: 'none',
          transform: 'none',
        }}
        className={css(
          'vf-button',
          'vf-button--secondary',
          'vf-button--sm',
          'showmore-btn',
        )}
        onClick={() => {
          showMoreChanged(!showMore);
        }}
      >
        {showMore ? 'Show less annotations' : 'Show all annotations'}
      </button>
    </div>
  );
};

export default ShowMoreTracks;
