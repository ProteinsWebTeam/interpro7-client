// @flow
import React, { useEffect, useRef, useState } from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from '../style.css';
import summary from 'styles/summary.css';

const f = foundationPartial(summary, fonts, style);
/*::
type Results = {
  xref: Array<{
    name: string,
  }>,
  sequence: string,
}
type Props = {
  localID: string,
  localTitle: string,
  payload: Results,
  updateJobTitle: function,
  status: string,
}
  */
const changeTitle = (
  localID /*: string */,
  results /*: Results */,
  updateJobTitle /*: function */,
  inputRef /*:  { current?:  null | HTMLInputElement } */,
  setTitle /*: function */,
  setReadable /*: function */,
) => {
  if (inputRef.current === null) return;
  if (inputRef.current === undefined) return;
  if (inputRef.current.readOnly) {
    inputRef.current.focus();
  } else {
    if (inputRef.current.value !== '') {
      const value = inputRef.current.value;
      results.xref[0].name = value;
      const input = `>${value} ${results.sequence}`;
      updateJobTitle(
        { metadata: { localID }, data: { input, results } },
        value,
      );
      setTitle(value);
    }
  }
  setReadable(!inputRef.current.readOnly);
};
const IPScanTitle = (
  { localID, localTitle, payload, updateJobTitle, status } /*: Props */,
) => {
  const [title, setTitle] = useState(localTitle);
  const [readable, setReadable] = useState(true);
  const titleInputRef /* { current?: null | HTMLInputElement }*/ = useRef();
  useEffect(() => {
    setTitle(localTitle || payload.xref[0].name);
  }, [payload, localTitle]);
  useEffect(() => {
    setTitle(localTitle);
  }, [localTitle]);

  if (!title) return null;
  return (
    <section className={f('summary-row')}>
      <header>Title</header>
      <section>
        <input
          ref={titleInputRef}
          className={f('title')}
          defaultValue={`${title}`}
          readOnly={readable}
          style={{ width: `${title.length}ch` }}
        />
        {['finished', 'imported file', 'saved in browser'].includes(status) ? (
          <button
            onClick={() =>
              changeTitle(
                localID,
                payload,
                updateJobTitle,
                titleInputRef,
                setTitle,
                setReadable,
              )
            }
          >
            {readable ? (
              <span
                className={f('icon', 'icon-common')}
                data-icon="&#xf303;"
                title={'Rename'}
              />
            ) : (
              <span
                className={f('icon', 'icon-common')}
                data-icon="&#x53;"
                title={'Save'}
              />
            )}
          </button>
        ) : null}
      </section>
    </section>
  );
};
IPScanTitle.propTypes = {
  localID: T.string,
  localTitle: T.string,
  payload: T.object,
  updateJobTitle: T.func,
  status: T.string,
};
export default IPScanTitle;
