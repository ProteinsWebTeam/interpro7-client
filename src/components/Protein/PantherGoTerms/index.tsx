import React, { useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData/ts';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import GoTerms from 'components/GoTerms';
import Loading from 'components/SimpleCommonComponents/Loading';

import cssBinder from 'styles/cssBinder';
import local from './style.css';
const css = cssBinder(local);

type PropsSF = {
  subfamily: string;
  onFoundGOTerms: () => void;
};
interface LoadedPropsSF
  extends PropsSF,
    LoadDataProps<{ metadata: EntryMetadata }> {}

const PantherSFGoTermsWithData = ({
  data,
  onFoundGOTerms = () => null,
}: LoadedPropsSF) => {
  const { loading, payload } = data || {};
  useEffect(() => {
    if (payload?.metadata?.go_terms?.length) onFoundGOTerms();
  }, [payload?.metadata?.go_terms]);
  if (loading) return <Loading inline={true} />;

  return payload?.metadata?.go_terms?.length ? (
    <details className={css('go-terms')}>
      <summary>{payload.metadata.accession}</summary>
      <GoTerms
        terms={payload?.metadata.go_terms}
        type="protein"
        withoutTitle={true}
      />
    </details>
  ) : null;
};

const getUrl = createSelector(
  (state: GlobalState) => state.settings.api,
  (_: GlobalState, props: PropsSF) => props.subfamily,
  ({ protocol, hostname, port, root }: ParsedURLServer, subfamily) => {
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'entry' },
          entry: { db: 'panther', accession: subfamily },
        }),
      query: {
        subfamily: '',
      },
    });
  },
);

const PantherSFGoTerms = loadData(getUrl as LoadDataParameters)(
  PantherSFGoTermsWithData,
);

type Props = {
  subfamilies?: string[];
};

const PantherGoTerms = ({ subfamilies }: Props) => {
  const [hasGOTerms, setHasGOTerms] = useState(false);
  useEffect(() => {
    setHasGOTerms(false);
  }, [subfamilies]);
  if (!subfamilies?.length) return null;
  return (
    <section>
      {hasGOTerms && <h5>Panther GO terms</h5>}
      {subfamilies.map((sf) => (
        <PantherSFGoTerms
          key={sf}
          subfamily={sf}
          onFoundGOTerms={() => setHasGOTerms(true)}
        />
      ))}
    </section>
  );
};

export default PantherGoTerms;
