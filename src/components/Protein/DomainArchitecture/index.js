import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import PopperJS from 'popper.js';

import path2description from 'utils/processLocation/path2description';
import { goToNewLocation } from 'actions/creators';

import EntryComponent from './entry_component';
import { EntryColorMode } from './entry';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts);

const requestFullScreen = element => {
  if ('requestFullscreen' in element) {
    element.requestFullscreen();
  }
  if ('webkitRequestFullscreen' in element) {
    element.webkitRequestFullscreen();
  }
  if ('mozRequestFullScreen' in element) {
    element.mozRequestFullScreen();
  }
  if ('msRequestFullscreen' in element) {
    element.msRequestFullscreen();
  }
};
const areMergedDataTheSame = (prev, next) => {
  if (Object.keys(prev).length !== Object.keys(next).length) return false;
  for (const key in prev) {
    if (prev[key].length !== next[key].length) return false;
    for (let i = 0; i < prev[key].length; i++) {
      if (JSON.stringify(prev[key][i]) !== JSON.stringify(next[key][i]))
        return false;
    }
  }
  return true;
};

class DomainArchitecture extends Component {
  static propTypes = {
    protein: T.object,
    data: T.object,
    goToNewLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      entryHovered: null,
      colorMode: EntryColorMode.COLOR_MODE_DOMAIN_RELATIONSHIP,
    };
  }

  componentDidMount() {
    const { protein, data } = this.props;
    this.ec = new EntryComponent(this._container, protein, data);
    this.ec.on('entryclick', e => {
      if (e.link) {
        this.props.goToNewLocation({ description: path2description(e.link) });
      }
    });
    this.ec.on('entrymouseover', e => {
      this._popper.classList.remove(f('hide'));
      if (e.hasOwnProperty('entry')) {
        this._popper.appendChild(this.getElementFromEntry(e.entry));
      }
      if (e.hasOwnProperty('residue')) {
        this._popper.appendChild(this.getElementFromResidue(e.residue));
      }
      this.popper = new PopperJS(e.event.g[0], this._popper, {
        placement: 'top',
        applyStyle: { enabled: false },
      });
    });
    this.ec.on('entrymouseout', () => {
      this._popper.removeChild(this._popper.lastChild);
      this.popper.destroy();
      this._popper.classList.add(f('hide'));
    });
  }

  // shouldComponentUpdate() {
  //   return false;
  // }
  componentWillReceiveProps(nextProps) {
    if (!areMergedDataTheSame(this.props.data, nextProps.data)) {
      this.ec.data = nextProps.data;
    }
  }

  componentWillUnmount() {
    this.ec.destructor();
  }

  handleCollapse = () => {
    this.ec.collapseAll();
  };

  handleExpand = () => {
    this.ec.expandAll();
  };

  handleFullScreen = () => {
    requestFullScreen(this._main);
  };

  getElementFromEntry(entry) {
    const tagString = `<div>
        <h4>${entry.label || entry.accession}</h4>
        <p>${entry.entry_type || ''}</p>
        <p>${
          Array.isArray(entry.source_database)
            ? entry.source_database[0]
            : entry.source_database
        }
          ${entry.entry ? `(${entry.entry})` : ''}
        </p>
      </div>`;
    const range = document.createRange();
    range.selectNode(document.getElementsByTagName('div').item(0));
    return range.createContextualFragment(tagString);
  }

  getElementFromResidue(residue) {
    const tagString = `<div>
        <h4>${residue.name} (${residue.residue})</h4>
        <p>${
          residue.from === residue.to
            ? residue.from
            : `${residue.from}-${residue.to}`
        }</p>
        <p>${residue.description}</p>
      </div>`;
    const range = document.createRange();
    range.selectNode(document.getElementsByTagName('div').item(0));
    return range.createContextualFragment(tagString);
  }

  changeColor = evt => {
    const newValue = Number(evt.target.value);
    this.setState({ colorMode: newValue });
    this.ec.changeColorMode(newValue);
  };

  render() {
    return (
      <div ref={e => (this._main = e)} className={f('fullscreenable')}>
        <div className={f('row')}>
          <div className={f('columns')}>
            <div className={f('buttons')}>
              Color By:{' '}
              <select
                className={f('select-inline')}
                value={this.state.colorMode}
                onChange={this.changeColor}
                onBlur={this.changeColor}
              >
                <option value={EntryColorMode.COLOR_MODE_ACCESSION}>
                  Accession
                </option>
                <option value={EntryColorMode.COLOR_MODE_MEMBERDB}>
                  Member Database
                </option>
                <option value={EntryColorMode.COLOR_MODE_DOMAIN_RELATIONSHIP}>
                  Domain Relationship
                </option>
              </select>
              &nbsp;|&nbsp;
              <button onClick={this.handleCollapse}>Collapse All</button>
              &nbsp;|&nbsp;
              <button onClick={this.handleExpand}>Expand All</button>
              &nbsp;|&nbsp;
              <button
                onClick={this.handleFullScreen}
                data-icon="F"
                title="Full screen"
                className={f('fullscreen', 'icon', 'icon-functional')}
              />
            </div>
          </div>
        </div>
        <div ref={e => (this._container = e)} className={f('row')} />
        <div ref={e => (this._popper = e)} className={f('popper', 'hide')}>
          <div className={f('popper__arrow')} />
        </div>
      </div>
    );
  }
}

export default connect(null, { goToNewLocation })(DomainArchitecture);
