import React, { useEffect, useRef, useState } from 'react';

import { connect } from 'react-redux';
import { updateSequenceJobTitle } from 'actions/creators';

import Button from 'components/SimpleCommonComponents/Button';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import style from '../style.css';
import summary from 'styles/summary.css';

const css = cssBinder(summary, fonts, style);

type Props = {
  seqAccession: string;
  localTitle: string;
  payload: Iprscan5Result;
  updateSequenceJobTitle?: typeof updateSequenceJobTitle;
  status: string;
};

const IPScanTitle = ({
  seqAccession,
  localTitle,
  payload,
  updateSequenceJobTitle,
  status,
}: Props) => {
  const [title, setTitle] = useState(localTitle);
  const [readable, setReadable] = useState(true);
  const titleInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTitle(localTitle || payload.xref[0].name);
  }, [payload, localTitle]);

  const changeTitle = () => {
    if (titleInputRef.current === null) return;
    if (titleInputRef.current === undefined) return;
    if (titleInputRef.current.readOnly) {
      titleInputRef.current.focus();
    } else {
      if (titleInputRef.current.value !== '') {
        const value = titleInputRef.current.value;
        payload.xref[0].name = value;
        updateSequenceJobTitle?.(seqAccession, value);
        setTitle(value);
      }
    }
    setReadable(!titleInputRef.current.readOnly);
  };

  if (!title) return null;
  return (
    <section className={css('summary-row')}>
      <header>Title</header>
      <section>
        <input
          ref={titleInputRef}
          className={css('title')}
          value={title}
          readOnly={readable}
          style={{ width: `${title.length}ch` }}
          onChange={(event) => setTitle(event.target.value)}
        />
        {['finished', 'imported file', 'saved in browser'].includes(status) ? (
          <Button
            type="inline"
            onClick={changeTitle}
            icon={readable ? 'icon-pencil-alt' : 'icon-save'}
            title={readable ? 'Rename' : 'Save'}
          />
        ) : null}
      </section>
    </section>
  );
};

export default connect(undefined, { updateSequenceJobTitle })(IPScanTitle);
