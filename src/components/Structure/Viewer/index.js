import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import { Stage, ColormakerRegistry } from 'ngl';

import EntrySelection from './EntrySelection';
import { NO_SELECTION } from './EntrySelection';
import { EntryColorMode, getTrackColor } from 'utils/entry-color';

import { intersectionObserver as intersectionObserverPolyfill } from 'utils/polyfills';

import ProtVistaForStructure from './ProtVistaForStructures';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';

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
  highlight?: string,
  colorDomainsBy?: string
}; */

/*:: type State = {
  plugin: ?Object,
  entryMap: Object,
  selectedEntry: string,
  selectedEntryToKeep: ?Object,
  isStuck: boolean,
  isSpinning: boolean,
  isStructureFullScreen: boolean,
  isSplitScreen: boolean,
  isMinimized: boolean,
}; */

const NUMBER_OF_CHECKS = 10;
const optionsForObserver = {
  root: null,
  rootMargin: '0px',
  /* eslint-disable-next-line prefer-spread */
  threshold: Array.apply(null, { length: NUMBER_OF_CHECKS }).map(
    Number.call,
    (n) => (n + 1) / NUMBER_OF_CHECKS,
  ),
};
const SPLIT_REQUESTER = 1;
const FULL_REQUESTER = 2;

let fullScreenRequester = null;
class StructureView extends PureComponent /*:: <Props, State> */ {
  /*:: _structureViewer: { current: ?HTMLElement }; */

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
      isMinimized: false,
    };

    this.stage = null;

    this._protein2structureMappers = {};
    this.name = `${this.props.id}`;

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
    onFullScreenChange(element, () => {
      const {
        isSplitScreen: prevSplit,
        isStructureFullScreen: prevFull,
      } = this.state;
      const willBeFull = !(prevSplit || prevFull);
      if (willBeFull) {
        if (fullScreenRequester === SPLIT_REQUESTER) {
          this.setState({ isSplitScreen: true });
        }
        if (fullScreenRequester === FULL_REQUESTER) {
          this.setState({ isStructureFullScreen: true });
        }
      } else {
        this.setState({ isSplitScreen: false, isStructureFullScreen: false });
      }
      fullScreenRequester = null;
      this._toggleSplit(willBeFull && !prevSplit, element);
    });

    const pdbid = this.props.id;
    this.stage = new Stage(this._structurevViewer.current);
    this.stage.setParameters({ backgroundColor: 0xfcfcfc });
    this.stage
      .loadFile(`rcsb://${this.name}.mmtf`, { defaultRepresentation: false })
      .then((component) => {
        component.addRepresentation('cartoon', { colorScheme: 'chainname' });
        component.autoView();
      })
      .then(() => {
        this.stage.handleResize();
        if (this.props.matches) {
          const entryMap = this.createEntryMap();
          this.setState({ entryMap });
        }
      });

    // TODO connect onclick to protvista
    this.stage.signals.clicked.add((picked) => {
      if (picked) {
        // const residue = picked.atom;
        // const index = residue.residueIndex;
        // const name = residue.resname;
        // const chain = residue.chainid;
        // console.log(`clicked: ${index} ${name} ${chain}`, picked);
      } else {
        // console.log(`clicked: nothing`);
      }
    });

    // TODO connect hover to protvista
    this.stage.signals.hovered.add((picked) => {
      if (picked) {
        // const residue = picked.atom;
        // const index = residue.residueIndex;
        // const name = residue.resname;
        // console.log(`mouseover: ${index} ${name}`);
      } else {
        // console.log('mouseover: nothing');
      }
    });

    const threshold = 0.4;
    this.observer = new IntersectionObserver((entries) => {
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
    this._protvista.current.addEventListener(
      'change',
      ({ detail: { eventtype, highlight, feature, chain, protein } }) => {
        const {
          accession,
          source_database: sourceDB,
          type,
          chain: chainF,
          protein: proteinF,
          parent,
        } = feature || {};
        let proteinD = proteinF;

        switch (eventtype) {
          case 'sequence-chain':
            if (highlight) {
              const [start, stop] = highlight.split(':');
              const p2s = this._protein2structureMappers[
                `${protein}->${chain}`.toUpperCase()
              ];
              this.showRegionInStructure(
                chain,
                Math.round(p2s(start)),
                Math.round(p2s(stop)),
              );
              this.handlingSequenceHighlight = true;
            } else this.showRegionInStructure();
            break;
          case 'click':
            // bit of a hack to handle missing data in some entries
            if (!proteinD && parent) {
              proteinD = parent.protein;
            }
            this.setState({
              selectedEntryToKeep:
                type === 'chain'
                  ? {
                      accession: pdbid,
                      db: 'pdb',
                      chain: accession,
                      protein: proteinD,
                    }
                  : {
                      accession: accession,
                      db: sourceDB,
                      chain: chainF,
                      protein: proteinD,
                    },
            });
            break;
          case 'mouseover':
            if (this.handlingSequenceHighlight) {
              this.handlingSequenceHighlight = false;
              return;
            }
            if (type === 'chain')
              this.showEntryInStructure('pdb', pdbid, accession, protein);
            else if (type === 'secondary_structure')
              this.showSecondaryStructureEntries(feature);
            else if (!accession.startsWith('G3D:'))
              // TODO: Needs refactoring
              this.showEntryInStructure(sourceDB, accession, chainF, proteinF);
            break;
          case 'mouseout':
            if (type !== 'secondary_structure') this.showEntryInStructure();
            break;
          default:
            break;
        }
      },
    );
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  _toggleSplit = (isSplit, element) => {
    const protvistaElement = this._protvista.current;
    const structureContainer = this._structureSection.current;
    const structureViewer = this._structurevViewer.current;
    const structureControls = this._viewerControls.current;
    // const isSplitScreen = !this.state.isSplitScreen;
    if (isSplit) {
      this.splitViewStyle.display = element.style.display;
      this.splitViewStyle.backgroundColor = element.style.backgroundColor;
      this.splitViewStyle.protvistaOverflow = protvistaElement.style.overflow;
      this.splitViewStyle.protvistaWidth = protvistaElement.style.width;
      this.splitViewStyle.viewControlsHeight = structureControls.style.height;
      this.splitViewStyle.viewElementHeight = structureViewer.style.height;
      this.splitViewStyle.viewContainerWidth = structureContainer.style.width;
      this.splitViewStyle.viewContainerHeight = structureContainer.style.height;

      element.style.display = 'flex';
      element.style.backgroundColor = '#FFFFFF';
      protvistaElement.style.overflow = 'scroll';
      protvistaElement.style.width = '50vw';
      structureControls.style.height = '5vh';
      structureViewer.style.height = '95vh';
      structureContainer.style.width = '50vw';
      structureContainer.style.height = 'initial';
    } else {
      element.style.display = this.splitViewStyle.display;
      element.style.backgroundColor = this.splitViewStyle.backgroundColor;
      protvistaElement.style.overflow = this.splitViewStyle.protvistaOverflow;
      structureControls.style.height = this.splitViewStyle.viewControlsHeight;
      structureViewer.style.height = this.splitViewStyle.viewElementHeight;
      structureContainer.style.width = this.splitViewStyle.viewContainerWidth;
      structureContainer.style.height = this.splitViewStyle.viewContainerHeight;
      protvistaElement.style.width = this.splitViewStyle.protvistaWidth;
    }
  };

  _toggleStructureFullScreen = () => {
    const section = this._structureSection.current;
    section.scrollIntoView(false);
    fullScreenRequester = FULL_REQUESTER;
    if (this.stage) {
      this.stage.toggleFullscreen();
      this.stage.handleResize();
    }
    // const isStructureFullScreen = !this.state.isStructureFullScreen;
  };

  _toggleSplitView = () => {
    if (this.stage) {
      const element = this._splitView.current;
      const isSplitScreen = this.state.isSplitScreen;
      fullScreenRequester = SPLIT_REQUESTER;
      if (isSplitScreen) {
        exitFullScreen(element);
      } else {
        const section = this._structureSection.current;
        section.scrollIntoView(false);
        requestFullScreen(element);
      }
      this.stage.handleResize();
    }
  };

  _toggleStructureSpin = () => {
    if (this.stage) {
      const isSpinning = !this.state.isSpinning;
      this.stage.setSpin(isSpinning);
      this.setState({ isSpinning });
    }
  };

  _resetStructureView = () => {
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

  _collateHits(database, accession, chain, protein) {
    let hits = [];
    if (database && accession) {
      if (chain && protein) {
        hits = hits.concat(
          this.state.entryMap[database][accession][chain][protein],
        );
      } else if (chain) {
        Object.keys(this.state.entryMap[database][accession][chain]).forEach(
          (p) => {
            hits = hits.concat(
              this.state.entryMap[database][accession][chain][p],
            );
          },
        );
      } else {
        Object.keys(this.state.entryMap[database][accession]).forEach((c) => {
          Object.keys(this.state.entryMap[database][accession][c]).forEach(
            (p) => {
              hits = hits.concat(
                this.state.entryMap[database][accession][c][p],
              );
            },
          );
        });
      }
    }

    hits.forEach(
      (hit) => (hit.color = getTrackColor(hit, this.props.colorDomainsBy)),
    );
    return hits;
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
          this._protein2structureMappers[
            `${protein}->${chain}`.toUpperCase()
          ] = p2s;
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
          // create PDB chain mapping
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

  // eslint-disable-next-line complexity
  showEntryInStructure = (memberDB, entry, chain, protein) => {
    const keep = this.state.selectedEntryToKeep;
    let db;
    let acc;
    let ch;
    let prot;

    // reset keep when 'no entry' is selected via selection input
    if (entry === NO_SELECTION && keep) {
      keep.db = null;
      keep.accession = null;
      keep.chain = null;
      keep.protein = null;
    } else if (memberDB !== undefined && entry !== undefined) {
      db = memberDB;
      acc = entry;
      ch = chain;
      prot = protein;
    } else if (
      keep &&
      keep.db !== null &&
      keep.accession !== null &&
      keep.chain !== null &&
      keep.protein !== null
    ) {
      db = keep.db;
      acc = keep.accession;
      ch = keep.chain;
      prot = keep.protein;
    }

    if (acc && acc.startsWith('Chain')) return; // Skip the keep procedure for secondary structure
    const hits = this._collateHits(db, acc, ch, prot);
    if (hits.length > 0) {
      if (this.stage) {
        const components = this.stage.getComponentsByName(this.name);
        if (components) {
          components.forEach((component) => {
            const selections = [];
            hits.forEach((hit) => {
              selections.push([
                hit.color,
                `${hit.start_residue_number}-${hit.end_residue_number}:${hit.struct_asym_id}`,
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
      // default view when no entry selected
      const components = this.stage.getComponentsByName(this.name);
      if (components) {
        components.forEach((component) => {
          component.addRepresentation('cartoon', { colorScheme: 'chainname' });
        });
      }
    }
    this.setState({ selectedEntry: acc || '' });
  };

  showSecondaryStructureEntries = (feature) => {
    const hits = [];
    if (feature.locations) {
      for (const loc of feature.locations) {
        for (const frag of loc.fragments) {
          hits.push({ color: feature.color, start: frag.start, end: frag.end });
        }
      }
    }

    if (hits.length > 0) {
      if (this.stage) {
        const components = this.stage.getComponentsByName(this.name);
        if (components) {
          components.forEach((component) => {
            const selections = [];
            hits.forEach((hit) => {
              selections.push([
                hit.color,
                `${hit.start}-${hit.end}:${feature.chain}`,
              ]);
            });
            const theme = ColormakerRegistry.addSelectionScheme(
              selections,
              feature.accession,
            );
            component.addRepresentation('cartoon', { color: theme });
          });
        }
      }
    }
  };

  _toggleMinimize = () =>
    this.setState({ isMinimized: !this.state.isMinimized });

  showRegionInStructure(chain, start, stop) {
    const components = this.stage.getComponentsByName(this.name);
    if (components) {
      components.forEach((component) => {
        if (chain && start && stop) {
          const selection = `${start}-${stop}:${chain}`;
          const theme = ColormakerRegistry.addSelectionScheme(
            [['red', selection]],
            selection,
          );
          component.addRepresentation('cartoon', { color: theme });
        } else {
          component.addRepresentation('cartoon', {
            colorScheme: 'chainname',
          });
        }
      });
    }
  }
  render() {
    const {
      isStuck,
      entryMap,
      selectedEntry,
      isSpinning,
      isSplitScreen,
      isMinimized,
    } = this.state;
    return (
      <>
        <div ref={this._splitView}>
          <div ref={this._structureSection} className={f('structure-wrapper')}>
            <div
              className={f('structure-viewer', {
                'is-stuck': isStuck,
                'is-minimized': isMinimized,
              })}
              ref={this._poppableViewer}
              data-testid="structure-3d-viewer"
            >
              <ResizeObserverComponent
                element="div"
                updateCallback={() => {
                  if (this.stage) this.stage.handleResize();
                }}
                measurements={['width', 'height']}
                className={f('viewer-resizer')}
              >
                {() => {
                  return (
                    <div
                      ref={this._structurevViewer}
                      className={f('structure-viewer-ref')}
                    />
                  );
                }}
              </ResizeObserverComponent>
              <div className={f('viewer-control-bar')}>
                {this.props.matches ? (
                  <EntrySelection
                    entryMap={entryMap}
                    updateStructure={this.showEntryInStructure}
                    selectedEntry={selectedEntry}
                  />
                ) : null}
                <div
                  ref={this._viewerControls}
                  className={f('viewer-controls')}
                >
                  <button
                    className={f('structure-icon', 'icon', 'icon-common')}
                    onClick={this._toggleStructureSpin}
                    data-icon={isSpinning ? '' : 'v'}
                    title={isSpinning ? 'Stop spinning' : 'Spin structure'}
                  />
                  <button
                    className={f('structure-icon', 'icon', 'icon-common')}
                    onClick={this._resetStructureView}
                    data-icon="}"
                    title="Reset image"
                  />
                  <FullScreenButton
                    handleFullScreen={this._toggleSplitView}
                    className={f('structure-icon', 'icon', 'icon-common')}
                    tooltip={
                      isSplitScreen ? 'Exit full screen' : 'Split full screen'
                    }
                    dataIcon={isSplitScreen ? 'G' : '\uF0DB'}
                  />

                  {isSplitScreen ? null : (
                    <FullScreenButton
                      className={f('structure-icon', 'icon', 'icon-common')}
                      handleFullScreen={this._toggleStructureFullScreen}
                      tooltip="View the structure in full screen mode"
                    />
                  )}
                  {isStuck && (
                    <button
                      data-icon={isMinimized ? '\uF2D0' : '\uF2D1'}
                      title={'Minimize'}
                      onClick={this._toggleMinimize}
                      className={f('structure-icon', 'icon', 'icon-common')}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div ref={this._protvista} data-testid="structure-protvista">
            <ProtVistaForStructure />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.settings.ui,
  (ui) => ({
    colorDomainsBy: ui.colorDomainsBy || EntryColorMode.DOMAIN_RELATIONSHIP,
  }),
);

export default connect(mapStateToProps)(StructureView);
