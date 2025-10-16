import React, { useEffect, useRef, useState, KeyboardEvent } from 'react';

import { connect } from 'react-redux';
import { updateSequenceJobTitle, updateJobTitle } from 'actions/creators';

import Button from 'components/SimpleCommonComponents/Button';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import style from '../style.css';
import summary from 'styles/summary.css';

const css = cssBinder(summary, fonts, style);

type Props = {
  type: 'sequence' | 'job';
  accession: string;
  localTitle?: string;
  payload: Iprscan5Result | MinimalJobMetadata;
  updateSequenceJobTitle?: typeof updateSequenceJobTitle;
  updateJobTitle?: typeof updateJobTitle;
  status?: string;
  editable?: boolean;
};

const IPScanTitle = ({
  type,
  accession,
  localTitle,
  payload,
  updateSequenceJobTitle,
  updateJobTitle,
  status,
  editable = true,
}: Props) => {
  const [title, setTitle] = useState(localTitle || '');
  const [readable, setReadable] = useState(true);
  const titleInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTitle(localTitle || (payload as Iprscan5Result).xref?.[0].name || '');
  }, [payload, localTitle]);

  const changeTitle = () => {
    if (!titleInputRef.current) return;
    if (titleInputRef.current.readOnly) {
      titleInputRef.current.focus();
    } else {
      if (titleInputRef.current.value !== '') {
        const value = titleInputRef.current.value;
        if (type === 'sequence') {
          (payload as Iprscan5Result).xref[0].name = value;
          updateSequenceJobTitle?.(accession, value);
        }
        if (type === 'job') {
          (payload as IprscanMetaIDB).localTitle = value;
          updateJobTitle?.(accession, value);
        }
        setTitle(value);
      }
    }
    setReadable(!titleInputRef.current.readOnly);
  };
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      changeTitle();
    }
  };

  return (
    <section className={css('summary-row')}>
      <header>Title</header>
      <section>
        <input
          ref={titleInputRef}
          className={css('title')}
          value={title}
          readOnly={readable || !editable}
          style={{ width: `${Math.max(title?.length, 10)}ch` }}
          onChange={(event) => setTitle(event.target.value)}
          onDoubleClick={() => setReadable(false || !editable)}
          onKeyUp={handleKeyPress}
          placeholder="ø"
        />
        {editable &&
        ['finished_with_results', 'imported file'].includes(status || '') ? (
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

export default connect(undefined, { updateSequenceJobTitle, updateJobTitle })(
  IPScanTitle,
);
