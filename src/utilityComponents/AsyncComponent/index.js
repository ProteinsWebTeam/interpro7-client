/* globals require: false */
import React, {PropTypes as T, Component} from 'react';

export default class extends Component {
  static displayName = 'AsyncComponent';

  static propTypes = {
    componentPath: T.string.isRequired,
    trigger: T.shape({
      then: T.func.isRequired,
    }).isRequired,
    placeHolder: T.oneOfType([T.func, T.string]),
  };

  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {componentPath, placeHolder, ...props} = this.props;
    const {Component = placeHolder} = this.state;
    /* trigger.then(() => require.ensure(
      componentPath,
      require => this.setState({Component: require(componentPath).default}),
      componentPath.replace(/^.*\//, '')
    ))().catch((e) => {console.error(e)}); */
    require.ensure([], require => {
      const Component = require(componentPath).default;
      this.setState({Component});
    });
    return Component ? <Component {...props} /> : null;
  }
}
