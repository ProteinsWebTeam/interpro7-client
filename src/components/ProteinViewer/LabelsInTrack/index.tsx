import React from 'react';

import Link from 'components/generic/Link';

import { ExtendedFeature } from '..';
import Label from './Label';
import ResidueLabel from './ResidueLabel';

import cssBinder from 'styles/cssBinder';

import style from '../../ProteinViewer/style.css';
import grid from '../../ProteinViewer/grid.css';
import local from './style.css';
import ExceptionalLabels, { isAnExceptionalLabel } from './ExceptionalLabels';
import MemberSymbol from 'components/Entry/MemberSymbol';

const css = cssBinder(style, grid, local);

type Props = {
  entry: ExtendedFeature;
  hideCategory: boolean;
  expandedTrack: boolean;
  isPrinting: boolean;
};

const LabelsInTrack = ({
  entry,
  hideCategory,
  isPrinting,
  expandedTrack,
}: Props) => {
  const key = entry.source_database === 'pdb' ? 'structure' : 'entry';

  return (
    <div
      className={css('track-label', {
        hideCategory,
      })}
    >
      {isAnExceptionalLabel(entry) ? (
        <ExceptionalLabels entry={entry} isPrinting={isPrinting} />
      ) : (
        <>
          {isPrinting ? (
            <b>
              <Label entry={entry} />
            </b>
          ) : (
            <Link
              to={{
                description: {
                  main: {
                    key,
                  },
                  [key]: {
                    db: entry.source_database,
                    accession: entry.accession.startsWith('residue:')
                      ? entry.accession.split('residue:')[1]
                      : entry.accession,
                  },
                },
              }}
            >
              <Label entry={entry} />
            </Link>
          )}
          <div
            className={css({
              hide: !expandedTrack,
            })}
          >
            <ResidueLabel entry={entry} expandedTrack={expandedTrack} />

            {entry.children &&
              entry.children.map((d) => (
                <div
                  key={`main_${d.accession}`}
                  className={css('track-accession-child')}
                >
                  {isPrinting ? (
                    <Label entry={d} />
                  ) : (
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            db: d.source_database,
                            accession: d.accession,
                          },
                        },
                      }}
                    >
                      <Label entry={d} />
                    </Link>
                  )}
                  <ResidueLabel entry={d} expandedTrack={expandedTrack} />
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};
export default LabelsInTrack;
