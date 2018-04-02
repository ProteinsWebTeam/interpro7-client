// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { customLocationSelector } from 'reducers/customLocation';

import { ErrorMessage } from 'higherOrder/loadable/LoadingComponent';

const defaultRenderOnError = _ => <ErrorMessage />;

/*:: type ReactError = {|
  error: Error,
  info: {
    componentStack: string,
  },
|}; */

/*:: type Props = {
  children: React$Node,
  renderOnError?: ?ReactError => React$Node,
  customLocation: Object,
}; */

/*:: type State = {|
  error: ?ReactError,
|}; */

// This component should be inserted before any possibly “risky” component
// Acts as a try/catch, preventing the rest of the website to crash
// Ideally to be inserted before any <Switch> or complex visualisation widget
class ErrorBoundary extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    children: T.node.isRequired,
    renderOnError: T.func,
    customLocation: T.object.isRequired,
  };

  static getDerivedStateFromProps() {
    // Any change in props should reset the error state, and try to re-render
    return { error: null };
  }

  constructor(props /*: Props */) {
    super(props);

    this.state = { error: null };
  }

  componentDidCatch(error /*: Error */, info /*: any */) {
    console.error(error);
    console.warn(info);
    this.setState({ error: { error, info } });
  }

  render() {
    const { renderOnError = defaultRenderOnError, children } = this.props;
    const { error } = this.state;
    if (error && typeof error === 'object') {
      return renderOnError(error);
    }
    return children;
  }
}

const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);
export default connect(mapStateToProps)(ErrorBoundary);
