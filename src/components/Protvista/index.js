import React, { Component } from 'react';
import T from 'prop-types';

import { foundationPartial } from 'styles/foundation';
import loadWebComponent from 'utils/loadWebComponent';
import ColorHash from 'color-hash/lib/color-hash';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts);

import { EntryColorMode } from 'components/Protein/DomainArchitecture/entry';
import Loading from 'components/SimpleCommonComponents/Loading';

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

class Protvista extends Component {
  static propTypes = {
    protein: T.object,
    data: T.array,
    // goToCustomLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.web_tracks = {};
    this.state = {
      entryHovered: null,
      colorMode: EntryColorMode.COLOR_MODE_ACCESSION,
      hideCategory: {},
    };
  }

  componentWillMount() {
    if (webComponents.length) return;
    const protvistaManager = () =>
      import(/* webpackChunkName: "protvista-manager" */ 'protvista-manager/src/protvista-manager.js');
    webComponents.push(
      loadWebComponent(() => protvistaManager().then(m => m.default)).as(
        'protvista-manager',
      ),
    );

    const protvistaSequence = () =>
      import(/* webpackChunkName: "protvista-sequence" */ 'protvista-sequence/src/protvista-sequence.js');
    webComponents.push(
      loadWebComponent(() => protvistaSequence().then(m => m.default)).as(
        'protvista-sequence',
      ),
    );
    const protvistaNavigation = () =>
      import(/* webpackChunkName: "protvista-navigation" */ 'protvista-navigation/src/protvista-navigation.js');
    webComponents.push(
      loadWebComponent(() => protvistaNavigation().then(m => m.default)).as(
        'protvista-navigation',
      ),
    );
    const protvistaInterproTrack = () =>
      import(/* webpackChunkName: "protvista-interpro-track" */ 'protvista-interpro-track/src/protvista-interpro-track.js');
    webComponents.push(
      loadWebComponent(() => protvistaInterproTrack().then(m => m.default)).as(
        'protvista-interpro-track',
      ),
    );
    // const protvistaTrack = () =>
    //   import(/* webpackChunkName: "protvista-track" */ 'protvista-track');
    // webComponents.push(
    //   loadWebComponent(() =>
    //     protvistaTrack().then(m => m.default),
    //   ).as('protvista-track'),
    // );
    // const protvistaInterproTrack = () =>
    //   import(/* webpackChunkName: "protvista-interpro-track" */ 'protvista-interpro-track');
    // webComponents.push(
    //   loadWebComponent(() =>
    //     protvistaInterproTrack().then(m => m.default),
    //   ).as('protvista-interpro-track'),
    // );
  }

  async componentDidMount() {
    await Promise.all(webComponents);
    const { data, protein } = this.props;
    this.web_protein.data = protein;
    for (const type of data) {
      for (const d of type[1]) {
        const tmp = d.entry_protein_locations.map(loc => ({
          accession: d.accession,
          source_database: d.source_database,
          locations: [loc],
          color: this.getTrackColor(d),
          children: d.children
            ? d.children.map(child => ({
                accession: child.accession,
                source_database: child.source_database,
                locations: child.entry_protein_locations,
                parent: d,
                color: this.getTrackColor(child),
              }))
            : null,
        }));
        this.web_tracks[d.accession].data = tmp;
      }
      this.setHiddenState(type[0], false);
    }
  }
  setHiddenState = (type, value) => {
    const hideCategory = { ...this.state.hideCategory };
    hideCategory[type] = value;
    this.setState({ hideCategory });
  };

  handleCollapse = () => {
    for (const track of Object.values(this.web_tracks)) {
      track.removeAttribute('expanded');
    }
  };

  handleExpand = () => {
    for (const track of Object.values(this.web_tracks)) {
      track.setAttribute('expanded', true);
    }
  };
  handleFullScreen = () => {
    requestFullScreen(this._main);
  };

  changeColor = evt => {
    const colorMode = Number(evt.target.value);
    for (const track of Object.values(this.web_tracks)) {
      const data = track._data;
      for (const d of data) {
        d.color = this.getTrackColor(d, colorMode);
        for (const child of d.children)
          child.color = this.getTrackColor(child, colorMode);
      }
      track.data = data;
    }
    this.setState({ colorMode });

    // this.ec.changeColorMode(newValue);
  };

  getTrackColor(entry, colorMode = null) {
    const mode = colorMode || this.state.colorMode;
    switch (mode) {
      case EntryColorMode.COLOR_MODE_ACCESSION:
        const acc = entry.accession
          .split('')
          .reverse()
          .join('');
        return colorHash.hex(acc);
      case EntryColorMode.COLOR_MODE_MEMBERDB:
        return colorsByDB[entry.source_database.toLowerCase()];
      case EntryColorMode.COLOR_MODE_DOMAIN_RELATIONSHIP:
        if (entry.source_database.toLowerCase() === 'interpro') {
          const acc = entry.accession
            .split('')
            .reverse()
            .join('');
          return colorHash.hex(acc);
        }
        if (entry.parent) {
          const acc = entry.parent.accession
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
    if (!length || !data) {
      return <Loading />;
    }

    const hiddenState = this.state.hideCategory;
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
        <div ref={e => (this._popper = e)} className={f('popper', 'hide')}>
          <div className={f('popper__arrow')} />
        </div>
        <div className={f('row', 'protvista')}>
          <protvista-manager
            attributes="length displaystart displayend highlightstart highlightend"
            id="pv-manager"
          >
            <protvista-navigation
              length={length}
              displaystart="1"
              displayend={length}
            />
            <protvista-sequence
              ref={e => (this.web_protein = e)}
              length={length}
              displaystart="1"
              displayend={length}
            />
            <div className={f('tracks-container')}>
              {data &&
                data.map(([type, entries]) => (
                  <div key={type} className={f('track-container')}>
                    <header>
                      <button
                        onClick={() =>
                          this.setHiddenState(type, !hiddenState[type])
                        }
                      >
                        {hiddenState[type] ? '▾' : '▸'} {type}
                      </button>
                    </header>
                    <div
                      className={f('track-group', {
                        hideCategory: hiddenState[type],
                      })}
                    >
                      {entries &&
                        entries.map(entry => (
                          <protvista-interpro-track
                            length={length}
                            displaystart="1"
                            displayend={length}
                            id={`track_${entry.accession}`}
                            key={entry.accession}
                            ref={e => (this.web_tracks[entry.accession] = e)}
                            expanded
                          />
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
export default Protvista;
