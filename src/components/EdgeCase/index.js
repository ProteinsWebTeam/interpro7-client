import React, { useState, useEffect, useRef } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ProgressButton from 'components/ProgressButton';
import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
const f = foundationPartial(ebiGlobalStyles);

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = () => savedCallback.current();
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const SECONDS = 3;
const ONE_SECOND = 1000;
const HERTZ = 10;

const EdgeCase = ({ text, accession, goToCustomLocation }) => {
  const [count, setCount] = useState(0);

  useInterval(() => {
    // Your custom logic here
    setCount(count + 1);
  }, ONE_SECOND / HERTZ);

  const limit = HERTZ * SECONDS;

  useEffect(() => {
    if (count >= limit) {
      goToCustomLocation({
        description: {
          main: { key: 'search' },
          search: { type: 'text', value: accession },
        },
      });
    }
  });
  return (
    <div className={f('callout', 'info', 'withicon')}>
      <b>{text}</b>
      <br />
      <span>
        Redirecting to Search in {Math.ceil((limit - count) / HERTZ)} seconds.
      </span>
      <ProgressButton
        downloading={true}
        success={true}
        progress={count / limit}
        failed={true}
        showIcon={false}
      />
    </div>
  );
};
EdgeCase.propTypes = {
  text: T.string.isRequired,
  accession: T.string,
  goToCustomLocation: T.func.isRequired,
};
const mapStateToProps = createSelector(
  state => state.customLocation.description,
  description => {
    const { key } = description.main;
    return {
      accession: description[key].accession,
    };
  },
);

export default connect(
  mapStateToProps,
  {
    goToCustomLocation,
  },
)(EdgeCase);
