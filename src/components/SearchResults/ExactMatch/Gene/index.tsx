import React, { Fragment, useState } from 'react';

import Link from 'components/generic/Link';
import Callout from 'components/SimpleCommonComponents/Callout';
import Button from 'components/SimpleCommonComponents/Button';

const NUMBER_OF_PROTEINS_TO_SHOW = 5;

const ListOfProteins = ({ accessions }: { accessions: string[] }) => {
  const [showMore, setShowMore] = useState(false);
  const accessions2show =
    accessions.length < NUMBER_OF_PROTEINS_TO_SHOW || showMore
      ? accessions
      : accessions.slice(0, NUMBER_OF_PROTEINS_TO_SHOW);
  return (
    <>
      {accessions2show.map((accession, i) => (
        <Fragment key={accession}>
          {i > 0 ? ', ' : ''}
          <Link
            to={{
              description: {
                main: { key: 'protein' },
                protein: { db: 'uniprot', accession },
              },
            }}
          >
            {accession}
          </Link>
        </Fragment>
      ))}
      {accessions.length > NUMBER_OF_PROTEINS_TO_SHOW && !showMore && (
        <Button type="inline" onClick={() => setShowMore(true)}>
          ... and {accessions.length - NUMBER_OF_PROTEINS_TO_SHOW} proteins more
          (click to show).
        </Button>
      )}
    </>
  );
};

type Props = {
  matches: Array<{
    accessions: string[];
    name: string;
  }>;
  gene: string;
};
const ExactGeneMatchWrapper = ({ matches, gene }: Props) => (
  <Callout type="warning" icon="icon-arrow-alt-circle-right">
    <span>
      Found an exact gene match for <b>{gene}</b> in the following key species:
    </span>{' '}
    <ul>
      {matches.map(({ accessions, name }) => (
        <li key={name}>
          <b>{name}</b>: <ListOfProteins accessions={accessions} />
        </li>
      ))}
    </ul>
  </Callout>
);

export default ExactGeneMatchWrapper;
