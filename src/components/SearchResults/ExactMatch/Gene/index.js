// @flow
import React, { Fragment, useState } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';
// $FlowFixMe
import Callout from 'components/SimpleCommonComponents/Callout';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

const NUMBER_OF_PROTEINS_TO_SHOW = 2;

const ListOfProteins = ({ accessions } /*: {accessions: string[]} */) => {
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
ListOfProteins.propTypes = {
  accessions: T.arrayOf(T.string),
};

/*:: type EMGWProps = {
  matches: {
    accessions: string[],
    name: string,
  },
  gene: string,
}; */
const ExactGeneMatchWrapper = ({ matches, gene }) => (
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
ExactGeneMatchWrapper.propTypes = {
  matches: T.arrayOf(
    T.shape({
      accessions: T.arrayOf(T.string),
      name: T.string,
    }),
  ),
  gene: T.string,
};

export default ExactGeneMatchWrapper;
