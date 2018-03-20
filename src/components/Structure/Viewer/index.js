// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import loadWebComponent from 'utils/loadWebComponent';
import LiteMol from 'litemol';
// import LiteMolViewer from 'litemol/dist/js/LiteMol-viewer.js';
import { foundationPartial } from 'styles/foundation';
import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import lmStyles from 'litemol/dist/css/LiteMol-plugin-light.css';

const embedStyle = { width: '100%', height: '50vh' };
const f = foundationPartial(ebiStyles);

/*:: type Props = {
  id: string|number,
  matches: Array<Object>,
  highlight?: string
}; */

//Call as follows to highlight pre-selected entry
//<StructureView id={accession} matches={matches} highlight={"pf00071"}/>

class StructureView extends PureComponent /*:: <Props> */ {
  static propTypes = {
    id: T.oneOfType([T.string, T.number]).isRequired,
    matches: T.array,
    highlight: T.string,
  };

  render() {
    return (
      <div style={embedStyle}>
        <div
          id="litemol"
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

  componentDidMount() {
    const pdbid = this.props.id;
    const InterProSpec = LiteMol.Plugin.getDefaultSpecification();
    const Behaviour = LiteMol.Bootstrap.Behaviour;
    const Components = LiteMol.Plugin.Components;
    const LayoutRegion = LiteMol.Bootstrap.Components.LayoutRegion;

    InterProSpec.behaviours = [
      Behaviour.SetEntityToCurrentWhenAdded,
      Behaviour.FocusCameraOnSelect,
      Behaviour.CreateVisualWhenModelIsAdded,
    ];
    InterProSpec.components = [
      Components.Transform.View(LayoutRegion.Right),
      Components.Context.Log(LayoutRegion.Bottom, true),
      Components.Context.Overlay(LayoutRegion.Root),
      Components.Context.Toast(LayoutRegion.Main, true),
      Components.Context.BackgroundTasks(LayoutRegion.Main, true),
    ];
    /*
    if (InterProSpec.behaviours.indexOf(Behaviour.ApplySelectionToVisual) != -1) {
      InterProSpec.behaviours.splice(InterProSpec.behaviours.indexOf(Behaviour.ApplySelectionToVisual), 1);
    }
    if (InterProSpec.behaviours.indexOf(Behaviour.HighlightElementInfo) != -1) {
      InterProSpec.behaviours.splice(InterProSpec.behaviours.indexOf(Behaviour.HighlightElementInfo), 1);
    }
    */

    let plugin = LiteMol.Plugin.create({
      target: '#litemol',
      viewportBackground: '#fff',
      layoutState: {
        hideControls: true,
        isExpanded: false,
      },
      customSpecification: InterProSpec,
    });

    var Transformer = LiteMol.Bootstrap.Entity.Transformer;
    const Query = LiteMol.Core.Structure.Query;

    let context = plugin.context;
    const Command = LiteMol.Bootstrap.Command;
    const Transform = LiteMol.Bootstrap.Tree.Transform;

    let action = Transform.build();
    action
      .add(context.tree.root, Transformer.Data.Download, {
        url:
          'https://www.ebi.ac.uk/pdbe/static/entry/' + pdbid + '_updated.cif',
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
        het: true,
        water: true,
      });

    plugin.applyTransform(action).then(() => {
      const model = context.select('model')[0];
      const polymer = context.select('polymer-visual')[0];
      if (this.props.matches != undefined) {
        const entryResidues = {};
        //create matches in structure hierarchy
        const queries = [];
        for (const match of this.props.matches) {
          const entry = match.metadata.accession;
          const db = match.metadata.source_database;
          let chain, protein;
          const residues = [];
          for (const structure of match.structures) {
            chain = structure.chain;
            protein = structure.protein;

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

        const group = Transform.build();
        group.add(
          polymer,
          Transformer.Basic.CreateGroup,
          { label: 'Entries', description: 'Entries mapped to this structure' },
          { isBinding: false },
        );

        for (const q of queries) {
          console.log(q.entry + ' len ' + q.length);
          group.then(
            Transformer.Molecule.CreateSelectionFromQuery,
            { name: q.entry + ' (' + q.db + ')', query: q.query, silent: true },
            { ref: q.entry },
          );
          /*
          .then(Transformer.Molecule.CreateVisual, {
            style: LiteMol.Bootstrap.Visualization.Molecule.Default.ForType.get(
            'Cartoons',
            ),
          });
          */
        }
        plugin.applyTransform(group);

        //highlight pre-selected entry
        if (
          this.props.highlight != undefined &&
          entryResidues[this.props.highlight] != undefined
        ) {
          const query = Query.residues(...entryResidues[this.props.highlight]);
          Command.Molecule.Highlight.dispatch(context.tree.context, {
            model: model,
            query: query,
            isOn: true,
          });
        }
      }
    });
  }
}
export default StructureView;
