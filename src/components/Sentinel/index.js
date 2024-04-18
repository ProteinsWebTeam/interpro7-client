import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { stick, unstick } from 'actions/creators';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import styles from './style.css';

/*:: type Props = {
  top: number,
  stick: function,
  unstick: function,
}; */

class Sentinel extends PureComponent /*:: <Props> */ {
  /*::
    _ref: { current: null | React$ElementRef<'span'> };
  */
  static propTypes = {
    top: T.number.isRequired,
    stick: T.func.isRequired,
    unstick: T.func.isRequired,
    path: T.string.isRequired,
  };

  static defaultProps = {
    top: 0,
  };

  constructor(props /*: Props */) {
    super(props);

    this._ref = React.createRef();
  }

  componentDidMount() {
    this._subscription = this._listenScrolled(this._ref.current, this.props);
  }

  componentWillUnmount() {
    this._subscription.unsubscribe();
  }

  _listenScrolled = (element, args) => {
    if (!window) return { unsubscribe() {} };
    if (window.IntersectionObserver) {
      return this._listenScrolledIO(element, args);
    }
    return this._listenScrolledEventListener(args);
  };
  // Default, use IntersectionObserver
  _listenScrolledIO = (element, { stick, unstick }) => {
    let prevPage = null;
    // IntersectionObserver to be used on the EBI header
    const io = new IntersectionObserver(
      ([{ intersectionRatio: notStuck }]) => {
        // If the EBI header is visible, display full banner
        // const samePage = this.props.path === prevPage;
        // if (notStuck) {
        //   samePage ? stick() : unstick();
        // } else stick();

        notStuck ? unstick() : stick();
        prevPage = this.props.path;
      },
      { threshold: [1] },
    );
    io.observe(element);
    return {
      unsubscribe() {
        io.disconnect();
      },
    };
  };

  // Fallback to event listener
  _listenScrolledEventListener = ({ stick, unstick, top }) => {
    let isStuck = false;
    let prevPage = null;
    const checkStickyness = () => {
      const isNowStuck = window.scrollY > top;
      // Detect if stickyness status has changed
      if (isNowStuck !== isStuck) {
        // Trigger reducers if it has changed

        // const samePage = this.props.path === prevPage;
        // if (isNowStuck) {
        //   stick();
        // } else {
        //   samePage ? stick() : unstick();
        // }
        isNowStuck ? unstick() : stick();
        prevPage = this.props.path;
        isStuck = isNowStuck;
      }
    };
    window.addEventListener('resize', checkStickyness, { passive: true });
    window.addEventListener('scroll', checkStickyness, { passive: true });
    // Run once, just in case
    checkStickyness();
    return {
      unsubscribe() {
        window.removeEventListener('resize', checkStickyness);
        window.removeEventListener('scroll', checkStickyness);
      },
    };
  };

  render() {
    const { top } = this.props;
    return (
      <span
        className={styles.sentinel}
        style={{ top: `${top}px` }}
        ref={this._ref}
      />
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation.description,
  (description) => ({
    path: descriptionToPath(description).split('/')?.[1],
  }),
);

export default connect(mapStateToProps, { stick, unstick })(Sentinel);
