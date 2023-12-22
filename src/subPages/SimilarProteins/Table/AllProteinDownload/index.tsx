import React from 'react';
import File from 'components/File';
import { SupportedExtensions } from 'components/File/FileButton';

import cssBinder from 'styles/cssBinder';

import local from './style.css';

const css = cssBinder(local);
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
      (description[description.main.key] as EndpointLocation).accession
    }.${fileType}`}
    count={count}
    customLocationDescription={{
      main: { key: 'protein' },
      protein: { db: db },
    }}
    search={{ ida }}
    endpoint="protein"
    className={css('generate-button')}
  />
);

export default AllProteinDownload;
