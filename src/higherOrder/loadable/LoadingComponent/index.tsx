import React from 'react';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(ipro, fonts);

export const LoadingMessage = () => <Loading />;
LoadingMessage.displayName = 'LoadingMessage';

async function reload() {
  const names = await caches.keys();
  if (names.length > 0) {
    await Promise.all(names.map((name) => caches.delete(name)));
  }
  location.reload();
}

export const ErrorMessage = () => {
  return (
    <div className={css('vf-stack', 'vf-stack--400', 'callout', 'alert')}>
      <div className={css('callout', 'info', 'withicon')}>
        An error was encountered while trying to load an element on this page.
      </div>
      <p>
        Please try reloading the page using the button below to see if this
        resolves the problem.
      </p>
      <button
        onClick={reload}
        className={css('vf-button', 'vf-button--secondary', 'vf-button--sm')}
      >
        Clear the cache & reload
      </button>
      <div>
        You can also try to hard-refresh your browser{' '}
        <Tooltip
          interactive
          title={
            <div>
              <h5>Chrome</h5>
              <ul>
                <li>
                  <b>Windows/Linux: </b>
                  Hold down Ctrl and click the reload button. Or, hold down Ctrl
                  and press F5
                </li>
                <li>
                  <b>Mac: </b>
                  Hold ⇧ Shift and click the reload button. Or, hold down ⌘ Cmd
                  and ⇧ Shift key and then press R.
                </li>
              </ul>
              <hr />
              <h5>Mozilla Firefox</h5>
              <ul>
                <li>
                  <b>Windows/Linux: </b>
                  Hold the Ctrl key and press the F5 key. Or, hold down Ctrl and
                  ⇧ Shift and then press R.
                </li>
                <li>
                  <b>Mac: </b>
                  Hold down the ⇧ Shift and click the reload button. Or, hold
                  down ⌘ Cmd and ⇧ Shift and then press R.
                </li>
              </ul>
            </div>
          }
        >
          <span
            className={css('small', 'icon', 'icon-common')}
            data-icon="&#xf129;"
          />
        </Tooltip>
      </div>
      <hr style={{ margin: '1em', borderColor: 'grey' }} />
      <div>
        If you continue to experience this error, please reach out to us using
        our contact form.
      </div>
      <Link
        className={css('vf-button', 'vf-button--secondary', 'vf-button--sm')}
        href="https://www.ebi.ac.uk/support/interpro"
        target="_blank"
        withReferrer
      >
        <span role="img" aria-label="email">
          ✉
        </span>
        ️ Contact form
      </Link>
    </div>
  );
};
ErrorMessage.displayName = 'ErrorMessage';

type Props = {
  isLoading: boolean;
  timedOut: boolean;
  pastDelay: boolean;
  error?: unknown;
};

const LoadingComponent = ({ isLoading, timedOut, pastDelay, error }: Props) => {
  if (isLoading) {
    // Component is loading…
    if (timedOut) {
      // … but the timeout has ellapsed, maybe something bad happened…
      return <ErrorMessage />;
    } else if (pastDelay) {
      // … but it's taking a bit of time, better display loading info to user
      return <LoadingMessage />;
    }
    // … but still within normal delay, just relax and wait.
    return null;
  } else if (error) {
    // console.error(error);
    return <ErrorMessage />;
  }
  // If we haven't returned here, it means that something strange happened…
  // console.warn('Something strange is happening…');
  return null;
};

export default LoadingComponent;
