// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { downloadSelector } from 'reducers/download';
import { downloadURL } from 'actions/creators';

import { getQueryTerm } from 'components/SearchResults';
// $FlowFixMe
import FileButton from 'components/File/FileButton';
import blockEvent from 'utils/block-event';

/*::
  type FileExplorerProps = {
    count?: number,
    fileType: string,
    name: string,
    className?: string,
    url: string,
    downloadURL: function,
    download: {
      progress: number,
      successful?: boolean,
      blobURL?: string,
    },
  }
  */
const FileExporter = (
  {
    count = Infinity,
    fileType,
    name,
    className,
    url,
    downloadURL,
    download,
  } /*: FileExplorerProps */,
) => {
  const _handleClick = blockEvent(() => {
    downloadURL(url, fileType, null, 'ebisearch');
  });
  const { progress = Infinity, successful, blobURL } = download;
  return (
    <FileButton
      fileType={fileType}
      url={url}
      count={count}
      name={name}
      progress={progress}
      successful={successful}
      blobURL={blobURL}
      handleClick={_handleClick}
      className={className}
      shouldLinkToResults={false}
    />
  );
};
FileExporter.propTypes = {
  count: T.number,
  fileType: T.string.isRequired,
  name: T.string,
  className: T.string,
  url: T.string,
  downloadURL: T.func,
  download: T.shape({
    progress: T.number,
    successful: T.bool,
    blobURL: T.string,
  }),
};

const getEbiSearchUrl = createSelector(
  (state) => state.settings.ebi,
  (state) => state.customLocation.description.search.value,
  ({ protocol, hostname, port, root }, searchValue) => {
    if (!searchValue) return null;
    const fields = 'description,name,source_database';
    const query = encodeURIComponent(getQueryTerm(searchValue));
    const params = `?query=${query}&format=json&fields=${fields}`;
    return `${protocol}//${hostname}:${port}${root}${params}`;
  },
);
const mapStateToProps = createSelector(
  getEbiSearchUrl,
  downloadSelector,
  (_, { fileType }) => fileType,
  (url, downloads, fileType) => ({
    url,
    download: downloads[[url, fileType].filter(Boolean).join('|')] || {},
  }),
);

export default connect(mapStateToProps, { downloadURL })(FileExporter);
