// @flow
import React from 'react';
import T from 'prop-types';
import Tippy, { tippy } from '@tippy.js/react';

const _Tooltip = (
  {
    html,
    title,
    interactive,
    useContext: _uC,
    children,
    ...rest
  } /*: {html?: any, title?: any, interactive?: boolean, useContext?: boolean, children: any, target?: Object} */,
) => {
  let content = html || title;
  if (typeof content === 'string') {
    // eslint-disable-next-line react/no-danger
    content = <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <Tippy
      content={content}
      arrow={true}
      interactive={true}
      onShow={() => tippy.hideAll({ duration: 0 })}
    >
      <div style={{ display: 'inline' }} {...rest}>
        {children}
      </div>
    </Tippy>
  );
};

_Tooltip.displayName = 'Tooltip';
_Tooltip.propTypes = {
  html: T.any,
  title: T.any,
  interactive: T.bool,
  useContext: T.bool,
  children: T.any,
  target: T.object,
};
export default _Tooltip;
