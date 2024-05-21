import React from 'react';
import { MAX_NUMBER_OF_SEQUENCES } from '../..';

type Props = {
  valid: boolean;
  tooShort: boolean;
  tooMany: boolean;
  headerIssues: boolean;
};

const InfoMessages = ({ valid, tooShort, tooMany, headerIssues }: Props) => {
  return (
    <div
      style={{
        textAlign: 'right',
      }}
    >
      {!valid && (
        <div>
          {tooShort
            ? 'There is a header without content. '
            : 'The sequence has invalid characters. '}
          <span role="img" aria-label="warning">
            ⚠️
          </span>
        </div>
      )}
      {valid && tooShort && (
        <div>
          The sequence is too short.{' '}
          <span role="img" aria-label="warning">
            ⚠️
          </span>
        </div>
      )}
      {tooMany && (
        <div>
          There are too many sequences. The maximum allowed is{' '}
          {MAX_NUMBER_OF_SEQUENCES}.{' '}
          <span role="img" aria-label="warning">
            ⚠️
          </span>
        </div>
      )}
      {headerIssues && (
        <div>
          There are issues with the headers.{' '}
          <span role="img" aria-label="warning">
            ⚠️
          </span>
        </div>
      )}
      {valid && !tooShort && !headerIssues && (
        <div>
          Valid Sequence.{' '}
          <span role="img" aria-label="warning">
            ✅
          </span>
        </div>
      )}
    </div>
  );
};

export default InfoMessages;
