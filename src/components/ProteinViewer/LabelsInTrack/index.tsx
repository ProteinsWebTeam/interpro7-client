import React from 'react';

import Link from 'components/generic/Link';

import { ExtendedFeature } from '../utils';
import Label from './Label';
import ResidueLabel from './ResidueLabel';

import cssBinder from 'styles/cssBinder';

import style from '../../ProteinViewer/style.css';
import grid from '../../ProteinViewer/grid.css';
import local from './style.css';
import ExceptionalLabels, {
  isAnExceptionalLabel,
  isStandaloneLabel,
} from './ExceptionalLabels';

const css = cssBinder(style, grid, local);

type Props = {
  entry: ExtendedFeature;
  hideCategory: boolean;
  expandedTrack: boolean;
  isPrinting: boolean;
  databases?: DBsInfo;
};

const LabelsInTrack = ({
  entry,
  hideCategory,
  isPrinting,
  expandedTrack,
  databases,
}: Props) => {
  const key = entry.source_database === 'pdb' ? 'structure' : 'entry';
  const sourceDb = entry.source_database || '';
  const isUnintegratedGroup = entry.accession.startsWith('parentUnintegrated:');

  return (
    <div
      className={css(
        'track-label',
        isStandaloneLabel(entry) ? 'inner-track-label' : null,
        {
          hideCategory,
        },
      )}
    >
      {isAnExceptionalLabel(entry) ? (
        <ExceptionalLabels
          entry={entry}
          isPrinting={isPrinting}
          databases={databases}
        />
      ) : (
        <>
          {isPrinting ? (
            <b>
              <Label entry={entry} />
            </b>
          ) : (
            <>
              {sourceDb !== 'interpro' &&
                // Conditions for residue section
                !(
                  entry.accession.startsWith('residue:') ||
                  entry.accession.startsWith('PIRSR')
                ) &&
                !hideCategory &&
                // The grouping track heads its own matches, see below.
                !isUnintegratedGroup && (
                  <div className={css('inner-track-label')}>
                    <b> Unintegrated</b>
                  </div>
                )}
              <div
                className={css(
                  entry.children || entry.residues
                    ? 'inner-track-label'
                    : 'track-accession-child',
                )}
              >
                {isUnintegratedGroup ? (
                  /* Stands where the InterPro entry stands for an integrated
                  signature, so its matches line up the same way. It groups
                  rather than names something, so there is nothing to link to
                  and the label reads "Unintegrated". */
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
                          db: sourceDb,
                          accession: entry.accession.startsWith('residue:')
                            ? entry.accession.split('residue:')[1]
                            : entry.accession.replaceAll(/:nmatch/gi, ''),
                        },
                      },
                    }}
                  >
                    <Label entry={entry} />
                  </Link>
                )}
              </div>
            </>
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
                            db: d.source_database || '',
                            accession: d.accession.replaceAll(/:nmatch/gi, ''),
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
