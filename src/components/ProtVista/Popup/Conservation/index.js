// @flow
import React from 'react';
import T from 'prop-types';

import ColorScale from '../ColorScale';

/*::
  import type {ProtVistaLocation, PopupDetail} from '../index.js';

  type Locations = Array<ProtVistaLocation>;
  type Props = {
    detail: PopupDetail,
    data: Array<{}>
  }
*/
const getConservationScore = (
  highlight /*: string */,
  match /*: {locations: Locations }*/,
  scale /*: Array<{color:string, min: number, max: number}> */,
) => {
  const start = parseInt(highlight.split(':')[0], 10);
  const matchFragment = match.locations[0].fragments.find((fragment) => {
    return start >= fragment.start && start <= fragment.end;
  });
  const scaleEntry = scale.find((element) => {
    return matchFragment?.color === element.color;
  });
  return `${scaleEntry?.min || 0} - ${scaleEntry?.max || 0}`;
};

const ProtVistaConservationPopup = ({ detail, data } /*: Props */) => {
  const match = detail.feature;
  const sourceDatabase = 'Pfam'; // TODO: get it from match.accession;
  const startLocation = match.locations[0];
  const endLocation = match.locations[match.locations.length - 1];
  const start = startLocation.fragments[0].start;
  const end = endLocation.fragments[endLocation.fragments.length - 1].end;
  const matchConservation = data.find((element) => {
    if (element[0] && element[0].toLowerCase() === 'match conservation') {
      return element[1].find(
        (e) => (e.type && e.type.toLowerCase()) === 'sequence_conservation',
      );
    }
    return false;
  });

  // $FlowFixMe
  const scale = matchConservation[1].find((element) => {
    return (
      element.type && element.type.toLowerCase() === 'sequence_conservation'
    );
  }).range;
  const score = getConservationScore(detail.highlight, match, scale);
  const accession = startLocation.match;

  return (
    <section>
      <h6>{accession}</h6>

      <div>
        <div>{sourceDatabase}</div>

        <p>
          {start && end && (
            <>
              {start} - {end}
            </>
          )}
        </p>
        {score && <p>Conservation : {score}</p>}
        {scale && (
          <>
            Scale:{' '}
            <ColorScale
              domain={[scale[0].min, scale[scale.length - 1].max]}
              range={[scale[0].color, scale[scale.length - 1].color]}
            />
          </>
        )}
      </div>
    </section>
  );
};
ProtVistaConservationPopup.propTypes = {
  detail: T.shape({
    feature: T.object,
    highlight: T.string,
  }),
  data: T.array,
};
export default ProtVistaConservationPopup;
