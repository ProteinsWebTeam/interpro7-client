// @flow
import React, { PureComponent, cloneElement } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import classnames from 'classnames/bind';

import style from './style.css';

const s = classnames.bind(style);

// const HALF_VISIBLE = 0.5;
// const VISIBLE = 1;

class Loading extends PureComponent {
  static propTypes = {
    data: T.shape({
      keyUrl: T.string,
      loading: T.bool.isRequired,
      data: T.object,
      error: T.any,
    }),
    component: T.func,
    children: T.element,
  };

  state = {};

  componentWillMount() {
    const { data, component } = this.props;
    if (this.shouldSetState({ data, component }))
      this.setState({ data, component });
  }

  componentWillReceiveProps({ data, component }) {
    if (this.shouldSetState({ data, component }))
      this.setState({ data, component });
  }

  shouldSetState({ data, component }) {
    return (
      data &&
      component &&
      !data.loading &&
      (!component.dataUrlMatch || component.dataUrlMatch.test(data.urlKey))
    );
  }

  render() {
    const {
      data: { loading },
      children: _,
      component: Component,
      ...otherProps
    } = this.props;
    const { data, children } = this.state;

    return (
      <div id="content" role="main" className={style.wrapper}>
        <div className={s('overlay', { loading })}>Loading</div>
        <div className={s('container', { loading })}>
          {data && children ? (
            cloneElement(children, { ...otherProps, ...data })
          ) : (
            <div>Loading…</div>
          )}
          {data && Component ? (
            <Component {...otherProps} {...data} />
          ) : (
            <div>Loading…</div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(state => state.data, data => ({ data }));

export default connect(mapStateToProps)(Loading);
