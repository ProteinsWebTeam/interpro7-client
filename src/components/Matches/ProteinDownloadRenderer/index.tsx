import React from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import File from 'components/File';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(local, fonts);

const ProteinDownloadRenderer =
  (description?: InterProDescription) =>
  (
    accession: string,
    row: {
      source_database: string;
      proteins?: number;
      counters?: { extra_fields: { counters: { proteins: number } } };
    },
    count?: number,
  ) => {
    if (!description) return null;
    const endpointToFilterBy = description.taxonomy.isFilter
      ? 'taxonomy'
      : 'proteome';
    return (
      <div className={css('actions')}>
        <div className={css('view-icon-div')}>
          <Link
            className={css('icon', 'icon-conceptual', 'view-link')}
            to={{
              description: {
                main: { key: description.main.key },
                [description.main.key!]: {
                  ...description[description.main.key as Endpoint],
                },
                protein: {
                  db: 'uniprot',
                  order: 1,
                  isFilter: true,
                },
                [endpointToFilterBy]: {
                  accession: accession,
                  db: row.source_database,
                  order: 2,
                  isFilter: true,
                },
              },
            }}
            aria-label="View proteins"
          >
            <small className={css('match-proteins-link')}>
              {count} protein matched{' '}
            </small>
          </Link>
        </div>
      </div>
    );
  };

export default ProteinDownloadRenderer;
