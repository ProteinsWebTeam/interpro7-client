import React from 'react';

import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import File from 'components/File';
import { SupportedExtensions } from 'components/File/FileButton';

type Props = {
  entryLocation?: EndpointLocation;
  search?: Record<string, string>;
  count: number;
  fileType: SupportedExtensions;
};

const AllIDADownload = ({ entryLocation, search, fileType, count }: Props) => (
  <File
    fileType={fileType}
    name={`ida-search-results.${fileType}`}
    count={count}
    customLocationDescription={{
      main: { key: 'entry' },
      entry: {
        ...(entryLocation || {}),
        detail: undefined,
      },
    }}
    search={entryLocation?.accession ? { ida: '' } : search}
    endpoint="ida"
  />
);

const mapStateToProps = createSelector(
  (state: GlobalState) =>
    state.customLocation.description.entry as EndpointLocation,
  (state: GlobalState) => state.customLocation.search as Record<string, string>,
  (entryLocation, search) => ({
    entryLocation,
    search,
  }),
);

export default connect(mapStateToProps)(AllIDADownload);
