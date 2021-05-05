// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import { DefaultPluginSpec, PluginSpec } from 'molstar/lib/mol-plugin/spec';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { StructureSelection } from 'molstar/lib/mol-model/structure';
import { ChainIdColorThemeProvider } from 'molstar/lib/mol-theme/color/chain-id';
import { HydrophobicityColorThemeProvider } from 'molstar/lib/mol-theme/color/hydrophobicity';
import { ElementIndexColorThemeProvider } from 'molstar/lib/mol-theme/color/element-index';
import { IllustrativeColorThemeProvider } from 'molstar/lib/mol-theme/color/illustrative';
import { PolymerIdColorThemeProvider } from 'molstar/lib/mol-theme/color/polymer-id';
import { ModelIndexColorThemeProvider } from 'molstar/lib/mol-theme/color/model-index';
import { Script } from 'molstar/lib/mol-script/script';
import { Type } from 'molstar/lib/mol-script/language/type';
import { EmptyLoci } from 'molstar/lib/mol-model/loci';
import { Color } from 'molstar/lib/mol-util/color';

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

    // this.viewer.representation.structure.themes
    //  .colorThemeRegistry.add(ChainIdColorThemeProvider);

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
      this.loadStructureInViewer(url);
    }
    if (this.viewer) {
      this.setSpin(this.props.isSpinning);
      if (this.props.shouldResetViewer) {
        PluginCommands.Camera.Reset(this.viewer, {});
      }
      if (this.props.selections?.length) {
        this.highlightSelections(this.props.selections);
      } else {
        this.clearSelections();
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
        // populate the entry map object used for entry highlighting
        this.props?.onStructureLoaded();
        // spin/stop spinning the structure
        this.setSpin(this.props.isSpinning);
        // apply colouring
        this.viewer.dataTransaction(async () => {
          for (const s of this.viewer.managers.structure.hierarchy.current
            .structures) {
            await this.viewer.managers.structure.component.updateRepresentationsTheme(
              s.components,
              {
                color: ChainIdColorThemeProvider.name,
              },
            );
          }
        });
      });
  }

  setSpin(spinState = false) {
    if (this.viewer.canvas3d) {
      const trackball = this.viewer.canvas3d.props.trackball;
      PluginCommands.Canvas3D.SetSettings(this.viewer, {
        settings: { trackball: { ...trackball, spin: spinState } },
      });
    }
  }

  highlightSelections(selections /*: Array<Array<string>> */) {
    if (!this.viewer) return;
    const data = this.viewer.managers.structure.hierarchy.current.structures[0]
      ?.cell.obj?.data;
    if (!data) return;

    for (const s of this.viewer.managers.structure.hierarchy.current
      .structures) {
      this.viewer.managers.structure.component.updateRepresentationsTheme(
        s.components,
        {
          color: ModelIndexColorThemeProvider.name,
        },
      );
    }

    // const colour = parseInt(selection[0], 16);
    PluginCommands.Canvas3D.SetSettings(this.viewer, {
      settings: (props) => {
        props.renderer.highlightColor = Color(0xffff00);
      },
    });
    const molSelection = Script.getStructureSelection((MS) => {
      const atomGroups = [];
      for (const selection of selections) {
        const [, start, end, chain] = selection[1].match(/(\d+)-(\d+)\:(\w+)/);
        atomGroups.push(
          MS.struct.generator.atomGroups({
            'chain-test': MS.core.rel.eq([chain, MS.ammp('label_asym_id')]),
            'residue-test': MS.core.rel.inRange([
              MS.ammp('auth_seq_id'),
              start,
              end,
            ]),
          }),
        );
      }
      return MS.struct.combinator.merge(atomGroups);
    }, data);
    const loci = StructureSelection.toLociWithSourceUnits(molSelection);
    this.viewer.managers.interactivity.lociHighlights.highlightOnly({ loci });

    PluginCommands.Toast.Show(this.viewer, {
      title: 'Custom Message',
      message: 'A custom toast message that will disappear after 2 seconds.',
      key: 'toast-custom',
      timeoutMs: 2000,
    });
  }

  clearSelections() {
    if (!this.viewer) return;
    const data = this.viewer.managers.structure.hierarchy.current.structures[0]
      ?.cell.obj?.data;
    if (!data) return;
    this.viewer.managers.interactivity.lociHighlights.highlightOnly({
      loci: EmptyLoci,
    });
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
