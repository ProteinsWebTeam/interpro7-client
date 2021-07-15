// @flow
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React, { PureComponent } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import PageSizeSelector from '../PageSizeSelector';

import { getCursor } from 'utils/url';

import config from 'config';

import { foundationPartial } from 'styles/foundation';

import s from '../style.css';

const f = foundationPartial(s);

const toFunctionFor = (value, key = 'page') => customLocation => ({
  ...customLocation,
  // $FlowFixMe
  search: { ...customLocation.search, [key]: value },
});

/*:: type Props = {
  className?: string,
  value?: number | string,
  noLink?: boolean,
  children?: number| string,
  attributeName?: string,
}; */
class PaginationItem extends PureComponent /*:: <Props> */ {
  static propTypes = {
    className: T.string,
    attributeName: T.string,
    value: T.oneOfType([T.number, T.string]),
    noLink: T.bool,
    onPageChange: T.func,
    children: T.oneOfType([T.number, T.string]),
  };

  render() {
    const {
      className,
      attributeName = 'page',
      value,
      noLink,
      onPageChange,
      children,
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
        <LinkOrSpan {...props} onClick={() => !noLink && onPageChange && onPageChange()}>
          {children || value}
        </LinkOrSpan>
      </li>
    );
  }
}
/*:: type PreviousTextProps = {
  previous: number,
  current: number,
  onPageChange: func,
}; */
class PreviousText extends PureComponent /*:: <PreviousTextProps> */ {
  static propTypes = {
    previous: T.number.isRequired,
    current: T.number.isRequired,
    onPageChange: T.func,
  };

  render() {
    const { previous, current, onPageChange } = this.props;
    return (
      <PaginationItem
        value={previous}
        noLink={previous === current}
        onPageChange={onPageChange}
      >
        Previous
      </PaginationItem>
    );
  }
}
/*:: type FirstProps = {
  first: number,
  current: number,
  onPageChange: func,
}; */
class First extends PureComponent /*:: <FirstProps> */ {
  static propTypes = {
    first: T.number.isRequired,
    current: T.number.isRequired,
    onPageChange: T.func,
  };

  render() {
    const { first, current, onPageChange } = this.props;
    if (first === current) return null;
    return <PaginationItem value={first} onPageChange={onPageChange} />;
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
  onPageChange: func,
}; */
class Previous extends PureComponent /*:: <PreviousProps> */ {
  static propTypes = {
    first: T.number.isRequired,
    previous: T.number.isRequired,
    current: T.number.isRequired,
    onPageChange: T.func,
  };

  render() {
    const { first, previous, current, onPageChange } = this.props;
    if (previous === current || previous === first) return null;
    return <PaginationItem value={previous} onPageChange={onPageChange} />;
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
  last: number,
  onPageChange: func,
}; */
class Next extends PureComponent /*:: <NextProps> */ {
  static propTypes = {
    current: T.number.isRequired,
    next: T.number.isRequired,
    last: T.number.isRequired,
    onPageChange: T.func,
  };

  render() {
    const { current, next, last, onPageChange } = this.props;
    if (next === current || last <= current) return null;
    return <PaginationItem value={next} onPageChange={onPageChange} />;
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
  onPageChange: func,
}; */
class NextText extends PureComponent /*:: <NextTextProps> */ {
  static propTypes = {
    current: T.number.isRequired,
    next: T.number.isRequired,
    onPageChange: T.func,
  };

  render() {
    const { current, next, onPageChange } = this.props;
    return (
      <PaginationItem
        value={next}
        noLink={current === next}
        onPageChange={onPageChange}
      >
        Next
      </PaginationItem>
    );
  }
}

const NumberedPaginationLinks = ({ pagination, actualSize, onPageChange }) => {
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
      <PreviousText previous={previous} current={current} onPageChange={onPageChange} />
      <First first={first} current={current} onPageChange={onPageChange} />
      <PreviousDotDotDot first={first} previous={previous} onPageChange={onPageChange} />
      <Previous first={first} previous={previous} current={current} onPageChange={onPageChange} />
      <Current current={current} onPageChange={onPageChange} />
      <Next current={current} next={next} last={last} onPageChange={onPageChange} />
      <NextDotDotDot next={next} last={last} onPageChange={onPageChange} />
      <NextText current={current} next={next} onPageChange={onPageChange} />
    </>
  );
};
NumberedPaginationLinks.propTypes = {
  actualSize: T.number,
  pagination: T.object.isRequired,
  onPageChange: T.func,
};

const CursorPaginationItem = ({ cursor, label, onPageChange }) => (
  <PaginationItem
    value={cursor || '_'}
    noLink={!cursor}
    attributeName="cursor"
    onPageChange={onPageChange}
  >
    {label}
  </PaginationItem>
);
CursorPaginationItem.propTypes = {
  cursor: T.string,
  label: T.string,
  onPageChange: T.func,
};

const CursorPaginationLinks = ({ next, previous, onPageChange }) => (
  <>
    <CursorPaginationItem cursor={previous} label="Previous" onPageChange={onPageChange} />
    <CursorPaginationItem cursor={next} label="Next" onPageChange={onPageChange} />
  </>
);
CursorPaginationLinks.propTypes = {
  next: T.string,
  previous: T.string,
  onPageChange: T.func,
};

const Footer = (
  {
    withPageSizeSelector,
    actualSize,
    pagination,
    notFound,
    nextAPICall,
    previousAPICall,
    onPageChange,
  } /*: {withPageSizeSelector: boolean, actualSize: number, pagination: Object, notFound: boolean, nextAPICall: string, previousAPICall: string, onPageChange: func } */,
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
                onPageChange={onPageChange}
              />
            ) : (
              <NumberedPaginationLinks
                pagination={pagination}
                actualSize={actualSize}
                onPageChange={onPageChange}
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
  onPageChange: T.func,
};

export default Footer;
