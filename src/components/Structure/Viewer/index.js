// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import loadWebComponent from 'utils/loadWebComponent';
import LiteMol from './litemol/js/LiteMol-plugin.js';
import { foundationPartial } from 'styles/foundation';
import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import lmStyles from './litemol/css/LiteMol-plugin-light.css';
//import lmStyles from './litemol/css/LiteMol-plugin-light.css';

const embedStyle = { width: '100%', height: '50vh' };
const f = foundationPartial(ebiStyles);

class StructureView extends PureComponent {
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
    var plugin = LiteMol.Plugin.create({
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
