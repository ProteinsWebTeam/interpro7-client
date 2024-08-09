import React from 'react';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { changeSettingsRaw } from 'actions/creators';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import { DomainArchitecturesWithData } from '../';

const mapStateToProps = createSelector(
  (state: GlobalState) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[
      state.customLocation.description.main.key as Endpoint
    ].accession,
  (state: GlobalState) => state.customLocation.search,
  (state: GlobalState) => state.settings.ui,
  (mainAccession, search, { idaAccessionDB }) => ({
    mainAccession,
    search,
    idaAccessionDB,
  }),
);

const getUrlForIDASearch = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }, search) => {
    // omit from search
    const description: InterProPartialDescription = {
      main: { key: 'entry' },
    };
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: search,
    });
  },
);

type Props = {
  searchFromURL: string;
  ignoreFromURL: string;
};
const IDAResults = ({ searchFromURL, ignoreFromURL }: Props) => {
  if (!searchFromURL) return null; // Empty search
  const entries = searchFromURL.split(',').map((e) => e.trim());
  const ignore = ignoreFromURL
    ? ignoreFromURL.split(',').map((e) => e.trim())
    : [];
  if (entries.indexOf('') !== -1) return null; // One of the entries is empty
  if (ignoreFromURL !== undefined && ignoreFromURL.trim() === '') return null; // single ignore entry empty
  if (ignoreFromURL !== undefined && ignore.indexOf('') !== -1) return null; // at least one of the ignore is empty
  const Results = loadData({
    getUrl: getUrlForMeta,
    propNamespace: 'DB',
  })(
    loadData({
      getUrl: getUrlForIDASearch,
      mapStateToProps,
      mapDispatchToProps: { changeSettingsRaw },
    })(DomainArchitecturesWithData),
  );
  return <Results highlight={entries} />;
};

const mapSearchStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.search,
  ({ ida_search: searchFromURL, ida_ignore: ignoreFromURL }) => ({
    searchFromURL: searchFromURL as string,
    ignoreFromURL: ignoreFromURL as string,
  }),
);
export default connect(mapSearchStateToProps)(IDAResults);
