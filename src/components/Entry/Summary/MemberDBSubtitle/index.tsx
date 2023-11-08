import React from 'react';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(ipro, fonts);

const MemberDBSubtitle = ({
  metadata,
  dbInfo,
}: {
  metadata: EntryMetadata;
  dbInfo: DBInfo;
}) => {
  if (
    !metadata.source_database ||
    metadata.source_database.toLowerCase() === 'interpro'
  ) {
    return null;
  }
  return (
    <table className={css('vf-table', 'left-headers')}>
      <tbody>
        <tr>
          <td style={{ maxWidth: '50%' }}>Member database</td>
          <td>
            <Link
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: { db: metadata.source_database },
                },
              }}
            >
              {dbInfo.name}
              {metadata.source_database === 'ncbifam'
                ? ' (includes TIGRFAMs) '
                : ' '}
              <Tooltip
                title={
                  dbInfo.description || `${dbInfo.name} (${dbInfo.version})`
                }
              >
                <sup>
                  <span
                    className={css('icon', 'icon-common')}
                    data-icon="&#xf129;"
                  />
                </sup>
              </Tooltip>
            </Link>
          </td>
        </tr>
        <tr>
          <td className={css('first-letter-cap')}>{dbInfo.name} type</td>
          <td>{metadata.type.replace('_', ' ').toLowerCase()}</td>
        </tr>
        {metadata.name.short && metadata.accession !== metadata.name.short && (
          <tr>
            <td>Short name</td>
            <td>
              <i className={css('shortname')}>{metadata.name.short}</i>
            </td>
          </tr>
        )}
        {metadata?.counters?.sets ? (
          <tr>
            <td>
              {metadata.source_database.toLowerCase() === 'pfam'
                ? 'Clan'
                : 'Set'}
            </td>
            <td>
              {metadata.set_info ? (
                <Link
                  to={{
                    description: {
                      main: { key: 'set' },
                      set: {
                        db: metadata.source_database,
                        accession: metadata.set_info.accession,
                      },
                    },
                  }}
                >
                  {metadata.set_info.name}
                </Link>
              ) : (
                'ø'
              )}
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  );
};

export default MemberDBSubtitle;
