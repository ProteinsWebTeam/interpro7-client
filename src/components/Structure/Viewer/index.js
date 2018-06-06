//
import React, {
  PureComponent,
  ButtonToolBar,
  ButtonGroup,
  Button,
} from 'react';
import T from 'prop-types';
import LiteMol from 'litemol';

// import LiteMolViewer from 'litemol/dist/js/LiteMol-viewer.js';
import CustomTheme from './CustomTheme';

import 'litemol/dist/css/LiteMol-plugin-light.css';

const embedStyle = { width: '100%', height: '50vh' };
// const f = foundationPartial(ebiStyles);

/*:: type Props = {
  id: string|number,
  matches: Array<Object>,
  highlight?: string
}; */

// Call as follows to highlight pre-selected entry (from Structure/Summary)
// <StructureView id={accession} matches={matches} highlight={"pf00071"}/>

class StructureView extends PureComponent /*:: <Props> */ {
  /*:: _ref: { current: ?HTMLElement }; */

  static propTypes = {
    id: T.oneOfType([T.string, T.number]).isRequired,
    matches: T.array,
    highlight: T.string,
  };

  constructor(props /*: Props */) {
    super(props);
    this.state = {
      plugin: null,
      entryMap: {},
    };
    this._ref = React.createRef();
  }

  componentDidMount() {
    const Core = LiteMol.Core;
    const Visualisation = LiteMol.Visualization;
    const Boostrap = LiteMol.Bootstrap;
    const Transformer = LiteMol.Bootstrap.Entity.Transformer;
    const Query = LiteMol.Core.Structure.Query;
    const Transform = LiteMol.Bootstrap.Tree.Transform;

    const pdbid = this.props.id;

    const plugin = LiteMol.Plugin.create({
      target: this._ref.current,
      viewportBackground: '#fff',
      layoutState: {
        hideControls: true,
        isExpanded: false,
      },
    });
    const context = plugin.context;

    const action = Transform.build();
    action
      .add(context.tree.root, Transformer.Data.Download, {
        url: `https://www.ebi.ac.uk/pdbe/static/entry/${pdbid}_updated.cif`,
        type: 'String',
        id: pdbid,
      })
      .then(
        Transformer.Data.ParseCif,
        { id: pdbid },
        { isBinding: true, ref: 'parse' },
      )
      .then(
        Transformer.Molecule.CreateFromMmCif,
        { blockIndex: 0 },
        { isBinding: true },
      )
      .then(
        Transformer.Molecule.CreateModel,
        { modelIndex: 0 },
        { isBinding: false, ref: 'model' },
      )
      .then(Transformer.Molecule.CreateMacromoleculeVisual, {
        polymer: true,
        polymerRef: 'polymer-visual',
        het: false,
        water: false,
      });

    plugin.applyTransform(action).then(() => {
      const parser = context.select('parse')[0];
      const polymer = context.select('polymer-visual')[0];
      if (this.props.matches) {
        const entryMap = this.createEntryMap(parser.parent.id);
        this.setState({
          plugin: plugin,
          entryMap: entryMap,
        });
      }
    });
  }

  updateTheme(entries) {
    if (this.state.plugin != null) {
      const Core = LiteMol.Core;
      const Visualisation = LiteMol.Visualization;
      const Boostrap = LiteMol.Bootstrap;
      const Query = LiteMol.Core.Structure.Query;
      const plugin = this.state.plugin;
      const context = plugin.context;
      const model = context.select('model')[0];
      const parser = context.select('parse')[0];
      if (this.props.matches) {
        console.log(`CustomTheme: ${entries.length}`);
        const customTheme = new CustomTheme(
          Core,
          Visualisation,
          Boostrap,
          Query,
        );
        const colour = {
          base: { r: 204, g: 201, b: 193 },
          entries: entries,
        };

        const theme = customTheme.createTheme(model.props.model, colour);
        customTheme.applyTheme(plugin, 'polymer-visual', theme);
        //end customtheme testing
      }
    }
  }

  createEntryMap(rootId) {
    const memberDBMap = {};

    if (this.props.matches) {
      const entryResidues = {};
      // create matches in structure hierarchy
      const queries = [];
      for (const match of this.props.matches) {
        const entry = match.metadata.accession;
        const db = match.metadata.source_database;
        if (memberDBMap[db] == null) {
          memberDBMap[db] = {};
        }
        if (memberDBMap[db][entry] == null) {
          memberDBMap[db][entry] = [];
        }

        for (const structure of match.structures) {
          const chain = structure.chain;
          for (const location of structure.entry_protein_locations) {
            for (const fragment of location.fragments) {
              memberDBMap[db][entry].push({
                entity_id: rootId,
                struct_asym_id: chain,
                start_residue_number: fragment.start,
                end_residue_number: fragment.end,
                color: { r: 64, g: 128, b: 255 },
              });
            }
          }
        }
      }
    }
    return memberDBMap;
  }

  handleClick(memberDB, entry) {
    this.updateTheme([]);
    this.updateTheme(this.state.entryMap[memberDB][entry]);
  }

  render() {
    const highlights = [];
    for (const [memberDB, entries] of Object.entries(this.state.entryMap)) {
      const entryList = [];
      for (const [entry, matches] of Object.entries(entries)) {
        console.log(`${memberDB} => ${entry}`);
        const key = `${memberDB}-${entry}`;
        entryList.push(
          <div key={key} onClick={() => this.handleClick(memberDB, entry)}>
            {entry}
          </div>,
        );
      }
      highlights.push(
        <div key={memberDB}>
          <div>
            {memberDB}
            {entryList}
          </div>
        </div>,
      );
    }
    return (
      <div>
        <div>{highlights}</div>
        <div style={embedStyle}>
          <div
            ref={this._ref}
            style={{
              background: 'white',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          />
        </div>
      </div>
    );
  }
}
export default StructureView;
