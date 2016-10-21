import React, {PropTypes as T, Component} from 'react';

import {foundationPartial} from 'styles/foundation';
import s from './style.css';
const fPlus = foundationPartial(s);

class Exporter extends Component {
  static propTypes = {
    children: T.any,
  };

  constructor(props){
    super(props);
    this.state = {isOpen: false};
  }
  render(){
    const {children} = this.props;
    return (
      <div
        className={fPlus('button-group', 'float-right', 'exporter')}
      >
        <a
          className={fPlus('arrow-only', 'button', 'dropdown', 'hover')}
          onClick={() => {
            this.setState({isOpen: !this.state.isOpen});
          }}
          style={{margin: 0}}
        >
          <span className={fPlus('show-for-sr')}>Get data</span>Get data </a>
        <div
          className={fPlus(
            'dropdown-pane',
            'left',
            'dropdown-content')
          }
          style={{
            transform: `scaleY(${this.state.isOpen ? 1 : 0})`,
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
export default Exporter;
