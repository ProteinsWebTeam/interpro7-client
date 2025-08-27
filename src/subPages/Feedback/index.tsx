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
import forms from 'styles/forms.css';
import Callout from 'components/SimpleCommonComponents/Callout';

const css = cssBinder(local, forms);

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
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<'info' | 'warning'>('info');

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
      // eslint-disable-next-line no-magic-numbers
      if (response.status === 200) {
        setFeedbackText('Thank you for your feedback!');
        setFeedbackType('info');
        // eslint-disable-next-line no-magic-numbers
      } else if (response.status === 429) {
        setFeedbackText(
          'Request aborted as too many requests are made within a minute',
        );
        setFeedbackType('warning');
      } else {
        setFeedbackText('Invalid request');
        setFeedbackType('warning');
      }
      /* addToast(
        {
          title: text,
          ttl: 3000,
        },
        'interhelp-mail',
      );
      setMessage('');
      setEmail('');
      */
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
        <>
          <p>
            InterPro has started exploring the utilization of Large Language
            Models (LLM) for the automated generation of descriptions for
            protein families.
          </p>
          <p>
            Our preliminary assessments have indicated that the quality of these
            descriptions is sufficiently high to warrant publication on the
            InterPro website. However, we are keenly interested in gathering
            feedback from researchers who use our resource.
          </p>
          <p>
            Your input is invaluable to us, and we appreciate your time in
            providing us with your insights.
          </p>
        </>
      ) : (
        <p>
          We welcome your suggestions for updating this entry's annotations. Our
          curators will review all feedback and may incorporate suitable updates
          in the next{' '}
          {metadata.source_database.toLowerCase() === 'interpro'
            ? 'InterPro'
            : 'Pfam'}{' '}
          release. For more accurate updates, please include supporting
          literature references.
        </p>
      )}
      <p>
        {feedbackText && (
          <Callout
            onClose={() => {
              setFeedbackText('');
            }}
            closable={true}
            type={feedbackType}
          >
            {feedbackText}
          </Callout>
        )}
      </p>
      <label
        className={css(
          'vf-form__label',
          'vf-form__label--required',
          'required',
        )}
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
      <label
        className={css(
          'vf-form__label',
          'vf-form__label--required',
          'required',
        )}
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
