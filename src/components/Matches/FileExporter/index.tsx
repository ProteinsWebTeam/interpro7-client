import React from 'react';
import File from 'components/File';
import { SupportedExtensions } from 'components/File/FileButton';

type SupportedEndpoints = 'entry' | 'protein' | 'structure';
const endpoint: Record<
  SupportedEndpoints,
  Record<SupportedEndpoints, string | undefined>
> = {
  protein: {
    entry: 'proteinEntry',
    protein: undefined,
    structure: 'proteinStructure',
  },
  structure: {
    entry: 'structureEntry',
    protein: 'structureProtein',
    structure: undefined,
  },
  entry: {
    entry: undefined,
    protein: 'entryProtein',
    structure: 'entryStructure',
  },
};

type Props = {
  description: InterProPartialDescription;
  search?: {
    extra_fields?: string;
  };
  count: number;
  minWidth?: number | string;
  fileType: SupportedExtensions;
  primary: SupportedEndpoints;
  secondary: SupportedEndpoints;
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
  focused = null,
  minWidth,
}: Props) => {
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
      name={`${primary}-matching-${
        (description[description.main.key] as EndpointLocation).accession
      }.${fileType}`}
      count={count}
      customLocationDescription={customLocationDescription}
      search={{
        ...search,
        extra_fields: `counters${
          search.extra_fields ? `,${search.extra_fields}` : ''
        }`,
      }}
      endpoint={(endpoint?.[primary]?.[secondary] as string) || primary}
      minWidth={minWidth}
    />
  );
};

export default FileExporter;
