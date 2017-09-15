/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import config from 'config';
import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';
import s from '../style.css';
const f = foundationPartial(s);

const TotalNb = ({
  data,
  actualSize,
  pagination,
  notFound,
  mainType,
  mainDB,
}) => {
  const page = parseInt(pagination.page || 1, 10);
  const pageSize = parseInt(
    pagination.page_size || config.pagination.pageSize,
    10
  );
  const index = (page - 1) * pageSize + 1;
  // const lastPage = Math.ceil(actualSize / pageSize) || 1;

  let textLabel = 'Loading data';
  if (notFound) {
    textLabel = 'No data available';
  } else if (actualSize) {
    textLabel = (
      <span>
        {index} - {index + data.length - 1} of <strong>{actualSize}</strong>{' '}
        {actualSize > 1 ? toPlural(mainType) : mainType}
        {mainDB != 'reviewed' && mainDB != 'uniprot' && mainDB != 'taxonomy' ? (
          ' in ' + mainDB
        ) : null}
      </span>
    );
  }
  return <div className={f('totalnb-box')}>{textLabel}</div>;
};
TotalNb.propTypes = {
  data: T.array,
  actualSize: T.number,
  pagination: T.object.isRequired,
  notFound: T.bool,
  mainDB: T.string.isRequired,
  mainType: T.string.isRequired,
};
const mapStateToProps = createSelector(
  state => state.newLocation.description.mainDB,
  state => state.newLocation.description.mainType,
  (mainDB, mainType) => ({ mainDB, mainType })
);
export default connect(mapStateToProps)(TotalNb);
