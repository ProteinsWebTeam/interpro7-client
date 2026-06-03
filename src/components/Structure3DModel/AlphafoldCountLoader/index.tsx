import { useEffect } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import { setAlphafoldModelCount } from 'actions/creators';

type Props = {
  accession: string;
  setAlphafoldModelCount: (accession: string, count: number) => void;
};
interface LoadedProps extends Props, LoadDataProps<MultimerAlphafoldPayload> {}

const AlphafoldCountLoader = ({
  data,
  accession,
  setAlphafoldModelCount,
}: LoadedProps) => {
  useEffect(() => {
    if (!data?.loading && data?.payload) {
      setAlphafoldModelCount(accession, data.payload.docs.length);
    }
  }, [data]);
  return null;
};

const getAlphafoldModelsUrl = createSelector(
  (state: GlobalState) => state.settings.alphafold,
  (_: GlobalState, props?: Props) => props?.accession,
  (
    { protocol, hostname, port, root }: ParsedURLServer,
    accession: string | undefined,
  ) => {
    if (!accession) return null;
    return format({
      protocol,
      hostname,
      port,
      pathname: `${root}api/search`,
      search: `?q=(uniprotAccession:${accession})&type=main&start=0&rows=100`,
    });
  },
);

export default connect(null, { setAlphafoldModelCount })(
  loadData(getAlphafoldModelsUrl as LoadDataParameters)(AlphafoldCountLoader),
);
