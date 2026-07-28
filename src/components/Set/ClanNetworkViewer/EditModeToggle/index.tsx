import React from 'react';

import Button from 'components/SimpleCommonComponents/Button';

type Props = {
  editMode: boolean;
  onToggle: () => void;
};

const EditModeToggle = ({ editMode, onToggle }: Props) => (
  <Button type={editMode ? 'primary' : 'secondary'} onClick={onToggle}>
    {editMode
      ? 'Editing mode: ON (drag nodes to reposition)'
      : 'Editing mode: OFF (click a node to open its entry)'}
  </Button>
);

export default EditModeToggle;
