import React, {PropTypes as T, Component} from 'react';

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

  async componentWillMount() {
    try {
      const module = await this.props.getComponent();
      this.setState({Component: module.default});
    } catch (err) {/*  */}
  }

  render() {
    const {placeHolder, getComponent: _, ...props} = this.props;
    const {Component = placeHolder} = this.state;
    return Component ? <Component {...props} /> : null;
  }
};

const defaultPlaceHolder = () => <div>Loading...</div>;

export const createAsyncComponent = (importFn/* : function */, placeHolder) => (
  class extends Component {
    static displayName = 'AsyncComponent';

    static defaultProps = {placeHolder: placeHolder || defaultPlaceHolder};

    static propTypes = {
      placeHolder: T.any,
    };

    constructor(props) {
      super(props);
      this.state = {};
    }

    async componentWillMount() {
      if (this.state.Component) return;
      try {
        const module = await importFn();
        this.setState({Component: module.default});
      } catch (err) {
        console.error(err);
      }
    }

    render() {
      const {placeHolder, ...props} = this.props;
      const {Component = placeHolder} = this.state;
      return Component ? <Component {...props} /> : null;
    }
  }
);

export default AsyncComponent;
