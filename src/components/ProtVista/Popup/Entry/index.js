// @flow
import React from 'react';
import T from 'prop-types';

import { cloneDeep } from 'lodash-es';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import localCSS from '../../style.css';

const f = foundationPartial(ipro, localCSS);

/*::
  import type {ProtVistaLocation, PopupDetail} from '../index.js';

  type Props = {
    detail: PopupDetail,
    sourceDatabase: string,
    goToCustomLocation: function,
    currentLocation: Object,

  }
*/
const getSecondaryStructureType = (
  locations /*: Array<ProtVistaLocation> */,
) => {
  let type = '';
  if (locations && locations.length > 0) {
    if (locations[0].fragments && locations[0].fragments[0]) {
      const shape = locations[0].fragments[0].shape || '';
      type = shape.charAt(0).toUpperCase() + shape.slice(1);
    }
  }
  return type;
};

const ProtVistaEntryPopup = (
  { detail, sourceDatabase, goToCustomLocation, currentLocation } /*: Props */,
) => {
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
    newLocations = highlightChild.split(',').map((loc) => {
      const [start, end] = loc.split(':');
      return {
        fragments: [{ start, end }],
        model_acc: null,
        subfamily: undefined,
      };
    });
  }
  const handleClick = (start, end) => () => {
    const newLocation = cloneDeep(currentLocation);
    newLocation.description[newLocation.description.main.key].detail =
      'sequence';
    newLocation.hash = `${start}-${end}`;
    goToCustomLocation(newLocation);
  };
  return (
    <section>
      <h6>
        {accession.startsWith('residue:')
          ? accession.split('residue:')[1]?.replace('PIRSF', 'PIRSR')
          : accession}
        {description && <p>[{description}]</p>}
      </h6>

      {name && <h4>{name}</h4>}

      <div className={f('pop-wrapper')}>
        <div>
          {isInterPro && (
            <interpro-type
              type={type.replace('_', ' ')}
              dimension="1.4em"
              aria-label="Entry type"
            />
          )}
        </div>
        <div>
          {sourceDatabase} {(type || '').replace('_', ' ')}
        </div>
      </div>
      <p>
        <small>{entry && <>({entry})</>}</small>
      </p>
      <ul>
        {(newLocations || locations || []).map(
          ({ fragments, model_acc: model, subfamily }, j) => (
            <li key={j}>
              {model && model !== accession && <>Model: {model}</>}
              {subfamily && (
                <div className={f('subfamily')}>
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
              <ul>
                {(fragments || []).map(({ start, end }, i) => (
                  <li key={i}>
                    <button
                      className={f('button', 'secondary')}
                      onClick={handleClick(start, end)}
                    >
                      {start} - {end}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ),
        )}
      </ul>
      {confidence && <p>Confidence: {confidence}</p>}
    </section>
  );
};
ProtVistaEntryPopup.propTypes = {
  detail: T.shape({
    feature: T.object,
    highlight: T.string,
    target: T.any,
  }),
  sourceDatabase: T.string,
  goToCustomLocation: T.func,
  currentLocation: T.object,
};

export default ProtVistaEntryPopup;
