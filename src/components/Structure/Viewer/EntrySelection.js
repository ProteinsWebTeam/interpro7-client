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
    const entry = e.target.value;
    let memberDB = null;
    if (entry != null) {
      const selectedOption =
        e.currentTarget.options[e.currentTarget.selectedIndex];
      const optGroup = selectedOption.parentNode;
      memberDB = optGroup.label;
    }

    this.props.updateStructure(memberDB, entry);
  }

  toggleState(event) {
    const active = this.state.active ? false : true;
    this.setState({ active: active });
    console.log(`${memberDB}:${entry} => ${active}`);
    this.props.updateStructure(memberDB, entry);
  }

  render() {
    const selectionGroups = [];
    selectionGroups.push(
      <option key="None" value={null} onChange={() => this.toggleState()}>
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
      <select onChange={e => this.onSelectionChange(e)}>
        {selectionGroups}
      </select>
    );
    return <div>{selection}</div>;
  }
}

export default EntrySelection;
