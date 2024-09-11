import React, { useRef } from 'react';
import SortButton, {
  ExposedButtonProps,
} from 'components/SimpleCommonComponents/ColumnIcons/SortButton';

type Props = {
  text: string;
  dataKey: string;
};

const SortButtonWithLabel = ({ text, dataKey }: Props) => {
  const sortButton = useRef<ExposedButtonProps>(null);
  return (
    <>
      <a
        onClick={() => {
          sortButton.current?.toggleSort();
        }}
        style={{
          color: 'inherit',
        }}
      >
        {text}
      </a>
      <SortButton field={dataKey} ref={sortButton} />
    </>
  );
};

export default SortButtonWithLabel;
