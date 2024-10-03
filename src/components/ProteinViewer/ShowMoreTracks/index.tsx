import React from 'react';
import cssBinder from 'styles/cssBinder';
import styles from './style.css';

import tooltip from 'components/SimpleCommonComponents/Tooltip/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { hide } from '@floating-ui/react-dom';

const css = cssBinder(styles, fonts, tooltip);

type CategoryVisibility = { [name: string]: boolean };

type Props = {
  showMore: boolean;
  hideCategory: CategoryVisibility;
  showMoreChanged: (v: boolean) => void;
  setHideCategory: (v: CategoryVisibility) => void;
  switchCategoryVisibility: (
    categories: CategoryVisibility,
    name: string[],
  ) => CategoryVisibility;
};

{
  /* Button to show/hide all secondary tracks (maintains internal view/show state of the specific track)*/
}
const ShowMoreTracks = ({
  showMore,
  hideCategory,
  showMoreChanged,
  setHideCategory,
  switchCategoryVisibility,
}: Props) => {
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
