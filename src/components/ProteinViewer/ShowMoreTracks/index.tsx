import React from 'react';
import cssBinder from 'styles/cssBinder';
import styles from './style.css';
import tooltip from 'components/SimpleCommonComponents/Tooltip/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { SettingsAction } from 'src/actions/types';

const css = cssBinder(styles, fonts, tooltip);

type CategoryVisibility = { [name: string]: boolean };

type Props = {
  showMore: boolean;
  hideCategory: CategoryVisibility;
  showMoreChanged: (v: boolean) => void;
  setHideCategory: (v: CategoryVisibility) => void;
  switchCategoryVisibilityShowMore: (
    categories: CategoryVisibility,
    name: string[],
    hide: boolean,
  ) => CategoryVisibility;
  changeSettingsRaw: (
    category: string,
    key: string,
    value: string | number | boolean | LabelUISettings,
  ) => SettingsAction;
};

const ShowMoreTracks = ({
  showMore,
  hideCategory,
  showMoreChanged,
  setHideCategory,
  switchCategoryVisibilityShowMore,
  changeSettingsRaw, // Destructure the prop
}: Props) => {
  const handleClick = () => {
    // Update the hideCategory state
    const newHideCategory = switchCategoryVisibilityShowMore(
      hideCategory,
      ['families', 'domains'],
      !showMore ? false : true,
    );
    setHideCategory(newHideCategory);
    showMoreChanged(!showMore);

    // Save the showMore state to the Redux store
    changeSettingsRaw('ui', 'showMoreSettings', !showMore);
  };

  return (
    <div onClick={handleClick}>
      <div
        className={css('showmore-toggle-outer', showMore ? 'full' : 'overview')}
      >
        <div
          className={css('showmore-toggle-inner', showMore ? 'moved' : '')}
        />
        <span style={{ marginLeft: showMore ? '7px' : '25px' }}>
          {showMore ? 'Full View' : 'Overview'}
        </span>
      </div>
    </div>
  );
};

export default ShowMoreTracks;
