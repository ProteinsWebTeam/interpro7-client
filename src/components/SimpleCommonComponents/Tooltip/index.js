// @flow
import React from 'react';
import T from 'prop-types';
import Tippy from '@tippy.js/react';
import { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const _Tooltip = (
  {
    html,
    title,
    interactive,
    useContext: _uC,
    children,
    distance,
    ...rest
  } /*: {html?: any, title?: any, interactive?: boolean, useContext?: boolean, children: any, target?: Object, distance? : number} */,
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
      onShow={() => hideAll({ duration: 0 })}
      distance={distance}
      appendTo={document.body}
      allowHTML={true}
      className={'tippy-box'}
    >
      <div {...rest} style={{ display: 'inline' }}>
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
  distance: T.number,
};
export default _Tooltip;
