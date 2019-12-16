import React from 'react';
import T from 'prop-types';
import File from 'components/File';

const endpoint = {
  protein: {
    entry: 'proteinEntry',
    structure: 'proteinStructure',
  },
  structure: {
    entry: 'structureEntry',
    protein: 'structureProtein',
  },
  entry: {
    protein: 'entryProtein',
    structure: 'entryStructure',
  },
};

const FileExporter = (
  {
    description,
    search = {},
    count,
    fileType,
    primary,
    secondary,
    label,
    className,
  } /*: {description: Object, search: Object, count: number, fileType: string, primary: string, secondary: string, label?: string, className?: string} */,
) => (
  <li style={{ display: 'flex', alignItems: 'center' }}>
    <div>
      <File
        className={className}
        fileType={fileType}
        name={`${primary}-matching-${description[description.main.key].accession}.${fileType}`}
        count={count}
        customLocationDescription={{
          ...description,
          main: { key: primary },
          [primary]: { ...description[primary], isFilter: false },
          [description.main.key]: {
            ...description[description.main.key],
            isFilter: true,
          },
        }}
        search={{
          ...search,
          extra_fields: `counters${
            search.extra_fields ? `,${search.extra_fields}` : ''
          }`,
        }}
        endpoint={
          (endpoint[primary] && endpoint[primary][secondary]) || primary
        }
        label={label || fileType.toUpperCase()}
      />
    </div>
  </li>
);
FileExporter.propTypes = {
  description: T.object,
  search: T.object,
  count: T.number,
  fileType: T.string,
  primary: T.string,
  secondary: T.string,
  label: T.string,
  className: T.string,
};

export default FileExporter;
