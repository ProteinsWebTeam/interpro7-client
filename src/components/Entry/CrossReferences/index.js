import React from 'react';
import T from 'prop-types';

import AnimatedEntry from 'components/AnimatedEntry';
import Link from 'components/generic/Link';

const ReferenceItem = ({ url, accession }) =>
  <li>
    <Link href={url}>
      {accession}
    </Link>
  </li>;
ReferenceItem.propTypes = {
  url: T.string.isRequired,
  accession: T.string.isRequired,
};

const ReferenceSection = ({ accessions, name, description }) =>
  <li>
    <h3>
      {name}
    </h3>
    <div>
      {description}
    </div>
    <ul>
      {accessions.map(({ accession, url }) =>
        <ReferenceItem key={accession} accession={accession} url={url} />,
      )}
    </ul>
  </li>;
ReferenceSection.propTypes = {
  accessions: T.array.isRequired,
  name: T.string.isRequired,
  description: T.string.isRequired,
};

const CrossReferences = ({ xRefs }) => {
  const databases = Object.entries(xRefs).sort(([a], [b]) => a.rank - b.rank);
  return (
    <div>
      <ul>
        <AnimatedEntry className="cross_references">
          {databases.map(
            ([database, { displayName, description, accessions }]) =>
              <ReferenceSection
                key={database}
                name={displayName}
                description={description}
                accessions={accessions}
              />,
          )}
        </AnimatedEntry>
      </ul>
    </div>
  );
};
CrossReferences.propTypes = {
  xRefs: T.object.isRequired,
};

export default CrossReferences;
