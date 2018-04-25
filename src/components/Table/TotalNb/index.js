// @flow
/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 3, 4] }]*/
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MemberDBSelector from 'components/MemberDBSelector';
import MemberSymbol from 'components/Entry/MemberSymbol';
import { NumberComponent } from 'components/NumberLabel';

import cn from 'classnames/bind';

import config from 'config';
import { toPlural } from 'utils/pages';

import styles from './style.css';

const s = cn.bind(styles);

const entityText = (entity, count) => {
  if (entity === 'search') {
    return `result${count > 1 ? 's' : ''}`;
  }
  return toPlural(entity, count);
};

const dbText = (entryDB, setDB, db, isSubPageButMainIsEntry) => {
  if (isSubPageButMainIsEntry || !entryDB) return null;
  return (
    <span>
      {entryDB === db || setDB === db ? ' in ' : ' matching '}
      <span className={s('db')}>{entryDB}</span>
      <MemberSymbol type={entryDB} className={s('db-symbol')} />
    </span>
  );
};

const SelectorSpoof = ({ children } /*: { children: function } */) =>
  children();
SelectorSpoof.propTypes = {
  children: T.func.isRequired,
};

const TotalNb = ({
  className,
  data,
  actualSize,
  pagination,
  description,
  contentType,
}) => {
  const page = parseInt(pagination.page || 1, 10);
  const pageSize = parseInt(
    pagination.page_size || config.pagination.pageSize,
    10,
  );

  const index = (page - 1) * pageSize + 1;

  let textLabel = '';
  if (actualSize) {
    const db = description[description.main.key].db;

    const isSubPageButMainIsEntry =
      contentType !== description.main.key && description.main.key === 'entry';
    const needSelector = !(
      isSubPageButMainIsEntry ||
      description.main.key === 'search' ||
      description.main.key === 'job' ||
      (contentType !== 'entry' && contentType !== description.main.key)
    );

    const SelectorMaybe = needSelector ? MemberDBSelector : SelectorSpoof;

    textLabel = (
      <SelectorMaybe
        {...(needSelector ? { contentType } : {})}
        contentType={contentType}
      >
        {open => (
          <span
            className={s('text', { selector: typeof open === 'boolean', open })}
          >
            <NumberComponent value={index} />
            {' - '}
            <NumberComponent value={index + data.length - 1} />
            {' of '}
            <strong>
              <NumberComponent value={actualSize} abbr />
            </strong>{' '}
            {entityText(contentType || description.main.key, actualSize)}
            {dbText(
              description.entry.db,
              description.set.db,
              db,
              isSubPageButMainIsEntry,
            )}
          </span>
        )}
      </SelectorMaybe>
    );
  }
  return <span className={s(className, 'component')}>{textLabel}</span>;
};

TotalNb.propTypes = {
  data: T.array,
  actualSize: T.number,
  pagination: T.object.isRequired,
  notFound: T.bool,
  className: T.string,
  description: T.object,
  contentType: T.string,
};

const mapStateToProps = createSelector(
  state => state.customLocation.description,
  description => ({ description }),
);

export default connect(mapStateToProps)(TotalNb);
