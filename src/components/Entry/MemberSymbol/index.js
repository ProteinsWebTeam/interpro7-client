import React from 'react';
import T from 'prop-types';
import {foundationPartial} from 'styles/foundation';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro);

const classNames = {
  CATH: f('md-cg'),
  CDD: f('md-cd'),
  HAMAP: f('md-ha'),
  PANTHER: f('md-pa'),
  PFAM: f('md-pf'),
  PIRSF: f('md-pi'),
  PRINTS: f('md-pri'),
  PRODOM: f('md-pro'),
  PATTERNS: f('md-prpat'),
  PROFILES: f('md-prpro'),
  SFLD: f('md-sf'),
  SMART: f('md-sm'),
  SUPERFAMILIES: f('md-su'),
  TIGRFAMS: f('md-ti'),
  NEW: f('md-new'),
};

const MemberSymbol = (
  {type, className = ''}
  /*: {
   type: string
   className?: string
   }*/
) => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      id={`md-${type}`}
      className={`${className} ${classNames[type.toUpperCase()]}`}
    >

      <text
        x="50%" y="50%"
        textAnchor="middle"
        dx="-0.01em" dy="0.4em"
        className={f('md-server')}
      >D</text>
      { // interesting to try text "&"
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
      // interesting to try text "&"
      }
    </svg>

  </div>
);
MemberSymbol.propTypes = {
  type: T.string.isRequired,
  className: T.string,
};

export default MemberSymbol;
