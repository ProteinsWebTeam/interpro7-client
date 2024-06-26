import React from 'react';
import { cloneDeep } from 'lodash-es';
import { SupportedExtensions } from 'components/File/FileButton';

import File from 'components/File';

type Props = {
  description: InterProDescription;
  search: InterProLocationSearch;
  count: number;
  focused?: string | null;
  fileType: SupportedExtensions;
  name?: string;
};

const AllTaxDownload = ({
  description,
  search,
  count,
  focused,
  fileType,
  name,
}: Props) => {
  const newDescription = cloneDeep(description);
  if (focused) {
    newDescription.taxonomy.accession = focused;
  }
  return (
    <File
      fileType={fileType}
      name={name || `taxon.${fileType}`}
      count={count}
      customLocationDescription={newDescription}
      search={{ ...search, extra_fields: 'counters:entry-protein' }}
      endpoint={'taxonomy'}
    />
  );
};

export default AllTaxDownload;
