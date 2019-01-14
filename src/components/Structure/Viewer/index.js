//
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import config from 'config';

import { Stage, ColormakerRegistry, Preferences } from 'ngl';

import EntrySelection from './EntrySelection';
import { EntryColorMode, hexToRgb, getTrackColor } from 'utils/entry-color';

import { intersectionObserver as intersectionObserverPolyfill } from 'utils/polyfills';

import ProtVistaForStructure from './ProtVistaForStructures';

import getMapper from './proteinToStructureMapper';

import { foundationPartial } from 'styles/foundation';

import style from './style.css';

const f = foundationPartial(style);

/*:: type Props = {
  id: string|number,
  matches: Array<Object>,
  highlight?: string
}; */

// Call as follows to highlight pre-selected entry (from Structure/Summary)
// <StructureView id={accession} matches={matches} highlight={"pf00071"}/>

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
  /*:: _ref: { current: ?HTMLElement }; */

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
    };

    this.stage = null;
    this.name = `${this.props.id}_updated.cif`;

    this._ref = React.createRef();
    this._placeholder = React.createRef();
    this._protvista = React.createRef();
  }

  async componentDidMount() {
    await intersectionObserverPolyfill();
    const pdbid = this.props.id;
    this.stage = new Stage(this._ref.current);
    this.stage.setParameters({ backgroundColor: 0xfcfcfc });

    this.stage
      .loadFile(`https://www.ebi.ac.uk/pdbe/static/entry/${this.name}`)
      .then(component => {
        component.addRepresentation('cartoon', { colorScheme: 'chainname' });
        component.autoView();
      })
      .then(component => {
        //this.stage.setSpin(true);
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
          this._placeholder.current.getBoundingClientRect().y < 0 &&
          entries[0].intersectionRatio < threshold,
      });
    }, optionsForObserver);
    this.observer.observe(this._placeholder.current);
    this._protvista.current.addEventListener(
      'entryclick',
      ({
        detail: {
          feature: { accession, source_database: db, type, chain },
        },
      }) => {
        this.setState(
          {
            selectedEntryToKeep:
              type === 'chain'
                ? {
                    accession: pdbid,
                    db: 'pdb',
                    chain: accession,
                  }
                : {
                    accession: accession,
                    db,
                    chain,
                  },
          },
          this.showEntryInStructure,
        );
      },
    );
    this._protvista.current.addEventListener(
      'entrymouseover',
      ({
        detail: {
          feature: { accession, source_database: db, type, chain },
        },
      }) => {
        if (type === 'chain')
          this.showEntryInStructure('pdb', pdbid, accession);
        else this.showEntryInStructure(db, accession, chain);
      },
    );
    this._protvista.current.addEventListener('entrymouseout', () => {
      this.showEntryInStructure();
    });
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

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

  _mapLocations(map, { chain, locations, entry, db, match }, p2s) {
    if (!map[chain]) map[chain] = [];
    for (const location of locations) {
      for (const fragment of location.fragments) {
        map[chain].push({
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
          if (!memberDBMap.pdb[structure.accession])
            memberDBMap.pdb[structure.accession] = {};
          const p2s = getMapper(structure.protein_structure_mapping[chain]);
          // const {
          //   start,
          //   end,
          // } = structure.structure_protein_locations[0].fragments[0];
          if (!memberDBMap.pdb[structure.accession][chain]) {
            memberDBMap.pdb[structure.accession][chain] = this._getChainMap(
              chain,
              structure.structure_protein_locations,
              p2s,
            );
          }
          this._mapLocations(
            memberDBMap[db][entry],
            {
              chain,
              locations: structure.entry_protein_locations,
              entry,
              db,
              match,
            },
            p2s,
          );
        }
      }
    }
    return memberDBMap;
  }

  showEntryInStructure = (memberDB, entry, chain) => {
    const keep = this.state.selectedEntryToKeep;
    let db;
    let acc;
    let ch;
    /*
    console.log(`Got: ${memberDB} ${entry} ${chain}`);
    if (keep) {
      console.log(`Had: ${keep.db} ${keep.accession} ${keep.chain}`);
    }
    */
    if (memberDB != null && entry != null) {
      db = memberDB;
      acc = entry;
      ch = chain;
    } else if (
      keep &&
      keep.db != null &&
      keep.accession != null &&
      keep.chain != null
    ) {
      db = keep.db;
      acc = keep.accession;
      ch = keep.chain;
    }

    if (db && acc) {
      const hits = ch
        ? this.state.entryMap[db][acc][ch]
        : Object.values(this.state.entryMap[db][acc]).reduce(
            (agg, v) => agg.concat(v),
            [],
          );
      hits.forEach(
        hit => (hit.color = getTrackColor(hit, this.props.colorDomainsBy)),
      );
      if (this.stage) {
        const components = this.stage.getComponentsByName(this.name);
        if (components) {
          components.forEach(component => {
            const selections = [];
            hits.forEach((hit, i) => {
              console.log(
                `Highlighting: ${hit.accession}: ${hit.start_residue_number}-${
                  hit.end_residue_number
                }:${hit.struct_asym_id}`,
              );
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
        <div ref={this._placeholder}>
          <div
            className={f('structure-viewer', {
              'is-stuck': this.state.isStuck,
            })}
          >
            <ResizeObserverComponent
              element="div"
              updateCallback={() => this.stage.handleResize()}
              measurements={['width', 'height']}
            >
              {({ width, height }) => {
                if (!width) {
                  width = 'auto';
                }
                if (!height) {
                  height = '400px';
                }
                if (this.stage) {
                  this.stage.handleResize();
                }
                return (
                  <div
                    ref={this._ref}
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
          </div>
          <div
            style={{
              width: 'auto',
              height: 'auto',
            }}
          >
            {this.props.matches ? (
              <EntrySelection
                entryMap={this.state.entryMap}
                updateStructure={this.showEntryInStructure}
                selectedEntry={this.state.selectedEntry}
              />
            ) : null}
          </div>
        </div>
        <div ref={this._protvista}>
          <ProtVistaForStructure />
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
