import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ProgressButton from 'components/ProgressButton';
import { goToCustomLocation } from 'actions/creators';

import useInterval from 'utils/hooks/useInterval';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';

const css = cssBinder(ipro);

const ONE_SECOND = 1000;
const HERTZ = 10;

export const STATUS_TIMEOUT = 408;
export const STATUS_GONE = 410;

type Props = {
  text: string;
  accession: string;
  status: number;
  shouldRedirect?: boolean;
  secondsToRetry: number;
  goToCustomLocation: typeof goToCustomLocation;
};

const EdgeCase = ({
  text,
  status,
  shouldRedirect = true,
  accession,
  secondsToRetry,
  goToCustomLocation,
}: Props) => {
  const [count, setCount] = useState(0);
  const limit = HERTZ * secondsToRetry;

  useInterval(() => {
    setCount(count + 1 > limit ? 0 : count + 1);
  }, ONE_SECOND / HERTZ);

  useEffect(() => {
    if (shouldRedirect && status !== STATUS_TIMEOUT && count >= limit) {
      goToCustomLocation({
        description: {
          main: { key: 'search' },
          search: { type: 'text', value: accession },
        },
      });
    }
  });
  const seconds = Math.ceil((limit - count) / HERTZ);
  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      <div
        className={css('callout', 'withicon', {
          info: status !== STATUS_GONE,
          alert: status === STATUS_GONE,
        })}
      >
        <b>{text}</b>
        {(shouldRedirect || status === STATUS_TIMEOUT) && !isNaN(seconds) && (
          <>
            <br />
            <span>
              {status === STATUS_TIMEOUT
                ? 'Checking again in '
                : 'Redirecting to Search in '}
              {seconds} seconds.
            </span>
            <ProgressButton
              downloading={true}
              success={true}
              progress={count / limit}
              failed={true}
              showIcon={false}
            />
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.settings.navigation.secondsToRetry,
  (description, secondsToRetry) => {
    const { key } = description.main;
    return {
      accession: (description[key] as EndpointLocation).accession,
      secondsToRetry,
    };
  }
);

export default connect(mapStateToProps, {
  goToCustomLocation,
})(EdgeCase);
