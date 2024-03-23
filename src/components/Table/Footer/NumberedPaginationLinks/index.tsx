import React from 'react';

import PaginationItem from '../PaginationItem';

import config from 'config';

import cssBinder from 'styles/cssBinder';

import s from '../../style.css';

const css = cssBinder(s);

type PreviousTextProps = {
  previous: number;
  current: number;
};
const PreviousText = ({ previous, current }: PreviousTextProps) => {
  return (
    <PaginationItem value={previous} noLink={previous === current}>
      Previous
    </PaginationItem>
  );
};

type FirstProps = {
  first: number;
  current: number;
};
const First = ({ first, current }: FirstProps) => {
  if (first === current) return null;
  return <PaginationItem value={first} />;
};

type LastProps = {
  last: number;
  current: number;
};
const Last = ({ last, current }: LastProps) => {
  if (last === current || last === 1) return null;
  return <PaginationItem value={last} />;
};

type PreviousDotDotProps = {
  first: number;
  previous: number;
};

const PreviousDotDotDot = ({ previous, first }: PreviousDotDotProps) => {
  if (previous - 1 <= first) return null;
  return <PaginationItem className={css('ellipsis')} />;
};

type PreviousProps = {
  first: number;
  previous: number;
  current: number;
};
const Previous = ({ first, previous, current }: PreviousProps) => {
  if (previous === current || previous === first) return null;
  return <PaginationItem value={previous} />;
};

const Current = ({ current }: { current: number }) => {
  return <PaginationItem className={css('current')} value={current} noLink />;
};

type NextProps = {
  current: number;
  next: number;
  last: number;
};
const Next = ({ current, next, last }: NextProps) => {
  if (next === current || last <= current) return null;
  return <PaginationItem value={next} />;
};

type NextDotDotDotProps = {
  next: number;
  last: number;
};
const NextDotDotDot = ({ next, last }: NextDotDotDotProps) => {
  if (next + 1 >= last) return null;
  return <PaginationItem className={css('ellipsis')} />;
};

type NextTextProps = {
  current: number;
  next: number;
};
const NextText = ({ current, next }: NextTextProps) => {
  return (
    <PaginationItem value={next} noLink={current === next}>
      Next
    </PaginationItem>
  );
};

type Props = {
  pagination: {
    page?: string;
    page_size?: string;
  };
  actualSize: number;
};
const NumberedPaginationLinks = ({ pagination, actualSize }: Props) => {
  const first = 1;
  const current = parseInt(String(pagination.page || first), 10);
  const pageSize = parseInt(
    pagination.page_size || config.pagination.pageSize,
    10,
  );
  const last = Math.ceil(actualSize / pageSize) || 1;
  const previous = Math.max(current - 1, first);
  const next = Math.min(current + 1, last);

  const firstPivot = Math.ceil(current / 2);
  const secondPivot = Math.floor((current + last + 1) / 2);

  const showFirstPivot = firstPivot > 2;
  const showSecondPivot = secondPivot < last - 2;
  const SHOW_ALL_FOR = 10;
  return (
    <>
      <PreviousText previous={previous} current={current} />
      {last <= SHOW_ALL_FOR &&
        Array.from(Array(last).keys()).map((n) => {
          return (
            <PaginationItem
              key={n}
              value={n + 1}
              noLink={n + 1 === current}
              className={css({ current: n + 1 === current })}
            />
          );
        })}
      {last > SHOW_ALL_FOR && (
        <>
          <First first={first} current={current} />
          {showFirstPivot && (
            <>
              <PreviousDotDotDot first={first} previous={firstPivot} />
              <PaginationItem value={firstPivot} />
            </>
          )}
          <PreviousDotDotDot
            first={showFirstPivot ? firstPivot : first}
            previous={previous}
          />
          <Previous first={first} previous={previous} current={current} />
          <Current current={current} />
          <Next current={current} next={next} last={last - 1} />
          <NextDotDotDot
            next={next}
            last={showSecondPivot ? secondPivot : last}
          />
          {showSecondPivot && (
            <>
              <PaginationItem value={secondPivot} />
              <NextDotDotDot next={next} last={last} />
            </>
          )}

          <Last last={last} current={current} />
        </>
      )}
      <NextText current={current} next={next} />
    </>
  );
};

export default NumberedPaginationLinks;
