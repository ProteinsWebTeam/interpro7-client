import React from 'react';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from '../style.css';

const f = foundationPartial(fonts, local);

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
    <table className={f('light', 'table-sum')}>
      <tbody>
        <tr>
          <td className={f('font-ml')} style={{ maxWidth: '50%' }}>
            Member database
          </td>
          <td className={f('first-letter-cap', 'md-hlight', 'font-ml')}>
            <Link
              className={f('nolink')}
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: { db: metadata.source_database },
                },
              }}
            >
              {dbInfo.name}{' '}
              <Tooltip
                title={
                  dbInfo.description || `${dbInfo.name} (${dbInfo.version})`
                }
              >
                <span
                  className={f('font-s', 'icon', 'icon-common')}
                  data-icon="&#xf129;"
                />
              </Tooltip>
            </Link>
          </td>
        </tr>
        <tr>
          <td className={f('first-letter-cap')}>{dbInfo.name} type</td>
          <td className={f('first-letter-cap')}>
            {metadata.type.replace('_', ' ').toLowerCase()}
          </td>
        </tr>
        {metadata.name.short && metadata.accession !== metadata.name.short && (
          <tr>
            <td>Short name</td>
            <td>
              <i className={f('shortname')}>{metadata.name.short}</i>
            </td>
          </tr>
        )}
        {metadata?.counters?.sets ? (
          <tr>
            <td>Set</td>
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
