import React from 'react';
import File from 'components/File';
import { SupportedExtensions } from 'components/File/FileButton';

const endpoint: Partial<
  Record<Endpoint, Partial<Record<Endpoint, string | undefined>>>
> = {
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

type Props = {
  description?: InterProPartialDescription;
  search?: {
    extra_fields?: string;
  };
  count: number;
  minWidth?: number | string;
  fileType: SupportedExtensions;
  primary: Endpoint;
  secondary: Endpoint;
  label?: string;
  focused?: string | null;
  className?: string;
};
const FileExporter = ({
  description,
  search = {},
  count,
  fileType,
  primary,
  secondary,
  className,
  label,
  focused = null,
  minWidth,
}: Props) => {
  if (!description) return null;
  const customLocationDescription = {
    ...description,
    main: { key: primary },
    [primary]: { ...description[primary], isFilter: false },
    [description.main.key]: {
      ...description[description.main.key],
      isFilter: true,
    },
  };
  if (focused && +focused !== 1 && customLocationDescription.taxonomy) {
    customLocationDescription.taxonomy.accession = focused;
  }
  return (
    <File
      className={className}
      fileType={fileType}
      name={`${primary}-matching-${(description[description.main.key] as EndpointLocation).accession
        }.${fileType}`}
      count={count}
      customLocationDescription={customLocationDescription}
      search={{
        ...search,
        extra_fields: `counters${search.extra_fields ? `,${search.extra_fields}` : ''
          }`,
      }}
      endpoint={(endpoint?.[primary]?.[secondary] as string) || primary}
      minWidth={minWidth}
      label={label}
    />
  );
};

export default FileExporter;
