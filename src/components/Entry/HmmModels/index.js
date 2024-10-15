// @flow
import React, { useEffect } from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';

import { createSelector } from 'reselect';
import Loading from 'components/SimpleCommonComponents/Loading';
import Link from 'components/generic/Link';
import loadData from 'higherOrder/loadData';
import { format } from 'url';

// $FlowFixMe
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import config from 'config';

import Skylign from 'skylign/src/index';

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

const HmmModelSection = ({ logo, data }) => {
  useEffect(() => {
    loadWebComponent(() => Skylign).as('skylign-component');

    // TODO: Change style in `skylign-component` itself.
    // This is a temporaly walkaround to change a shadow DOM style from this code base.
    customElements.whenDefined('skylign-component').then(() => {
      const controlsDiv = document
        .querySelector('skylign-component')
        ?.shadowRoot?.querySelector('div');

      if (controlsDiv) controlsDiv.style.position = 'relative';
    });
  });

  const { loading, payload } = data;

  if (loading) return <Loading />;
  // eslint-disable-next-line camelcase
  const details = payload?.extra_fields?.details;

  if (!details) return null;

  return (
    <div className={f('row')}>
      <div className={f('columns')}>
        <div className={f('logo_wrapper')}>
          <SchemaOrgData
            data={JSON.stringify(logo)}
            processData={schemaProcessData}
          />
          <skylign-component logo={JSON.stringify(logo)} />
          <br />
          <h4>HMM Information</h4>
          <table className={f('light', 'table-sum')}>
            <tbody>
              <tr>
                <td>HMM build commands</td>
                <td>
                  Build method: {details.hmm?.commands?.build || ''}
                  <br />
                  Search method: {details.hmm?.commands?.search || ''}
                </td>
              </tr>
              <tr>
                <td>Gathering threshold</td>
                <td>
                  Sequence: {details.hmm?.cutoffs?.gathering?.sequence || ''}
                  <br />
                  Domain: {details.hmm?.cutoffs?.gathering?.domain || ''}
                </td>
              </tr>
              <tr>
                <td>Download</td>
                <td>
                  <Link
                    href={`${config.root.API.href}/entry/pfam/${payload?.metadata?.accession}?annotation=hmm`}
                    download={`${
                      payload?.metadata?.accession || 'download'
                    }.hmm.gz`}
                  >
                    <span
                      className={f('icon', 'icon-common', 'icon-download')}
                      data-icon="&#xf019;"
                    />{' '}
                    Download
                  </Link>{' '}
                  the raw HMM for this family
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

HmmModelSection.propTypes = {
  logo: T.object.isRequired,
};

const getPfamCurationUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description.main.key,
  (state) =>
    state.customLocation.description.main.key &&
    state.customLocation.description[state.customLocation.description.main.key]
      .db,
  (state) =>
    state.customLocation.description[state.customLocation.description.main.key]
      .accession,
  ({ protocol, hostname, port, root }, mainType, db, accession) => {
    if (!accession) return;
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: mainType },
          [mainType]: {
            db,
            accession,
          },
        }),
      query: { extra_fields: 'details' },
    });
  },
);

export default loadData(getPfamCurationUrl)(HmmModelSection);
