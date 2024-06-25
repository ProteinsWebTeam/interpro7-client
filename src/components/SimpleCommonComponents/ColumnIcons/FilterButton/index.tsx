import React, { FormEvent } from 'react';

import Button from 'components/SimpleCommonComponents/Button';

const OPACITY_OFF = 0.4;

type Props = {
  isOpen: boolean;
  onClick?: (event: FormEvent) => void;
};
export const FilterButton = ({ isOpen, onClick }: Props) => {
  return (
    <Button
      type="inline"
      style={{
        opacity: isOpen ? 1 : OPACITY_OFF,
      }}
      onClick={onClick}
      icon="icon-filter"
    />
  );
};

export default FilterButton;
