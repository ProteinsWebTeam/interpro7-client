// @flow
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React, { PureComponent } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import PageSizeSelector from '../PageSizeSelector';
import NumberComponent from 'components/NumberComponent';

import { getCursor } from 'utils/url';

import config from 'config';

import { foundationPartial } from 'styles/foundation';

import s from '../style.css';

const f = foundationPartial(s);

const toFunctionFor = (value, key = 'page') => customLocation => ({
  ...customLocation,
  search: { ...customLocation.search, [key]: value },
});

const scrollToTop = () => {
  window.scrollTo(0, 0);
};
/*:: type Props = {
  className?: string,
  value?: number,
  noLink?: boolean,
  children?: number| string,
  duration?: number
}; */
class PaginationItem extends PureComponent /*:: <Props> */ {
  static propTypes = {
    className: T.string,
    attributeName: T.string,
    value: T.oneOfType([T.number, T.string]),
    noLink: T.bool,
    children: T.oneOfType([T.number, T.string]),
    duration: T.number,
  };

  render() {
    const {
      className,
      attributeName = 'page',
      value,
      noLink,
      children,
      duration,
    } = this.props;
    const LinkOrSpan = !value || noLink ? 'span' : Link;
    const props = {};
    if (value) {
      if (noLink) {
        props.className = f('no-link');
      } else {
        props.to = toFunctionFor(value, attributeName);
      }
    }
    return (
      <li className={className}>
        <LinkOrSpan {...props} onClick={() => !noLink && scrollToTop()}>
          {(value && children) || (
            <NumberComponent duration={duration || 0} noTitle>
              {value}
            </NumberComponent>
          )}
        </LinkOrSpan>
      </li>
    );
  }
}
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

  return (
    <>
      <PreviousText previous={previous} current={current} />
      <First first={first} current={current} />
      <PreviousDotDotDot first={first} previous={previous} />
      <Previous first={first} previous={previous} current={current} />
      <Current current={current} />
      <Next current={current} next={next} last={last} />
      <NextDotDotDot next={next} last={last} />
      <NextText current={current} next={next} />
    </>
  );
};

const CursorPaginationItem = ({ cursor, label }) => (
  <PaginationItem value={cursor || '_'} noLink={!cursor} attributeName="cursor">
    {label}
  </PaginationItem>
);

const CursorPaginationLinks = ({ next, previous }) => (
  <>
    <CursorPaginationItem cursor={previous} label="Previous" />
    <CursorPaginationItem cursor={next} label="Next" />
  </>
);
const Footer = (
  {
    withPageSizeSelector,
    actualSize,
    pagination,
    notFound,
    nextAPICall,
    previousAPICall,
  } /*: {withPageSizeSelector: boolean, actualSize: number, pagination: Object, notFound: boolean} */,
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
};

export default Footer;
