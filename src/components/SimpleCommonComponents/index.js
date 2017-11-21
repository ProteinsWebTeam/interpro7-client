// @flow
import React, { createElement } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import { PDBeLink, UniProtLink } from 'components/ExtLink';
import { foundationPartial } from 'styles/foundation';

import global from 'styles/global.css';
const f = foundationPartial(global);

export const Name = (
  {
    name: { name, short },
    accession,
  } /*: {name: {name: string, short?: string}, accession: string} */,
) => (
  <div>
    <h3>
      {name} ({accession})
    </h3>
    {short && <p style={{ color: 'gray' }}>Short name: {short}</p>}
  </div>
);
Name.propTypes = {
  name: T.shape({
    short: T.string,
    name: T.string.isRequired,
  }).isRequired,
  accession: T.string.isRequired,
};

const extOriginDBLookup = {
  pdb: {
    nicerName: 'PDBe',
    component: PDBeLink,
  },
  reviewed: {
    nicerName: 'reviewed',
    component: UniProtLink,
  },
  unreviewed: {
    nicerName: 'unreviewed',
    component: UniProtLink,
  },
};

export const ExtOriginDB = (
  { source, accession } /*: {source: string, accession: string | number} */,
) => {
  const desc = extOriginDBLookup[source.toLowerCase()];
  if (!desc) return null;
  return createElement(desc.component, { id: accession }, [
    `(${desc.nicerName || source} external link)`,
  ]);
};
ExtOriginDB.propTypes = {
  source: T.string.isRequired,
  accession: T.oneOfType([T.string, T.number]).isRequired,
};

export const OriginDB = (
  { source, accession } /*: {source: string, accession: string | number} */,
) => (
  <p>
    Source DB:{' '}
    <Link
      newTo={location => ({
        ...location,
        description: {
          mainType: location.description.mainType,
          mainDB: source,
        },
      })}
    >
      {source}
    </Link>{' '}
    <ExtOriginDB source={source} accession={accession} />
  </p>
);
OriginDB.propTypes = {
  source: T.string.isRequired,
  accession: T.oneOfType([T.string, T.number]).isRequired,
};

export const HighlightedText = ({ text, textToHighlight = '' }) =>
  textToHighlight ? (
    <span>
      {text
        .toString()
        .split(new RegExp(`(${textToHighlight})`, 'i'))
        .map(
          (e, i) =>
            e.toLowerCase() === textToHighlight.toLowerCase() ? (
              <mark key={i}>{e}</mark>
            ) : (
              <span key={i}>{e}</span>
            ),
        )}
    </span>
  ) : (
    text
  );
HighlightedText.propTypes = {
  text: T.oneOfType([T.string, T.number]).isRequired,
  textToHighlight: T.string,
};

export const Loading = () => (
  <div className={f('row')}>
    <div className={f('columns')}>
      {' '}
      LOADING!!!!
      <div className={f('loading-spinner')}>
        <div className={f('rd1')} />
        <div className={f('rd2')} />
        <div className={f('rd3')} />
      </div>
    </div>
  </div>
);
