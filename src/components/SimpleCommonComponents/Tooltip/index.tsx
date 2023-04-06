import React, { PropsWithChildren } from 'react';
import Tippy from '@tippy.js/react';
import { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const Tooltip = ({
  html,
  title,
  useContext,
  children,
  distance,
  interactive = false,
  ...rest
}: PropsWithChildren<{
  html?: React.ReactElement | string | number;
  title?: React.ReactElement | string | number;
  useContext?: boolean;
  distance?: number;
  interactive?: boolean;
}>) => {
  let content = html || title || '';
  if (typeof content === 'string') {
    // eslint-disable-next-line react/no-danger
    content = <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <Tippy
      content={content || ''}
      arrow={true}
      onShow={() => hideAll({ duration: 0 })}
      distance={distance}
      appendTo={document.body}
      allowHTML={true}
      className={'tippy-box'}
      interactive={interactive}
    >
      <div {...rest} style={useContext ? {} : { display: 'inline' }}>
        {children}
      </div>
    </Tippy>
  );
};

export default Tooltip;
