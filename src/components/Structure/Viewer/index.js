//
import React, { PureComponent } from 'react';
import T from 'prop-types';
import config from 'config';
import LiteMol from 'litemol';
import CustomTheme from './CustomTheme';
import EntrySelection from './EntrySelection';
import { hexToRgb } from 'utils/entry-color';

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
      selectedEntry: '',
    };
    this.plugin = null;
    this._ref = React.createRef();
  }

  componentDidMount() {
    const Core = LiteMol.Core;
    const Visualisation = LiteMol.Visualization;
    const Boostrap = LiteMol.Bootstrap;
    const Event = LiteMol.Bootstrap.Event;
    const Transformer = LiteMol.Bootstrap.Entity.Transformer;
    const Query = LiteMol.Core.Structure.Query;
    const Transform = LiteMol.Bootstrap.Tree.Transform;

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

    this.plugin.applyTransform(action).then(() => {
      if (this.props.matches) {
        const entryMap = this.createEntryMap();
        this.setState({
          entryMap: entryMap,
        });
      }
      //override the default litemol colour with the custom theme
      this.updateTheme([]);
      //detect any changes to the tree from within LiteMol and reset select control
      Event.Tree.TransformFinished.getStream(context).subscribe(ev => {
        this.setState({ selectedEntry: '' });
      });
    });
  }

  updateTheme(entries) {
    if (this.plugin != null) {
      const Core = LiteMol.Core;
      const Visualisation = LiteMol.Visualization;
      const Boostrap = LiteMol.Bootstrap;
      const Query = LiteMol.Core.Structure.Query;
      const context = this.plugin.context;
      const model = context.select('model')[0];
      if (this.props.matches != null) {
        const customTheme = new CustomTheme(
          Core,
          Visualisation,
          Boostrap,
          Query,
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

  createEntryMap() {
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
              const hexCol = config.colors.get(db);
              const color = hexToRgb(hexCol);

              memberDBMap[db][entry].push({
                struct_asym_id: chain,
                start_residue_number: fragment.start,
                end_residue_number: fragment.end,
                color: color,
              });
            }
          }
        }
      }
    }
    return memberDBMap;
  }

  showEntryInStructure = (memberDB, entry) => {
    this.updateTheme([]);
    if (memberDB != null && entry != null) {
      const hits = this.state.entryMap[memberDB][entry];
      this.updateTheme(hits);
      this.setState({ selectedEntry: entry });
    }
  };

  render() {
    let eventSelector = '';
    if (this.props.matches) {
      eventSelector = (
        <EntrySelection
          entryMap={this.state.entryMap}
          updateStructure={this.showEntryInStructure}
          selectedEntry={this.state.selectedEntry}
        />
      );
    }
    return (
      <div>
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
        {eventSelector}
      </div>
    );
  }
}
export default StructureView;
