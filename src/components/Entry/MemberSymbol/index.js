import React, {PropTypes as T} from 'react';
import f from 'styles/foundation';

const MemberSymbol = (
  {type}
  /*: {
   type: string
   }*/
) => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      id={`md-${type}`}
    >
      <defs>
        <clipPath id="cut-off-center">
          <rect x="33%" y="33%" width="70" height="70"/>
        </clipPath>
      </defs>
      <text
        x="50%" y="50%"
        textAnchor="middle"
        dx="-0.01em" dy="0.4em"
        className={f('md-server')}
      >D</text>
      {
        type === 'new' ?
          <text
            x="50%" y="50%"
            textAnchor="middle"
            dx="-0.01em" dy="0.4em"
            fill="#222"
            style={{
              fontFamily: 'Montserrat, arial, serif',
              fontSize: 120,
              fontWeight: 700}}
          >?</text> :
          <text
            x="50%" y="50%"
            textAnchor="middle"
            dx="-0.01em" dy="0.4em"
            className={f('md-color')}
            clipPath="url(#cut-off-center)"
          >D</text>
      }
    </svg>

  </div>
);
MemberSymbol.propTypes = {
  type: T.string.isRequired,
};

export default MemberSymbol;
