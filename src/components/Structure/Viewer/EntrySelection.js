import React, { PureComponent } from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';
import style from './style.css';

const f = foundationPartial(style);
export const NO_SELECTION = 'NO_SELECTION';

/*:: type Props = {
  updateStructure: function,
  entryMap: Object,
  selectedEntry?: any,
}; */

/*:: type State = {
  memberDB: ?Object,
  accession: ?string,
  active: boolean,
}; */

class EntrySelection extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    updateStructure: T.func.isRequired,
    entryMap: T.object.isRequired,
    selectedEntry: T.any,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {
      memberDB: null,
      accession: null,
      active: false,
    };
  }

  onSelectionChange = e => {
    // extract memberDB and entry from component
    const entry = e.target.value;
    let memberDB = null;
    if (entry !== null) {
      const selectedOption =
        e.currentTarget.options[e.currentTarget.selectedIndex];
      const optGroup = selectedOption.parentNode;
      memberDB = optGroup.label;
    }
    // update structure viewer
    this.props.updateStructure(memberDB, entry);
  };

  render() {
    const selectionGroups = [];
    selectionGroups.push(
      <option key="{NO_SELECTION}" value={NO_SELECTION}>
        Select Entry
      </option>,
    );

    for (const [memberDB, entries] of Object.entries(this.props.entryMap)) {
      const entryList = [];
      for (const entry of Object.keys(entries)) {
        const key = `${memberDB}$-${entry}`;
        entryList.push(
          <option key={key} value={entry}>
            {entry}
          </option>,
        );
      }
      selectionGroups.push(
        <optgroup key={memberDB} label={memberDB}>
          {entryList}
        </optgroup>,
      );
    }
    return (
      <select
        className={f('structure-viewer-select')}
        onChange={this.onSelectionChange}
        onBlur={this.onSelectionChange}
        value={this.props.selectedEntry}
        data-testid="structure-entry-select"
      >
        {selectionGroups}
      </select>
    );
  }
}

export default EntrySelection;
