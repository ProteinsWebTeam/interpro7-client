// @flow
import React, { useState } from 'react';
import T from 'prop-types';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Species from 'components/Protein/Species';
import Link from 'components/generic/Link';
import FileExporter from 'components/Matches/FileExporter';

import { UniProtLink } from 'components/ExtLink';
import DomainsOnProtein from 'components/Related/DomainsOnProtein';

import loadable from 'higherOrder/loadable';
import {
  isTranscribedFrom,
  isContainedInOrganism,
} from 'schema_org/processors';

import { DescriptionReadMore } from 'components/Description';

import IsoformSelector from 'components/Protein/Isoforms/Selector';
import IsoformViewer from 'components/Protein/Isoforms/Viewer';

import Loading from 'components/SimpleCommonComponents/Loading';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import HmmerButton from 'components/Protein/Sequence/HmmerButton';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import sequenceStyles from '../Sequence/style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiStyles, sequenceStyles, fonts);

/*:: type Props = {
  data: {
    metadata: Object,
  },
  loading: Boolean,
}; */
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const SummaryProtein = (
  { data, loading } /*: {data: Object, loading: boolean} */,
) => {
  const [isoform, setIsoform] = useState('');
  if (loading || !data || !data.metadata) return <Loading />;
  const metadata = data.metadata;

  return (
    <div className={f('sections')}>
      {metadata.gene && (
        <SchemaOrgData
          data={{ gene: metadata.gene }}
          processData={isTranscribedFrom}
        />
      )}
      {metadata.source_organism && (
        <SchemaOrgData
          data={metadata.source_organism}
          processData={isContainedInOrganism}
        />
      )}
      <section>
        <div className={f('row')}>
          <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
            <table className={f('light', 'table-sum')}>
              <tbody>
                <tr>
                  <td>Short name</td>
                  <td>
                    <i
                      className={f('shortname')}
                      data-testid="protein-shortname"
                    >
                      {metadata.id}
                    </i>
                  </td>
                </tr>
                <tr>
                  <td>Length</td>
                  <td data-testid="protein-length">
                    <Length metadata={metadata} />
                  </td>
                </tr>
                <tr>
                  <td>Species</td>
                  <td data-testid="protein-species">
                    <Species
                      fullName={metadata.source_organism.fullName}
                      taxID={metadata.source_organism.taxId}
                    />
                  </td>
                </tr>
                {metadata.proteome && metadata.proteome.length > 0 && (
                  <tr>
                    <td>Proteome</td>
                    <td data-testid="protein-proteome">
                      <Link
                        to={{
                          description: {
                            main: { key: 'proteome' },
                            proteome: {
                              db: 'uniprot',
                              accession: metadata.proteome,
                            },
                          },
                        }}
                      >
                        {metadata.proteome}
                      </Link>
                    </td>
                  </tr>
                )}
                {metadata.description && metadata.description.length ? (
                  <tr>
                    <td data-testid="protein-function">
                      Function{' '}
                      <Tooltip title="Provided By UniProt">
                        <span
                          className={f('small', 'icon', 'icon-common')}
                          data-icon="&#xf129;"
                          aria-label="Provided By UniProt"
                        />
                      </Tooltip>
                    </td>
                    <td>
                      <DescriptionReadMore
                        text={metadata.description[0]}
                        minNumberOfCharToShow={250}
                        patternToRemove="\s?\(PubMed:\d+\)\s?"
                      />
                    </td>
                  </tr>
                ) : null}
                {metadata.counters &&
                metadata.counters.isoforms &&
                metadata.counters.isoforms > 0 ? (
                  <tr>
                    <td data-testid="protein-function">
                      Isoforms{' '}
                      <Tooltip
                        title={`This protein has ${metadata.counters.isoforms} isoforms`}
                      >
                        <span
                          className={f('small', 'icon', 'icon-common')}
                          data-icon="&#xf129;"
                          aria-label={`This protein has ${metadata.counters.isoforms} isoforms`}
                        />
                      </Tooltip>
                    </td>
                    <td>
                      <IsoformSelector
                        value={isoform}
                        onChange={(event) => setIsoform(event.target.value)}
                      />
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <div className={f('medium-3', 'columns')}>
            <div className={f('panel')}>
              <h5>External Links</h5>
              <ul
                className={f('no-bullet')}
                data-testid="protein-external-links"
              >
                <li>
                  <UniProtLink id={metadata.accession} className={f('ext')}>
                    View {metadata.accession} in UniProtKB
                  </UniProtLink>
                </li>
              </ul>
              <hr style={{ margin: '0.8em' }} />
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label>
                Export Matches [TSV]
                <FileExporter
                  description={{
                    main: { key: 'protein' },
                    protein: {
                      db: metadata.source_database,
                      accession: metadata.accession,
                    },
                    entry: { integration: 'all' },
                  }}
                  count={metadata.counters.entries}
                  fileType="tsv"
                  primary="entry"
                  secondary="protein"
                  label="Export Matches [TSV]"
                  className={'button hollow'}
                />
              </label>
              <hr style={{ margin: '0.8em' }} />
              <HmmerButton
                sequence={metadata.sequence}
                accession={metadata.accession}
              />
            </div>
          </div>
        </div>
      </section>
      <IsoformViewer isoform={isoform} />
      <section>
        <div className={f('row')}>
          <div className={f('medium-12', 'columns', 'margin-bottom-large')}>
            <DomainsOnProtein mainData={data} />
          </div>
        </div>
      </section>
      {metadata.go_terms && (
        <GoTerms terms={metadata.go_terms} type="protein" />
      )}
    </div>
  );
};
SummaryProtein.propTypes = {
  data: T.shape({
    metadata: T.object,
  }).isRequired,
  loading: T.bool.isRequired,
};

export default SummaryProtein;
