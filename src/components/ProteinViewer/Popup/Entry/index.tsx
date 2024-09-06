import React from 'react';

import Positions from '../Positions';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';
import ipro from 'styles/interpro-vf.css';
import localCSS from './style.css';

const css = cssBinder(ipro, localCSS);
export type EntryDetail = {
  target?: HTMLElement;
  feature?: {
    accession: string;
    integrated: string;
    description: string;
    name: string;
    type: string;
    entry: string;
    protein?: string;
    parent?: { protein?: string };
    locations: Array<ProtVistaLocation>;
    confidence?: string;
  };
  highlight: string;
};
type Props = {
  detail: EntryDetail;
  sourceDatabase: string;
  currentLocation: InterProLocation;
};
const getSecondaryStructureType = (locations: Array<ProtVistaLocation>) => {
  let type = '';
  if (locations && locations.length > 0) {
    if (locations[0].fragments && locations[0].fragments[0]) {
      const shape = locations[0].fragments[0].shape || '';
      type = shape.charAt(0).toUpperCase() + shape.slice(1);
    }
  }
  return type;
};

const ProtVistaEntryPopup = ({
  detail,
  sourceDatabase,
  currentLocation,
}: Props) => {
  const {
    accession,
    description,
    name,
    type: originalType,
    entry,
    locations,
    confidence,
  } = detail?.feature || {};
  const isInterPro = sourceDatabase.toLowerCase() === 'interpro';
  const integrated = detail.feature?.integrated;

  // To include the type of fragment of the secondary structure
  let type = originalType;
  if (originalType === 'secondary_structure' && locations) {
    type = `Secondary Structure: ${getSecondaryStructureType(locations)}`;
  }

  // To only show the location of the currntly selected fragment
  const highlightChild =
    detail.target &&
    detail.target.classList.contains('child-fragment') &&
    detail.highlight;
  let newLocations = null;
  if (highlightChild) {
    newLocations = highlightChild.split(',').map((loc: string) => {
      const [start, end] = loc.split(':').map(Number);
      return {
        fragments: [{ start, end }],
        model_acc: null,
        subfamily: locations?.[0]?.subfamily,
      };
    });
  }
  const protein =
    currentLocation?.description?.protein?.accession ||
    detail?.feature?.protein ||
    detail?.feature?.parent?.protein;
  return (
    <section className={css('entry-popup')}>
      <h6>
        <div className={css('pop-wrapper')}>
          <div>
            {isInterPro && (
              <interpro-type
                type={(type || '').replace('_', ' ')}
                dimension="1.4em"
                aria-label="Entry type"
              />
            )}
          </div>
          <div>{sourceDatabase}</div>
          <div>
            {accession?.startsWith('residue:')
              ? accession.split('residue:')[1]?.replace('PIRSF', 'PIRSR')
              : accession}
          </div>
        </div>{' '}
      </h6>

      {name && <h6 className={css('title')}>{name}</h6>}
      {description && <p>[{description}]</p>}

      {entry && (
        <p>
          <small>({entry})</small>
        </p>
      )}

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
      <ul>
        {(newLocations || locations || []).map(
          ({ fragments, model_acc: model, subfamily }, j) => (
            <li key={j}>
              {model && model !== accession && <>Model: {model}</>}
              {subfamily && (
                <div className={css('subfamily')}>
                  <header>Subfamily</header>
                  <ul>
                    <li>
                      <header>Accession:</header> {subfamily.accession}
                    </li>
                    <li>
                      <header>Name:</header> {subfamily.name}
                    </li>
                  </ul>
                </div>
              )}
              <Positions fragments={fragments} protein={protein} />
            </li>
          ),
        )}
      </ul>
      {confidence && <p>Confidence: {confidence}</p>}
    </section>
  );
};

export default ProtVistaEntryPopup;
