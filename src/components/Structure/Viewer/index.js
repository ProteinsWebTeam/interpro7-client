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
  matches: array
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

    let plugin = LiteMol.Plugin.create({
      target: '#litemol',
      viewportBackground: '#fff',
      layoutState: {
        hideControls: true,
        isExpanded: false,
      },
      customSpecification: InterProSpec,
    });

    /*
    plugin.loadMolecule({
      id: pdbid,
      url: 'https://www.ebi.ac.uk/pdbe/static/entry/' + pdbid + '_updated.cif',
      format: 'cif', // default
    });
    */
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
      let model = context.select('model')[0];
      let polymer = context.select('polymer-visual')[0];
      if (this.props.matches != undefined) {
        let group = Transform.build();
        group.add(
          model,
          Transformer.Basic.CreateGroup,
          { label: 'Entries', description: 'Entries mapped to this structure' },
          { isBinding: false },
        );
        let entryResidues = {};
        //create matches in structure hierarchy
        if (this.props.matches != undefined) {
          for (let match of this.props.matches) {
            let chain = match.chain;
            let protein = match.protein;
            let entry = match.accession;
            let db = match.source_database;
            let residues = [];
            for (let location of match.protein_structure_locations) {
              for (let fragment of location.fragments) {
                for (let i = fragment.start; i < fragment.end; i++) {
                  residues.push({ authAsymId: chain, authSeqNumber: i });
                }
              }
            }
            entryResidues[entry] = residues;
            let query = Query.residues(...residues);
            group
              .then(
                Transformer.Molecule.CreateSelectionFromQuery,
                { name: entry + ' (' + db + ')', query: query, silent: true },
                { ref: entry },
              )
              .then(Transformer.Molecule.CreateVisual, {
                style: LiteMol.Bootstrap.Visualization.Molecule.Default.ForType.get(
                  'Cartoons',
                ),
              });
          }
        }
        //highlight pre-selected entry
        plugin.applyTransform(group).then(() => {
          if (
            this.props.highlight != undefined &&
            entryResidues[this.props.highlight] != undefined
          ) {
            let query = Query.residues(...entryResidues[this.props.highlight]);
            Command.Molecule.Highlight.dispatch(context.tree.context, {
              model: model,
              query: query,
              isOn: true,
            });
          }
        });
      }
    });
  }
}
export default StructureView;
