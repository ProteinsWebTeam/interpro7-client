import React, { Component } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { isEqual } from 'lodash-es';

import { changeSettingsRaw } from 'actions/creators';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import ProtVistaManager from 'protvista-manager';
import ProtVistaSequence from 'protvista-sequence';
import ProtVistaNavigation from 'protvista-navigation';
import ProtVistaInterProTrack from 'protvista-interpro-track';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import { NOT_MEMBER_DBS } from 'menuConfig';

import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import PopperJS from 'popper.js';

import loadWebComponent from 'utils/load-web-component';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import local from './style.css';

const f = foundationPartial(ipro, local);

const webComponents = [];

const loadProtVistaWebComponents = () => {
  if (!webComponents.length) {
    webComponents.push(
      loadWebComponent(() => ProtVistaManager).as('protvista-manager'),
    );

    webComponents.push(
      loadWebComponent(() => ProtVistaSequence).as('protvista-sequence'),
    );

    webComponents.push(
      loadWebComponent(() => ProtVistaNavigation).as('protvista-navigation'),
    );

    webComponents.push(
      loadWebComponent(() => ProtVistaInterProTrack).as(
        'protvista-interpro-track',
      ),
    );
  }
  return Promise.all(webComponents);
};

const removeAllChildrenFromNode = node => {
  if (node.lastChild) {
    node.removeChild(node.lastChild);
    removeAllChildrenFromNode(node);
  }
};

class ProtVista extends Component {
  static propTypes = {
    protein: T.object,
    data: T.array,
    colorDomainsBy: T.string,
    changeSettingsRaw: T.func,
    title: T.string,
    fixedHighlight: T.string,
  };

  constructor(props) {
    super(props);

    this.web_tracks = {};

    this.state = {
      entryHovered: null,
      // colorMode: EntryColorMode.DOMAIN_RELATIONSHIP,
      hideCategory: {},
      expandedTrack: {},
      collapsed: false,
    };

    this._mainRef = React.createRef();
    this._popperRef = React.createRef();
    this._popperContentRef = React.createRef();
    this._webProteinRef = React.createRef();
    this._isPopperTop = true;
  }

