import React from 'react';
import getColor from 'utils/taxonomy/get-color';
import getIcon from 'utils/taxonomy/get-icon';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(fonts);

type Props = {
  lineage: string;
  fontSize?: string;
};

export const SpeciesIcon = ({ lineage, fontSize = '1rem' }: Props) => {
  let icon = '.';
  let color;
  if (lineage) {
    icon = getIcon(lineage) || '.';
    color = getColor(lineage);
  }
  return (
    <span
      style={{ color, fontSize }}
      className={css('small', 'icon', 'icon-species')}
      data-icon={icon}
    />
  );
};

export default SpeciesIcon;
