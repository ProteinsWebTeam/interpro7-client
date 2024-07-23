import React from 'react';

import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData/ts';
import { STATUS_OK } from 'utils/server-message';
import { getReversedUrl } from 'higherOrder/loadData/defaults';

import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';
import { Column } from 'components/Table';
import Table from 'components/Table/SimpleTable';
import ProteinDownloadRenderer from 'components/Matches/ProteinDownloadRenderer';
import NumberComponent from 'components/NumberComponent';

import { speciesFeat } from 'staticData/home';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import tableStyles from 'components/Table/style.css';

const css = cssBinder(fonts, tableStyles);

type Props = {
  description?: InterProDescription;
};
interface LoadedProps
  extends Props,
    LoadDataProps<
      PayloadList<{
        metadata: TaxonomyMetadata;
        extra_fields?: { counters: Record<string, number> };
      }>
    > {}

type SpeciesFeature = (typeof speciesFeat)[number];

const _KeySpeciesTableWithData = ({ data, description }: LoadedProps) => {
  if (!data) return null;
  const { status, loading, payload } = data;
  if (!loading && status !== STATUS_OK)
    return (
      <Callout type="info">
        There is no key species associated with this accession
      </Callout>
    );
  if (loading || !payload) return <Loading />;
  const dataTable = payload.results.map((r) => ({
    ...r.metadata,
    ...((r.extra_fields && r.extra_fields.counters) || {}),
    features: speciesFeat.find((f) => f.tax_id === r.metadata.accession),
  }));
  return (
    <Table
      dataTable={dataTable}
      notFound={payload.results.length === 0}
      contentType="taxonomy"
      title="Key Species"
    >
      <Column
        dataKey="accession"
        defaultKey="icons"
        renderer={(acc: string, { features }: { features: SpeciesFeature }) => {
          return (
            <span
              style={{ color: features.color, fontSize: '2em' }}
              className={css('small', 'icon', 'icon-species')}
              data-icon={features.icon}
              aria-label={acc}
            />
          );
        }}
      >
        {' '}
      </Column>
      <Column
        dataKey="accession"
        renderer={(acc: string) => <span>{acc}</span>}
      >
        Tax ID
      </Column>
      <Column dataKey="name" renderer={(name: string) => <span>{name}</span>}>
        Name
      </Column>
      <Column
        dataKey="proteins"
        cellClassName={css('table-center')}
        headerClassName={css('table-header-center')}
        renderer={(count) => <NumberComponent abbr>{count}</NumberComponent>}
      >
        protein count
      </Column>
      <Column
        dataKey="accession"
        defaultKey="proteinFastas"
        headerClassName={css('table-header-center')}
        cellClassName={css('table-center')}
        renderer={ProteinDownloadRenderer(description)}
      >
        Actions
      </Column>
    </Table>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description,
  (description) => ({ description }),
);
export default loadData({
  getUrl: ({ ...args }) => {
    const reversed = getReversedUrl({ ...args });
    return `${reversed}${reversed.indexOf('?') >= 0 ? '&' : '?'}key_species`;
  },
  mapStateToProps,
} as LoadDataParameters)(_KeySpeciesTableWithData);
