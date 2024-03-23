import React from 'react';

import Link from 'components/generic/Link';

type Props = { url: string };

const ApiLink = ({ url }: Props) => {
  return (
    <section>
      <h6>Corresponding API call</h6>
      <p>
        <Link href={url} target="_blank">
          <code>{url}</code>
        </Link>
      </p>
    </section>
  );
};

export default ApiLink;
