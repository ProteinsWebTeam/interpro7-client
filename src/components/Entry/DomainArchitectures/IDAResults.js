// @flow
import React from 'react';
import T from 'prop-types';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import { DomainArchitecturesWithData } from 'components/Entry/DomainArchitectures/index';

const mapStateToProps = createSelector(
  state =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  state => state.customLocation.search,
  (mainAccession, search) => ({ mainAccession, search }),
);

const getUrlForIDASearch = createSelector(
  state => state.settings.api,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, search) => {
    // omit from search
    const description = {
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
const IDAResults = ({ searchFromURL, ignoreFromURL }) => {
  if (!searchFromURL) return null; // Empty search
  const entries = searchFromURL.split(',').map(e => e.trim());
  const ignore = ignoreFromURL
    ? ignoreFromURL.split(',').map(e => e.trim())
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
    })(DomainArchitecturesWithData),
  );
  return <Results highlight={entries} />;
};
IDAResults.propTypes = {
  searchFromURL: T.string,
  ignoreFromURL: T.string,
};

const mapSearchStateToProps = createSelector(
  state => state.customLocation.search,
  ({ ida_search: searchFromURL, ida_ignore: ignoreFromURL }) => ({
    searchFromURL,
    ignoreFromURL,
  }),
);
export default connect(mapSearchStateToProps)(IDAResults);
