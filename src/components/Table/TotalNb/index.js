// @flow
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import cn from 'classnames';

import NumberLabel from 'components/NumberLabel';

import config from 'config';
import { toPlural } from 'utils/pages';

import styles from './style.css';

const entityText = (entity, count) => {
  if (entity === 'search') {
    return `result${count > 1 ? 's' : ''}`;
  }
  return toPlural(entity, count);
};

const dbText = db => {
  if (
    db &&
    db !== 'reviewed' &&
    db !== 'UniProt' &&
    db !== 'taxonomy' &&
    db !== 'proteome'
  )
    return ` in ${db}`;
};

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
        <NumberLabel value={index} className={styles.number} />
        {' - '}
        <NumberLabel
          value={index + data.length - 1}
          className={styles.number}
        />
        {' of '}
        <strong>
          <NumberLabel value={actualSize} className={styles.number} />
        </strong>{' '}
        {entityText(description.main.key, actualSize)}
        {dbText(db)}
      </span>
    );
  }
  return <p className={cn(className, styles.component)}>{textLabel}</p>;
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
