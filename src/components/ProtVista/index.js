import React, { PureComponent } from 'react';
import T from 'prop-types';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { foundationPartial } from 'styles/foundation';
import loadWebComponent from 'utils/loadWebComponent';
import ColorHash from 'color-hash/lib/color-hash';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts);

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import ProtVistaManager from 'protvista-manager/src/protvista-manager.js';
import ProtVistaSequence from 'protvista-sequence/src/protvista-sequence.js';
import ProtVistaNavigation from 'protvista-navigation/src/protvista-navigation.js';
import ProtVistaInterProTrack from 'protvista-interpro-track/src/protvista-interpro-track.js';

import PopperJS from 'popper.js';

const webComponents = [];

const colorHash = new ColorHash();

// TODO: refactor to have a single place for colors
const colorsByDB = {
  gene3d: '#a88cc3',
  cdd: '#addc58',
  hamap: '#2cd6d6',
  mobidblt: '#d6dc94',
  panther: '#bfac92',
  pfam: '#6287b1',
  pirsf: '#fbbddd',
  prints: '#54c75f',
  prodom: '#8d99e4',
  profile: '#f69f74',
  prosite: '#f3c766',
  sfld: '#00b1d3',
  smart: '#ff8d8d',
  ssf: '#686868',
  tigrfams: '#56b9a6',
  interpro: '#2daec1',
  pdb: '#74b360',
};

const EntryColorMode = {
  ACCESSION: 'ACCESSION',
  MEMBER_DB: 'MEMBER_DB',
  DOMAIN_RELATIONSHIP: 'DOMAIN_RELATIONSHIP',
};

