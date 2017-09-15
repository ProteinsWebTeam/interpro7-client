// @flow
import { PureComponent, createElement } from 'react';
import T from 'prop-types';

import { ErrorMessage } from 'higherOrder/loadable/LoadingComponent';

/*:: type ReactError = {
  error: Error,
  info: {
    componentStack: string,
  },
}; */
/*:: type Props = {
  children: React$Node,
  errorComponent: React$ElementType,
}; */
/*:: type State = {
  error: ?ReactError,
}; */

// This clcomponent should be inserted before any possibly “risky” component
// Acts as a try/cacth, preventing the rest of the website to crash
// Ideally to be inserted before any <Switch> or complex visualisation widget
class ErrorBoundary extends PureComponent /*:: <Props, State> */ {
  static defaultProps = {
    errorComponent: ErrorMessage,
  };

  static propTypes = {
    children: T.node.isRequired,
    errorComponent: T.element,
  };

  constructor(props /*: Props */) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error /*: Error */, info /*: any */) {
    console.error(error);
    console.error(info);
    this.setState({ error: { error, info } });
  }

  render() {
    const { error } = this.state;
    if (error && typeof error === 'object') {
      return createElement(this.props.errorComponent, error);
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
