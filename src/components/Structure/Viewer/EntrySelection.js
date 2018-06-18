import React, { PureComponent } from 'react';

import T from 'prop-types';

class EntrySelection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      memberDB: null,
      accession: null,
      active: false,
    };
  }

  onSelectionChange(e) {
    //extract memberDB and entry from component
    console.log(e);
    const entry = e.target.value;
    let memberDB = null;
    if (entry != null) {
      const selectedOption =
        e.currentTarget.options[e.currentTarget.selectedIndex];
      const optGroup = selectedOption.parentNode;
      memberDB = optGroup.label;
    }
    //update LiteMol
    this.props.updateStructure(memberDB, entry);
  }

  render() {
    const selectionGroups = [];
    selectionGroups.push(
      <option key="None" value="">
        Select Entry
      </option>,
    );

    for (const [memberDB, entries] of Object.entries(this.props.entryMap)) {
      const entryList = [];
      for (const [entry, matches] of Object.entries(entries)) {
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
    const selection = (
      <select
        onChange={e => this.onSelectionChange(e)}
        value={this.props.selectedEntry}
      >
        {selectionGroups}
      </select>
    );
    return <div>{selection}</div>;
  }
}

export default EntrySelection;
