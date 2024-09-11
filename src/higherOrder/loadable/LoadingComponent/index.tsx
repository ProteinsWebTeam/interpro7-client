import React from 'react';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';
import Button from 'components/SimpleCommonComponents/Button';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';

const css = cssBinder(ipro);

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
    <Callout type="alert">
      <div className={css('vf-stack', 'vf-stack--400')}>
        <p>
          <b>
            An error was encountered while trying to load an element on this
            page
          </b>
          <br />
          Please use the button below to clear your web browser's cache and
          reload the page. This may resolve the issue.
        </p>
        <Button onClick={reload}>Clear the cache & reload</Button>
        <p>If this does not solve the issue, clear the cache manually.</p>
        <details className={css('read-more')}>
          <summary>Instructions</summary>
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
            <h5>Mozilla Firefox</h5>
            <ul>
              <li>
                <b>Windows/Linux: </b>
                Hold the Ctrl key and press the F5 key. Or, hold down Ctrl and ⇧
                Shift and then press R.
              </li>
              <li>
                <b>Mac: </b>
                Hold down the ⇧ Shift and click the reload button. Or, hold down
                ⌘ Cmd and ⇧ Shift and then press R.
              </li>
            </ul>
          </div>
        </details>
        <p>
          If neither options solve the error, please{' '}
          <Link
            href="https://www.ebi.ac.uk/support/interpro"
            target="_blank"
            withReferrer
          >
            contact us
          </Link>
          .
        </p>
      </div>
    </Callout>
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
