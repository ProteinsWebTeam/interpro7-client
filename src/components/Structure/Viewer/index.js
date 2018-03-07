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
}; */

class StructureView extends PureComponent /*:: <Props> */ {
  static propTypes = {
    id: T.oneOfType([T.string, T.number]).isRequired,
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
    let plugin = LiteMol.Plugin.create({
      target: '#litemol',
      viewportBackground: '#fff',
      layoutState: {
        hideControls: true,
        isExpanded: false,
      },
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
      .add(plugin.context.tree.root, Transformer.Data.Download, {
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
      console.log('Transformed');
      let model = context.select('model')[0];
      console.log('Model:' + model);
      var query = Query.everything();
      console.log('QUERY: ' + query);
      Command.Molecule.Highlight.dispatch(context.tree.context, {
        model: model,
        query: Query.everything(),
        isOn: true,
      });
    });
  }
}
export default StructureView;
