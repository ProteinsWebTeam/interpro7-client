import React from 'react';
import PaginationItem from '../PaginationItem';

type ItemProps = { cursor: string; label: string };
const CursorPaginationItem = ({ cursor, label }: ItemProps) => (
  <PaginationItem value={cursor || '_'} noLink={!cursor} attributeName="cursor">
    {label}
  </PaginationItem>
);

type Props = { next: string; previous: string };
const CursorPaginationLinks = ({ next, previous }: Props) => (
  <>
    <CursorPaginationItem cursor={previous} label="Previous" />
    <CursorPaginationItem cursor={next} label="Next" />
  </>
);

export default CursorPaginationLinks;
