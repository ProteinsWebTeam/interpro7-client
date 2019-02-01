//
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import config from 'config';

import { Stage, ColormakerRegistry, Preferences } from 'ngl';

import EntrySelection from './EntrySelection';
import { NO_SELECTION } from './EntrySelection';
import { EntryColorMode, hexToRgb, getTrackColor } from 'utils/entry-color';

import { intersectionObserver as intersectionObserverPolyfill } from 'utils/polyfills';

import ProtVistaForStructure from './ProtVistaForStructures';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import getMapper from './proteinToStructureMapper';

import fonts from 'EBI-Icon-fonts/fonts.css';

import { foundationPartial } from 'styles/foundation';

import {
  requestFullScreen,
  exitFullScreen,
  onFullScreenChange,
} from '../../../utils/fullscreen';

import style from './style.css';

const f = foundationPartial(style, fonts);

/*:: type Props = {
  id: string|number,
  matches: Array<Object>,
  highlight?: string
}; */

const NUMBER_OF_CHECKS = 10;
const optionsForObserver = {
  root: null,
  rootMargin: '0px',
  /* eslint-disable-next-line prefer-spread */
  threshold: Array.apply(null, { length: NUMBER_OF_CHECKS }).map(
    Number.call,
    n => (n + 1) / NUMBER_OF_CHECKS,
  ),
};

class StructureView extends PureComponent /*:: <Props> */ {
  /*:: _structurevViewer: { current: ?HTMLElement }; */

  static propTypes = {
    id: T.oneOfType([T.string, T.number]).isRequired,
    matches: T.array,
    highlight: T.string,
    colorDomainsBy: T.string,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {
      plugin: null,
      entryMap: {},
      selectedEntry: '',
      selectedEntryToKeep: null,
      isStuck: false,
      isSpinning: false,
      isStructureFullScreen: false,
      isSplitScreen: false,
    };

    this.stage = null;
    this.name = `${this.props.id}_updated.cif`;

    this._structurevViewer = React.createRef();
    this._structureSection = React.createRef();
    this._protvista = React.createRef();
    this._splitView = React.createRef();
    this._viewerControls = React.createRef();
    this._poppableViewer = React.createRef();
    this.splitViewStyle = {};
  }

