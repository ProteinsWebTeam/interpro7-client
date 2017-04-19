/* eslint react/no-multi-comp: ["off"] */
import React, {PropTypes as T, Component} from 'react';

import cancelable from 'utils/cancelable';

const AsyncComponent = class extends Component {
  static displayName = 'AsyncComponent';

  static propTypes = {
    getComponent: T.func.isRequired,
    placeHolder: T.oneOfType([T.func, T.string]),
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.state.Component) return;
    this._moduleP = cancelable(this.props.getComponent());
    this._moduleP.promise.then(
      module => this.setState({Component: module.default || module})
    ).catch(error => {
      if (!error.canceled) console.error(error);
    });
  }

  componentWillUnmount() {
    this._moduleP.cancel();
  }

  render() {
    const {placeHolder, getComponent: _, ...props} = this.props;
    const {Component = placeHolder} = this.state;
    return Component ? <Component {...props} /> : null;
  }
};

const defaultPlaceHolder = () => <div>Loading...</div>;

export const createAsyncComponent = (importFn/* : function */, placeHolder) => {
  let imported;
  return class AsyncComponent extends Component {
    static displayName = 'AsyncComponent';

    static defaultProps = {placeHolder: placeHolder || defaultPlaceHolder};
    static propTypes = {
      placeHolder: T.any,
    };

    static preload() {
      if (imported) return;
      imported = importFn();
    }

    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      if (this.state.Component) return;
      AsyncComponent.preload();
      this._moduleP = cancelable(imported);
      this._moduleP.promise.then(
        module => this.setState({Component: module.default || module})
      ).catch(error => {
        if (!error.canceled) throw error;
      });
    }

    componentWillUnmount() {
      this._moduleP.cancel();
    }

    render() {
      const {placeHolder, ...props} = this.props;
      const {Component = placeHolder} = this.state;
      return Component ? <Component {...props} /> : null;
    }
  };
};

export default AsyncComponent;
