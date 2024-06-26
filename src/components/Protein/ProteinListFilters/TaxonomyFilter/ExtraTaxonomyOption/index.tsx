import React, { FormEvent } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import TaxonomyOption from '../TaxonomyOption';

type OptionProps = {
  taxId: string;
  checked?: boolean;
  onChange: (event: FormEvent) => void;
};
interface OptionsLoadedProps
  extends OptionProps,
    LoadDataProps<MetadataPayload<TaxonomyMetadata>> {}

const ExtraTaxonomyOption = ({
  taxId,
  checked,
  data,
  isStale,
  onChange,
}: OptionsLoadedProps) => (
  <TaxonomyOption
    taxId={taxId}
    checked={!!checked}
    title={
      (typeof data?.payload?.metadata?.name === 'string'
        ? data?.payload?.metadata?.name
        : data?.payload?.metadata?.name?.name) || taxId
    }
    onChange={onChange}
    isStale={!!isStale}
    loading={data!.loading}
  />
);

const getUrlForMetadata = createSelector(
  (state: GlobalState) => state.settings.api,
  (_, props) => props.taxId,
  ({ protocol, hostname, port, root }, accession) =>
    format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'taxonomy' },
          taxonomy: { db: 'uniprot', accession },
        }),
    }),
);
export default loadData<MetadataPayload<TaxonomyMetadata>>(getUrlForMetadata)(
  ExtraTaxonomyOption,
);
