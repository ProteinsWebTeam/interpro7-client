import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';

import {stick, unstick} from 'actions/creators';
import {sticky as supportsSticky} from 'utils/support';

import styles from './style.css';

const listenScrolled = (element, {top, stick, unstick}) => {
  const output = {unsubscribe() {}};
  if (!window) return output;
  console.log(element);
  if (supportsSticky) {
    // IntersectionObserver to be used on the EBI header
    const io = new IntersectionObserver(([{intersectionRatio: notStuck}]) => {
      // If the EBI header is visible, display full banner
      notStuck ? unstick() : stick();
    });
    io.observe(element);
    output.unsubscribe = () => {
      io.disconnect();
    };
  } else {
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
    output.unsubscribe = () => {
      window.removeEventListener('resize', checkStickyness);
      window.removeEventListener('scroll', checkStickyness);
    };
  }
  return output;
};

const Sentinel = class extends Component {
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
        aria-visible="false"
        className={styles.sentinel}
        style={{top: `${top}px`}}
        ref={element => {
          this._element = element;
        }}
      />
    );
  }
};

export default connect(null, {stick, unstick})(Sentinel);
