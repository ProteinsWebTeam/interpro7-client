//
import React, { PureComponent } from 'react';
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

    this._ref = React.createRef();
  }

  componentDidMount() {
    // const Behaviour = LiteMol.Bootstrap.Behaviour;
    // const Components = LiteMol.Plugin.Components;
    // const LayoutRegion = LiteMol.Bootstrap.Components.LayoutRegion;
    const Core = LiteMol.Core;
    const Visualisation = LiteMol.Visualization;
    const Boostrap = LiteMol.Bootstrap;
    const Transformer = LiteMol.Bootstrap.Entity.Transformer;
    const Query = LiteMol.Core.Structure.Query;
    const Command = LiteMol.Bootstrap.Command;
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
      .then(Transformer.Data.ParseCif, { id: pdbid }, { isBinding: true })
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
      const model = context.select('model')[0];
      const polymer = context.select('polymer-visual')[0];
      if (this.props.matches) {
        const entryResidues = {};
        // create matches in structure hierarchy
        const queries = [];
        for (const match of this.props.matches) {
          const entry = match.metadata.accession;
          const db = match.metadata.source_database;
          let chain;
          const residues = [];

          for (const structure of match.structures) {
            chain = structure.chain;
            for (const location of structure.entry_protein_locations) {
              for (const fragment of location.fragments) {
                for (let i = fragment.start; i <= fragment.end; i++) {
                  residues.push({ authAsymId: chain, authSeqNumber: i });
                }
              }
            }
          }

          entryResidues[entry] = residues;
          queries.push({
            entry: entry,
            chain: chain,
            db: db,
            query: Query.residues(...residues),
            length: residues.length,
          });
        }

        //Testing customtheme
        console.log('CustomTheme');
        const customTheme = new CustomTheme(
          Core,
          Visualisation,
          Boostrap,
          Query,
        );
        /*
        const colour = {
          base: { r: 255, g: 255, b: 255 },
          entries: [
            {
              entity_id: polymer.id,
              struct_asym_id: 'A',
              start_residue_number: 3,
              end_residue_number: 51,
              color: { r: 255, g: 128, b: 64 },
            },
            {
              entity_id: polymer.id,
              struct_asym_id: 'A',
              start_residue_number: 70,
              end_residue_number: 153,
              color: { r: 64, g: 128, b: 255 },
            },
          ],
        };
        */
        const colour = {
          base: { r: 255, g: 255, b: 255 },
          entries: [
            {
              entity_id: '1',
              struct_asym_id: 'A',
              start_residue_number: 10,
              end_residue_number: 25,
              color: { r: 255, g: 128, b: 64 },
            },
            {
              entity_id: '1',
              struct_asym_id: 'A',
              start_residue_number: 40,
              end_residue_number: 60,
              color: { r: 64, g: 128, b: 255 },
            },
          ],
        };

        const theme = customTheme.createTheme(model.props.model, colour);
        customTheme.applyTheme(plugin, 'polymer-visual', theme);
        //end customtheme testing

        /*
        const group = Transform.build();
        group.add(
          polymer,
          Transformer.Basic.CreateGroup,
          { label: 'Entries', description: 'Entries mapped to this structure' },
          { isBinding: false },
        );
        for (const q of queries) {
          group
            .then(
              Transformer.Molecule.CreateSelectionFromQuery,
              { name: `${q.entry} (${q.db})`, query: q.query, silent: true },
              { ref: q.entry },
            )
            .then(Transformer.Molecule.CreateVisual, {
              style: LiteMol.Bootstrap.Visualization.Molecule.Default.ForType.get(
                'Cartoons',
              ),
            });
        }
        plugin.applyTransform(group).then(() => {
          if (this.props.highlight && entryResidues[this.props.highlight]) {
            const query = Query.residues(
              ...entryResidues[this.props.highlight],
            );
            Command.Molecule.Highlight.dispatch(context.tree.context, {
              model: model,
              query: query,
              isOn: true,
            });
          }
        });
        */
      }
    });
  }

  render() {
    return (
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
    );
  }
}
export default StructureView;
