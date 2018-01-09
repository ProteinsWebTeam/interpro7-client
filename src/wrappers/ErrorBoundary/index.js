// @flow
import { PureComponent, createElement } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

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
  customLocation: Object,
}; */

/*:: type State = {
  error: ?ReactError,
}; */

// This component should be inserted before any possibly “risky” component
// Acts as a try/catch, preventing the rest of the website to crash
// Ideally to be inserted before any <Switch> or complex visualisation widget
class ErrorBoundary extends PureComponent /*:: <Props, State> */ {
  static defaultProps = {
    errorComponent: ErrorMessage,
  };

  static propTypes = {
    children: T.node.isRequired,
    errorComponent: T.any,
    customLocation: T.object,
  };

  constructor(props /*: Props */) {
    super(props);
    this.state = { error: null };
  }

  componentWillReceiveProps({ customLocation }) {
    // If the location is changing, the children should be
    // rendered again
    if (this.props.customLocation !== customLocation) {
      this.setState({ error: null });
    }
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

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);
export default connect(mapStateToProps)(ErrorBoundary);
