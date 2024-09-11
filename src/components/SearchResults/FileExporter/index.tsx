import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { downloadURL } from 'actions/creators';

import { getQueryTerm } from 'components/SearchResults';
import FileButton, { SupportedExtensions } from 'components/File/FileButton';
import blockEvent from 'utils/block-event';

type Props = {
  count?: number;
  fileType: SupportedExtensions;
  name: string;
  className?: string;
  url: string;
  downloadURL: typeof downloadURL;
  download: {
    progress: number;
    successful?: boolean;
    blobURL?: string;
  };
};

const FileExporter = ({
  count = Infinity,
  fileType,
  name,
  className,
  url,
  downloadURL,
  download,
}: Props) => {
  const _handleClick = blockEvent(() => {
    downloadURL(url, fileType, false, 'ebisearch');
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

const getEbiSearchUrl = createSelector(
  (state: GlobalState) => state.settings.ebi,
  (state: GlobalState) => state.customLocation.description.search.value,
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
  (state: GlobalState) => state.download,
  (_, { fileType }) => fileType,
  (url, downloads, fileType) => ({
    url,
    download: downloads[[url, fileType].filter(Boolean).join('|')] || {},
  }),
);

export default connect(mapStateToProps, { downloadURL })(FileExporter);
