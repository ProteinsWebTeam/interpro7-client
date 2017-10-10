import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = data => ({
  '@type': 'PhysicalEntity',
  '@id': '@isBasedOn',
  additionalType: '???ProteinAnnotation???',
  inDataset: data.db,
  name: data.name,
});

const ContributingSignatures = ({ contr } /*: {contr: Object} */) => (
  <div className={f('side-panel', 'margin-top-small', 'margin-bottom-large')}>
    <h5>Contributing signatures</h5>

    <div className={f('table-chevron')}>
      {Object.entries(contr).map(([db, accessions]) => (
        <div key={db} className={f('sign-row')}>
          <span className={f('sign-cell')}>{db}</span>

          {accessions.map(accession => (
            <span key={accession} className={f('sign-cell')}>
              <SchemaOrgData
                data={{ db, name: accession }}
                processData={schemaProcessData}
              />
              <span className={f('sign-label')}>
                <Link
                  className={f('neutral')}
                  newTo={{
                    description: {
                      mainType: 'entry',
                      mainDB: db,
                      mainAccession: accession,
                    },
                  }}
                >
                  {accession}
                </Link>
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
ContributingSignatures.propTypes = {
  contr: T.object.isRequired,
};

export default ContributingSignatures;
