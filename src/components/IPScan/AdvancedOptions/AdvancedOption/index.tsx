import React, { PropsWithChildren } from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

type Props = PropsWithChildren<{
  name: string;
  value: string;
  title?: string;
  defaultChecked: boolean;
}>;

// TODO: it has this state, but I don't think was used.
// this.state = {
//     checked: !!props.defaultChecked,
//   };
const AdvancedOption = ({
  name,
  value,
  children,
  title,
  defaultChecked,
}: Props) => {
  const output = (
    <>
      <input
        name={name}
        defaultChecked={defaultChecked}
        type="checkbox"
        value={value}
        data-defaultchecked={defaultChecked}
      />{' '}
      {children}
    </>
  );
  if (!title) return output;
  return (
    <label>
      <Tooltip title={title}>{output}</Tooltip>
    </label>
  );
};

export default AdvancedOption;
