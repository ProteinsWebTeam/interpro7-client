import React from 'react';
import T from 'prop-types';
import AnimatedEntry from 'components/AnimatedEntry';

import ebiStyles from 'styles/ebi-global.css';
import {foundationPartial} from 'styles/foundation';

const ReferenceItem = (item) => {
  return <li>
    <a href={item.url}>{item.accession}</a>
  </li>
};

const ReferenceSection = (database) => {
  const accessions = database.accessions;
  return(<li>
    <h3>{database['name']}</h3>
    <div>{database['description']}</div>
    <ul>{
        accessions.map(
          ({accession, url}) => (
          <ReferenceItem key={accession} accession={accession} url={url} />
        )
      )
    }
    </ul>
  </li>);
};

const sortString = (a, b) => {
  if (a < b) return -1;
  if (b > a) return 1;
  return 0;
};

const CrossReferences = ({cross_references}) => {
  //reformat
  const databases = Object.entries(cross_references).sort(([a], [b]) => a.rank - b.rank );
  return (<div><ul>{
    <AnimatedEntry className="cross_references" itemDelay={100} duration={500}>{
        databases.map(
          ([database, {displayName, description, accessions}]) => (
            <ReferenceSection key={database} name={displayName} description={description} accessions={accessions}/>
          )
        )
      }
    </AnimatedEntry>
  }</ul></div>);
};

export default CrossReferences;
