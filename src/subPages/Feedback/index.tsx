import React, { FormEvent, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { addToast } from 'actions/creators';
import { format } from 'url';
import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';

import Button from 'components/SimpleCommonComponents/Button';
import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';

import local from './style.css';

const css = cssBinder(local);

type Props = {
  api: ParsedURLServer;
  llm?: boolean;
  addToast: typeof addToast;
};

interface LoadedProps
  extends Props,
    LoadDataProps<{ metadata: EntryMetadata }> {}

const Feedback = ({ api, llm, data, addToast }: LoadedProps) => {
  if (!data) return null;
  if (data.loading) return <Loading />;
  const metadata = data.payload?.metadata;
  if (!metadata) return null;

  const { protocol, hostname, port, root } = api;
  const apiUrl = cleanUpMultipleSlashes(
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/mail/`,
    }),
  );

  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const entry = `${metadata.name.name} (${metadata.accession})`;
  const queue =
    metadata.source_database.toLowerCase() === 'pfam' ? 'pfam' : 'interpro';

  const handleSubmit = (event: FormEvent) => {
    if (!event.target) return;
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    data.append(
      'subject',
      llm ? `LLM Feedback, ${entry}` : `Add annotation, ${entry}`,
    );
    data.append('queue', queue);
    fetch(apiUrl, {
      method: 'POST',
      body: data,
    }).then((response) => {
      let text;
      // eslint-disable-next-line no-magic-numbers
      if (response.status === 200) {
        text = 'Thanks for your feedback';
        // eslint-disable-next-line no-magic-numbers
      } else if (response.status === 429) {
        text = 'Request aborted as too many requests are made within a minute';
      } else {
        text = 'Invalid request';
      }
      addToast(
        {
          title: text,
          ttl: 3000,
        },
        'interhelp-mail',
      );
      setMessage('');
      setEmail('');
    });
  };
  const handleFields = (e: FormEvent) => {
    const target = e.target as HTMLFormElement;
    if (target.name === 'message') setMessage(target.value);
    else setEmail(target.value);
  };

  const clearFields = () => {
    setMessage('');
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className={css('vf-stack', 'vf-stack--200')}>
      <h4>Feedback</h4>
      {llm ? (
        <p>
          Please let us know if there is anything incorrect in the LLM generated
          data.
        </p>
      ) : (
        <p>
          You can suggest annotation updates for this entry using the provided
          form. Our curators will review and, if suitable, include them in the
          next{' '}
          {metadata.source_database.toLowerCase() === 'interpro'
            ? 'InterPro'
            : 'Pfam'}{' '}
          release. Please include supporting literature references for better
          accuracy.
        </p>
      )}
      <label
        className={css('vf-form__label', 'vf-form__label--required')}
        htmlFor="message"
      >
        Details
      </label>
      <textarea
        id="message"
        name="message"
        value={message}
        onChange={handleFields}
        className={css('vf-form__textarea')}
        rows={5}
        required
      />
      <label
        className={css('vf-form__label', 'vf-form__label--required')}
        htmlFor="from_email"
      >
        Email address
      </label>
      <input
        id="from_email"
        name="from_email"
        type="email"
        value={email}
        onChange={handleFields}
        className={css('vf-form__input')}
        required
      />
      <div className={css('flex-space-evenly')}>
        <Button submit>Submit</Button>
        <Button type="tertiary" onClick={clearFields}>
          Clear
        </Button>
      </div>
    </form>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.search,
  (api, search) => ({ api, llm: 'llm' in search }),
);

export default connect(mapStateToProps, { addToast })(Feedback);
