import React, {PureComponent} from 'react';
import T from 'prop-types';
import {connect} from 'react-redux';

import {stick, unstick} from 'actions/creators';

import styles from './style.css';

// Default, use IntersectionObserver
const listenScrolledIO = (element, {stick, unstick}) => {
  // IntersectionObserver to be used on the EBI header
  const io = new IntersectionObserver(([{intersectionRatio: notStuck}]) => {
    // If the EBI header is visible, display full banner
    notStuck ? unstick() : stick();
  }, {threshold: [1]});
  io.observe(element);
  return ({
    unsubscribe() {
      io.disconnect();
    },
  });
};

// Fallback to event listener
const listenScrolledEventListener = ({stick, unstick, top}) => {
  let isStuck = false;
  const checkStickyness = () => {
    const isNowStuck = window.scrollY > top;
    // Detect if stickyness status has changed
    if (isNowStuck !== isStuck) {
      // Trigger reducers if it has changed
      isNowStuck ? stick() : unstick();
      isStuck = isNowStuck;
    }
  };
  window.addEventListener('resize', checkStickyness, {passive: true});
  window.addEventListener('scroll', checkStickyness, {passive: true});
  // Run once, just in case
  checkStickyness();
  return ({
    unsubscribe() {
      window.removeEventListener('resize', checkStickyness);
      window.removeEventListener('scroll', checkStickyness);
    },
  });
};

const listenScrolled = (element, args) => {
  if (!window) return {unsubscribe() {}};
  if (window.IntersectionObserver) {
    return listenScrolledIO(element, args);
  }
  return listenScrolledEventListener(args);
};

class Sentinel extends PureComponent {
  static defaultProps = {
    top: 0,
  };

  static propTypes = {
    top: T.number.isRequired,
    stick: T.func.isRequired,
    unstick: T.func.isRequired,
  };

  componentDidMount() {
    this._subscription = listenScrolled(this._element, this.props);
  }

  componentWillUnmount() {
    this._subscription.unsubscribe();
  }

  render() {
    const {top} = this.props;
    return (
      <span
        className={styles.sentinel}
        style={{top: `${top}px`}}
        ref={element => {
          this._element = element;
        }}
      />
    );
  }
}

export default connect(null, {stick, unstick})(Sentinel);
