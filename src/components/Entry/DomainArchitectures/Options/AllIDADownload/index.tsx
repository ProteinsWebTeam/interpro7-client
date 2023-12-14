import React from 'react';
import File from 'components/File';
import { SupportedExtensions } from 'components/File/FileButton';

import cssBinder from 'styles/cssBinder';

import exporterStyle from 'components/Table/Exporter/style.css';

const css = cssBinder(exporterStyle);

type Props = {
  search: Record<string, string>;
  count: number;
  fileType: SupportedExtensions;
};

const AllIDADownload = ({ search, fileType, count }: Props) => (
  <File
    fileType={fileType}
    name={`ida-search-results.${fileType}`}
    count={count}
    customLocationDescription={{
      main: { key: 'entry' },
    }}
    search={search}
    endpoint="ida"
    className={css('generate-button')}
  />
);

export default AllIDADownload;
