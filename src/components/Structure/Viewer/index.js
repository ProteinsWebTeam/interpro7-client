//
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import config from 'config';
import LiteMol from 'litemol';
import CustomTheme from './CustomTheme';
import EntrySelection from './EntrySelection';
import { EntryColorMode, hexToRgb, getTrackColor } from 'utils/entry-color';

import { intersectionObserver as intersectionObserverPolyfill } from 'utils/polyfills';

import ProtVistaForStructure from './ProtVistaForStructures';

import getMapper from './proteinToStructureMapper';

import { foundationPartial } from 'styles/foundation';

import 'litemol/dist/css/LiteMol-plugin-light.css';
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

    this.plugin = null;

    this._ref = React.createRef();
    this._placeholder = React.createRef();
    this._protvista = React.createRef();
  }

  async componentDidMount() {
    await intersectionObserverPolyfill();
    const pdbid = this.props.id;

    this.plugin = LiteMol.Plugin.create({
      target: this._ref.current,
      viewportBackground: '#fff',
      layoutState: {
        hideControls: true,
        isExpanded: false,
      },
    });
    const context = this.plugin.context;
    const action = LiteMol.Bootstrap.Tree.Transform.build();
    action
      .add(
        context.tree.root,
        LiteMol.Bootstrap.Entity.Transformer.Data.Download,
        {
          url: `https://www.ebi.ac.uk/pdbe/static/entry/${pdbid}_updated.cif`,
          type: 'String',
          id: pdbid,
        },
      )
      .then(
        LiteMol.Bootstrap.Entity.Transformer.Data.ParseCif,
        { id: pdbid },
        { isBinding: true, ref: 'parse' },
      )
      .then(
        LiteMol.Bootstrap.Entity.Transformer.Molecule.CreateFromMmCif,
        { blockIndex: 0 },
        { isBinding: true },
      )
      .then(
        LiteMol.Bootstrap.Entity.Transformer.Molecule.CreateModel,
        { modelIndex: 0 },
        { isBinding: false, ref: 'model' },
      )
      .then(
        LiteMol.Bootstrap.Entity.Transformer.Molecule.CreateMacromoleculeVisual,
        {
          polymer: true,
          polymerRef: 'polymer-visual',
          het: false,
          water: false,
        },
      );

    this.plugin.applyTransform(action).then(() => {
      if (this.props.matches) {
        const entryMap = this.createEntryMap();
        this.setState({ entryMap });
      }
      // override the default litemol colour with the custom theme
      this.updateTheme([]);
      // detect any changes to the tree from within LiteMol and reset select control
      LiteMol.Bootstrap.Event.Tree.TransformFinished.getStream(
        context,
      ).subscribe(() => {
        this.setState({ selectedEntry: '' });
      });
    });
    const threshold = 0.4;
    this.observer = new IntersectionObserver(entries => {
      this.setState({ isStuck: entries[0].intersectionRatio < threshold });
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

  componentDidUpdate(_, prevState) {
    if (prevState.isStuck !== this.state.isStuck) {
      this.plugin.instance.context.scene.scene.handleResize();
    }
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  updateTheme(entries) {
    if (this.plugin) {
      const context = this.plugin.context;
      const model = context.select('model')[0];
      if (this.props.matches) {
        const customTheme = new CustomTheme(
          LiteMol.Core,
          LiteMol.Visualization,
          LiteMol.Bootstrap,
          LiteMol.Core.Structure.Query,
        );
        const base = hexToRgb(config.colors.get('fallback'));
        const color = {
          base: base,
          entries: entries,
        };

        const theme = customTheme.createTheme(model.props.model, color);
        customTheme.applyTheme(this.plugin, 'polymer-visual', theme);
      }
    }
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
          start_residue_number: p2s(fragment.start),
          end_residue_number: p2s(fragment.end),
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
    this.updateTheme([]);
    const db = memberDB || (keep && keep.db);
    const acc = entry || (keep && keep.accession);
    const ch = chain || (keep && keep.chain);
    if (db && acc) {
      const hits = ch
        ? this.state.entryMap[db][acc][ch]
        : Object.values(this.state.entryMap[db][acc]).reduce(
            (agg, v) => agg.concat(v),
            [],
          );
      hits.forEach(
        hit =>
          (hit.color = hexToRgb(getTrackColor(hit, this.props.colorDomainsBy))),
      );
      this.updateTheme(hits);
    }
    this.setState({ selectedEntry: acc || '' });
  };

  render() {
    return (
      <>
        <div className={f('structure-placeholder')} ref={this._placeholder}>
          <div
            className={f('structure-viewer', {
              'is-stuck': this.state.isStuck,
            })}
          >
            <div
              ref={this._ref}
              style={{
                width: '100%',
                height: '100%',
                // don't think that is needed anymore?
                // display: 'flex',
                // alignItems: 'center',
                // justifyContent: 'center',
                position: 'relative',
              }}
            />
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
