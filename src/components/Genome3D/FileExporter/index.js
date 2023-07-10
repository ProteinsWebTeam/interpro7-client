// @flow
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import { downloadSelector } from 'reducers/download';
import { downloadURL } from 'actions/creators';

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
    downloadURL(url, fileType, null, 'genome3d');
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

const getGenome3dURL = createSelector(
  (state) => state.settings.genome3d,
  (state) => state.customLocation.description.entry.accession,
  ({ protocol, hostname, port, root }, accession) => {
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}interpro/ipr/${accession}`,
    });
  },
);
const mapStateToProps = createSelector(
  getGenome3dURL,
  downloadSelector,
  (_, { fileType }) => fileType,
  (url, downloads, fileType) => ({
    url,
    download: downloads[[url, fileType].filter(Boolean).join('|')] || {},
  }),
);

export default connect(mapStateToProps, { downloadURL })(FileExporter);
