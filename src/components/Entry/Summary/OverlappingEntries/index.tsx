import React, { useState } from 'react';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { Button } from 'components/SimpleCommonComponents/Button';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(local, fonts, ipro);

const MAX_NUMBER_OF_OVERLAPPING_ENTRIES = 5;

const OverlappingEntries = ({ metadata }: { metadata: EntryMetadata }) => {
  const [showAllOverlappingEntries, setShowAllOverlappingEntries] =
    useState(false);
  const overlaps = metadata.overlaps_with;
  if (!overlaps || Object.keys(overlaps).length === 0) return null;
  if (overlaps) {
    overlaps.sort((a, b) => {
      if (a.type > b.type) return 1;
      if (a.type < b.type) return -1;
      return a.accession > b.accession ? 1 : -1;
    });
  }

  let _overlaps = overlaps;
  if (!showAllOverlappingEntries)
    _overlaps = (metadata.overlaps_with || []).slice(
      0,
      MAX_NUMBER_OF_OVERLAPPING_ENTRIES,
    );

  return (
    <tr>
      <td>
        {metadata.type === 'homologous_superfamily' ? (
          'Overlapping entries'
        ) : (
          <>
            Overlapping
            <br />
            homologous
            <br />
            superfamilies
          </>
        )}
        <Tooltip
          title="The relationship between homologous superfamilies and other InterPro entries is calculated by analysing
          the overlap between matched sequence sets. An InterPro entry is considered related to a homologous superfamily
          if its sequence matches overlap (i.e., the match positions fall within the homologous superfamily boundaries)
          and either the Jaccard index (equivalent) or containment index (parent/child) of the matching sequence sets is greater than 0.75."
        >
          &nbsp;
          <sup>
            <span
              className={css('icon', 'icon-common', 'font-s')}
              data-icon="&#xf129;"
            />
          </sup>
        </Tooltip>
      </td>
      <td>
        {_overlaps.map((ov) => (
          <div key={ov.accession} className={css('list-items')}>
            <interpro-type type={ov.type.replace('_', ' ')} dimension="1.2em" />
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: 'InterPro',
                    accession: ov.accession,
                  },
                },
              }}
            >
              {ov.name}
            </Link>{' '}
            <small>({ov.accession})</small>
          </div>
        ))}
        {Object.keys(metadata.overlaps_with || {}).length >
          MAX_NUMBER_OF_OVERLAPPING_ENTRIES && (
          <Button
            type="secondary"
            onClick={() =>
              setShowAllOverlappingEntries(!showAllOverlappingEntries)
            }
          >
            Show{' '}
            {showAllOverlappingEntries ? (
              <span>
                Less{' '}
                <i
                  className={css('icon', 'icon-common', 'font-sm')}
                  data-icon="&#xf102;"
                />
              </span>
            ) : (
              <span>
                More{' '}
                <i
                  className={css('icon', 'icon-common', 'font-sm')}
                  data-icon="&#xf103;"
                />
              </span>
            )}
          </Button>
        )}
      </td>
    </tr>
  );
};

export default OverlappingEntries;
