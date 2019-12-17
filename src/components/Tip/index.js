// @flow
import { PureComponent } from 'react';
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

class Tip extends PureComponent /*:: <Props> */ {
  static propTypes = {
    title: T.string,
    body: T.string.isRequired,
    checkBoxLabel: T.string,
    ttl: T.number,
    toastID: T.string.isRequired,
    settingsName: T.string.isRequired,
    addToast: T.func.isRequired,
    changeSettingsRaw: T.func.isRequired,
  };

  updateToastSettings(props /*: Props */) {
    props.changeSettingsRaw('notifications', props.settingsName, false);
  }

  render() {
    const { title, body, checkBoxLabel, ttl, toastID } = this.props;
    this.props.addToast(
      {
        title: title || '💡 Tip',
        body: body,
        checkBox: {
          label: checkBoxLabel || 'Do not show again',
          fn: () => this.updateToastSettings(this.props),
        },
        ttl: ttl || TTL,
      },
      toastID,
    );
    return null;
  }
}

export default connect(null, { addToast, changeSettingsRaw })(Tip);
