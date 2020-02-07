import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import ProtvistaOverlay from 'protvista-overlay';
import loadWebComponent from 'utils/load-web-component';

/*:: type Props = {
  elementId: string,
  stuck: boolean,
};*/

class ZoomOverlay extends PureComponent /*:: <Props> */ {
  static propTypes = {
    elementId: T.string.isRequired,
    stuck: T.bool.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);
    this._ref = React.createRef();
  }

  async componentDidMount() {
    await loadWebComponent(() => ProtvistaOverlay).as('protvista-overlay');
  }

  componentDidUpdate(prevProps /*: Props */) {
    if (prevProps.stuck !== this.props.stuck) {
      this._ref.current?.refreshOverlay(this.props.elementId)();
    }
  }

  render() {
    const { elementId } = this.props;
    return <protvista-overlay for={elementId} ref={this._ref} />;
  }
}

const mapStateToProps = createSelector(
  state => state.ui.stuck,
  stuck => ({ stuck }),
);

export default connect(mapStateToProps)(ZoomOverlay);
