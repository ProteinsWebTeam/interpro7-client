import React, { useRef, useEffect, useState } from 'react';
import { createSelector } from 'reselect';

import Length from 'components/Protein/Length';
import Species from 'components/Protein/Species';
import Link from 'components/generic/Link';
import DomainsOnProteinLoaded from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';

import { UniProtLink } from 'components/ExtLink/patternLinkWrapper';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { mergeData } from 'components/IPScan/Summary/serializers';
import FileExporter from 'components/Matches/FileExporter';

import DownloadButton from '../Sequence/DownloadButton';

import { splitSequenceByChunks } from 'utils/sequence';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-vf.css';
import local from './style.css';
import summary from 'styles/summary.css';
import BaseLink from 'components/ExtLink/BaseLink';

const css = cssBinder(summary, fonts, ipro, local);

type Props = {
  data: {
    metadata: ProteinMetadata & { name?: NameObject };
  };
  md5: string;
};

export const UniParcProtein = ({ data, md5 }: Props) => {
  const metadata = data.metadata;
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!metadata || !metadata.accession || !md5) return;

    const fetchMatches = async () => {
      try {
        const response = await fetch(
          `https://www.ebi.ac.uk/interpro/matches/api/matches/${md5}`,
        );
        const data = await response.json();
        setMatches(data.matches || []);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        setMatches([]);
      }
    };

    fetchMatches();
  }, [metadata, md5]);

  let organisedData = {};

  if (matches && matches.length > 0) {
    organisedData = mergeData(matches, metadata.length);
  }

  console.log(organisedData);
  return (
    <>
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
                x
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
              {metadata.gene && (
                <tr>
                  <td>Gene</td>
                  <td>{metadata.gene}</td>
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
                    UniProt
                  </UniProtLink>
                </li>
                {metadata.in_bfvd ? (
                  <>
                    <li>
                      <BaseLink
                        id={metadata.accession}
                        target={'_blank'}
                        pattern="https://bfvd.foldseek.com/cluster/{id}"
                        className={css('ext')}
                      >
                        BFVD
                      </BaseLink>
                    </li>
                    <li>
                      <BaseLink
                        id={metadata.accession}
                        target={'_blank'}
                        pattern="https://search.foldseek.com/search?accession={id}&source=BFVD"
                        className={css('ext')}
                      >
                        Foldseek
                      </BaseLink>
                    </li>
                  </>
                ) : null}
                {metadata.in_alphafold ? (
                  <>
                    <li>
                      <BaseLink
                        id={metadata.accession}
                        target={'_blank'}
                        pattern="https://alphafold.ebi.ac.uk/entry/{id}"
                        className={css('ext')}
                      >
                        AlphaFold
                      </BaseLink>
                    </li>
                    <li>
                      <BaseLink
                        id={metadata.accession}
                        target={'_blank'}
                        pattern="https://search.foldseek.com/search?accession={id}&source=AlphaFoldDB"
                        className={css('ext')}
                      >
                        Foldseek
                      </BaseLink>
                    </li>
                  </>
                ) : null}
              </ul>
            </section>
            <hr style={{ margin: '0.8em' }} />
            {/* {/* <HmmerButton
              sequence={metadata.sequence}
              accession={metadata.accession}
              title="Search protein with HMMER"
              minWidth={minWidth}
            /> 
                // <IPScanButton
                //     sequence={splitSequenceByChunks(
                //         metadata.sequence,
                //         metadata.id || '',
                //     )}
                //     title="Search sequence with InterProScan"
                //     minWidth={"20"}
                // /> */}
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label style={{ marginBottom: '0.4rem' }}>
              <FileExporter
                description={{
                  main: { key: 'protein' },
                  protein: {
                    db: metadata.source_database,
                    accession: metadata.accession,
                  },
                  entry: { integration: 'all' },
                }}
                count={metadata.counters!.entries as number}
                fileType="tsv"
                primary="entry"
                secondary="protein"
                minWidth={20}
                label="Download matches (TSV)"
              />
            </label>
            <DownloadButton
              sequence={metadata.sequence}
              accession={metadata.accession}
            />
          </section>
        </div>
      </section>
      <br></br>
      {matches && matches.length > 0 && (
        <DomainsOnProteinLoaded
          mainData={{ metadata }}
          dataMerged={organisedData}
          loading={false}
        ></DomainsOnProteinLoaded>
      )}
    </>
  );
};
