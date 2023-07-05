import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Species from 'components/Protein/Species';
import Link from 'components/generic/Link';
import FileExporter from 'components/Matches/FileExporter';

import { UniProtLink } from 'components/ExtLink/patternLinkWrapper';
import DomainsOnProtein from 'components/Related/DomainsOnProtein';

import loadable from 'higherOrder/loadable';
import {
  isTranscribedFrom,
  isContainedInOrganism,
} from 'schema_org/processors';

import DescriptionReadMore from 'components/Description/DescriptionReadMore';

import IsoformSelector from 'components/Protein/Isoforms/Selector';
import IsoformViewer from 'components/Protein/Isoforms/Viewer';

import Loading from 'components/SimpleCommonComponents/Loading';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// import HmmerButton from 'components/Protein/Sequence/HmmerButton';
import IPScanButton from 'components/Protein/Sequence/IPScanButton';
import PantherGoTerms from 'components/Protein/PantherGoTerms';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';

import DownloadButton from '../Sequence/DownloadButton';

import { splitSequenceByChunks } from 'utils/sequence';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-vf.css';
import local from './style.css';
import summary from 'styles/summary.css';

const css = cssBinder(summary, fonts, ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

type Props = {
  data: {
    metadata: ProteinMetadata;
  };
  loading: boolean;
  isoform?: string;
};

export const SummaryProtein = ({ data, loading, isoform }: Props) => {
  const comparisonContainerRef = useRef<HTMLElement | null>(null);
  const [renderComparisonButton, setRenderComparisonButton] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [subfamilies, setSubfamilies] = useState<Array<string> | null>(null);
  useEffect(() => {
    setRenderComparisonButton(true);
  }, [comparisonContainerRef]);
  if (loading || !data || !data.metadata) return <Loading />;
  const metadata = data.metadata;

  const minWidth = '200px';

  const getSubfamiliesFromMatches = (
    results: EntryProteinPayload[]
    //  Array<{
    //   metadata: {
    //     source_database: string;
    //   };
    //   proteins: Array<{
    //     entry_protein_locations: Array<{
    //       subfamily: { accession: string };
    //     }>;
    //   }>;
    // }>
  ) => {
    if (results?.length) {
      setSubfamilies(
        results
          .filter(
            ({ metadata: { source_database: db } }) =>
              db?.toLowerCase() === 'panther'
          )
          .map(({ proteins }) => {
            const subfamilies: Array<string | undefined> = [];
            proteins.forEach((p) => {
              p.entry_protein_locations.forEach(({ subfamily }) => {
                subfamilies.push(subfamily?.accession);
              });
            });
            return subfamilies.filter(Boolean) as Array<string>;
          })
          .flat()
      );
      return;
    }
    setSubfamilies(null);
  };

  return (
    <div className={css('sections')}>
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
      <section className={css('vf-grid', 'summary-grid')}>
        <div className={css('vf-stack')}>
          <table className={css('vf-table', 'left-headers')}>
            <tbody>
              <tr>
                <td style={{ maxWidth: '50%' }}>Short name</td>
                <td>
                  <i
                    className={css('shortname')}
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
                        className={css('small', 'icon', 'icon-common')}
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
              (metadata.counters.isoforms as number) > 0 ? (
                <tr>
                  <td data-testid="protein-function">
                    Isoforms{' '}
                    <Tooltip
                      title={`This protein has ${metadata.counters.isoforms} isoforms`}
                    >
                      <span
                        className={css('small', 'icon', 'icon-common')}
                        data-icon="&#xf129;"
                        aria-label={`This protein has ${metadata.counters.isoforms} isoforms`}
                      />
                    </Tooltip>
                  </td>
                  <td style={{ display: 'flex' }}>
                    <IsoformSelector />
                    {renderComparisonButton ? (
                      <FullScreenButton
                        element={comparisonContainerRef.current}
                        className={css(
                          'button',
                          'comparison-button',
                          'icon',
                          'icon-common'
                        )}
                        disabled={!isoform}
                        dataIcon={'\uF0DB'}
                        tooltip="View in comparison mode"
                        onFullScreenHook={() => setComparisonMode(true)}
                        onExitFullScreenHook={() => setComparisonMode(false)}
                      />
                    ) : null}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className={css('vf-stack')}>
          <section>
            <section>
              <h5>External Links</h5>
              <ul className={css('no-bullet')}>
                <li>
                  <UniProtLink id={metadata.accession} className={css('ext')}>
                    View {metadata.accession} in UniProtKB
                  </UniProtLink>
                </li>
              </ul>
            </section>
            <hr style={{ margin: '0.8em' }} />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label>
              <h5>Export Matches [TSV]</h5>
              <FileExporter
                description={{
                  main: { key: 'protein' },
                  protein: {
                    db: metadata.source_database,
                    accession: metadata.accession,
                  },
                  entry: { integration: 'all' },
                }}
                count={metadata.counters.entries as number}
                fileType="tsv"
                primary="entry"
                secondary="protein"
                // label="Export Matches [TSV]"
                // className={'button hollow'}
                minWidth={minWidth}
              />
            </label>
            <hr style={{ margin: '0.8em' }} />
            {/* <HmmerButton
              sequence={metadata.sequence}
              accession={metadata.accession}
              title="Search protein with HMMER"
              minWidth={minWidth}
            />
            <br /> */}
            <IPScanButton
              sequence={splitSequenceByChunks(metadata.sequence, metadata.id)}
              title="Search protein with InterProScan"
              minWidth={minWidth}
            />
            <DownloadButton
              sequence={metadata.sequence}
              accession={metadata.accession}
            />
          </section>
        </div>
      </section>
      <section
        ref={comparisonContainerRef}
        className={css({ splitfullscreen: comparisonMode })}
      >
        <IsoformViewer />
        <section>
          <div className={css('row')}>
            <div className={css('medium-12', 'columns', 'margin-bottom-large')}>
              <DomainsOnProtein
                mainData={data}
                onMatchesLoaded={getSubfamiliesFromMatches}
              />
            </div>
          </div>
        </section>
      </section>
      {metadata.go_terms && (
        <GoTerms terms={metadata.go_terms} type="protein" />
      )}
      <PantherGoTerms subfamilies={subfamilies || []} />
    </div>
  );
};

const mapStateToProps = createSelector(
  (state) => state.customLocation.search,
  ({ isoform }) => ({ isoform })
);

export default connect(mapStateToProps)(SummaryProtein);
