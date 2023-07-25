import React from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Accession from 'components/Accession';
import Link from 'components/generic/Link';
import BaseLink from 'components/ExtLink/BaseLink';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Literature from 'components/Entry/Literature';
import TimeAgo from 'components/TimeAgo';
import ViewerOnDemand from 'components/Structure/ViewerAndEntries';
import { formatExperimentType } from 'components/Structure/utils';
import { formatShortDate } from 'utils/date';

import cssBinder from 'styles/cssBinder';

import summary from 'styles/summary.css';

const css = cssBinder(summary);

const EXTERNAL_LINKS = [
  { pattern: 'https://www.ebi.ac.uk/pdbe/entry/pdb/{id}', label: 'PDBe' },
  { pattern: 'https://www.rcsb.org/structure/{id}', label: 'RCSB PDB' },
  {
    pattern:
      'http://www.ebi.ac.uk/thornton-srv/databases/cgi-bin/pdbsum/GetPage.pl?pdbcode={id}',
    label: 'PDBsum',
  },
  { pattern: 'https://www.cathdb.info/pdb/{id}', label: 'CATH' },
  {
    pattern: 'http://scop.mrc-lmb.cam.ac.uk/search?t=txt;q={id}',
    label: 'SCOP',
  },
  {
    pattern: 'http://prodata.swmed.edu/ecod/complete/search?kw={id}',
    label: 'ECOD',
  },
  {
    pattern: 'https://proteopedia.org/wiki/index.php/{id}',
    label: 'Proteopedia',
  },
];

interface LoadedProps
  extends LoadDataProps<{ metadata: StructureMetadata }>,
    LoadDataProps<PayloadList<EntryStructurePayload>, 'Matches'> {}

const SummaryStructure = ({ data, dataMatches }: LoadedProps) => {
  const { loading, payload } = data || {};
  const { loading: loadingM, payload: payloadM } = dataMatches || {};
  if (loading || loadingM || !payload) return null;
  const metadata = payload.metadata;
  const matches = payloadM?.results || [];
  const chains = Array.from(new Set(metadata.chains || []));
  const date = new Date(metadata.release_date);
  const literature = Object.entries(metadata.literature || {}).map((item) => {
    // DOI_URL for structure URL is not complete. It contains only the ID
    if (
      item.length === 2 &&
      item[1]?.DOI_URL !== null &&
      !item[1]?.DOI_URL?.startsWith('http')
    ) {
      const id = item[1].DOI_URL;
      item[1].DOI_URL = `https://www.doi.org/${id}`;
    }
    return item;
  });
  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      <section className={css('vf-grid', 'summary-grid')}>
        <div className={css('vf-stack')}>
          {chains.length && (
            <table className={css('vf-table', 'left-headers')}>
              <tbody>
                <tr>
                  <td style={{ maxWidth: '50%' }}>Accession</td>
                  <td>
                    <Accession accession={metadata.accession} />
                  </td>
                </tr>
                <tr>
                  <td>Experiment type</td>
                  <td className={css('text-cap')}>
                    <Link
                      to={{
                        description: {
                          main: { key: 'structure' },
                          structure: { db: 'PDB' },
                          entry: { isFilter: true, db: 'InterPro' },
                        },
                        search: {
                          experiment_type: metadata.experiment_type,
                        },
                      }}
                    >
                      {formatExperimentType(metadata.experiment_type)}
                    </Link>
                  </td>
                </tr>
                {metadata.resolution && (
                  <tr>
                    <td>Resolution</td>
                    <td>{metadata.resolution} Å</td>
                  </tr>
                )}
                <tr>
                  <td>Chains</td>
                  <td>{chains.join(', ')}</td>
                </tr>
                <tr>
                  <td>Released</td>
                  <td>
                    <TimeAgo
                      date={date}
                      noUpdate
                      title={formatShortDate(date)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className={css('vf-stack')}>
          <section>
            <h5>External Links</h5>
            <ul className={css('no-bullet')}>
              {EXTERNAL_LINKS.map(({ label, pattern }) => (
                <li key={label}>
                  <BaseLink
                    id={metadata.accession}
                    target="_blank"
                    pattern={pattern}
                    className={css('ext')}
                  >
                    {label}
                  </BaseLink>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>
      <ErrorBoundary>
        <div>
          <ViewerOnDemand id={metadata.accession} matches={matches} />
        </div>
      </ErrorBoundary>
      <div>
        {literature.length ? (
          <section id="references">
            <div className={css('vf-grid')}>
              <h4>References</h4>
            </div>
            <Literature extra={literature} />
          </section>
        ) : null}
      </div>
    </div>
  );
};

export const getURLForMatches = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.structure,
  ({ protocol, hostname, port, root }, { accession }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}${descriptionToPath({
        main: { key: 'entry' },
        structure: { isFilter: true, db: 'pdb', accession },
        entry: { db: 'all' },
      })}`,
      query: {
        page_size: 200,
        extra_fields: 'short_name',
      },
    })
);

export default loadData({
  getUrl: getURLForMatches,
  propNamespace: 'Matches',
})(loadData()(SummaryStructure));
