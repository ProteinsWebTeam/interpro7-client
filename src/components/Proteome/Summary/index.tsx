import React from 'react';

import Accession from 'components/Accession';
import Species from 'components/Protein/Species';
import ProteomeLink from 'components/ExtLink/ProteomeLink';
import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';

import memberSelectorStyle from 'components/Table/TotalNb/style.css';
import summary from 'styles/summary.css';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(summary, memberSelectorStyle, ipro);

type Props = {
  data: {
    metadata: ProteomeMetadata;
  };
  loading: boolean;
};

const SummaryProteome = ({ data, loading }: Props) => {
  if (loading || !data.metadata) return <Loading />;
  const { metadata } = data;
  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      <section className={css('vf-grid', 'summary-grid')}>
        <div className={css('vf-stack')}>
          <table className={css('vf-table', 'left-headers')}>
            <tbody>
              <tr>
                <td style={{ maxWidth: '50%' }}>Proteome ID</td>
                <td>
                  <Accession
                    accession={metadata.proteomeAccession || metadata.accession}
                    title="Proteome ID"
                  />
                </td>
              </tr>
              {metadata.strain && (
                <tr>
                  <td>Strain</td>
                  <td>{metadata.strain}</td>
                </tr>
              )}
              <tr>
                <td>Taxonomy</td>
                <td data-testid="proteome-species">
                  <Species
                    fullName={
                      typeof metadata.name === 'string'
                        ? metadata.name
                        : metadata.name.name
                    }
                    taxID={metadata.taxonomy}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={css('vf-stack')}>
          <section>
            <h5>External Links</h5>
            <ul className={css('no-bullet')}>
              <li>
                <ProteomeLink id={metadata.accession} className={css('ext')}>
                  UniProt
                </ProteomeLink>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </div>
  );
};

export default SummaryProteome;
