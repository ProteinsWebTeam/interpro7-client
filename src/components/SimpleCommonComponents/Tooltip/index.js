import React from 'react';
import T from 'prop-types';
import Tippy from '@tippy.js/react';

const _Tooltip = ({
  html,
  title,
  interactive,
  useContext: _uC,
  children,
  ...rest
}) => {
  let content = html || title;
  if (typeof content === 'string') {
    content = <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <Tippy content={content} arrow={true} interactive={true}>
      <div style={{ display: 'inline' }} {...rest}>
        {children}
      </div>
    </Tippy>
  );
};

// const _Tooltip = ({ ...rest }) => (
//   <Tooltip animation="shift" arrow="true" position="top" {...rest} />
// );
_Tooltip.displayName = 'Tooltip';
_Tooltip.propTypes = {
  html: T.any,
  title: T.any,
  interactive: T.bool,
  useContext: T.bool,
  children: T.any,
};
export default _Tooltip;
