import React, { useState } from 'react';

import Accession from 'components/Accession';
import Description from 'components/Description';
import BaseLink from 'components/ExtLink/BaseLink';
import { setDBs } from 'utils/processDescription/handlers';
import Literature from 'components/Entry/Literature';
import Tabs from 'components/Tabs';

import loadable from 'higherOrder/loadable';
import config from 'config';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import ClanViewer from '../ClanViewer';
import Wikipedia from 'components/Entry/Summary/Wikipedia';

import cssBinder from 'styles/cssBinder';

import style from './style.css';
import protvistaOptions from 'components/ProteinViewer/Options/style.css';
import ipro from 'styles/interpro-vf.css';
import summary from 'styles/summary.css';

const css = cssBinder(style, summary, protvistaOptions, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export const schemaProcessData = ({
  data: { accession, score },
  db,
}: {
  data: { accession: string; score: number };
  db: string;
}) => ({
  '@id': '@contains', // maybe 'is member of' http://semanticscience.org/resource/SIO_000095
  name: 'entry',
  value: {
    '@type': ['Entry', 'StructuredValue', 'BioChemEntity'],
    name: accession,
    score,
    url:
      config.root.website.protocol +
      config.root.website.href +
      descriptionToPath({
        main: { key: 'entry' },
        entry: { db, accession },
      }),
  },
});

const getLiterature = (literature: Array<Reference>): [string, Reference][] => {
  const literatureEntries: [string, Reference][] = literature.map((ref) => {
    const journalRegExp = /(.+) (\d{4});(\d+):(\d+-\d+)./;
    const matches = journalRegExp.exec(ref.journal || '');
    if (matches) {
      return [
        String(ref.PMID),
        {
          ...ref,
          ISO_journal: matches[1],
          year: Number(matches[2]),
          volume: matches[3],
          raw_pages: matches[4],
        } as Reference,
      ];
    }
    return [String(ref.PMID), ref];
  });

  return literatureEntries;
};

const SetLiterature = ({ literature }: { literature: Array<Reference> }) => {
  if (literature.length === 0) return null;
  const literatureEntries = getLiterature(literature);
  return (
    <>
      <h4>References</h4>
      <Literature extra={literatureEntries} />
    </>
  );
};

const SetDescription = ({
  accession,
  description,
  literature,
}: {
  accession: string;
  description: string;
  literature: [string, Reference][];
}) => {
  if (!accession || !description) return null;
  return (
    <>
      <h4>Description</h4>
      <Description literature={literature} textBlocks={[description]} />
    </>
  );
};

const SetAuthors = ({ authors }: { authors: Array<string> }) => {
  if (authors.length === 0) return null;
  return (
    <tr>
      <td>Authors</td>
      <td data-testid="set-type">{authors.join(', ')}</td>
    </tr>
  );
};

type Props = {
  data: {
    metadata: SetMetadata;
  };
  loading: boolean;
};

const SummarySet = ({ data, loading }: Props) => {
  const metadata: SetMetadata =
    loading || !data.metadata
      ? {
          accession: '',
          name: { name: '' },
          description: '',
          id: '',
          source_database: '',
          authors: null,
          literature: [],
          counters: {},
          relationships: {
            nodes: [],
            links: [],
          },
          wikipedia: [],
        }
      : data.metadata;
  let currentSet = null;
  if (metadata.source_database) {
    for (const db of setDBs) {
      if (db.name === metadata.source_database) currentSet = db;
    }
    if (metadata.source_database === 'panther')
      metadata.description = metadata.name.name;
  }

  const hasWiki =
    metadata.source_database === 'pfam' && !!metadata.wikipedia?.length;

  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      {metadata.relationships &&
        metadata.relationships.nodes &&
        metadata.relationships.nodes.map((m) => (
          <SchemaOrgData
            key={m.accession}
            data={{ data: m, db: metadata.source_database }}
            processData={schemaProcessData}
          />
        ))}
      <section className={css('vf-grid', 'summary-grid')}>
        <div className={css('vf-stack')}>
          <table className={css('vf-table', 'left-headers')}>
            <tbody>
              <tr>
                <td style={{ maxWidth: '50%' }}>Accession</td>
                <td data-testid="set-accession">
                  <Accession accession={metadata.accession} />
                </td>
              </tr>
              <tr>
                <td style={{ width: '200px' }} data-testid="set-memberdb">
                  Member database
                </td>
                <td>{currentSet?.dbName || metadata.source_database}</td>
              </tr>
              <SetAuthors authors={metadata.authors || []} />
            </tbody>
          </table>
        </div>
        {currentSet?.url_template ? (
          <div className={css('vf-stack')}>
            <section>
              <h5>External Links</h5>
              <ul className={css('no-bullet')} data-testid="set-external-links">
                <li>
                  <BaseLink
                    id={metadata.accession}
                    className={css('ext')}
                    target="_blank"
                    pattern={currentSet.url_template}
                  >
                    {currentSet.dbName}
                  </BaseLink>
                </li>
              </ul>
            </section>
          </div>
        ) : null}
      </section>
      <SetDescription
        accession={metadata.accession}
        description={metadata?.description}
        literature={getLiterature(metadata?.literature || [])}
      />
      <SetLiterature literature={metadata?.literature || []} />
      {hasWiki && (
        <section>
          <h4>Wikipedia</h4>
          <Tabs>
            {(metadata.wikipedia || []).map((wiki, key) => (
              <div key={key} title={wiki.title.replaceAll('_', ' ')}>
                <Wikipedia
                  title={wiki.title}
                  extract={wiki.extract}
                  thumbnail={wiki.thumbnail}
                />
              </div>
            ))}
          </Tabs>
        </section>
      )}
      <div className={css('vf-stack', 'vf-stack-400')}>
        <h4>Clan Viewer</h4>
        <ClanViewer data={data} loading={loading} />
      </div>
    </div>
  );
};

export default SummarySet;
