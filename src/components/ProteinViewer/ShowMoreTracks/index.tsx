import React from 'react';
import cssBinder from 'styles/cssBinder';
import styles from './style.css';

import tooltip from 'components/SimpleCommonComponents/Tooltip/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { hide } from '@floating-ui/react-dom';

const css = cssBinder(styles, fonts, tooltip);

type CategoryVisibility = { [name: string]: boolean };

type Props = {
  disabled: boolean;
  showMore: boolean;
  hideCategory: CategoryVisibility;
  showMoreChanged: (v: boolean) => void;
  setHideCategory: (v: CategoryVisibility) => void;
  switchCategoryVisibilityShowMore: (
    categories: CategoryVisibility,
    name: string[],
    hide: boolean,
  ) => CategoryVisibility;
};

{
  /* Button to show/hide all secondary tracks (maintains internal view/show state of the specific track)*/
}
const ShowMoreTracks = ({
  disabled,
  showMore,
  hideCategory,
  showMoreChanged,
  setHideCategory,
  switchCategoryVisibilityShowMore,
}: Props) => {
  return (
    <div>
      <button
        disabled={disabled}
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
          setHideCategory(
            switchCategoryVisibilityShowMore(
              hideCategory,
              ['families', 'domains'],
              !showMore ? false : true,
            ),
          );
          showMoreChanged(!showMore);
        }}
      >
        {showMore ? 'Show summary view' : 'Show all annotations'}
      </button>
    </div>
  );
};

export default ShowMoreTracks;
