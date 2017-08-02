import React, { Component } from 'react';
import T from 'prop-types';
import fonts from 'styles/ebi/fonts.css';
import { foundationPartial } from 'styles/foundation';
import s from './style.css';
const fPlus = foundationPartial(s, fonts);

class Exporter extends Component {
  static propTypes = {
    children: T.any,
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }
  render() {
    const { children } = this.props;
    return (
      <div
        className={fPlus('button-group', 'small', 'float-right', 'exporter')}
      >
        <a
          className={fPlus('button', 'small', 'hover')}
          title="recent search activity"
        >
          <span className={fPlus('icon', 'icon-generic')} data-icon="{" />{' '}
          Recent search{' '}
        </a>
        <a
          className={fPlus('button', 'dropdown', 'small', 'hover')}
          onClick={() => {
            this.setState({ isOpen: !this.state.isOpen });
          }}
        >
          <span
            className={fPlus('icon', 'icon-functional')}
            data-icon="="
          />{' '}
          Export {' '}
        </a>
        <a className={fPlus('button', 'small', 'hover')}>
          <span className={fPlus('icon', 'icon-functional')} data-icon="s" />
        </a>
        <div
          className={fPlus('dropdown-pane', 'left', 'dropdown-content')}
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
