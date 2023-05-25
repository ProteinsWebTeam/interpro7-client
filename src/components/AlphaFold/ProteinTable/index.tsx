import React from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData/ts';
import { Params } from 'higherOrder/loadData/extract-params';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Table, { Column, PageSizeSelector, SearchBox } from 'components/Table';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';

const f = cssBinder(style, ipro, fonts);

type Props = {
  search?: Record<string, string>;
  onProteinChange: (acc: string) => void;
};
interface LoadedProps
  extends Props,
    LoadDataProps<PayloadList<ProteinEntryPayload>> {}

const ProteinTable = ({
  data,
  isStale,
  search,
  onProteinChange,
}: LoadedProps) => {
  if (data?.loading) return <Loading />;

  return (
    <div>
      <Table
        dataTable={data.payload?.results.map((e) => e.metadata) || []}
        contentType="protein"
        loading={data.loading}
        ok={data.ok}
        status={data.status}
        actualSize={data.payload?.count || 0}
        query={search}
        nextAPICall={data.payload?.next}
        previousAPICall={data.payload?.previous}
        currentAPICall={data.url}
        isStale={isStale}
      >
        <PageSizeSelector />
        <SearchBox loading={data.loading}>Search proteins</SearchBox>
        <Column
          dataKey="accession"
          cellClassName={'nowrap'}
          renderer={(accession: string, row: Record<string, string>) => (
            <>
              <Link
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: {
                      db: row.source_database,
                      accession,
                    },
                  },
                  search: {},
                }}
                className={f('acc-row')}
              >
                {accession}
              </Link>
              {row.source_database === 'reviewed' ? (
                <>
                  {'\u00A0' /* non-breakable space */}
                  <Tooltip title="Reviewed by UniProt curators (Swiss-Prot)">
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#xf00c;"
                      aria-label="reviewed"
                    />
                  </Tooltip>
                </>
              ) : null}
            </>
          )}
        />
        <Column
          dataKey="name"
          renderer={(name: string, row: Record<string, string>) => {
            return (
              <Link
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: {
                      db: row.source_database,
                      accession: row.accession,
                    },
                  },
                  search: {},
                }}
                className={f('acc-row')}
              >
                {name}
              </Link>
            );
          }}
        >
          Name
        </Column>
        <Column
          dataKey="source_organism"
          renderer={({
            fullName,
            taxId,
          }: {
            fullName: string;
            taxId: number;
          }) => (
            <Link
              to={{
                description: {
                  main: { key: 'taxonomy' },
                  taxonomy: {
                    db: 'uniprot',
                    accession: `${taxId}`,
                  },
                },
              }}
            >
              {fullName}
            </Link>
          )}
        >
          Species
        </Column>
        <Column
          dataKey="length"
          headerClassName={f('text-right')}
          cellClassName={f('text-right')}
          renderer={(length: number) => length.toLocaleString()}
        >
          Length
        </Column>
        <Column
          dataKey={''}
          headerClassName={f('text-right')}
          cellClassName={f('text-right')}
          renderer={(_: string, row: Record<string, string>) => {
            return (
              <button
                className={f('button')}
                onClick={() => onProteinChange(row.accession)}
              >
                Show prediction
              </button>
            );
          }}
        />
      </Table>
    </div>
  );
};

export const getUrl = (includeSearch: boolean) =>
  createSelector(
    (state: GlobalState) => state.settings.api,
    (state: GlobalState) => state.customLocation.description,
    (state: GlobalState) => state.customLocation.search,
    (
      { protocol, hostname, port, root }: ParsedURLServer,
      description,
      search
    ) => {
      if (description.main.key === 'entry') {
        const _description = {
          main: {
            key: 'protein',
            numberOfFilters: 1,
          },
          protein: { db: description.protein.db || 'UniProt' },
          entry: {
            isFilter: true,
            db: description.entry.db,
            accession: description.entry.accession,
          },
        };
        let query;
        if (includeSearch) query = { ...search, has_model: true };
        else query = { has_model: true };
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(_description),
          query: query,
        });
      }
      return null;
      // This below was to support the idea of multiple models for the same protein, which is unnecessary at the moment
      // return {
      //   accession: description[description.main.key].accession,
      // };
    }
  );

export const mapStateToPropsForModels = createSelector(
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  (description: InterProDescription, search: Record<string, string>) => ({
    description,
    search,
  })
);

export default loadData({
  getUrl: getUrl(true),
  mapStateToProps: mapStateToPropsForModels,
} as Params)(ProteinTable);
