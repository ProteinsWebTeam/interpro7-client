import React from 'react';

import Callout from 'components/SimpleCommonComponents/Callout';

import { MAX_NUMBER_OF_SEQUENCES } from '../..';
import { SequenceIssue } from '..';

import cssBinder from 'styles/cssBinder';

import local from './style.css';

const css = cssBinder(local);

type Props = {
  sequenceIssues: Array<SequenceIssue>;
};

const InfoMessages = ({ sequenceIssues }: Props) => {
  const allOk = sequenceIssues.length === 0;
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
          {sequenceIssues.map((issue) => {
            switch (issue.type) {
              case 'invalidCharacters':
                return (
                  <li>
                    The sequence with the header below has invalid characters.{' '}
                    <div className={css('header')}>{issue.header}</div>
                  </li>
                );
              case 'tooShort':
                return (
                  <li>
                    The sequence with the header below is too short (min: three
                    characters).{' '}
                    <div className={css('header')}>{issue.header}</div>
                  </li>
                );
              case 'tooMany':
                return (
                  <li>
                    There are too many sequences. The maximum allowed is{' '}
                    {MAX_NUMBER_OF_SEQUENCES}.{' '}
                  </li>
                );
              case 'duplicateHeaders':
                return (
                  <li>
                    There are multiple sequences with the same header:{' '}
                    <div className={css('header')}>{issue.header}</div>
                  </li>
                );
              default:
                return null;
            }
          })}
        </ul>
      )}
    </Callout>
  );
};

export default InfoMessages;
