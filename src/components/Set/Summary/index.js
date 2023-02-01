// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Accession from 'components/Accession';
import Description from 'components/Description';
import { BaseLink } from 'components/ExtLink';
import { setDBs } from 'utils/processDescription/handlers';
import Literature from 'components/Entry/Literature';

import loadable from 'higherOrder/loadable';
import config from 'config';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import style from './style.css';
import ClanViewer from '../ClanViewer';
import protvistaOptions from 'components/ProtVista/Options/style.css';

const f = foundationPartial(ebiGlobalStyles, style, protvistaOptions);

/*::
type Props = {
  data: {
    metadata: Object,
  },
  db: string,
  loading: boolean,
};

 */
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export const schemaProcessData = (
  {
    data: { accession, score },
    db,
  } /*: {data: {accession: string, score: number}, db: string} */,
) => ({
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

const SetLiterature = ({ literature }) => {
  if (!literature) return null;
  const literatureEntries = literature.map((ref) => {
    const journalRegExp = /(.+) (\d{4});(\d+):(\d+-\d+)./;
    const matches = journalRegExp.exec(ref.journal);
    if (matches) {
      return [
        ref.PMID,
        {
          ...ref,
          ISO_journal: matches[1],
          year: matches[2],
          volume: matches[3],
          raw_pages: matches[4],
        },
      ];
    }
    return [ref.PMID, ref];
  });
  return (
    <>
      <h4>Literature</h4>
      <Literature extra={literatureEntries} />
    </>
  );
};
SetLiterature.propTypes = {
  literature: T.array,
};

const SetDescription = ({ accession, description }) => {
  if (!accession || !description) return null;
  return (
    <>
      <h4>Description</h4>
      <Description textBlocks={[description]} accession={accession} />
    </>
  );
};
SetDescription.propTypes = {
  accession: T.string,
  description: T.string,
};
const SetAuthors = ({ authors }) => {
  if (!authors) return null;
  return (
    <tr>
      <td>Authors</td>
      <td data-testid="set-type">{authors.join(', ')}</td>
    </tr>
  );
};
SetAuthors.propTypes = {
  authors: T.arrayOf(T.string),
};

class SummarySet extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object,
    }).isRequired,
    db: T.string.isRequired,
    loading: T.bool.isRequired,
  };

  render() {
    const metadata =
      this.props.loading || !this.props.data.metadata
        ? {
            accession: '',
            description: '',
            id: '',
            source_database: '',
            authors: null,
            literature: null,
          }
        : this.props.data.metadata;
    let currentSet = null;
    if (metadata.source_database) {
      for (const db of setDBs) {
        if (db.name === metadata.source_database) currentSet = db;
      }
      if (metadata.source_database === 'panther')
        metadata.description = metadata.name.name;
    }

    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div
              className={f(
                currentSet?.url_template ? 'medium-9' : 'medium-12',
                'columns',
                'margin-bottom-large',
              )}
            >
              <table className={f('light', 'table-sum')}>
                <tbody>
                  <tr>
                    <td>Accession</td>
                    <td data-testid="set-accession">
                      <Accession accession={metadata.accession} />
                    </td>
                  </tr>
                  <tr>
                    <td>Data type</td>
                    <td data-testid="set-type">Set</td>
                  </tr>
                  <tr>
                    <td style={{ width: '200px' }} data-testid="set-memberdb">
                      Member database
                    </td>
                    <td>{currentSet?.dbName || metadata.source_database}</td>
                  </tr>
                  <SetAuthors authors={metadata.authors} />
                </tbody>
              </table>
              <SetDescription
                accession={metadata.accession}
                description={metadata?.description}
              />
              <SetLiterature literature={metadata?.literature} />
              {metadata.relationships &&
                metadata.relationships.nodes &&
                metadata.relationships.nodes.map((m) => (
                  <SchemaOrgData
                    key={m.accession}
                    data={{ data: m, db: metadata.source_database }}
                    processData={schemaProcessData}
                  />
                ))}
            </div>
            <div className={f('medium-3', 'columns')}>
              {currentSet?.url_template ? (
                <div className={f('panel')}>
                  <h5>External Links</h5>
                  <ul
                    className={f('no-bullet')}
                    data-testid="set-external-links"
                  >
                    <li>
                      <BaseLink
                        id={metadata.accession}
                        className={f('ext')}
                        target="_blank"
                        pattern={currentSet.url_template}
                      >
                        View {metadata.accession} in {currentSet.dbName}
                      </BaseLink>
                    </li>
                  </ul>
                </div>
              ) : null}
            </div>
          </div>{' '}
          <div className={f('row', 'columns')}>
            <ClanViewer data={this.props.data} loading={this.props.loading} />
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.set.db,
  (db) => ({ db }),
);

export default connect(mapStateToProps)(SummarySet);
