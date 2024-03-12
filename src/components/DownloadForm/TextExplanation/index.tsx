import React, { ReactNode } from 'react';
import { noop } from 'lodash-es';

import NumberComComponent from 'components/NumberComponent';
import { toPlural } from 'utils/pages/toPlural';

import { format2label } from '../FormatSelector';

const getMainFragment = (
  description: InterProPartialDescription,
  count: number,
) => {
  const main = description.main?.key;
  if (!main) return null;
  const { db, integration, accession } = description[
    main
  ] as EndpointPartialLocation;
  if (accession) {
    return (
      <>
        <b>metadata</b> about <b>{db}</b> <b>{main}</b> with accession{' '}
        <b>{accession}</b>
      </>
    );
  }
  if (db && integration) {
    return (
      <>
        <b>a list</b> of approximately{' '}
        <NumberComComponent abbr>{count}</NumberComComponent>{' '}
        {integration !== 'all' && (
          <>
            <b>{integration}</b>{' '}
          </>
        )}
        <b>{db}</b> <b>{toPlural(main)}</b>
      </>
    );
  }
  if (db || integration) {
    return (
      <>
        <b>a list</b> of approximately{' '}
        <NumberComComponent abbr>{count}</NumberComComponent>{' '}
        <b>{db || integration}</b> <b>{toPlural(main)}</b>
      </>
    );
  }
  return (
    <>
      <b>a list of counts</b> of <b>{toPlural(main)}</b> from each data source
      in InterPro
    </>
  );
};

const getFilterFragment = (type: string, location: EndpointPartialLocation) => {
  if (!location) return null;
  const { db, integration, accession } = location;
  if (accession) {
    return (
      <>
        the <b>{db}</b> <b>{type === 'taxonomy' ? 'taxon' : type}</b> with
        accession <b>{accession}</b>
      </>
    );
  }
  if (db && integration) {
    return (
      <>
        any of the{' '}
        {integration !== 'all' && (
          <>
            <b>{integration}</b>{' '}
          </>
        )}
        <b>{db}</b> <b>{toPlural(type)}</b>
      </>
    );
  }
  if (db || (integration && integration !== 'all')) {
    return (
      <>
        any <b>{db || integration}</b> <b>{toPlural(type)}</b>
      </>
    );
  }
  return (
    <>
      any <b>{type === 'taxonomy' ? 'taxon' : type}</b>
    </>
  );
};

const getFilters = (description: InterProPartialDescription) =>
  Object.entries(description)
    .filter(([, desc]) => (desc as EndpointPartialLocation).isFilter)
    .map(([type, desc], i, { length }) => (
      // This logic is to have `join` between the different filters correct in
      // english (proper use of `,`, `and`, and `, and`)
      <React.Fragment key={type}>
        {i > 0 && length > 2 && ', '}
        {i === length - 1 && i > 0 && ' and '}
        {getFilterFragment(type, desc as EndpointPartialLocation)}
      </React.Fragment>
    ));

type Props = {
  fileType: keyof typeof format2label;
  description: InterProPartialDescription;
  subset: boolean;
  isStale: boolean;
  noData: boolean;
  count: number;
};

const TextExplanation = ({
  fileType,
  description,
  subset,
  isStale,
  count,
  noData,
}: Props) => {
  const filters = getFilters(description);
  let filterText: ReactNode = '';
  if (filters.length) {
    filterText = <> which match with {filters}</>;
  }

  let explanation: ReactNode;
  if (isStale) {
    explanation = <p>Preparing data...</p>;
  } else {
    if (noData) {
      explanation = <p>No data matches the selected set of filters</p>;
    } else {
      explanation = (
        <p>
          This <b>{format2label[fileType || 'accession']}</b> file will contain{' '}
          {getMainFragment(description, count)} {filterText}.
        </p>
      );
      fileType === 'fasta' &&
        description?.entry?.isFilter &&
        description?.entry?.accession && (
          <label>
            <input
              name="subset"
              type="checkbox"
              checked={subset}
              onChange={noop}
              onBlur={noop}
            />
            I&apos;m only interested in the part(s) of the sequence matching (1
            subsequence with all the fragments for every match)
          </label>
        );
    }
  }
  return (
    <section>
      <h6>Explanation</h6>
      {explanation}
    </section>
  );
};

export default TextExplanation;
