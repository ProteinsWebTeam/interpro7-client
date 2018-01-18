// @flow
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4] }]*/
import React, { PureComponent } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';

import config from 'config';

import { foundationPartial } from 'styles/foundation';

import s from '../style.css';

const f = foundationPartial(s);

class PaginationItem extends PureComponent {
  static propTypes = {
    className: T.string,
    value: T.number,
    children: T.oneOfType([T.number, T.string]),
  };

  render() {
    const { className, value, children } = this.props;
    const LinkOrFragment = value ? Link : React.Fragment;
    return (
      <li className={className}>
        <LinkOrFragment
          to={customLocation => ({
            ...customLocation,
            search: {
              ...customLocation.search,
              page: value,
            },
          })}
        >
          {(value && children) || value}
        </LinkOrFragment>
      </li>
    );
  }
}

class PreviousText extends PureComponent {
  static propTypes = {
    previous: T.number.isRequired,
  };

  render() {
    return (
      <PaginationItem value={this.props.previous}>Previous</PaginationItem>
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
      <PaginationItem className={f('current')} value={this.props.current} />
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
    if (next === current || next === last) return null;
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

class Last extends PureComponent {
  static propTypes = {
    current: T.number.isRequired,
    last: T.number.isRequired,
  };

  render() {
    const { current, last } = this.props;
    if (last === current) return null;
    return <PaginationItem value={last} />;
  }
}

class NextText extends PureComponent {
  static propTypes = {
    next: T.number.isRequired,
  };

  render() {
    return <PaginationItem value={this.props.next}>Next</PaginationItem>;
  }
}

const Footer = ({
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

  const props = { first, previous, current, next, last };

  return (
    <div className={f('pagination-box')}>
      <ul
        className={f('pagination', 'text-right')}
        role="navigation"
        aria-label="Pagination"
      >
        <PreviousText {...props} />
        <First {...props} />
        <PreviousDotDotDot {...props} />
        <Previous {...props} />
        <Current {...props} />
        <Next {...props} />
        <NextDotDotDot {...props} />
        <Last {...props} />
        <NextText {...props} />
      </ul>
    </div>
  );
};
Footer.propTypes = {
  data: T.array,
  actualSize: T.number,
  pagination: T.object.isRequired,
  notFound: T.bool,
};

export default Footer;
