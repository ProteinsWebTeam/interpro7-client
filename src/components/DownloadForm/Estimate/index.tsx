import React from 'react';
import { filesize } from 'filesize';

import NumberComponent from 'components/NumberComponent';

const NO_CONTENT = 204;

const getText = (
  {
    loading,
    payload,
    ok,
    status,
    headers,
  }: RequestedData<PayloadList<unknown>>,
  isStale: boolean,
) => {
  if (loading || isStale) return 'Calculating estimate…';

  if (!ok) return 'There was an error whilst fetching data.';

  if (status === NO_CONTENT) {
    return 'No data associated with this query.';
  }

  if (!payload) return 'An unexpected error was encountered.';

  const count = payload.count;
  if (count) {
    return (
      <>
        Your file will contain <NumberComponent abbr>{count}</NumberComponent>{' '}
        item
        {count > 1 ? 's' : ''}.
      </>
    );
  }

  let size = +(headers?.get('content-length') || 0);
  if (!size) {
    size = JSON.stringify(payload, null, 2).length;
  }
  if (size && Number.isFinite(size)) {
    const [value, suffix] = filesize(size, {
      round: 0,
      standard: 'iec',
      output: 'array',
    });
    return (
      <>
        Your file size will be <NumberComponent>{value}</NumberComponent>{' '}
        {suffix}
      </>
    );
  }

  return 'No estimate available.';
};

interface LoadedProps extends LoadDataProps<PayloadList<unknown>> {}

const Estimate = ({ data, isStale }: LoadedProps) => {
  if (!data) return null;
  return (
    <section>
      <h6>Estimate</h6>
      {getText(data, !!isStale)}
    </section>
  );
};

export default Estimate;
