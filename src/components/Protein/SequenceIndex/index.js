import React, {Component} from 'react';

import seqStyles from '../Sequence/style.css';

class SequenceIndex extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      lineLength: 100,
      numberOfLines: 10,
    };
  }

  setLineLength(lineLength) {
    this.state.setState({lineLength});
  }

  setNumberOfLines(numberOfLines) {
    this.state.setState({numberOfLines});
  }

  render() {
    const {numberOfLines, lineLength} = this.state.numberOfLines;
    const lines = [...Array(numberOfLines).keys()]
      .map(e => 1 + e * lineLength);
    return (
      <div className={seqStyles.sequence_index}>
        {lines.map((e, i) => <div key={i}>{e}</div>)}
      </div>
    );
  }
}

export default SequenceIndex;
