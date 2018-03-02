// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import loadWebComponent from 'utils/loadWebComponent';
import LiteMol from 'litemol';
//import LiteMolViewer from 'litemol/dist/js/LiteMol-viewer.js';
import { foundationPartial } from 'styles/foundation';
import ebiStyles from 'ebi-framework/css/ebi-global.scss';
//import lmStyles from 'litemol/dist/css/LiteMol-plugin-blue.css';
import lmStyles from 'litemol/dist/css/LiteMol-plugin-light.css';
import local from './style.css';

const f = foundationPartial(ebiStyles, local);

/*:: type Props = {
  id: string|number,
}; */

class StructureView extends PureComponent /*:: <Props> */ {
  static propTypes = {
    id: T.oneOfType([T.string, T.number]).isRequired,
  };

  render() {
    return (
      <div className={f('structure-wrapper')}>
        <div id="litemol" className={f('structure-viewer')} />
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
    plugin.loadMolecule({
      id: pdbid,
      url: 'https://www.ebi.ac.uk/pdbe/static/entry/' + pdbid + '_updated.cif',
      format: 'cif', // default
    });
  }
}
export default StructureView;
