import React from 'react';
import File from 'components/File';
import { SupportedExtensions } from 'components/File/FileButton';

type Props = {
  description: InterProDescription;
  count: number;
  ida: string;
  fileType: SupportedExtensions;
  db: string;
};

const AllProteinDownload = ({
  description,
  count,
  ida,
  fileType,
  db,
}: Props) => (
  <File
    fileType={fileType}
    name={`protein-similar-to-${
      description[description.main.key as Endpoint].accession
    }.${fileType}`}
    count={count}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: db },
    }}
    search={{ ida }}
    endpoint="protein"
  />
);

export default AllProteinDownload;