  async componentDidMount() {
    await intersectionObserverPolyfill();

    const element = this._splitView.current;
    onFullScreenChange(element, e => {
      const protvistaElement = this._protvista.current;
      const structureContainer = this._structureSection.current;
      const structureViewer = this._structurevViewer.current;
      const structureControls = this._viewerControls.current;
      const isSplitScreen = !this.state.isSplitScreen;
      if (isSplitScreen) {
        this.splitViewStyle.display = element.style.display;
        this.splitViewStyle.backgroundColor = element.style.backgroundColor;
        this.splitViewStyle.protvistaOverflow = protvistaElement.style.overflow;
        this.splitViewStyle.protvistaWidth = protvistaElement.style.width;
        this.splitViewStyle.viewControlsHeight = structureControls.style.height;
        this.splitViewStyle.viewElementHeight = structureViewer.style.height;
        this.splitViewStyle.viewElementWidth = structureContainer.style.width;

        element.style.display = 'flex';
        element.style.backgroundColor = '#FFFFFF';
        protvistaElement.style.overflow = 'scroll';
        protvistaElement.style.width = '50vw';
        structureControls.style.height = '5vh';
        structureViewer.style.height = '95vh';
        structureContainer.style.width = '50vw';
      } else {
        element.style.display = this.splitViewStyle.display;
        element.style.backgroundColor = this.splitViewStyle.backgroundColor;
        protvistaElement.style.overflow = this.splitViewStyle.protvistaOverflow;
        structureControls.style.height = this.splitViewStyle.viewControlsHeight;
        structureViewer.style.height = this.splitViewStyle.viewElementHeight;
        structureContainer.style.width = this.splitViewStyle.viewElementWidth;
        protvistaElement.style.width = this.splitViewStyle.protvistaWidth;
      }
      this.setState({ isSplitScreen });
    });

    const pdbid = this.props.id;
    this.stage = new Stage(this._structurevViewer.current);
    this.stage.setParameters({ backgroundColor: 0xfcfcfc });

    this.stage
      .loadFile(`https://www.ebi.ac.uk/pdbe/static/entry/${this.name}`)
      .then(component => {
        component.addRepresentation('cartoon', { colorScheme: 'chainname' });
        component.autoView();
      })
      .then(component => {
        this.stage.handleResize();
        if (this.props.matches) {
          const entryMap = this.createEntryMap();
          this.setState({ entryMap });
        }
      });

    //example onclick
    this.stage.signals.clicked.add(picked => {
      if (picked) {
        const residue = picked.atom;
        const index = residue.residueIndex;
        const name = residue.resname;
        //console.log(`clicked: ${index} ${name}`);
      } else {
        //console.log(`clicked: nothing`);
      }
    });

    this.stage.signals.hovered.add(picked => {
      if (picked) {
        const residue = picked.atom;
        const index = residue.residueIndex;
        const name = residue.resname;
        //console.log(`mouseover: ${index} ${name}`);
      } else {
        //console.log('mouseover: nothing');
      }
    });

    const threshold = 0.4;
    this.observer = new IntersectionObserver(entries => {
      this.setState({
        isStuck:
          this._structureSection.current.getBoundingClientRect().y < 0 &&
          entries[0].intersectionRatio < threshold,
      });
      if (this.stage && this.state.isStuck) {
        this.stage.handleResize();
      }
    }, optionsForObserver);
    this.observer.observe(this._structureSection.current);
    this._protvista.current.addEventListener('entryclick', e => {
      const {
        detail: {
          feature: { accession, source_database: db, type, chain },
        },
      } = e;

      let protein = e.detail.feature.protein;
      //bit of a hack to handle missing data in some entries
      if (!protein && 'parent' in e.detail.feature) {
        protein = e.detail.feature.parent.protein;
      }
      this.setState({
        selectedEntryToKeep:
          type === 'chain'
            ? {
                accession: pdbid,
                db: 'pdb',
                chain: accession,
                protein,
              }
            : {
                accession: accession,
                db,
                chain,
                protein,
              },
      });
      this.showEntryInStructure;
    });
    this._protvista.current.addEventListener(
      'entrymouseover',
      ({
        detail: {
          feature: { accession, source_database: db, type, chain, protein },
        },
      }) => {
        if (type === 'chain')
          this.showEntryInStructure('pdb', pdbid, accession, protein);
        else this.showEntryInStructure(db, accession, chain, protein);
      },
    );
    this._protvista.current.addEventListener('entrymouseout', () => {
      this.showEntryInStructure();
    });
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  _toggleStructureFullScreen = e => {
    const section = this._structureSection.current;
    section.scrollIntoView(false);
    if (this.stage) {
      this.stage.toggleFullscreen();
      this.stage.handleResize();
    }
    const isStructureFullScreen = !this.state.isStructureFullScreen;
    this.setState({ isStructureFullScreen });
  };

  _toggleSplitView = e => {
    if (this.stage) {
      const element = this._splitView.current;
      const isSplitScreen = this.state.isSplitScreen;
      if (isSplitScreen) {
        exitFullScreen(element);
      } else {
        const section = this._structureSection.current;
        section.scrollIntoView(false);
        requestFullScreen(element);
        //setTimeout(() => {requestFullScreen(element);}, 500);
      }
      this.stage.handleResize();
    }
  };

  _toggleStructureSpin = e => {
    if (this.stage) {
      const isSpinning = !this.state.isSpinning;
      this.stage.setSpin(isSpinning);
      this.setState({ isSpinning });
    }
  };

  _resetStructureView = e => {
    if (this.stage) {
      this.stage.autoView();
    }
  };

  _getChainMap(chain, locations, p2s) {
    const chainMap = [];
    for (const location of locations) {
      for (const { start, end } of location.fragments) {
        chainMap.push({
          struct_asym_id: chain,
          start_residue_number: p2s(start),
          end_residue_number: p2s(end),
          accession: chain,
          source_database: 'pdb',
        });
      }
    }
    return chainMap;
  }

  _mapLocations(map, { chain, protein, locations, entry, db, match }, p2s) {
    for (const location of locations) {
      for (const fragment of location.fragments) {
        map[chain][protein].push({
          struct_asym_id: chain,
          start_residue_number: Math.round(p2s(fragment.start)),
          end_residue_number: Math.round(p2s(fragment.end)),
          accession: entry,
          source_database: db,
          parent: match.metadata.integrated
            ? { accession: match.metadata.integrated }
            : null,
        });
      }
    }
  }

  createEntryMap() {
    const memberDBMap = { pdb: {} };

    if (this.props.matches) {
      // create matches in structure hierarchy
      for (const match of this.props.matches) {
        const entry = match.metadata.accession;
        const db = match.metadata.source_database;
        if (!memberDBMap[db]) memberDBMap[db] = {};
        if (!memberDBMap[db][entry]) memberDBMap[db][entry] = {};

        for (const structure of match.structures) {
          const chain = structure.chain;
          const protein = structure.protein;
          const p2s = getMapper(structure.protein_structure_mapping[chain]);
          if (!memberDBMap[db][entry][chain])
            memberDBMap[db][entry][chain] = {};
          if (!memberDBMap[db][entry][chain][protein])
            memberDBMap[db][entry][chain][protein] = [];
          this._mapLocations(
            memberDBMap[db][entry],
            {
              chain,
              protein,
              locations: structure.entry_protein_locations,
              entry,
              db,
              match,
            },
            p2s,
          );
          //create PDB chain mapping
          if (!memberDBMap.pdb[structure.accession])
            memberDBMap.pdb[structure.accession] = {};
          if (!memberDBMap.pdb[structure.accession][chain]) {
            memberDBMap.pdb[structure.accession][chain] = {};
          }
          if (!memberDBMap.pdb[structure.accession][chain][structure.protein]) {
            memberDBMap.pdb[structure.accession][chain][
              structure.protein
            ] = this._getChainMap(
              chain,
              structure.structure_protein_locations,
              p2s,
            );
          }
        }
      }
    }
    return memberDBMap;
  }

  showEntryInStructure = (memberDB, entry, chain, protein) => {
    const keep = this.state.selectedEntryToKeep;
    let db;
    let acc;
    let ch;
    let prot;

    //reset keep when 'no entry' is selected via selection input
    if (entry === NO_SELECTION && keep) {
      keep.db = null;
      keep.accession = null;
      keep.chain = null;
      keep.protein = null;
    } else if (memberDB != null && entry != null) {
      db = memberDB;
      acc = entry;
      ch = chain;
      prot = protein;
    } else if (
      keep &&
      keep.db != null &&
      keep.accession != null &&
      keep.chain != null &&
      keep.protein != null
    ) {
      db = keep.db;
      acc = keep.accession;
      ch = keep.chain;
      prot = keep.protein;
    }

    if (db && acc) {
      let hits = [];
      if (ch && prot) {
        hits = hits.concat(this.state.entryMap[db][acc][ch][prot]);
      } else if (ch) {
        Object.keys(this.state.entryMap[db][acc][ch]).forEach(p => {
          hits = hits.concat(this.state.entryMap[db][acc][ch][p]);
        });
      } else {
        Object.keys(this.state.entryMap[db][acc]).forEach(c => {
          Object.keys(this.state.entryMap[db][acc][c]).forEach(p => {
            hits = hits.concat(this.state.entryMap[db][acc][c][p]);
          });
        });
      }

      hits.forEach(
        hit => (hit.color = getTrackColor(hit, this.props.colorDomainsBy)),
      );
      if (this.stage) {
        const components = this.stage.getComponentsByName(this.name);
        if (components) {
          components.forEach(component => {
            const selections = [];
            hits.forEach((hit, i) => {
              selections.push([
                hit.color,
                `${hit.start_residue_number}-${hit.end_residue_number}:${
                  hit.struct_asym_id
                }`,
              ]);
            });
            const theme = ColormakerRegistry.addSelectionScheme(
              selections,
              acc,
            );
            component.addRepresentation('cartoon', { color: theme });
          });
        }
      }
    } else {
      //rest view when no entry selected
      const components = this.stage.getComponentsByName(this.name);
      if (components) {
        components.forEach(component => {
          component.addRepresentation('cartoon', { colorScheme: 'chainname' });
        });
      }
    }
    this.setState({ selectedEntry: acc || '' });
  };

  render() {
    return (
      <>
        <div ref={this._splitView}>
          <div ref={this._structureSection}>
            <div
              className={f('structure-viewer', {
                'is-stuck': this.state.isStuck,
              })}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'auto',
              }}
              ref={this._poppableViewer}
            >
              <ResizeObserverComponent
                element="div"
                updateCallback={() => {
                  if (this.stage) this.stage.handleResize();
                }}
                measurements={['width', 'height']}
              >
                {({ width, height }) => {
                  if (!width) {
                    width = 'auto';
                  }
                  if (!height) {
                    height = '450px';
                  }
                  if (this.stage) {
                    this.stage.handleResize();
                  }
                  return (
                    <div
                      ref={this._structurevViewer}
                      style={{
                        width: width,
                        height: height,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    />
                  );
                }}
              </ResizeObserverComponent>
              <div
                style={{
                  width: 'auto',
                  height: 'auto',
                  display: 'inline-flex',
                  justifyContent: 'space-between',
                }}
              >
                {this.props.matches ? (
                  <EntrySelection
                    entryMap={this.state.entryMap}
                    updateStructure={this.showEntryInStructure}
                    selectedEntry={this.state.selectedEntry}
                  />
                ) : null}
                <div ref={this._viewerControls}>
                  <button
                    className={f('structure-icon', 'icon', 'icon-common')}
                    onClick={this._toggleStructureSpin}
                    data-icon={this.state.isSpinning ? '' : 'v'}
                    title={
                      this.state.isSpinning ? 'Stop spinning' : 'Spin structure'
                    }
                  />
                  <button
                    className={f('structure-icon', 'icon', 'icon-common')}
                    onClick={this._resetStructureView}
                    data-icon="}"
                    title="Reset image"
                  />
                  {this.state.isStructureFullScreen ||
                  this.state.isSplitScreen ? (
                    <button
                      onClick={this._toggleSplitView}
                      data-icon="G"
                      title="Exit full screen"
                      className={f('structure-icon', 'icon', 'icon-common')}
                    />
                  ) : (
                    <button
                      onClick={this._toggleSplitView}
                      data-icon="O"
                      title="Split full screen"
                      className={f('structure-icon', 'icon', 'icon-common')}
                    />
                  )}
                  {this.state.isSplitScreen ? null : (
                    <button
                      data-icon="F"
                      title="Full screen"
                      onClick={this._toggleStructureFullScreen}
                      className={f('structure-icon', 'icon', 'icon-common')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div ref={this._protvista}>
            <ProtVistaForStructure />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.ui,
  ui => ({
    colorDomainsBy: ui.colorDomainsBy || EntryColorMode.DOMAIN_RELATIONSHIP,
  }),
);

export default connect(mapStateToProps)(StructureView);
