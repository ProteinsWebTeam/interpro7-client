import { useEffect } from 'react';

import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

type Props = {
  onSearchComplete: (payload?: TaxonommyTreePayload | null) => void;
};
interface LoadedProps extends Props, LoadDataProps<TaxonommyTreePayload> {}

const ExactMatchSearch = ({ data, onSearchComplete }: LoadedProps) => {
  useEffect(() => {
    onSearchComplete(data && !data.loading ? data.payload : null);
  });
  return null;
};

const getURLFromState = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search as { search: string },
  ({ protocol, hostname, port, root }, description, { search }) => {
    if (search && search.match(/^\d+$/)) {
      const desc = {
        ...description,
        taxonomy: {
          db: 'uniprot',
          accession: search,
        },
      };
      try {
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(desc),
        });
      } catch {
        return;
      }
    } else if (search && search.match(/^[\w ]+$/)) {
      try {
        return format({
          protocol,
          hostname,
          port,
          pathname: root + descriptionToPath(description),
          search: `?scientific_name=${search}`,
        });
      } catch {
        return;
      }
    }
  },
);

export default loadData(getURLFromState as LoadDataParameters)(
  ExactMatchSearch,
);
