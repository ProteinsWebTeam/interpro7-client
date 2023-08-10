import React from 'react';
import Positions from '../Positions';
import Link from 'components/generic/Link';

export type DomainDetails = {
  feature: {
    accession: string;
    color: string;
    integrated: string;
    length: number;
    protein: string;
    short_name: string;
    source_database: string;
    locations: Array<ProtVistaLocation>;
  };
};
type Props = {
  detail: DomainDetails;
};

const DomainPopup = ({ detail }: Props) => {
  const {
    locations,
    accession,
    source_database,
    integrated,
    protein,
    short_name,
  } = detail.feature;
  return (
    <section>
      <h5>
        {source_database}:{' '}
        <Link
          to={{
            description: {
              main: { key: 'entry' },
              entry: { db: source_database, accession },
            },
          }}
        >
          <span style={{ color: 'white' }}>{accession}</span>
        </Link>
      </h5>
      {short_name ? <h6>{short_name}</h6> : null}
      {integrated ? (
        <h6>
          Integrated:{' '}
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: { db: 'interpro', accession: integrated },
              },
            }}
          >
            <span style={{ color: 'white' }}>{integrated}</span>
          </Link>
        </h6>
      ) : null}

      {locations.map(({ fragments }, i) => (
        <div key={i}>
          <Positions fragments={fragments} protein={protein} key={i} />
        </div>
      ))}
    </section>
  );
};
export default DomainPopup;