const requestFullScreen = element => {
  if (!element) return;
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

const removeAllChildrenFromNode = node => {
  if (node.lastChild) {
    node.removeChild(node.lastChild);
    removeAllChildrenFromNode(node);
  }
};

class ProtVista extends PureComponent {
  static propTypes = {
    protein: T.object,
    data: T.array,
  };

  constructor(props) {
    super(props);
    this.web_tracks = {};
    this.state = {
      entryHovered: null,
      colorMode: EntryColorMode.DOMAIN_RELATIONSHIP,
      hideCategory: {},
      expandedTrack: {},
      collapsed: false,
    };
  }

  componentWillMount() {
    if (webComponents.length) return;
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

  async componentDidMount() {
    await Promise.all(webComponents);
    const { data, protein } = this.props;
    this.web_protein.data = protein;
    this.updateTracksWithData(data);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.updateTracksWithData(this.props.data);
    }
  }

  updateTracksWithData(data) {
    for (const type of data) {
      for (const d of type[1]) {
        const tmp = (d.entry_protein_locations || d.locations).map(loc => ({
          accession: d.accession,
          name: d.name,
          source_database: d.source_database,
          locations: [loc],
          color: this.getTrackColor(d),
          entry_type: d.entry_type,
        }));
        const children = d.children
          ? d.children.map(child => ({
              accession: child.accession,
              name: child.name,
              residues: child.children,
              source_database: child.source_database,
              entry_type: child.entry_type,
              locations: child.entry_protein_locations || child.locations,
              parent: d,
              color: this.getTrackColor(Object.assign(child, { parent: d })),
            }))
          : null;
        const isNewElement = !this.web_tracks[d.accession]._data;
        this.web_tracks[d.accession].data = tmp;
        if (children) {
          this.web_tracks[d.accession].contributors = children;
          for (const child of children) {
            if (child.residues) {
              this.setObjectValueInState(
                'expandedTrack',
                child.accession,
                true,
              );
            }
          }
        }
        if (isNewElement) {
          this.web_tracks[d.accession].addEventListener('entryclick', e => {
            this.handleCollapseLabels(e.detail.feature.accession);
          });
          this.web_tracks[d.accession].addEventListener('entrymouseout', () => {
            removeAllChildrenFromNode(this._popper_content);
            this.popper.destroy();
            this._popper.classList.add(f('hide'));
          });
          this.web_tracks[d.accession].addEventListener('entrymouseover', e => {
            this._popper.classList.remove(f('hide'));
            if (e.detail.feature.source_database) {
              removeAllChildrenFromNode(this._popper_content);
              this._popper_content.appendChild(
                this.getElementFromEntry(e.detail.feature),
              );
            }
            // if (e.hasOwnProperty('residue')) {
            //   this._popper.appendChild(this.getElementFromResidue(d));
            // }
            this.popper = new PopperJS(e.detail.target, this._popper, {
              placement: 'top',
              applyStyle: { enabled: false },
            });
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

  getElementFromEntry(entry) {
    const tagString = `<div>
        <h5>${entry.accession}</h5>
        ${entry.name ? `<h4>${entry.name}</h4>` : ''}
        <ul>
          ${entry.locations
            .map(({ fragments }) =>
              `
          <li>location:
            <ul>
              ${fragments
                .map(({ start, end }) =>
                  `
                <li>From ${start} to ${end}</li>
              `.trim(),
                )
                .join('')}
            </ul>
          </li>
          `.trim(),
            )
            .join('')}
        </ul>
        <p style={{ textTransform: 'capitalize' }}>${entry.entry_type || ''}</p>
        <p style={{ textTransform: 'uppercase' }}>
          <small>${
            Array.isArray(entry.source_database)
              ? entry.source_database[0]
              : entry.source_database
          }
            ${entry.entry ? `(${entry.entry})` : ''}
          </small>
        </p>
      </div>
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

  handleFullScreen = () => requestFullScreen(this._main);

  changeColor = ({ target: { value: colorMode } }) => {
    for (const track of Object.values(this.web_tracks)) {
      for (const d of [...track._data, ...(track._contributors || [])]) {
        d.color = this.getTrackColor(d, colorMode);
      }
      track.refresh();
    }
    this.setState({ colorMode });
  };

  getTrackColor(entry, colorMode = null) {
    let acc;
    switch (colorMode || this.state.colorMode) {
      case EntryColorMode.ACCESSION:
        acc = entry.accession
          .split('')
          .reverse()
          .join('');
        return colorHash.hex(acc);
      case EntryColorMode.MEMBER_DB:
        return colorsByDB[entry.source_database.toLowerCase()];
      case EntryColorMode.DOMAIN_RELATIONSHIP:
        if (entry.source_database.toLowerCase() === 'interpro') {
          acc = entry.accession
            .split('')
            .reverse()
            .join('');
          return colorHash.hex(acc);
        }
        if (entry.parent) {
          acc = entry.parent.accession
            .split('')
            .reverse()
            .join('');
          return colorHash.hex(acc);
        }
        break;
      default:
        return 'rgb(170,170,170)';
    }
    return 'rgb(170,170,170)';
  }

  render() {
    const { protein: { length }, data } = this.props;

    if (!(length && data)) return <Loading />;

    const { collapsed, hideCategory, expandedTrack } = this.state;
    return (
      <div ref={e => (this._main = e)} className={f('fullscreenable')}>
        <div className={f('row')}>
          <div className={f('columns')}>
            <div className={f('track-row')}>
              <div className={f('aligned-to-track-component')}>
                <div className={f('view-options-title')}>
                  Domains on protein
                </div>
                <div className={f('view-options')}>
                  <div className={f('option-color', 'margin-right-large')}>
                    Color By:{' '}
                    <select
                      className={f('select-inline')}
                      value={this.state.colorMode}
                      onChange={this.changeColor}
                      onBlur={this.changeColor}
                    >
                      <option value={EntryColorMode.ACCESSION}>
                        Accession
                      </option>
                      <option value={EntryColorMode.MEMBER_DB}>
                        Member Database
                      </option>
                      <option value={EntryColorMode.DOMAIN_RELATIONSHIP}>
                        Domain Relationship
                      </option>
                    </select>
                  </div>
                  <div className={f('option-collapse')}>
                    &nbsp;|&nbsp;
                    <Tooltip
                      title={`${collapsed ? 'Expand' : 'Collapse'} all tracks`}
                    >
                      <button
                        onClick={this.toggleCollapseAll}
                        aria-label={`${
                          collapsed ? 'Expand' : 'Collapse'
                        } all tracks`}
                      >
                        {collapsed ? '▸ Expand' : '▾ Collapse'} All
                      </button>
                    </Tooltip>
                    &nbsp;|&nbsp;
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
                      />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div ref={e => (this._popper = e)} className={f('popper', 'hide')}>
          <div className={f('popper__arrow')} />
          <div ref={e => (this._popper_content = e)} />
        </div>
        <div className={f('row', 'protvista')}>
          <protvista-manager
            attributes="length displaystart displayend highlightstart highlightend"
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
                    ref={e => (this.web_protein = e)}
                    length={length}
                    displaystart="1"
                    displayend={length}
                  />
                </div>
              </div>
            </div>
            <div className={f('tracks-container')}>
              {data &&
                data.map(([type, entries]) => (
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
                            {hideCategory[type] ? '▾' : '▸'} {type}
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
                          <div key={entry.accession} className={f('track-row')}>
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
                                // onClick={() =>
                                //   this.handleCollapseLabels(entry.accession)
                                // }
                              />
                            </div>
                            <div className={f('track-accession')}>
                              <Link
                                to={{
                                  description: {
                                    main: {
                                      key:
                                        entry.source_database === 'pdb'
                                          ? 'structure'
                                          : 'entry',
                                    },
                                    [entry.source_database === 'pdb'
                                      ? 'structure'
                                      : 'entry']: {
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
                                {entry.children &&
                                  entry.children.map(d => (
                                    <div
                                      key={d.accession}
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
                                      {d.residues
                                        ? d.residues.map(residue =>
                                            residue.locations.map(r => (
                                              <div
                                                key={r.accession}
                                                className={f(
                                                  'track-accession-child',
                                                  {
                                                    hide: !expandedTrack[
                                                      d.accession
                                                    ],
                                                  },
                                                )}
                                              >
                                                <Link
                                                  r={r}
                                                  d={d}
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
                                                  {r.entry_accession}
                                                </Link>
                                              </div>
                                            )),
                                          )
                                        : null}
                                    </div>
                                  ))}
                              </div>
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

export default ProtVista;
