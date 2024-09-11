import React from 'react';

import File from 'components/File';
import { SupportedExtensions } from 'components/File/FileButton';

type AllSetDownloadProps = {
  description: InterProDescription;
  search: InterProLocationSearch;
  count: number;
  fileType: SupportedExtensions;
  name?: string;
};

const AllSetDownload = ({
  description,
  search,
  count,
  fileType,
  name,
}: AllSetDownloadProps) => (
  <>
    <File
      fileType={fileType}
      name={name || `sets.${fileType}`}
      count={count}
      customLocationDescription={description}
      search={{ ...search, extra_fields: 'counters:entry-protein' }}
      endpoint={'set'}
    />
  </>
);

export default AllSetDownload;
