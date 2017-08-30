// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

export const LoadingMessage = () => <div>Loading…</div>;

export const ErrorMessage = () => (
  <div>
    <p>An error happened while try to load a component of this page</p>
    <p>If you really want this part of the page you might want to reload it</p>
    <button onClick={location.reload}>Reload this page</button>
  </div>
);

/*:: type Props = {
  isLoading: boolean,
  timedOut: boolean,
  pastDelay: boolean,
  error?: any,
}; */

class LoadingComponent extends PureComponent /*:: <Props> */ {
  static propTypes = {
    isLoading: T.bool.isRequired,
    timedOut: T.bool.isRequired,
    pastDelay: T.bool.isRequired,
    error: T.any,
  };

  render() {
    const { isLoading, timedOut, pastDelay, error } = this.props;
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
  }
}

export default LoadingComponent;
