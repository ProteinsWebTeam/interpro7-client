import React from 'react';
import File from 'components/File';
import { SupportedExtensions } from 'components/File/FileButton';
import { getNeededCountersForSubpages } from 'higherOrder/loadData/defaults/relatedCounters';

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
  search?: InterProLocationSearch;
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
  if (!description?.main) return null;
  const customLocationDescription = {
    ...description,
    main: { key: primary },
    [primary]: { ...description[primary], isFilter: false },
    [description.main.key!]: {
      ...description[description.main.key as Endpoint],
      isFilter: true,
    },
  };
  if (focused && +focused !== 1 && customLocationDescription.taxonomy) {
    customLocationDescription.taxonomy.accession = focused;
  }
  /*
   * Not a mistake: the filtering/secondary endpoint in the client (subpage)
   * becomes the main endpoint when exporting data.
   * e.g. InterPro entry IPR000001 > Proteins
   *   client: `/entry/interpro/IPR000001/protein/uniprot`
   *   export: `/api/protein/uniprot/entry/interpro/IPR000001/`
   */
  const counters = getNeededCountersForSubpages(secondary, primary, true);
  const extraFields = `${counters}${search.extra_fields || ''}` || undefined;
  const newSearch = { ...search };
  if (extraFields) newSearch.extra_fields = extraFields;
  return (
    <File
      className={className}
      fileType={fileType}
      name={`${primary}-matching-${
        description?.[description.main.key as Endpoint]?.accession || ''
      }.${fileType}`}
      count={count}
      customLocationDescription={customLocationDescription}
      search={newSearch}
      endpoint={(endpoint?.[primary]?.[secondary] as string) || primary}
      minWidth={minWidth}
      label={label}
    />
  );
};

export default FileExporter;
