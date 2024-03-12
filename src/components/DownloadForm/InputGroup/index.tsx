import React, { ReactElement } from 'react';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(local, fonts);

type Props = {
  /**
   * What should be the label of the component. It supports nested react element
   */
  label: ReactElement | string;
  input: ReactElement;
  button: ReactElement;
};
const InputGroup = ({ label, input, button }: Props) => {
  return (
    <label className={css('new-input-group')}>
      <span className={css('new-input-group-label')}>{label}</span>
      {input}
      <div className={css('new-input-group-button')}>{button}</div>
    </label>
  );
};

export default InputGroup;
