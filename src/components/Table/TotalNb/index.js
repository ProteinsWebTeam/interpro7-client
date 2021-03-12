// @flow
/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 3, 4] }]*/
import React from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import MemberDBSelector from 'components/MemberDBSelector';
import MemberSymbol from 'components/Entry/MemberSymbol';
import NumberComponent from 'components/NumberComponent';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import cn from 'classnames/bind';

import config from 'config';
import { toPlural } from 'utils/pages';

import styles from './style.css';
import { toCanonicalURL } from 'utils/url';

const s = cn.bind(styles);

const entityText = (entity, count) => {
  if (entity === 'search') {
    return `result${count > 1 ? 's' : ''}`;
  }
  return toPlural(entity, count);
};

const dbText = (
  entryDB,
  setDB,
  db,
  isSubPageButMainIsEntry,
  databases = {},
) => {
  if (isSubPageButMainIsEntry || !entryDB) return null;
  return (
    <span>
      {entryDB === db || setDB === db ? ' in ' : ' matching '}
      <span className={s('total-text-bold')}>
        {(databases && databases[entryDB] && databases[entryDB].name) ||
          entryDB}
      </span>{' '}
      <TooltipAndRTDLink
        rtdPage={`databases.html#${entryDB}`}
        label={`Visit our documentation for more information about
                         ${
                           (databases &&
                             databases[entryDB] &&
                             databases[entryDB].name) ||
                           entryDB
                         }`}
      />
      <MemberSymbol type={entryDB} className={s('db-symbol')} />
    </span>
  );
};

const SelectorSpoof = ({ children } /*: { children: function } */) =>
  children();
SelectorSpoof.propTypes = {
  children: T.func.isRequired,
};

const url2page = new Map();

// eslint-disable-next-line complexity
export const TotalNb = (
  {
    className,
    data,
    actualSize,
    pagination,
    description,
    contentType,
    databases,
    dbCounters,
    currentAPICall,
    nextAPICall,
    previousAPICall,
  } /*: {
    className?: string,
    data: Array<Object>,
    actualSize?: number,
    pagination: Object,
    notFound?: boolean,
    description: Object,
    contentType?: string,
    databases?: Object,
    dbCounters?: Object,
    currentAPICall?: ?string,
    nextAPICall?: ?string,
    previousAPICall?: ?string,
  } */,
) => {
  const page =
    (currentAPICall && url2page.get(toCanonicalURL(currentAPICall, true))) ||
    parseInt(pagination.page || 1, 10);
  const pageSize = parseInt(
    pagination.page_size || config.pagination.pageSize,
    10,
  );

  if (currentAPICall && !pagination.page) {
    if (nextAPICall) url2page.set(toCanonicalURL(nextAPICall), page + 1);
    if (previousAPICall)
      url2page.set(toCanonicalURL(previousAPICall), page - 1);
  }

  const index = (page - 1) * pageSize + 1;

  let textLabel = '';
  if (actualSize) {
    const db = description[description.main.key].db;

    const isSubPageButMainIsEntry =
      contentType !== description.main.key && description.main.key === 'entry';

    const isBrowsePage = contentType && contentType === description.main.key;
    const needSelector = !(
      isBrowsePage ||
      isSubPageButMainIsEntry ||
      description.main.key === 'search' ||
      (description.main.key === 'result' && !description.result.accession) ||
      description.main.key === 'set' ||
      (contentType !== 'entry' && contentType !== description.main.key)
    );

    const SelectorMaybe = needSelector ? MemberDBSelector : SelectorSpoof;

    textLabel = (
      <SelectorMaybe
        {...(needSelector ? { contentType } : {})}
        contentType={contentType}
        dbCounters={dbCounters}
      >
        {(open) => (
          <span
            className={s('header-total-results', {
              selector: typeof open === 'boolean',
              open,
              bordered: needSelector,
            })}
          >
            <NumberComponent noTitle>{index}</NumberComponent>
            {' - '}
            <NumberComponent noTitle>{index + data.length - 1}</NumberComponent>
            {' of '}
            <strong>
              <NumberComponent abbr>{actualSize}</NumberComponent>
            </strong>{' '}
            {entityText(contentType || description.main.key, actualSize)}
            {dbText(
              description.entry.db,
              description.set.db,
              db,
              isSubPageButMainIsEntry,
              databases,
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
  databases: T.object,
  dbCounters: T.object,
  currentAPICall: T.string,
  nextAPICall: T.string,
  previousAPICall: T.string,
};

const mapStateToProps = createSelector(
  (state) => state.customLocation.description,
  (description) => ({ description }),
);

export default connect(mapStateToProps)(TotalNb);
