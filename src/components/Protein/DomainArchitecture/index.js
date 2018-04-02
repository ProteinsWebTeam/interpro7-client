import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import PopperJS from 'popper.js';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import pathToDescription from 'utils/processDescription/pathToDescription';
import { goToCustomLocation } from 'actions/creators';

import EntryComponent from './entry_component';
import { EntryColorMode } from './entry';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(local, theme, ipro, fonts);

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
  for (const [key, value] of Object.entries(prev)) {
    if (value.length !== next[key].length) return false;
    for (let i = 0; i < value.length; i++) {
      if (JSON.stringify(value[i]) !== JSON.stringify(next[key][i]))
        return false;
    }
  }
  return true;
};

class DomainArchitecture extends PureComponent {
  static propTypes = {
    protein: T.object,
    data: T.object,
    goToCustomLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      entryHovered: null,
      colorMode: EntryColorMode.COLOR_MODE_DOMAIN_RELATIONSHIP,
    };
  }

  componentDidMount() {
    const { protein, data } = this.props;
    this.ec = new EntryComponent(this._container, protein, data);
    this.ec.on('entryclick', e => {
      if (e.link) {
        this.props.goToCustomLocation({
          description: pathToDescription(e.link),
        });
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

  componentDidUpdate(prevProps) {
    if (!areMergedDataTheSame(prevProps.data, this.props.data)) {
      this.ec.data = this.props.data;
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
    const tagString = `<div className={f('info-win')}>
        <h5 style="text-transform: uppercase; font-weight: bold;">${
          entry.accession
        }</h5>
        <p style="text-transform: capitalize;">${entry.entry_type || ''}</p>
        <p style="text-transform: uppercase;">
        <small>${
          Array.isArray(entry.source_database)
            ? entry.source_database[0]
            : entry.source_database
        }
          ${entry.entry ? `(${entry.entry})` : ''}
        </small></p>
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

  _handleCollapseToggle = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  _combiCol = () => {
    this.handleCollapse();
    this._handleCollapseToggle();
  };

  _combiExp = () => {
    this.handleExpand();
    this._handleCollapseToggle();
  };

  render() {
    const { collapsed } = this.state;
    return (
      <div ref={e => (this._main = e)} className={f('fullscreenable')}>
        <div className={f('row', { collapsed })}>
          <div className={f('columns')}>
            <div className={f('view-options-wrap', 'margin-top-medium')}>
              <div className={f('view-options-title')}>Domains on protein</div>
              <div className={f('view-options')}>
                <div className={f('option-color', 'margin-right-large')}>
                  Color By:{' '}
                  <select
                    className={f('select-inline')}
                    value={this.state.colorMode}
                    onChange={this.changeColor}
                    onBlur={this.changeColor}
                  >
                    <option
                      value={EntryColorMode.COLOR_MODE_DOMAIN_RELATIONSHIP}
                    >
                      Domain Relationship
                    </option>
                    <option value={EntryColorMode.COLOR_MODE_MEMBERDB}>
                      Member Database
                    </option>
                    <option value={EntryColorMode.COLOR_MODE_ACCESSION}>
                      Accession
                    </option>
                  </select>
                </div>
                <div className={f('option-collapse')}>
                  {collapsed ? (
                    <Tooltip title="Expand all tracks">
                      <button
                        data-icon="9"
                        // onClick={this.handleExpand}
                        onClick={this._combiExp}
                        // onClick={function(event){ this._handleCollapseToggle(); this.handleExpand();}}
                        // onClick={(event) => { this._handleCollapseToggle; this.handleExpand;}}
                        style={{ outline: '0' }}
                        className={f(
                          'icon',
                          'icon-functional',
                          'margin-right-large',
                          'margin-bottom-none',
                        )}
                        aria-label="Expand all tracks"
                      >
                        {' '}
                        Expand all
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Collapse all tracks">
                      <button
                        data-icon="8"
                        onClick={this._combiCol}
                        style={{ outline: '0' }}
                        className={f(
                          'icon',
                          'icon-functional',
                          'margin-right-large',
                          'margin-bottom-none',
                        )}
                        aria-label="collapse all tracks"
                      >
                        {' '}
                        Collapse all
                      </button>
                    </Tooltip>
                  )}
                </div>

                <div className={f('option-fullscreen')}>
                  <Tooltip title="View the domain viewer in full screen mode">
                    <button
                      onClick={this.handleFullScreen}
                      data-icon="F"
                      title="Full screen"
                      className={f(
                        'margin-bottom-none',
                        'icon',
                        'icon-functional',
                      )}
                      style={{ marginRight: '5.3rem' }}
                    />
                  </Tooltip>
                </div>
              </div>
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

export default connect(null, { goToCustomLocation })(DomainArchitecture);
