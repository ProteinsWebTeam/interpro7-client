// @flow
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React, { PureComponent } from 'react';
import T from 'prop-types';

import PageSizeSelector from '../PageSizeSelector';
// $FlowFixMe
import PaginationItem from './PaginationItem';
import { getCursor } from 'utils/url';

import config from 'config';

import { foundationPartial } from 'styles/foundation';

import s from '../style.css';

const f = foundationPartial(s);

/*:: type PreviousTextProps = {
  previous: number,
  current: number,
}; */
class PreviousText extends PureComponent /*:: <PreviousTextProps> */ {
  static propTypes = {
    previous: T.number.isRequired,
    current: T.number.isRequired,
  };

  render() {
    const { previous, current } = this.props;
    return (
      <PaginationItem value={previous} noLink={previous === current}>
        Previous
      </PaginationItem>
    );
  }
}
/*:: type FirstProps = {
  first: number,
  current: number,
}; */
class First extends PureComponent /*:: <FirstProps> */ {
  static propTypes = {
    first: T.number.isRequired,
    current: T.number.isRequired,
  };

  render() {
    const { first, current } = this.props;
    if (first === current) return null;
    return <PaginationItem value={first} />;
  }
}
/*:: type LastProps = {
  last: number,
  current: number,
}; */
class Last extends PureComponent /*:: <LastProps> */ {
  static propTypes = {
    last: T.number.isRequired,
    current: T.number.isRequired,
  };

  render() {
    const { last, current } = this.props;
    if (last === current || last === 1) return null;
    return <PaginationItem value={last} />;
  }
}
/*:: type PreviousDotDotProps = {
  first: number,
  previous: number,
}; */
class PreviousDotDotDot extends PureComponent /*:: <PreviousDotDotProps> */ {
  static propTypes = {
    first: T.number.isRequired,
    previous: T.number.isRequired,
  };

  render() {
    if (this.props.previous - 1 <= this.props.first) return null;
    return <PaginationItem className={f('ellipsis')} />;
  }
}
/*:: type PreviousProps = {
  first: number,
  previous: number,
  current: number,
}; */
class Previous extends PureComponent /*:: <PreviousProps> */ {
  static propTypes = {
    first: T.number.isRequired,
    previous: T.number.isRequired,
    current: T.number.isRequired,
  };

  render() {
    const { first, previous, current } = this.props;
    if (previous === current || previous === first) return null;
    return <PaginationItem value={previous} />;
  }
}

class Current extends PureComponent /*:: <{current: number}> */ {
  static propTypes = {
    current: T.number.isRequired,
  };

  render() {
    return (
      <PaginationItem
        className={f('current')}
        value={this.props.current}
        noLink
      />
    );
  }
}
/*:: type NextProps = {
  current: number,
  next: number,
  last: number
}; */
class Next extends PureComponent /*:: <NextProps> */ {
  static propTypes = {
    current: T.number.isRequired,
    next: T.number.isRequired,
    last: T.number.isRequired,
  };

  render() {
    const { current, next, last } = this.props;
    if (next === current || last <= current) return null;
    return <PaginationItem value={next} />;
  }
}
/*:: type NextDotDotDotProps = {
  next: number,
  last: number,
}; */
class NextDotDotDot extends PureComponent /*:: <NextDotDotDotProps> */ {
  static propTypes = {
    next: T.number.isRequired,
    last: T.number.isRequired,
  };

  render() {
    if (this.props.next + 1 >= this.props.last) return null;
    return <PaginationItem className={f('ellipsis')} />;
  }
}
/*:: type NextTextProps = {
  current: number,
  next: number,
}; */
class NextText extends PureComponent /*:: <NextTextProps> */ {
  static propTypes = {
    current: T.number.isRequired,
    next: T.number.isRequired,
  };

  render() {
    const { current, next } = this.props;
    return (
      <PaginationItem value={next} noLink={current === next}>
        Next
      </PaginationItem>
    );
  }
}

const NumberedPaginationLinks = ({ pagination, actualSize }) => {
  const first = 1;
  const current = parseInt(pagination.page || first, 10);
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
              className={f({ current: n + 1 === current })}
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
NumberedPaginationLinks.propTypes = {
  actualSize: T.number,
  pagination: T.object.isRequired,
};

const CursorPaginationItem = ({ cursor, label }) => (
  <PaginationItem value={cursor || '_'} noLink={!cursor} attributeName="cursor">
    {label}
  </PaginationItem>
);
CursorPaginationItem.propTypes = {
  cursor: T.string,
  label: T.string,
};

const CursorPaginationLinks = ({ next, previous }) => (
  <>
    <CursorPaginationItem cursor={previous} label="Previous" />
    <CursorPaginationItem cursor={next} label="Next" />
  </>
);
CursorPaginationLinks.propTypes = {
  next: T.string,
  previous: T.string,
};

const Footer = (
  {
    withPageSizeSelector,
    actualSize,
    pagination,
    notFound,
    nextAPICall,
    previousAPICall,
  } /*: {withPageSizeSelector: boolean, actualSize: number, pagination: Object, notFound: boolean, nextAPICall: string, previousAPICall: string } */,
) => {
  if (notFound) return null;

  const nextCursor = getCursor(nextAPICall);
  const previousCursor = getCursor(previousAPICall);
  // if (nextCursor || previousCursor) {
  //   return
  // }

  return (
    <div className={f('table-footer')}>
      <div className={f('table-footer-content')}>
        {withPageSizeSelector && <PageSizeSelector search={pagination} />}
        <div className={f('pagination-box')}>
          <ul
            className={f('pagination', 'text-right')}
            role="navigation"
            aria-label="Pagination"
          >
            {nextCursor || previousCursor ? (
              <CursorPaginationLinks
                next={nextCursor}
                previous={previousCursor}
              />
            ) : (
              <NumberedPaginationLinks
                pagination={pagination}
                actualSize={actualSize}
              />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
Footer.propTypes = {
  withPageSizeSelector: T.bool.isRequired,
  actualSize: T.number,
  pagination: T.object.isRequired,
  notFound: T.bool,
  nextAPICall: T.string,
  previousAPICall: T.string,
};

export default Footer;
