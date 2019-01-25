import React, { PureComponent } from 'react';
import T from 'prop-types';

class IdaEntry extends PureComponent {
  render() {
    const {
      entry,
      active,
      changeEntryHandler,
      removeEntryHandler,
    } = this.props;
    return (
      <div>
        <input
          type="text"
          value={entry}
          onChange={evt => changeEntryHandler(evt.target.value)}
        />
        <button onClick={removeEntryHandler}> X </button>
      </div>
    );
  }
}

export default IdaEntry;
