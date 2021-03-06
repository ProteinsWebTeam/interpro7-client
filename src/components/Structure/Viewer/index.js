import React, { PureComponent } from 'react';
import T from 'prop-types';
import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import { DefaultPluginSpec } from 'molstar/lib/mol-plugin/spec';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { StructureSelection } from 'molstar/lib/mol-model/structure';
import { ChainIdColorThemeProvider } from 'molstar/lib/mol-theme/color/chain-id';
import {
  UniformColorThemeProvider,
  UniformColorThemeParams,
} from 'molstar/lib/mol-theme/color/uniform';
import { ColorByResidueLddtTheme } from './ColourByResidueLddtTheme';
import { ParamDefinition } from 'molstar/lib/mol-util/param-definition';
import { Script } from 'molstar/lib/mol-script/script';
import { Color } from 'molstar/lib/mol-util/color';
import { ColorNames } from 'molstar/lib/mol-util/color/names';
import { useBehavior } from 'molstar/lib/mol-plugin-ui/hooks/use-behavior';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import style from './style.css';
// import SelectionTheme from './InterProTheme';

const f = foundationPartial(style, fonts);

const newLocal = (props /*: Props */) => {
  if (props.viewer) {
    const highlighted = useBehavior(props.viewer.behaviors.labels.highlight);
    if (highlighted) {
      const text = highlighted.labels[0];
      return (
        <div
          className={f('structure-label')}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }
  }
  return <div />;
};
/**
 * Function hook for 3D model labels
 * returns information on residue highlighted on 3D structure
 * @param {Object} props - react props
 * @returns {Object} react element8
 */
const Labels = newLocal;

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
    onReset: T.func,
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
    this.highlightColour = null;
    this.selections = null;
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
      this.viewer.representation.structure.themes.colorThemeRegistry.add(
        ColorByResidueLddtTheme.colorThemeProvider,
      );
      this.viewer.managers.lociLabels.addProvider(
        ColorByResidueLddtTheme.labelProvider,
      );
      this.viewer.customModelProperties.register(
        ColorByResidueLddtTheme.propertyProvider,
        true,
      );
    }

    if (this.props.url) {
      this.loadStructureInViewer(this.props.url, 'pdb');
    } else {
      this.loadStructureInViewer(
        `https://www.ebi.ac.uk/pdbe/static/entry/${this.name}_updated.cif`,
        'mmcif',
      );
    }
  }

  componentDidUpdate() {
    if (this.name !== `${this.props.id}`) {
      this.name = `${this.props.id}`;
      this.viewer.clear();
      if (this.props.url) {
        this.loadStructureInViewer(this.props.url, 'pdb');
      } else {
        this.loadStructureInViewer(
          `https://www.ebi.ac.uk/pdbe/static/entry/${this.name}_updated.cif`,
          'mmcif',
        );
      }
    }
    if (this.viewer) {
      this.setSpin(this.props.isSpinning);
      if (this.props.shouldResetViewer) {
        PluginCommands.Camera.Reset(this.viewer, {});
        this.clearSelections();
        this.applyChainIdTheme();
        if (this.props.onReset) {
          this.props.onReset();
        }
      }
      if (this.props.selections?.length > 0) {
        this.highlightSelections(this.props.selections);
      }
    }
  }

  async loadStructureInViewer(url /*: string */, format /*: string */) {
    if (this.viewer) {
      await this.viewer.clear();
      const data = await this.viewer.builders.data.download(
        { url: url },
        { state: { isGhost: false } },
      );
      const trajectory = await this.viewer.builders.structure.parseTrajectory(
        data,
        format,
      );
      this.viewer.builders.structure.hierarchy
        .applyPreset(trajectory, 'default')
        .then(() => {
          // populate the entry map object used for entry highlighting
          if (this.props.onStructureLoaded) {
            this.props.onStructureLoaded();
          }
          // spin/stop spinning the structure
          this.setSpin(this.props.isSpinning);
          this.applyChainIdTheme();
        });
    }
  }

  setSpin(spinState = false) {
    if (this.viewer && this.viewer.canvas3d) {
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

    this.clearSelections();
    this.viewer
      .dataTransaction(async () => {
        UniformColorThemeParams.value = ParamDefinition.Color(ColorNames.white);
        for (const s of this.viewer.managers.structure.hierarchy.current
          .structures) {
          await this.viewer.managers.structure.component.updateRepresentationsTheme(
            s.components,
            {
              color: UniformColorThemeProvider.name,
            },
          );
        }
      })
      .then(() => {
        const molSelection = Script.getStructureSelection((MS) => {
          const atomGroups = [];

          let ShouldColourChange = true;
          for (const selection of selections) {
            if (ShouldColourChange) {
              // const hexColour = parseInt(selections[0].colour.substring(1), 16);
              if (this.highlightColour !== selection.colour) {
                this.highlightColour = selection.colour;
                PluginCommands.Canvas3D.SetSettings(this.viewer, {
                  settings: (props) => {
                    props.renderer.selectColor = Color(selection.colour);
                  },
                });
              }
              ShouldColourChange = false;
            }
            const positions = [];
            for (let i = selection.start; i <= selection.end; i++) {
              positions.push(i);
            }
            atomGroups.push(
              MS.struct.generator.atomGroups({
                'chain-test': MS.core.rel.eq([
                  selection.chain,
                  MS.ammp('label_asym_id'),
                ]),
                'residue-test': MS.core.set.has([
                  MS.set(...positions),
                  MS.ammp('auth_seq_id'),
                ]),
              }),
            );
          }
          return MS.struct.combinator.merge(atomGroups);
        }, data);
        const loci = StructureSelection.toLociWithSourceUnits(molSelection);
        this.viewer.managers.interactivity.lociSelects.select({ loci });
      });
  }

  applyChainIdTheme() {
    // apply colouring
    this.viewer.dataTransaction(async () => {
      for (const s of this.viewer.managers.structure.hierarchy.current
        .structures) {
        await this.viewer.managers.structure.component.updateRepresentationsTheme(
          s.components,
          {
            color: this.props.url
              ? ColorByResidueLddtTheme.propertyProvider.descriptor.name
              : ChainIdColorThemeProvider.name,
          },
        );
      }
    });
  }

  clearSelections() {
    if (!this.viewer) return;
    const data = this.viewer.managers.structure.hierarchy.current.structures[0]
      ?.cell.obj?.data;
    if (!data) return;
    this.viewer.managers.interactivity.lociSelects.deselectAll();
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
            <div className={f('structure-and-label')}>
              <div
                id={this.props.elementId || 'structure-viewer'}
                ref={this._structureViewer}
                className={f('structure-viewer-ref')}
              >
                <canvas ref={this._structureViewerCanvas} />
              </div>
              <Labels viewer={this.viewer} />
            </div>
          );
        }}
      </ResizeObserverComponent>
    );
  }
}

export default StructureView;
