// @flow
import React from 'react';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import FullyLoadedTable from 'components/Table/FullyLoadedTable';
import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import f from 'styles/foundation';

const SubfamiliesSubpage = (
  { data } /*: {data: {loading: boolean, payload: ?Object}}*/,
) => {
  if (data.loading) return <Loading />;
  const _data = (data?.payload?.results || []).map(
    ({ metadata: { accession, name } }) => ({
      accession,
      name,
    }),
  );

  return (
    <section>
      {_data.length && (
        <FullyLoadedTable
          data={_data}
          renderers={{
            accession: (accession) => (
              <Link
                target="_blank"
                className={f('ext')}
                href={`http://www.pantherdb.org/panther/family.do?clsAccession=${accession.toUpperCase()}`}
              >
                {accession}
              </Link>
            ),
            name: (name, { accession }) => (
              <Link
                target="_blank"
                className={f('ext')}
                href={`http://www.pantherdb.org/panther/family.do?clsAccession=${accession.toUpperCase()}`}
              >
                {name}
              </Link>
            ),
          }}
        />
      )}
    </section>
  );
};
SubfamiliesSubpage.propTypes = {
  data: dataPropType,
};

export default SubfamiliesSubpage;
