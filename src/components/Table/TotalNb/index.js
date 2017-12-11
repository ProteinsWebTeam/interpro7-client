/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import config from 'config';
import { toPlural } from 'utils/pages';

const TotalNb = ({ className, data, actualSize, pagination, description }) => {
  const page = parseInt(pagination.page || 1, 10);
  const pageSize = parseInt(
    pagination.page_size || config.pagination.pageSize,
    10,
  );
  const index = (page - 1) * pageSize + 1;
  // const lastPage = Math.ceil(actualSize / pageSize) || 1;
  let textLabel = '';
  if (actualSize) {
    const db = description[description.main.key].db;
    textLabel = (
      <span>
        {index} - {index + data.length - 1} of{' '}
        <strong>{actualSize.toLocaleString()}</strong>{' '}
        {toPlural(description.main.key, actualSize)}
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
  className: T.string,
  description: T.object,
};

const mapStateToProps = createSelector(
  state => state.customLocation.description,
  description => ({ description }),
);

export default connect(mapStateToProps)(TotalNb);
