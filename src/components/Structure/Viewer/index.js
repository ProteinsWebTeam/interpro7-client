// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import { ColormakerRegistry } from 'ngl';
import { DefaultPluginSpec, PluginSpec } from 'molstar/lib/mol-plugin/spec';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';

const f = foundationPartial(style, fonts);
/*:: type Props = {
  id: string,
  url?: string,
  elementId: string,
  ext?: string,
  name?: string,
  onStructureLoaded?: function,
  isSpinning?: boolean,
  shouldResetViewer?: boolean,
  selections: Array<Array<string>>,
};
  type SettingsForNGL ={
    defaultRepresentation: boolean,
    ext?: string,
    name?: string,
  }
 */

class StructureView extends PureComponent /*:: <Props> */ {
  /*:: _structureViewer: { current: ?HTMLElement }; */
  /*:: _structureViewerCanvas: { current: ?HTMLElement }; */
  /*:: viewer: Object; */
  /*:: name: Object; */

  static propTypes = {
    id: T.oneOfType([T.string, T.number]).isRequired,
    url: T.string,
    elementId: T.string,
    onStructureLoaded: T.func,
    isSpinning: T.bool,
    shouldResetViewer: T.bool,
    selections: T.array,
    ext: T.string,
    name: T.string,
  };

  constructor(props /*: Props */) {
    super(props);

    this.viewer = null;
    this.name = `${this.props.id}`;
    this._structureViewer = React.createRef();
    this._structureViewerCanvas = React.createRef();
  }

  async componentDidMount() {
    if (!this.viewer) {
      const MySpec = {
        ...DefaultPluginSpec(),
        layout: {
          isExpanded: true,
          showControls: true,
        },
        config: [[PluginConfig.VolumeStreaming.Enabled, false]],
      };
      this.viewer = new PluginContext(MySpec);

      await this.viewer.init();
      this.viewer.initViewer(
        this._structureViewerCanvas.current,
        this._structureViewer.current,
      );
    }
    const url =
      this.props.url ||
      `https://www.ebi.ac.uk/pdbe/static/entry/${this.name}_updated.cif`;
    this.loadStructureInViewer(url);
  }

  componentDidUpdate() {
    if (this.name !== `${this.props.id}`) {
      this.name = `${this.props.id}`;
      this.viewer.clear();
      const url =
        this.props.url ||
        `https://www.ebi.ac.uk/pdbe/static/entry/${this.name}_updated.cif`;
      this.loadURLInViewer(url);
    }
    if (this.viewer) {
      this.setSpin(this.props.isSpinning);
      if (this.props.shouldResetViewer) {
        PluginCommands.Camera.Reset(this.viewer, {});
      }
      if (this.props.selections?.length) {
        //this.highlightSelections(this.props.selections);
      } else {
        //this.clearSelections();
      }
    }
  }

  async loadStructureInViewer(url /*: string */) {
    const data = await this.viewer.builders.data.download(
      { url: url },
      { state: { isGhost: false } },
    );
    const trajectory = await this.viewer.builders.structure.parseTrajectory(
      data,
      'mmcif',
    );
    this.viewer.builders.structure.hierarchy
      .applyPreset(trajectory, 'default')
      .then(() => {
        this.setSpin(this.props.isSpinning);
      });
  }

  setSpin(spinState) {
    if (this.viewer.canvas3d) {
      // this.viewer.canvas3d.props.trackball.spin = this.props.isSpinning;
      const trackball = this.viewer.canvas3d.props.trackball;
      PluginCommands.Canvas3D.SetSettings(this.viewer, {
        settings: { trackball: { ...trackball, spin: spinState } },
      });
    }
  }

  loadURLInViewer(url /*: string */) {
    console.log('MAQ loadURLInViewer');
    // const settings /*: SettingsForNGL */ = { defaultRepresentation: false };
    // if (this.props.ext) {
    //   settings.ext = this.props.ext;
    //   settings.name = this.props.id;
    // }
    // this.viewer
    //   .loadFile(url, settings)
    //   .then((component) => {
    //     console.log("MAQ loaded file");
    //     component.addRepresentation('cartoon', { colorScheme: 'chainname' });
    //     component.autoView();
    //   })
    //   .then(() => {
    //     this.viewer.handleResize();
    //     if (this.props?.onStructureLoaded) this.props?.onStructureLoaded();
    //   });
  }

  highlightSelections(selections /*: Array<Array<string>> */) {
    if (!this.viewer) return;
    const components = this.viewer.getComponentsByName(this.name);
    if (components) {
      components.forEach((component) => {
        const theme = ColormakerRegistry.addSelectionScheme(
          selections,
          'highlight',
        );
        component.addRepresentation('cartoon', { color: theme });
      });
    }
  }
  clearSelections() {
    if (!this.viewer) return;
    const components = this.viewer.getComponentsByName(this.name);
    if (components) {
      components.forEach((component) => {
        component.addRepresentation('cartoon', {
          colorScheme: 'chainname',
        });
      });
    }
  }

  render() {
    return (
      <ResizeObserverComponent
        element="div"
        updateCallback={() => {
          if (this.viewer) this.viewer.handleResize();
        }}
        measurements={['width', 'height']}
        className={f('viewer-resizer')}
      >
        {() => {
          return (
            <div
              id={this.props.elementId || 'structure-viewer'}
              ref={this._structureViewer}
              className={f('structure-viewer-ref')}
            >
              <canvas ref={this._structureViewerCanvas} />
            </div>
          );
        }}
      </ResizeObserverComponent>
    );
  }
}

export default StructureView;
