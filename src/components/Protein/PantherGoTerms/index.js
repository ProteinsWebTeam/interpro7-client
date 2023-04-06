// @flow
import React from 'react';
import T from 'prop-types';
import { dataPropType } from 'higherOrder/loadData/dataPropTypes';

import { createSelector } from 'reselect';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';
import loadData from 'higherOrder/loadData';
// $FlowFixMe
import GoTerms from 'components/GoTerms';
import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
const f = foundationPartial(local);

const PantherSFGoTermsWithData = ({ data: { loading, payload } }) => {
  if (loading) return <Loading inline={true} />;
  return payload?.metadata?.go_terms ? (
    <GoTerms
      terms={payload?.metadata.go_terms}
      type="protein"
      withoutTitle={true}
    />
  ) : null;
};
PantherSFGoTermsWithData.propTypes = {
  data: dataPropType,
};

const getUrl = createSelector(
  (state) => state.settings.api,
  (_, props) => props.subfamily,
  ({ protocol, hostname, port, root }, subfamily) => {
    return format({
      protocol,
      hostname,
      port,
      pathname:
        root +
        descriptionToPath({
          main: { key: 'entry' },
          entry: { db: 'panther', accession: subfamily },
        }),
      query: {
        subfamily: '',
      },
    });
  },
);

const PantherSFGoTerms = loadData(getUrl)(PantherSFGoTermsWithData);
/*::
type Props = {
  subfamilies?: string[]
}
*/

const PantherGoTerms = ({ subfamilies } /*: Props */) => {
  if (!subfamilies?.length) return null;
  return (
    <section>
      <h5>Panther GO terms</h5>
      {subfamilies.map((sf) => (
        <details key={sf} className={f('go-terms')}>
          <summary>{sf}</summary>
          <PantherSFGoTerms subfamily={sf} />
        </details>
      ))}
    </section>
  );
};
PantherGoTerms.propTypes = {
  subfamilies: T.arrayOf(T.string),
};

export default PantherGoTerms;
