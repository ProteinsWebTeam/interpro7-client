// @flow
import { useEffect } from 'react';
import T from 'prop-types';

import { addToast, changeSettingsRaw } from 'actions/creators';
import { connect } from 'react-redux';

const TTL = 5000;

/*:: type Props = {
  title?: string,
  body: string,
  checkBoxLabel?: string,
  ttl?: number,
  toastID: string,
  settingsName: string,
  addToast: function,
  changeSettingsRaw: function,
};*/

const Tip = (
  {
    title,
    body,
    checkBoxLabel,
    ttl,
    toastID,
    addToast,
    changeSettingsRaw,
    settingsName,
  } /*: Props */,
) => {
  useEffect(() => {
    addToast(
      {
        title: title || '💡 Tip',
        body: body,
        checkBox: {
          label: checkBoxLabel || 'Do not show again',
          fn: () => changeSettingsRaw('notifications', settingsName, false),
        },
        ttl: ttl || TTL,
      },
      toastID,
    );
  });
  return null;
};
Tip.propTypes = {
  title: T.string,
  body: T.oneOfType([T.string, T.object]).isRequired,
  checkBoxLabel: T.string,
  ttl: T.number,
  toastID: T.string.isRequired,
  settingsName: T.string.isRequired,
  addToast: T.func.isRequired,
  changeSettingsRaw: T.func.isRequired,
};
export default connect(null, { addToast, changeSettingsRaw })(Tip);
