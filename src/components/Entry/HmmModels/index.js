// @flow
import React, { useEffect } from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';

import Skylign from 'skylign';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import styles from './logo.css';
import loadable from 'higherOrder/loadable';
import loadWebComponent from 'utils/load-web-component';

const f = foundationPartial(ebiGlobalStyles, styles);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessData = (data) => {
  return {
    '@id': '@additionalProperty',
    '@type': 'PropertyValue',
    name: 'hasSignature',
    value: [
      {
        '@type': 'CreativeWork',
        additionalType: ['bio:DataRecord', 'AlignmentLogo'],
        additionalProperty: [
          {
            '@type': 'PropertyValue',
            name: 'maxHeight',
            value: data.max_height,
          },
          {
            '@type': 'PropertyValue',
            name: 'processing',
            value: data.processing,
          },
          {
            '@type': 'PropertyValue',
            name: 'alphabet',
            value: data.alphabet,
          },
          {
            '@type': 'PropertyValue',
            name: 'minHeightObserved',
            value: data.min_height_obs,
          },
        ],
      },
    ],
  };
};

const HmmModelSection = ({ logo } /*: {logo: {}} */) => {
  useEffect(() => {
    loadWebComponent(() => Skylign).as('skylign-component');
  });

  return (
    <div className={f('row')}>
      <div className={f('columns')}>
        <div className={f('logo_wrapper')}>
          <SchemaOrgData
            data={JSON.stringify(logo)}
            processData={schemaProcessData}
          />
          <skylign-component logo={JSON.stringify(logo)} />
        </div>
      </div>
    </div>
  );
};

HmmModelSection.propTypes = {
  logo: T.object.isRequired,
};

export default HmmModelSection;
