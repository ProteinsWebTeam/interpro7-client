import React, { FormEvent, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { addToast } from 'actions/creators';
import { format } from 'url';
import { cleanUpMultipleSlashes } from 'higherOrder/loadData/defaults';

import { HCAPTCHA_SITE_KEY, HCAPTCHA_HOST } from 'config';

import Button from 'components/SimpleCommonComponents/Button';
import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
import forms from 'styles/forms.css';
import Callout from 'components/SimpleCommonComponents/Callout';

const css = cssBinder(local, forms);

const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '0.0.0.0', '[::1]'];
const IS_LOCALHOST =
  typeof window !== 'undefined' &&
  LOCAL_HOSTNAMES.includes(window.location.hostname);

type Props = {
  api: ParsedURLServer;
  llm?: boolean;
  addToast: typeof addToast;
};

interface LoadedProps
  extends Props,
    LoadDataProps<{ metadata: EntryMetadata }> {}

const Feedback = ({ api, llm, data, addToast }: LoadedProps) => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState<string | React.ReactNode>(
    '',
  );
  const [feedbackType, setFeedbackType] = useState<'info' | 'warning'>('info');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const handleVerificationSuccess = (token: string) => {
    setCaptchaToken(token);
  };

  const handleCaptchaError = (error: string) => {
    setCaptchaToken(null);
    if (IS_LOCALHOST) {
      return;
    }
    setFeedbackText(
      <>
        The verification widget could not be loaded
        {error ? <> (error: {error})</> : null}. This is often caused by a
        browser extension (e.g. an ad or privacy blocker) blocking hCaptcha.
        Please disable it for this page and try again.
      </>,
    );
    setFeedbackType('warning');
  };

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
    if (captchaToken) data.append('h-captcha-response', captchaToken);
    fetch(apiUrl, {
      method: 'POST',
      body: data,
    }).then(async (response) => {
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
      // eslint-disable-next-line no-magic-numbers
      if (response.status === 200) {
        setFeedbackText('Your feedback has been successfully submitted.');
        setFeedbackType('info');
        // eslint-disable-next-line no-magic-numbers
      } else if (response.status === 400) {
        const data = await response.json();
        setFeedbackText(
          <>
            Sorry, we couldn't send your feedback due to the following error:{' '}
            <b>{data.error}</b>.
          </>,
        );
        setFeedbackType('warning');
      } else if (response.status === 429) {
        setFeedbackText(
          'Request aborted as too many requests are made within a minute',
        );
        setFeedbackType('warning');
      } else {
        setFeedbackText(
          <>
            Sorry, we couldn't send your feedback. You can submit it through our{' '}
            <a href="https://www.ebi.ac.uk/about/contact/support/interpro">
              contact form
            </a>{' '}
            instead. Please mention that you encountered a sending error.
          </>,
        );
        setFeedbackType('warning');
      }
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
    <form
      onSubmit={handleSubmit}
      className={css('vf-stack', 'vf-stack--200', { locked: !captchaToken })}
    >
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
      {!captchaToken && (
        <div className={css('captcha')}>
          <HCaptcha
            sitekey={HCAPTCHA_SITE_KEY}
            host={HCAPTCHA_HOST || undefined}
            sentry={false}
            onVerify={(token, _) => handleVerificationSuccess(token)}
            onError={handleCaptchaError}
            ref={captchaRef}
          />
        </div>
      )}
      <div
        className={css('form-fields', 'vf-stack', 'vf-stack--200', {
          hidden: !captchaToken,
        })}
      >
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button type="tertiary" onClick={clearFields}>
            Clear
          </Button>
          <Button submit>Submit</Button>
        </div>
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
