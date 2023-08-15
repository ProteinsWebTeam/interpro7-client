// @flow
/* eslint-disable no-param-reassign */

/*  This file is currently not in use. It has been disabled fromRelated Advanced in 15/08/2023
    Give it a few months otherwise delete!
*/
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { format } from 'url';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';
import Link from 'components/generic/Link';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import Loading from 'components/SimpleCommonComponents/Loading';

const ProteinViewer = loadable({
  loader: () =>
    // $FlowFixMe
    import(/* webpackChunkName: "protein-viewer" */ 'components/ProteinViewer'),
});

const toArrayStructure = (locations) =>
  locations.map((loc) => loc.fragments.map((fr) => [fr.start, fr.end]));

const formatStructureInfoObj = (data) => {
  const features = [];
  for (const key of Object.keys(data)) {
    if (key === 'pdb') continue;
    for (const acc of Object.keys(data[key]).sort()) {
      const f = data[key][acc];
      features.push({
        accession: `${key} - ${acc}`,
        source_database: key.toUpperCase(),
        locations: [
          {
            fragments: f.coordinates,
          },
        ],
        name: f.domain_id,
      });
    }
  }
  return features;
};

const mergeData = (interpro, structures, structureInfo) => {
  const out = {};

  out.interpro = interpro.map(({ metadata, proteins }) => ({
    ...metadata,
    locations: proteins[0].entry_protein_locations,
  }));
  if (structures.length) {
    out.structures = structures
      .map(({ ...obj }) => ({
        label: `${obj.accession}: ${obj.chain}`,
        coordinates: toArrayStructure(obj.structure_protein_locations),
        locations: obj.structure_protein_locations,
        link: `/structure/${obj.source_database}/${obj.accession}`,
        ...obj,
      }))
      .sort((a, b) => (a.label > b.label ? 1 : -1));
  }
  if (structureInfo) {
    out.features = formatStructureInfoObj(structureInfo);
  }
  return out;
};

const PAGE_SIZE = 10;
const _Pagination = ({ modelPage, length, customLocation }) => {
  return (
    <nav>
      {modelPage > 1 ? (
        <Link
          to={{
            ...customLocation,
            search: {
              ...customLocation.search,
              model_page: modelPage - 1,
            },
          }}
          alt="Previous"
        >
          Prev ▲
        </Link>
      ) : (
        'Prev △'
      )}{' '}
      {modelPage * PAGE_SIZE < length ? (
        <Link
          to={{
            ...customLocation,
            search: {
              ...customLocation.search,
              model_page: modelPage + 1,
            },
          }}
          alt="Next"
        >
          ▼ Next
        </Link>
      ) : (
        '▽ Next'
      )}
    </nav>
  );
};
_Pagination.propTypes = {
  modelPage: T.number,
  length: T.number,
  customLocation: T.object,
};
const mapStateToProps = createSelector(
  (state) => state.customLocation,
  (state) => state.customLocation.search,
  (customLocation, { model_page: modelPage }) => ({
    customLocation,
    modelPage: +modelPage || 1,
  }),
);

const Pagination = connect(mapStateToProps)(_Pagination);

const paginateStructureInfoData = (
  data /*: Array<[string, Array<mixed>]> */,
  page /*:: ?: number */ = 1,
) => {
  const featureIndex = data.findIndex(([name]) => name === 'features');
  if (featureIndex === -1 || data[featureIndex][1].length < PAGE_SIZE)
    return data;
  const newData = [...data];
  const from = PAGE_SIZE * (page - 1);
  const to = Math.min(from + PAGE_SIZE, data[featureIndex][1].length);
  newData[featureIndex] = [
    `features (${from + 1} to ${to} out of ${data[featureIndex][1].length})`,
    data[featureIndex][1].slice(from, to),
    {
      component: Pagination,
      attributes: {
        length: data[featureIndex][1].length,
      },
    },
    // ,
  ];
  return newData;
};
const UNDERSCORE = /_/g;

/*:: type Props = {
  structures: Array<Object>,
  dataInterPro: Object,
  protein: Object,
  dataStructureInfo: Object,
  modelPage?: number,
}; */

class _StructureOnProtein extends PureComponent /*:: <Props> */ {
  static propTypes = {
    structures: T.array.isRequired,
    dataInterPro: T.object,
    protein: T.object,
    dataStructureInfo: T.object,
    modelPage: T.number,
  };

  render() {
    const { structures, dataInterPro, dataStructureInfo, protein, modelPage } =
      this.props;
    if (dataInterPro.loading || dataStructureInfo.loading) {
      return <Loading />;
    }
    // prettier-ignore
    const mergedData /*: Array<[string, Array<mixed>]> */ = (Object.entries(
      mergeData(
        dataInterPro?.payload?.results || [],
        structures,
        dataStructureInfo?.payload || [],
      ),
    ) /*: any */)
      .map(([key/*: string */, value/*: Array<mixed> */]) => [
        key.replace(UNDERSCORE, ' '),
        value,
      ]);
    const data = paginateStructureInfoData(mergedData, modelPage);
    return (
      <ProteinViewer
        protein={protein}
        data={data}
        title="Structures on protein"
      />
    );
  }
}

const getUrlForInterPro = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  (
    { protocol, hostname, port, root },
    description,
    { cursor: _, model_page: __, ...search },
  ) => {
    const _description = {
      main: { key: 'entry' },
      structure: {
        ...description.structure,
        isFilter: true,
      },
      protein: {
        ...description.protein,
        isFilter: true,
      },
      entry: {
        db: 'InterPro',
      },
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(_description),
      query: search,
    });
  },
);
const getUrlForStructureInfo = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    const _description = {
      main: { key: 'protein' },
      protein: {
        ...description.protein,
      },
    };
    const _search = {
      structureinfo: null,
    };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(_description),
      query: _search,
    });
  },
);
export default loadData({
  propNamespace: 'InterPro',
  getUrl: getUrlForInterPro,
  mapStateToProps,
})(
  loadData({
    propNamespace: 'StructureInfo',
    getUrl: getUrlForStructureInfo,
  })(_StructureOnProtein),
);
