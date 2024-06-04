import React from 'react';

import Callout from 'components/SimpleCommonComponents/Callout';

import { MAX_NUMBER_OF_SEQUENCES } from '../..';
import { CheckResult } from '..';

import cssBinder from 'styles/cssBinder';

import local from './style.css';

const css = cssBinder(local);

type Props = {
  validCharacters: CheckResult;
  tooShort: CheckResult;
  tooMany: CheckResult;
  duplicateHeaders: CheckResult;
};

const InfoMessages = ({
  validCharacters,
  tooShort,
  tooMany,
  duplicateHeaders,
}: Props) => {
  const allOk =
    validCharacters.result &&
    !tooShort.result &&
    !duplicateHeaders.result &&
    !tooMany.result;
  return (
    <Callout
      type={allOk ? 'announcement' : 'warning'}
      style={{
        backgroundColor: 'var(--colors-secondary-header)',
      }}
      alt
      className={css('info-message')}
    >
      {allOk ? (
        <div>
          <span role="img" aria-label="warning">
            ✅
          </span>{' '}
          Valid Sequence.
        </div>
      ) : (
        <ul className={css('warnings')}>
          {!validCharacters.result && (
            <li>
              The sequence with the header below has invalid characters.{' '}
              <div className={css('header')}>{validCharacters.header}</div>
            </li>
          )}
          {tooShort.result && (
            <li>
              The sequence {tooShort.header ? 'with the header below' : ''} is
              too short (min: three characters).{' '}
              {tooShort.header && (
                <div className={css('header')}>{tooShort.header}</div>
              )}
            </li>
          )}
          {tooMany.result && (
            <li>
              There are too many sequences. The maximum allowed is{' '}
              {MAX_NUMBER_OF_SEQUENCES}.{' '}
            </li>
          )}
          {duplicateHeaders.result && (
            <li>
              There are multiple sequences with the same header:{' '}
              <div className={css('header')}>{duplicateHeaders.header}</div>
            </li>
          )}
        </ul>
      )}
    </Callout>
  );
};

export default InfoMessages;
