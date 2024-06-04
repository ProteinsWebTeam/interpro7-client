import React from 'react';
import getUrlFor from 'utils/url-patterns';

import Link from 'components/generic/Link';

import Integration from './Integration';
import ContributingSignatures from './ContributingSignatures';
import RepresentativeStructure from './RepresentativeStructure';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(fonts, local, ipro);

const SidePanel = ({
  metadata,
  dbInfo,
}: {
  metadata: EntryMetadata;
  dbInfo: DBInfo;
}) => {
  const url = getUrlFor(metadata.source_database);

  return (
    <>
      {['interpro', 'pfam'].includes(
        // Only receiving new annotations for pfam and interpro
        metadata.source_database.toLowerCase(),
      ) &&
        !metadata.is_removed && (
          <div>
            <Link
              buttonType="secondary"
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: {
                    db: metadata.source_database,
                    accession: metadata.accession,
                    detail: 'feedback',
                  },
                },
              }}
              style={{
                width: '100%',
              }}
            >
              <span className={css('icon', 'icon-common', 'icon-pencil-alt')} />{' '}
              Provide feedback
            </Link>
          </div>
        )}
      {metadata.integrated && <Integration intr={metadata.integrated} />}
      {!['interpro', 'pfam', 'antifam'].includes(
        metadata.source_database.toLowerCase(),
      ) &&
        url && (
          <section>
            <h5>External Links</h5>
            <ul className={css('no-bullet')}>
              <li>
                <Link
                  className={css('ext-link')}
                  target="_blank"
                  href={url(metadata.accession)}
                >
                  View {metadata.accession} in{' '}
                  {(dbInfo && dbInfo.name) || metadata.source_database}
                </Link>
              </li>
            </ul>
          </section>
        )}
      {metadata.member_databases &&
      Object.keys(metadata.member_databases).length ? (
        <ContributingSignatures contr={metadata.member_databases} />
      ) : null}
      {metadata.representative_structure && (
        <RepresentativeStructure
          accession={metadata.representative_structure.accession}
          name={metadata.representative_structure.name}
        />
      )}
    </>
  );
};

export default SidePanel;
