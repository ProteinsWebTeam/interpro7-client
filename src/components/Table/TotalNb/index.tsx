/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 3, 4] }]*/
import React, { ReactNode } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// $FlowFixMe
import MemberDBSelector from 'components/MemberDBSelector';
import MemberSymbol from 'components/Entry/MemberSymbol';
import NumberComponent from 'components/NumberComponent';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import { toPlural } from 'utils/pages/toPlural';
import config from 'config';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';
import { toCanonicalURL } from 'utils/url/toCanonicalURL';

const css = cssBinder(styles);

const entityText = (entity: string, count: number) => {
  if (entity === 'search') {
    return `result${count > 1 ? 's' : ''}`;
  }
  return toPlural(entity, count);
};

const dbText = (
  entryDB?: MemberDB | 'interpro',
  setDB?: string | null,
  db?: string | null,
  isSubPageButMainIsEntry?: boolean,
  databases: DBsInfo = {},
) => {
  if (isSubPageButMainIsEntry || !entryDB) return null;
  return (
    <span>
      {entryDB === db || setDB === db ? ' in ' : ' matching '}
      <span className={css('total-text-bold')}>
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
      <MemberSymbol type={entryDB} className={css('db-symbol')} />
    </span>
  );
};

const SelectorSpoof = ({
  children,
}: {
  contentType: unknown;
  children: (x: boolean) => ReactNode;
}) => children(true);

const url2page = new Map();

type Props<RowData extends object> = {
  className?: string;
  data: Array<RowData>;
  actualSize?: number;
  pagination: Record<string, unknown>;
  notFound?: boolean;
  description?: InterProDescription;
  contentType?: string;
  databases?: DBsInfo;
  dbCounters?: MetadataCounters;
  currentAPICall?: string | null;
  nextAPICall?: string | null;
  previousAPICall?: string | null;
};

export const TotalNb = <RowData extends object>({
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
}: Props<RowData>) => {
  if (!description) return null;
  const page =
    (currentAPICall && url2page.get(toCanonicalURL(currentAPICall))) ||
    Number(pagination.page || 1);
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

  let textLabel: ReactNode = '';
  if (actualSize) {
    const db = description[description.main.key as Endpoint].db;

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
        {(open: boolean) => (
          <span
            className={css('header-total-results', {
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
              description.entry.db as MemberDB | 'interpro',
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
  return <span className={css(className, 'component')}>{textLabel}</span>;
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description,
  (description) => ({ description }),
);

export default connect(mapStateToProps)(TotalNb);
