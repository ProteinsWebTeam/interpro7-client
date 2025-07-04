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
};

const IPScanStandardization = (name: string): string => {
  const IPScan5to6: Record<string, string> = {
    'prosite profiles': 'profile',
    'prosite patterns': 'prosite',
    'cath-gene3d': 'cathgene3d',
  };

  return IPScan5to6[name] || name;
};

const LabelsInTrack = ({
  entry,
  hideCategory,
  isPrinting,
  expandedTrack,
}: Props) => {
  const key = entry.source_database === 'pdb' ? 'structure' : 'entry';

  //Imports, IPScan5 and IPScan6 standardizations
  let filteredSourceDb = IPScanStandardization(entry.source_database || '');

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
        <ExceptionalLabels entry={entry} isPrinting={isPrinting} />
      ) : (
        <>
          {isPrinting ? (
            <b>
              <Label entry={entry} />
            </b>
          ) : (
            <>
              {filteredSourceDb !== 'interpro' &&
                // Conditions for residue section
                !(
                  entry.accession.startsWith('residue:') ||
                  entry.accession.startsWith('PIRSR')
                ) &&
                !hideCategory && (
                  <div className={css('inner-track-label')}>
                    {/* Handle new type of parent track for stacked-view: unintegrated parent entry with matches coming from InterPro-N and HMMs */}
                    <b>
                      {' '}
                      {!entry.accession.includes('parentUnintegrated')
                        ? 'Unintegrated'
                        : ''}
                    </b>
                  </div>
                )}
              <div
                className={css(
                  entry.children || entry.residues
                    ? 'inner-track-label'
                    : 'track-accession-child',
                )}
              >
                <Link
                  to={{
                    description: {
                      main: {
                        key,
                      },
                      [key]: {
                        db: filteredSourceDb,
                        accession: entry.accession.startsWith('residue:')
                          ? entry.accession.split('residue:')[1]
                          : entry.accession.replaceAll(/:nmatch/gi, ''),
                      },
                    },
                  }}
                >
                  <Label entry={entry} />
                </Link>
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
                            db: IPScanStandardization(d.source_database || ''),
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