  async componentDidMount() {
    await loadProtVistaWebComponents();
    const { data, protein } = this.props;
    this._webProteinRef.current.data = protein;
    this.updateTracksWithData(data);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state || !isEqual(nextProps, this.props);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.data, this.props.data)) {
      this.updateTracksWithData(this.props.data);
    }
  }

  _setResiduesInState(children, accession) {
    if (children) {
      this.web_tracks[accession].contributors = children;
      for (const child of children) {
        if (child.residues) {
          this.setObjectValueInState('expandedTrack', child.accession, true);
        }
      }
    }
  }

  updateTracksWithData(data) {
    const b2sh = new Map([
      ['s', 'discontinuosStart'],
      ['e', 'discontinuosEnd'],
      ['se', 'discontinuos'],
      ['es', 'discontinuos'],
    ]);

    for (const type of data) {
      for (const d of type[1]) {
        const tmp = (d.entry_protein_locations || d.locations).map(loc => ({
          accession: d.accession,
          name: d.name,
          source_database: d.source_database,
          locations: [loc],
          color: getTrackColor(d, this.props.colorDomainsBy),
          entry_type: d.entry_type,
          type: d.type || 'entry',
          residues: d.residues && JSON.parse(JSON.stringify(d.residues)),
          chain: d.chain,
          protein: d.protein,
        }));
        const children = d.children
          ? d.children.map(child => ({
              accession: child.accession,
              chain: d.chain,
              name: child.name,
              residues:
                child.residues && JSON.parse(JSON.stringify(child.residues)),
              source_database: child.source_database,
              entry_type: child.entry_type,
              type: child.type,
              locations: (child.entry_protein_locations || child.locations).map(
                loc => ({
                  ...loc,
                  fragments: loc.fragments.map(f => ({
                    shape: b2sh.get(f.bounds),
                    ...f,
                  })),
                }),
              ),
              parent: d,
              color: getTrackColor(
                Object.assign(child, { parent: d }),
                this.props.colorDomainsBy,
              ),
              location2residue: child.location2residue,
            }))
          : null;
        const isNewElement = !this.web_tracks[d.accession]._data;
        this.web_tracks[d.accession].data = tmp;
        if (this.props.fixedHighlight)
          this.web_tracks[
            d.accession
          ].fixedHighlight = this.props.fixedHighlight;
        this._setResiduesInState(children, d.accession);
        if (isNewElement) {
          this.web_tracks[d.accession].addEventListener('entryclick', e => {
            this.handleCollapseLabels(e.detail.feature.accession);
          });
          this.web_tracks[d.accession].addEventListener('entrymouseout', () => {
            removeAllChildrenFromNode(this._popperContentRef.current);
            this.popper.destroy();
            this._popperRef.current.classList.add(f('hide'));
          });
          this.web_tracks[d.accession].addEventListener('entrymouseover', e => {
            this._popperRef.current.classList.remove(f('hide'));
            removeAllChildrenFromNode(this._popperContentRef.current);
            this._popperContentRef.current.appendChild(
              this.getElementFromEntry(e.detail),
            );
            this._isPopperTop = !this._isPopperTop;
            this.popper = new PopperJS(
              e.detail.target,
              this._popperRef.current,
              {
                placement: this._isPopperTop ? 'top' : 'bottom',
                applyStyle: { enabled: false },
              },
            );
          });
        }
        this.setObjectValueInState(
          'expandedTrack',
          d.accession,
          this.web_tracks[d.accession]._expanded,
        );
      }
      this.setObjectValueInState('hideCategory', type[0], false);
    }
  }

  getElementFromEntry(detail) {
    const entry = detail.feature;
    const isResidue = detail.type === 'residue';
    const isInterPro = entry.source_database === 'interpro';
    const tagString = `<section>   
        <h6>
          ${entry.accession}
          ${
            isResidue
              ? `<br/>[${detail.description || detail.location.description}]`
              : ''
          } 
         </h6>
          
        ${entry.name ? `<h4>${entry.name}</h4>` : ''}
        
        <!-- use class as Protvista is not react-->       
        <div class="${f('pop-wrapper')}" >
        <div>${
          isInterPro
            ? `<interpro-type
                    type="${(entry.entry_type || entry.type).replace('_', ' ')}"
                    dimension="1.4em"
                    aria-label="Entry type"
                  />`
            : ''
        } 
        </div>
        <div>
          ${
            Array.isArray(entry.source_database)
              ? entry.source_database[0]
              : entry.source_database
          }
        ${(entry.entry_type || entry.type || '').replace('_', ' ') ||
          ''}</div>       
        </div>
        <p>
          <small>          
            ${entry.entry ? `(${entry.entry})` : ''}
          </small>
        </p>
        <ul>
          ${
            isResidue
              ? `
              <li>Position: ${detail.start}</li>
              <li>Residue: ${detail.residue || detail.residues}</li>
              `
              : entry.locations
                  .map(({ fragments, model_acc: model }) =>
                    `
          <li> 
          <!--location:-->
            ${model && model !== entry.accession ? `Model: ${model}` : ''}
            <ul>
              ${fragments
                .map(({ start, end }) =>
                  `
                <li>${start} - ${end}</li>
              `.trim(),
                )
                .join('')}
            </ul>
          </li>
          `.trim(),
                  )
                  .join('')
          }
        </ul>
      </section>
    `.trim();
    const range = document.createRange();
    range.selectNode(document.getElementsByTagName('div').item(0));
    return range.createContextualFragment(tagString);
  }

  setObjectValueInState = (objectName, type, value) =>
    this.setState(({ [objectName]: obj }) => ({
      [objectName]: { ...obj, [type]: value },
    }));

  toggleCollapseAll = () => {
    const { collapsed } = this.state;
    const expandedTrack = {};
    for (const track of Object.values(this.web_tracks)) {
      if (collapsed) track.setAttribute('expanded', true);
      else track.removeAttribute('expanded');
    }
    for (const acc of Object.keys(this.state.expandedTrack)) {
      expandedTrack[acc] = collapsed;
    }
    this.setState({ collapsed: !collapsed, expandedTrack });
  };

  handleCollapseLabels = accession => {
    if (this.web_tracks[accession]) {
      this.setObjectValueInState(
        'expandedTrack',
        accession,
        this.web_tracks[accession]._expanded,
      );
    } else if (this.state.expandedTrack.hasOwnProperty(accession)) {
      this.setObjectValueInState(
        'expandedTrack',
        accession,
        !this.state.expandedTrack[accession],
      );
    }
  };

  changeColor = ({ target: { value: colorMode } }) => {
    for (const track of Object.values(this.web_tracks)) {
      for (const d of [...track._data, ...(track._contributors || [])]) {
        d.color = getTrackColor(d, colorMode);
      }
      track.refresh();
    }
    this.props.changeSettingsRaw('ui', 'colorDomainsBy', colorMode);
  };

  renderLabels(entry) {
    const { expandedTrack } = this.state;
    if (NOT_MEMBER_DBS.has(entry.source_database) || entry.type === 'chain')
      return entry.accession;
    return (
      <>
        <Link
          to={{
            description: {
              main: {
                key: entry.source_database === 'pdb' ? 'structure' : 'entry',
              },
              [entry.source_database === 'pdb' ? 'structure' : 'entry']: {
                db: entry.source_database,
                accession: entry.accession,
              },
            },
          }}
        >
          {entry.accession}
        </Link>
        <div
          className={f({
            hide: !expandedTrack[entry.accession],
          })}
        >
          {this.renderResidueLabels(entry)}
          {entry.children &&
            entry.children.map(d => (
              <div
                key={`main_${d.accession}`}
                className={f('track-accession-child')}
              >
                <Link
                  to={{
                    description: {
                      main: { key: 'entry' },
                      entry: {
                        db: d.source_database,
                        accession: d.accession,
                      },
                    },
                  }}
                >
                  {d.accession}
                </Link>
                {this.renderResidueLabels(d)}
              </div>
            ))}
        </div>
      </>
    );
  }

  renderResidueLabels(entry) {
    if (!entry.residues) return null;
    const { expandedTrack } = this.state;
    return entry.residues.map(residue =>
      residue.locations.map((r, i) => (
        <div
          key={`res_${r.accession || i}`}
          className={f('track-accession-child', {
            hide: !expandedTrack[entry.accession],
          })}
        >
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entry.source_database,
                  accession: entry.accession,
                },
              },
            }}
          >
            {r.accession || r.description}
          </Link>
        </div>
      )),
    );
  }

  renderOptions() {
    const { collapsed } = this.state;
    const title = this.props.title || 'Domains on protein';
    return (
      <div className={f('aligned-to-track-component', 'view-options-wrap')}>
        <div className={f('view-options-title')}>{title}</div>
        <div className={f('view-options')}>
          <div className={f('option-color', 'margin-right-medium')}>
            Color By:{' '}
            <select
              className={f('select-inline')}
              value={this.props.colorDomainsBy}
              onChange={this.changeColor}
              onBlur={this.changeColor}
            >
              <option value={EntryColorMode.ACCESSION}>Accession</option>
              <option value={EntryColorMode.MEMBER_DB}>Member Database</option>
              <option value={EntryColorMode.DOMAIN_RELATIONSHIP}>
                Domain Relationship
              </option>
            </select>
          </div>
          <div className={f('option-collapse')}>
            <Tooltip title={`${collapsed ? 'Expand' : 'Collapse'} all tracks`}>
              <button
                onClick={this.toggleCollapseAll}
                aria-label={`${collapsed ? 'Expand' : 'Collapse'} all tracks`}
              >
                {collapsed ? 'Expand' : 'Collapse'} All
              </button>
            </Tooltip>
          </div>
          <div
            className={f('option-fullscreen', 'font-l', 'margin-right-large')}
          >
            <FullScreenButton
              element={this._mainRef.current}
              tooltip="View the domain viewer in full screen mode"
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      protein: { length },
      data,
    } = this.props;

    if (!(length && data)) return <Loading />;

    const { hideCategory } = this.state;
    return (
      <div
        ref={this._mainRef}
        className={f('fullscreenable', 'margin-bottom-large')}
      >
        <div className={f('track-row')}>{this.renderOptions()}</div>
        <div ref={this._popperRef} className={f('popper', 'hide')}>
          <div className={f('popper__arrow')} />
          <div className={f('popper-content')} ref={this._popperContentRef} />
        </div>

        <div className={f('protvista')}>
          <protvista-manager
            attributes="length displaystart displayend highlight"
            id="pv-manager"
          >
            <div className={f('track-container')}>
              <div className={f('track-row')}>
                <div className={f('aligned-to-track-component')}>
                  <protvista-navigation
                    length={length}
                    displaystart="1"
                    displayend={length}
                  />
                </div>
              </div>
              <div className={f('track-row')}>
                <div className={f('aligned-to-track-component')}>
                  <protvista-sequence
                    ref={this._webProteinRef}
                    length={length}
                    displaystart="1"
                    displayend={length}
                  />
                </div>
              </div>
            </div>
            <div className={f('tracks-container')}>
              {data &&
                data
                  .filter(([_, tracks]) => tracks && tracks.length)
                  .map(([type, entries]) => (
                    <div key={type} className={f('track-container')}>
                      <div className={f('track-row')}>
                        <div
                          className={f('track-component')}
                          style={{ borderBottom: 0 }}
                        >
                          <header>
                            <button
                              onClick={() =>
                                this.setObjectValueInState(
                                  'hideCategory',
                                  type,
                                  !hideCategory[type],
                                )
                              }
                            >
                              {hideCategory[type] ? '▸' : '▾'} {type}
                            </button>
                          </header>
                        </div>
                      </div>
                      <div
                        className={f('track-group', {
                          hideCategory: hideCategory[type],
                        })}
                      >
                        {entries &&
                          entries.map(entry => (
                            <div
                              key={entry.accession}
                              className={f('track-row')}
                            >
                              <div className={f('track-component')}>
                                <protvista-interpro-track
                                  length={length}
                                  displaystart="1"
                                  displayend={length}
                                  id={`track_${entry.accession}`}
                                  ref={e =>
                                    (this.web_tracks[entry.accession] = e)
                                  }
                                  shape="roundRectangle"
                                  expanded
                                />
                              </div>
                              <div className={f('track-accession')}>
                                {this.renderLabels(entry)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
            </div>
          </protvista-manager>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.ui,
  ui => ({
    colorDomainsBy: ui.colorDomainsBy || EntryColorMode.DOMAIN_RELATIONSHIP,
  }),
);

export default connect(
  mapStateToProps,
  { changeSettingsRaw },
)(ProtVista);
