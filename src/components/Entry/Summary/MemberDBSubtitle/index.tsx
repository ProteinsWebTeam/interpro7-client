import React from 'react';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import cssBinder from 'styles/cssBinder';
import { format } from 'url';

// $FlowFixMe
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import Loading from 'components/SimpleCommonComponents/Loading';

import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { getTooltipContentFormMetadata, MiniBadgeAI } from '../../BadgeAI';
import loadData from 'higherOrder/loadData';

const css = cssBinder(ipro, fonts);

type Props = {
  metadata: EntryMetadata;
  dbInfo: DBInfo;
  hasLLM?: boolean;
};
interface LoadedProps
  extends Props,
    LoadDataProps<{
      extra_fields: {
        details: {
          curation: {
            sequence_ontology: string;
            authors: { author: string; orcid: string }[];
          };
        };
      };
      body: string;
    }> {}

const MemberDBSubtitle = ({ data, metadata, dbInfo, hasLLM }: LoadedProps) => {
  if (
    !metadata.source_database ||
    metadata.source_database.toLowerCase() === 'interpro'
  ) {
    return null;
  }

  if (!data) return null;
  const { loading, payload } = data;

  if (loading) return <Loading />;
  // eslint-disable-next-line camelcase
  const details = payload?.extra_fields?.details;

  // eslint-disable-next-line camelcase
  const sequenceOntology = details?.curation?.sequence_ontology || '';

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
              <i className={css('shortname')}>{metadata.name.short}</i>{' '}
              {hasLLM && (
                <MiniBadgeAI
                  tooltipText={getTooltipContentFormMetadata(metadata)}
                />
              )}
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
        {data?.payload ? (
          <>
            {details?.curation.authors && (
              <tr>
                <td>Author</td>
                <td className={css('first-letter-cap')}>
                  {(details?.curation?.authors || []).map((author) => {
                    const preferredName: string | Element = author.author;
                    if (author.orcid) {
                      return (
                        <span key={author.author}>
                          {' '}
                          <a
                            href={`https://orcid.org/${author.orcid}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {author.author}
                            <i
                              className={css('icon', 'icon-common')}
                              data-icon="&#xf112;"
                            />{' '}
                          </a>
                        </span>
                      );
                    }
                    return <span key={author.author}>{preferredName}</span>;
                  })}
                </td>
              </tr>
            )}
            {details?.curation.sequence_ontology && (
              <tr>
                <td>Sequence Ontology</td>
                <td className={css('first-letter-cap')}>
                  <a
                    href={`http://www.sequenceontology.org/browser/current_release/term/SO:${details?.curation.sequence_ontology}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {sequenceOntology}
                  </a>
                </td>
              </tr>
            )}
          </>
        ) : null}
      </tbody>
    </table>
  );
};

const getPfamCurationUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.main.key,
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  (state) =>
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  ({ protocol, hostname, port, root }, mainType, db, accession) => {
    if (!accession) return;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: mainType },
          [mainType]: {
            db,
            accession,
          },
        }),
      query: { extra_fields: 'details' },
    });
  },
);

export default loadData(getPfamCurationUrl)(MemberDBSubtitle);
