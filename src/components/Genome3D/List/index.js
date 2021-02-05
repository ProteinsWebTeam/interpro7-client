// @flow
import React from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import Loading from 'components/SimpleCommonComponents/Loading';
import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import { createSelector } from 'reselect';
import { format } from 'url';

import Table, { Column, Exporter } from 'components/Table';
import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';

import MatchesOnProtein from './MatchesOnProtein';
import FileExporter from '../FileExporter';
import EdgeCase from 'components/EdgeCase';

import { foundationPartial } from 'styles/foundation';
import exporterStyle from 'components/Table/Exporter/style.css';
import ebiStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiStyles, exporterStyle);
const HTTP_404 = 404;

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = (data) => {
  return {
    '@id': '@additionalProperty',
    '@type': 'PropertyValue',
    additionalType: ['bio:SequenceMatchingModel', 'bio:sequenceAnnotation'],
    name: 'Annotation',
    value: data.map((g3d) => g3d?.metadata?.evidences?.source?.url),
  };
};
/*::
  type Genome3DPayload = {
      data: Array<{
        accession: string,
        locations: Array<Object>,
        metadata: {
          anno_id: string | number,
          confidence: string,
          evidences ?: Object,
          resource: string,
          type: string,
        },
        tooltipContent: string,
        length: number,
      }>,
      pager: {
        total_entries: number,
        current_page: number,
        entries_per_page: number,
        entry_from: number,
        entry_to: number,
        total_pages: number,
      },
      interpro: {
        ipr_id: string,
        release_date: string,
        release_name: string,
      }
    }
  */
export const List = (
  {
    data,
    dataResource,
    customLocation: { search },
  } /*: {data: {
    loading: boolean,
    payload: Genome3DPayload,
    ok?: boolean,
    status?: number
  },
  dataResource: {
    loading: boolean,
    payload: Array<Object>,
  },
  customLocation: {search?: Object}} */,
) => {
  if (data.loading) return <Loading />;
  if (!data.payload)
    return (
      <div className={f('columns')}>
        <EdgeCase
          text={'There is no data associated with this request'}
          shouldRedirect={false}
        />
      </div>
    );
  const data4table = data.payload.data.map(
    ({ accession, locations, metadata, tooltipContent, length }) => ({
      ...metadata,
      id: metadata.anno_id,
      accession,
      length,
      locations,
      tooltipContent,
    }),
  );
  let resourceList = [];
  if (!dataResource.loading)
    resourceList = dataResource.payload.map(({ name }) => name);

  return (
    <div className={f('row')}>
      <div className={f('columns')}>
        <SchemaOrgData
          data={data.payload.data}
          processData={schemaProcessData}
        />
        <Table
          dataTable={data4table}
          loading={data.loading}
          ok={data.ok}
          status={data.status}
          actualSize={data.payload.pager.total_entries}
          notFound={data.status === HTTP_404}
          rowKey={'id'}
          query={search}
        >
          <Exporter>
            <div className={f('menu-grid')}>
              <label htmlFor="json">JSON</label>
              <FileExporter
                fileType="json"
                name={`genome3d.${data.payload.interpro.ipr_id}.json`}
                count={data.payload.pager.total_entries}
              />
              <label htmlFor="tsv">TSV</label>
              <FileExporter
                fileType="tsv"
                name={`genome3d.${data.payload.interpro.ipr_id}.tsv`}
                count={data.payload.pager.total_entries}
              />
            </div>
          </Exporter>
          <Column
            dataKey="accession"
            renderer={(accession /*: string */) => (
              <Link
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: { db: 'uniprot', accession },
                  },
                }}
              >
                {accession}
              </Link>
            )}
            isSearchable={true}
            customiseSearch={{
              validation: /^([OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})$/i,
              message: 'Accepts only UniProt accessions',
            }}
          >
            Protein
          </Column>
          <Column
            dataKey="evidences"
            renderer={(
              {
                source: { url, id, name },
              } /*: {source: {url: string, id: string, name: string}} */,
            ) => (
              <Link href={url} target="_blank" className={f('ext')}>
                {name}: {id}
              </Link>
            )}
            isSearchable={true}
            showOptions={true}
            options={resourceList}
          >
            Evidence
          </Column>
          <Column
            dataKey="confidence"
            renderer={(confidence /*: number */) => (
              <NumberComponent>{confidence}</NumberComponent>
            )}
            isSearchable={true}
            customiseSearch={{
              type: 'number',
              placeholder: '>=',
            }}
          />
          <Column
            dataKey="locations"
            renderer={(
              locations /*: Array<Object> */,
              {
                tooltipContent,
                accession,
                length,
              } /*: { tooltipContent: string, accession: string, length: number } */,
            ) => (
              <MatchesOnProtein
                matches={locations}
                tooltip={tooltipContent}
                accession={`${accession}`}
                length={length}
              />
            )}
          >
            Matches
          </Column>
        </Table>
      </div>
    </div>
  );
};
List.propTypes = {
  data: dataPropType,
  dataResource: T.object,
  customLocation: T.shape({
    search: T.object,
  }),
};

const getGenome3dResourceURL = createSelector(
  (state) => state.settings.genome3d,
  ({ protocol, hostname, port, root }) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}resource/list`,
    });
  },
);

export default loadData({
  getUrl: getGenome3dResourceURL,
  propNamespace: 'Resource',
})(List);
