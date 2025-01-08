import React from 'react';
import cssBinder from 'styles/cssBinder';
import styles from './style.css';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { SettingsAction } from 'src/actions/types';

const css = cssBinder(styles, fonts);

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
    value: string | number | boolean | LabelUISettings | MatchTypeUISettings,
  ) => SettingsAction;
};

const ShowMoreTracks = ({
  showMore,
  hideCategory,
  showMoreChanged,
  setHideCategory,
  switchCategoryVisibilityShowMore,
  changeSettingsRaw,
}: Props) => {
  const handleClick = (view: boolean) => {
    const newHideCategory = switchCategoryVisibilityShowMore(
      hideCategory,
      ['families', 'domains'],
      view,
    );
    setHideCategory(newHideCategory);
    showMoreChanged(view);
    changeSettingsRaw('ui', 'showMoreSettings', view);
  };

  return (
    <div className={css('view-mode-option-container')}>
      <div className={css('no-margin', 'view-mode-option-label')}>
        <b>Feature Display Mode</b>{' '}
        <Tooltip
          html={`
        <b style = "text-align:left" > Change which annotations are displayed</b>
        <ul style = "text-align:left" >
          <li> Overview: representative features only </li>
          <li> Full: all available features </li>
        </ul> `}
        >
          <span className={css('icon', 'icon-common')} data-icon="&#xf059;" />
        </Tooltip>
      </div>
      <div className={css('view-mode-checkboxes')}>
        <div className={css('view-mode-checkbox')}>
          <div>
            <input
              type="radio"
              name="featureDisplay"
              value="overview"
              checked={!showMore}
              className={css('no-margin')}
              onChange={() => handleClick(false)}
            />
          </div>
          <div className={css('checkbox-label')}>Summary</div>
        </div>
        <div className={css('view-mode-checkbox')}>
          <div>
            <input
              type="radio"
              name="featureDisplay"
              value="overview"
              checked={showMore}
              className={css('no-margin')}
              onChange={() => handleClick(true)}
            />
          </div>
          <div className={css('checkbox-label')}>Full</div>
        </div>
      </div>
    </div>
  );
};

export default ShowMoreTracks;
