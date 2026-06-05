import React, { useRef, useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import config from 'config';
import TitleTag from 'components/Title/TitleTag';
import Species from 'components/Protein/Species';
import Link from 'components/generic/Link';
import DomainsOnProteinLoaded from 'components/Related/DomainsOnProtein/DomainsOnProteinLoaded';

import { mergeData } from 'components/IPScan/Summary/serializers';

import DownloadButton from '../Sequence/DownloadButton';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-vf.css';
import style from 'components/Title/style.css';
import summary from 'styles/summary.css';

import AccessionTag from 'components/Title/AccessionTag';
import Callout from 'components/SimpleCommonComponents/Callout';

const css = cssBinder(summary, fonts, ipro, style);

type Props = {
  data: {
    metadata: ProteinMetadata & { name?: NameObject } & {
      taxonomies: { commonTaxon: string; commonTaxonId: string }[];
    };
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
        const response = await fetch(`${config.root.matches.href}/${md5}`);
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

  return (
    <>
      <Callout type="info">
        {metadata.accession} is no longer available in UniProtKB. This page
        shows information from its corresponding UniParc sequence entry.
      </Callout>
      <div className={css('title-name')}>
        <div className={css('title-fav')}>
          <AccessionTag
            accession={metadata.accession}
            db={metadata.source_database}
            mainType={'protein'}
            isIPScanResult={false}
          />
          <h3 className={css('margin-bottom-large')}>
            UniParc Entry {metadata.id}
          </h3>
        </div>
      </div>
      <TitleTag mainType="protein" db="uniparc" dbLabel="uniparc" />
      <br></br>
      <section className={css('vf-grid', 'summary-grid')}>
        <div className={css('vf-stack')}>
          <table className={css('vf-table', 'left-headers')}>
            <tbody>
              <tr>
                <td>Length</td>
                <td data-testid="protein-length">
                  {metadata.length} amino acids
                </td>
              </tr>
              <tr>
                <td>Taxonomies</td>
                <td data-testid="protein-species">
                  {metadata.taxonomies?.map((taxonomy, idx) => {
                    return (
                      <>
                        <Species
                          fullName={taxonomy.commonTaxon}
                          taxID={taxonomy.commonTaxonId}
                        />
                        {idx !== metadata.taxonomies?.length - 1 ? ', ' : ''}
                      </>
                    );
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={css('vf-stack')}>
          <section>
            <section>
              <h5>External Links</h5>
              <ul className={css('no-bullet')}>
                <li>
                  <Link
                    href={`https://www.uniprot.org/uniparc/${metadata.id}/entry/${metadata.accession}`}
                    className={css('ext')}
                  >
                    UniProt
                  </Link>
                </li>
              </ul>
            </section>
            <hr style={{ margin: '0.8em' }} />
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
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
