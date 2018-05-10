import React, { PureComponent } from 'react';
import { schedule } from 'timing-functions/src';

import Storage from 'utils/storage';

import f from 'styles/foundation';

const storage = new Storage('user-id', 'local');

const handleReset = () => {
  storage.setValue('');
  window.location.reload();
};

const mounted = new WeakSet();

export default class UserId extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { uuid: storage.getValue() };
  }

  componentDidMount() {
    mounted.add(this);

    if (!this.state.uuid) this._checkUUID();
  }

  componentWillUnmount() {
    mounted.delete(this);
  }

  _checkUUID = async () => {
    await schedule();
    const uuid = storage.getValue();
    if (mounted.has(this)) {
      if (uuid) {
        this.setState({ uuid });
      } else {
        this._checkUUID();
      }
    }
  };

  render() {
    return (
      <div className={f('input-group')}>
        <span className={f('input-group-label')}>Your user ID is:</span>
        <code className={f('input-group-field')}>{storage.getValue()}</code>
        <div className={f('input-group-button')}>
          <button
            className={f('button', 'hollow', 'small')}
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
}
