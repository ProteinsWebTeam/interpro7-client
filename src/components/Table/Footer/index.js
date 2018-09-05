/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React, { PureComponent } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import PageSizeSelector from '../PageSizeSelector';
import NumberComponent from 'components/NumberComponent';

import config from 'config';

import { foundationPartial } from 'styles/foundation';

import s from '../style.css';

const f = foundationPartial(s);

const toFunctionFor = page => customLocation => ({
  ...customLocation,
  search: { ...customLocation.search, page },
});

class PaginationItem extends PureComponent {
  static propTypes = {
    className: T.string,
    value: T.number,
    noLink: T.bool,
    children: T.oneOfType([T.number, T.string]),
    duration: T.number,
  };

  render() {
    const { className, value, noLink, children, duration } = this.props;
    const LinkOrSpan = !value || noLink ? 'span' : Link;
    const props = {};
    if (value) {
      if (noLink) {
        props.className = f('no-link');
      } else {
        props.to = toFunctionFor(value);
      }
    }
    return (
      <li className={className}>
        <LinkOrSpan {...props}>
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

class PreviousText extends PureComponent {
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

class First extends PureComponent {
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

class PreviousDotDotDot extends PureComponent {
  static propTypes = {
    first: T.number.isRequired,
    previous: T.number.isRequired,
  };

  render() {
    if (this.props.previous - 1 <= this.props.first) return null;
    return <PaginationItem className={f('ellipsis')} />;
  }
}

class Previous extends PureComponent {
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

class Current extends PureComponent {
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

class Next extends PureComponent {
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

class NextDotDotDot extends PureComponent {
  static propTypes = {
    next: T.number.isRequired,
    last: T.number.isRequired,
  };

  render() {
    if (this.props.next + 1 >= this.props.last) return null;
    return <PaginationItem className={f('ellipsis')} />;
  }
}

class NextText extends PureComponent {
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

const Footer = ({
  withPageSizeSelector /*: boolean */,
  actualSize /*: number */,
  pagination /*: Object */,
  notFound,
}) => {
  if (notFound) return null;

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
    <div className={f('table-footer')}>
      <div className={f('table-footer-content')}>
        {withPageSizeSelector && <PageSizeSelector search={pagination} />}
        <div className={f('pagination-box')}>
          <ul
            className={f('pagination', 'text-right')}
            role="navigation"
            aria-label="Pagination"
          >
            <PreviousText previous={previous} current={current} />
            <First first={first} current={current} />
            <PreviousDotDotDot first={first} previous={previous} />
            <Previous first={first} previous={previous} current={current} />
            <Current current={current} />
            <Next current={current} next={next} last={last} />
            <NextDotDotDot next={next} last={last} />
            <NextText current={current} next={next} />
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
