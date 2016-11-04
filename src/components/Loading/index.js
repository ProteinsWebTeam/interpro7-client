import React, {PropTypes as T, Component, cloneElement} from 'react';
import {connect} from 'react-redux';

import classnames from 'classnames/bind';

import style from './style.css';

const s = classnames.bind(style);

const HALF_VISIBLE = 0.5;
const VISIBLE = 1;

class Loading extends Component {
  static propTypes = {
    data: T.shape({
      keyUrl: T.string,
      loading: T.bool.isRequired,
      data: T.object,
      error: T.any,
    }),
    children: T.element,
  };

  state = {};

  componentWillMount() {
    const {data, children} = this.props;
    if (this.shouldSetState({data, children})) this.setState({data, children});
  }

  componentWillReceiveProps({data, children}) {
    if (this.shouldSetState({data, children})) this.setState({data, children});
  }

  shouldSetState({data, children}) {
    return (
      data && children && !data.loading &&
      (!children.dataUrlMatch || children.dataUrlMatch.test(data.urlKey))
    );
  }

  render() {
    const {data: {loading}, children: _, ...otherProps} = this.props;
    const {data, children} = this.state;

    return (
      <div id="content" role="main" className={style.wrapper}>
        <div className={s('overlay', {loading})}>Loading</div>
        <div className={s('container', {loading})}>
          {data && children ?
            cloneElement(children, {...otherProps, ...data}) :
            <div>Loading...</div>
          }
        </div>
      </div>
    );
  }
}

export default connect(({data}) => ({data}))(Loading);
