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
  ) => {
    if (!description) return null;
    const endpointToFilterBy = description.taxonomy.isFilter
      ? 'taxonomy'
      : 'proteome';
    return (
      <div className={css('actions')}>
        <Tooltip title="View matching proteins" useContext>
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
              data-icon="&#x50;"
            />
          </div>
        </Tooltip>
        <File
          fileType="fasta"
          name={`protein-sequences-matching-${
            description[description.main.key as Endpoint].accession
          }-for-${accession}.fasta`}
          count={
            row.proteins || row.counters?.extra_fields.counters.proteins || 0
          }
          customLocationDescription={{
            main: { key: 'protein' },
            protein: { db: 'UniProt' },
            [endpointToFilterBy]: {
              isFilter: true,
              db: 'UniProt',
              accession: `${accession}`,
            },
            [description.main.key!]: {
              ...description[description.main.key as Endpoint],
              isFilter: true,
            },
          }}
          showIcon={true}
        />
        <Tooltip title={`View ${endpointToFilterBy} information`}>
          <div className={css('view-icon-div')}>
            <Link
              className={css('icon', 'icon-count-organisms', 'icon-wrapper')}
              to={{
                description: {
                  main: {
                    key: endpointToFilterBy,
                  },
                  [endpointToFilterBy]: {
                    db: row.source_database,
                    accession: accession,
                  },
                },
              }}
              data-icon="&#x50;"
            >
              <div
                className={css('icon', 'icon-count-organisms', 'icon-wrapper')}
              />
            </Link>
          </div>
        </Tooltip>
      </div>
    );
  };

export default ProteinDownloadRenderer;
