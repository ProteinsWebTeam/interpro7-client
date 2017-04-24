import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';

import {goToLocation} from '../../../actions/creators';
import Link from 'components/generic/Link';

import classname from 'classnames/bind';
import styles from './style.css';

const s = classname.bind(styles);
class SortHandler extends Component{
  static propTypes = {
    sortField: T.string.isRequired,
    sort_by: T.string.isRequired,
    goToLocation: T.func,
  };
  render() {
    const asc = this.props.sort_by === this.props.sortField;
    const desc = `-${this.props.sortField}` === this.props.sort_by;
    let sortBy = this.props.sortField;
    if (asc) sortBy = `-${this.props.sortField}`;
    if (desc) sortBy = null;

    return (
      <Link to={{
        search: {
          sort_by: sortBy,
          page: 1,
        },
      }}
      >
        <div className={s('sorticon', {desc, asc})} />
      </Link>
    );
  }

}

export default connect(
  ({location: {search: {sort_by}}}) => (
    {sort_by}
  ), {goToLocation}
)(SortHandler);
