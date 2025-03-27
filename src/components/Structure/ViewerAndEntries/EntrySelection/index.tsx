import React from 'react';

import cssBinder from 'styles/cssBinder';

import style from '../style.css';

const css = cssBinder(style);
export const NO_SELECTION = 'NO_SELECTION';

type Props = {
  updateStructure: (memberDB: string | null, entry: string) => void;
  entryMap: Object;
  selectedEntry?: string;
  entriesNames: Record<string, string | NameObject>;
};

const EntrySelection = ({
  entryMap,
  selectedEntry,
  entriesNames,
  updateStructure,
}: Props) => {
  const selectionGroups = [];
  selectionGroups.push(
    <option key="{NO_SELECTION}" value={NO_SELECTION}>
      Highlight Entry in the 3D structure
    </option>,
  );

  for (const [memberDB, entries] of Object.entries(entryMap)) {
    const entryList = [];
    for (const entry of Object.keys(entries)) {
      const key = `${memberDB}$-${entry}`;
      entryList.push(
        <option key={key} value={entry}>
          {entriesNames[entry] as string}
        </option>,
      );
    }
    selectionGroups.push(
      <optgroup key={memberDB} label={memberDB}>
        {entryList}
      </optgroup>,
    );
  }
  const onSelectionChange = (e: React.FormEvent) => {
    // extract memberDB and entry from component
    const select = e.target as HTMLSelectElement;
    const entry = select.value;
    let memberDB = null;
    if (entry !== null) {
      const selectedOption = select.options[select.selectedIndex];
      const optGroup = selectedOption.parentNode as HTMLOptGroupElement;
      memberDB = optGroup?.label;
    }
    // update structure viewer
    updateStructure(memberDB, entry);
  };
  return (
    <select
      className={css('structure-viewer-select')}
      onChange={onSelectionChange}
      onBlur={onSelectionChange}
      value={selectedEntry}
      data-testid="structure-entry-select"
    >
      {selectionGroups}
    </select>
  );
};

export default EntrySelection;
