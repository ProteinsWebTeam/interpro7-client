/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import config from 'config';
import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';
import styles from '../style.css';

const f = foundationPartial(styles);

const TotalNb = ({
  className,
  data,
  actualSize,
  pagination,
  notFound,
  mainType,
  mainDB,
  focusType,
  focusDB,
}) => {
  const page = parseInt(pagination.page || 1, 10);
  const pageSize = parseInt(
    pagination.page_size || config.pagination.pageSize,
    10,
  );
  const index = (page - 1) * pageSize + 1;
  // const lastPage = Math.ceil(actualSize / pageSize) || 1;

  let textLabel = 'Loading data';
  if (notFound) {
    textLabel = 'No data available';
  } else if (actualSize) {
    const type = focusType || mainType;
    const db = focusDB || mainDB;
    const plural = actualSize > 1 ? toPlural(type) : type;
    textLabel = (
      <span>
        {index} - {index + data.length - 1} of <strong>{actualSize}</strong>{' '}
        {db === 'proteome' ? 'proteomes' : plural}
        {db !== 'reviewed' &&
        db !== 'UniProt' &&
        db !== 'taxonomy' &&
        db !== 'proteome'
          ? ` in ${db}`
          : null}
      </span>
    );
  }
  return (
    <p className={className} style={{ color: '#505f74', marginBottom: '0' }}>
      {textLabel}
    </p>
  );
};
TotalNb.propTypes = {
  data: T.array,
  actualSize: T.number,
  pagination: T.object.isRequired,
  notFound: T.bool,
  mainDB: T.string.isRequired,
  mainType: T.string.isRequired,
  focusDB: T.string,
  className: T.string,
  focusType: T.string,
};
const mapStateToProps = createSelector(
  state => state.newLocation.description.mainDB,
  state => state.newLocation.description.mainType,
  state => state.newLocation.description.focusDB,
  state => state.newLocation.description.focusType,
  (mainDB, mainType, focusDB, focusType) => ({
    mainDB,
    mainType,
    focusDB,
    focusType,
  }),
);
export default connect(mapStateToProps)(TotalNb);
