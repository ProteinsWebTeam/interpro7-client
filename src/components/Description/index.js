/* @flow */
/* eslint no-magic-numbers: [1, {ignore: [2]}] */
import React, {PropTypes as T, Component} from 'react';

// import ReadMoreCard from 'components/ReadMoreCard';

import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import styles from './style.css';
const f = foundationPartial(ebiStyles, styles);

import {transformFormatted} from 'utils/text';

const ParagraphWithCites = ({p, literature}) => (
  <p>
    {p.split( /<cite id="([^"]+)" ?\/>/i /*/\[(PUB\d+)\]/i*/).map((part, i) => {
      const refCounter = Object.keys(literature).indexOf(part)+1;
      return (
      i % 2 ?
        <a key={i} href={`${location.pathname}#${part}`}>{refCounter}</a> :
        <span key={i}>{part}</span>
    )})}
  </p>
);
ParagraphWithCites.propTypes = {
  p: T.string.isRequired,
  literature: T.object.isRequired,
};

class Description extends Component {
  static propTypes = {
    children: T.any,
  };

  constructor(props) {
    super(props);
    this.state = {isOpen: false};
    this.handleClick = this.handleClick.bind(this);

  }
  handleClick(){
    this.setState({isOpen: !this.state.isOpen});
  }
  render(){
    const {textBlocks, literature} = this.props,
      maxNumberOfChars = 500,
      hide = textBlocks.length < 2 && textBlocks[0].length < maxNumberOfChars;
    return (
      <div className={f('content')}>
        <h4>Description</h4>
        <div
          className={f('animate-height', {collapsed: !this.state.isOpen})}
          style={{maxHeight: this.state.isOpen ? '5000px' : '200px'}}
        >
          {textBlocks.map((b, i) => (
            <div key={i}>
              {transformFormatted(b).map((p, i) => (
                <ParagraphWithCites key={i} p={p} literature={literature}/>
              ))}
            </div>
          ))}
        </div>
        <br/>
        <button
          className={f('button', 'secondary', {hidden: hide})}
          id="show-more"
          onClick={this.handleClick}
        >
          Read {this.state.isOpen ? 'less' : 'more'} about this entry
        </button>
      </div>

    );
  }
}
Description.propTypes = {
  textBlocks: T.array.isRequired,
  literature: T.object.isRequired,
};
export default Description;
