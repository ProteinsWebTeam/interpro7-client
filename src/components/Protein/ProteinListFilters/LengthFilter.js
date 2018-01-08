// @flow
import React, { Component } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';

import { goToCustomLocation } from 'actions/creators';

import classname from 'classnames/bind';
import styles from './style.css';
const s = classname.bind(styles);

class LengthFilter extends Component {
  static propTypes = {
    dataReviewed: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    description: T.object,
    search: T.object,
  };

  constructor() {
    super();
    this.max = 40000;
    this.state = { from: 0, to: this.max };
  }

  componentWillMount() {
    const { search: { protein_length: pl } } = this.props;
    const [from, to] = pl ? pl.split('-').map(a => +a) : [0, this.max];
    this.setState({ from, to });
  }

  handleChange = () => {
    const vals = [+this.input1.value, +this.input2.value].sort((a, b) => a - b);
    const waitingTime = 500;
    this.setState({ from: vals[0], to: vals[1] });
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      const vals = [+this.input1.value, +this.input2.value].sort(
        (a, b) => a - b,
      );
      this.setState({ from: vals[0], to: vals[1] });
      this.props.goToCustomLocation(location => ({
        ...location,
        search: {
          ...location.search,
          protein_length: `${vals[0]}-${vals[1]}`,
        },
      }));
      this.timer = null;
    }, waitingTime);
  };

  render() {
    return (
      <div>
        {this.state.from}
        <br />
        <div className={s('multirange')}>
          <input
            ref={i => (this.input1 = i)}
            type="range"
            min="0"
            max={this.max}
            value={this.state.from}
            onChange={this.handleChange}
            className={s('original')}
          />
          <input
            ref={i => (this.input2 = i)}
            type="range"
            min="0"
            max={this.max}
            value={this.state.to}
            onChange={this.handleChange}
            className={s('ghost')}
          />
        </div>
        <br />
        {this.state.to}
      </div>
    );
  }
}

export default connect(null, { goToCustomLocation })(LengthFilter);
