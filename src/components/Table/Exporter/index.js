import React, { Component } from 'react';
import Link from 'components/generic/Link';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import fonts from 'EBI-Icon-fonts/fonts.css';
import { foundationPartial } from 'styles/foundation';
import s from './style.css';
const fPlus = foundationPartial(s, fonts);
const colors = {
  gene3d: '#a88cc3',
  cdd: '#addc58',
  hamap: '#2cd6d6' /*00e2e2*/,
  mobidblt: '#d6dc94',
  panther: '#bfac92',
  pfam: '#6287b1',
  pirsf: '#dfafdf',
  prints: '#71ce79',
  prodom: '#8d99e4',
  profile: '#f69f74',
  prosite: '#f3c766',
  sfld: '#00b1d3',
  smart: '#ff7a76',
  ssf: '#686868',
  tigrfams: '#4f9294',
  InterPro: '#2daec1',
};

class Exporter extends Component {
  static propTypes = {
    mainDB: T.string.isRequired,
    children: T.any,
  };

  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }
  render() {
    const { children, mainDB } = this.props;
    return (
      <div className={fPlus('button-group', 'small', 'exporter')}>
        <a
          className={fPlus('button', 'dropdown')}
          style={{ backgroundColor: colors[mainDB] ? colors[mainDB] : null }}
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
        <Link
          newTo={{ description: { other: 'settings' } }}
          className={fPlus(
            'icon',
            'icon-functional',
            'icon-settings',
            'show-for-large',
          )}
          data-icon="s"
        />
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
const mapStateToProps = createSelector(
  state => state.newLocation.description.mainDB,
  mainDB => ({ mainDB }),
);
export default connect(mapStateToProps)(Exporter);
