import React, { PureComponent, RefObject } from 'react';

import { DefaultPluginSpec, PluginSpec } from 'molstar/lib/mol-plugin/spec';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginContext } from 'molstar/lib/mol-plugin/context';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { StructureSelection } from 'molstar/lib/mol-model/structure';
import { ChainIdColorThemeProvider } from 'molstar/lib/mol-theme/color/chain-id';
import { ParamDefinition } from 'molstar/lib/mol-util/param-definition';
import { Script } from 'molstar/lib/mol-script/script';
import { Color } from 'molstar/lib/mol-util/color';
import { ColorNames } from 'molstar/lib/mol-util/color/names';
import { BuiltInTrajectoryFormat } from 'molstar/lib/mol-plugin-state/formats/trajectory';

import {
  UniformColorThemeProvider,
  UniformColorThemeParams,
} from 'molstar/lib/mol-theme/color/uniform';

import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import Labels from './Labels';
import { Selection } from '../ViewerAndEntries';
import { AfConfidenceProvider } from './af-confidence/prop';
import { AfConfidenceColorThemeProvider } from './af-confidence/color';
import { BFactorColorThemeProvider } from './bfvd-confidence/color';
import { CustomThemeProvider } from './custom/color';

import cssBinder from 'styles/cssBinder';

import style from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
const css = cssBinder(style, fonts);

export type Props = {
  id: string;
  url?: string;
  elementId: string;
  ext?: string;
  name?: string;
  theme?: string;
  onStructureLoaded?: () => void;
  onReset?: () => void;
  isSpinning?: boolean;
  shouldResetViewer?: boolean;
  selections?: Array<Selection> | null;
  colorBy?: string;
  colorMap?: Record<number, number>;
};

const DEFAULT_EXTENSION = 'mmcif';

class StructureView extends PureComponent<Props> {
  _structureViewer: RefObject<HTMLDivElement>;
  _structureViewerCanvas: RefObject<HTMLCanvasElement>;
  viewer: PluginContext | null;
  name: string;
  highlightColour: number | null;
  selections: null | Array<unknown>;

  constructor(props: Props) {
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
      const mySpec: PluginSpec = {
        ...DefaultPluginSpec(),
        layout: {
          initial: {
            isExpanded: false,
            showControls: true,
          },
        },
        config: [[PluginConfig.VolumeStreaming.Enabled, false]],
      };

      this.viewer = new PluginContext(mySpec);

      await this.viewer.init();
      if (
        this._structureViewerCanvas.current &&
        this._structureViewer.current
      ) {
        this.viewer.initViewer(
          this._structureViewerCanvas.current,
          this._structureViewer.current,
        );
        this.viewer.customModelProperties.register(AfConfidenceProvider, true);
        // this.viewer.managers.lociLabels.addProvider(this.labelAfConfScore);
        this.viewer.representation.structure.themes.colorThemeRegistry.add(
          AfConfidenceColorThemeProvider,
        );

        this.viewer.representation.structure.themes.colorThemeRegistry.add(
          CustomThemeProvider,
        );

        this.viewer.representation.structure.themes.colorThemeRegistry.add(
          BFactorColorThemeProvider,
        );
      }
      // mouseover ?????
      // window.viewer = this.viewer;
    }

    if (this.props.url) {
      this.loadStructureInViewer(
        this.props.url,
        this.props.ext || DEFAULT_EXTENSION,
      );
    } else {
      this.loadStructureInViewer(
        `https://www.ebi.ac.uk/pdbe/static/entry/${this.name}_updated.cif`,
        'mmcif',
      );
    }
  }

  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /* 
  Delays take into account: 
    - animation times
    - the MolStar viewer not handling well multiple commands at once 
  */
  async resetOperations() {
    if (this.viewer) {
      if (this.props.onReset) {
        await this.delay(100);
        this.props.onReset();
        this.applyChainIdTheme();
      }

      PluginCommands.Camera.ResetAxes(this.viewer, {});
      await this.delay(500);
      PluginCommands.Camera.Reset(this.viewer, {});
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.name !== `${this.props.id}` || prevProps.url !== this.props.url) {
      this.name = `${this.props.id}`;
      if (this.props.url) {
        this.loadStructureInViewer(
          this.props.url,
          this.props.ext || DEFAULT_EXTENSION,
        );
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
        this.resetOperations();
      }
      if ((this.props.selections?.length || 0) > 0) {
        this.highlightSelections(this.props.selections as Array<Selection>);
      } else {
        this.clearSelections();
        this.applyChainIdTheme();
      }
    }
  }

  loadStructureInViewer(url: string, format: string) {
    requestAnimationFrame(async () => {
      try {
        if (this.viewer) {
          await this.viewer.clear();

          const data = await this.viewer.builders.data.download(
            { url: url },
            { state: { isGhost: false } },
          );
          const trajectory =
            await this.viewer.builders.structure.parseTrajectory(
              data,
              format as BuiltInTrajectoryFormat,
            );
          const outcome = this.viewer.builders.structure.hierarchy.applyPreset(
            trajectory,
            'default',
            {
              structure: {
                name: 'model',
                params: {},
              },
              showUnitcell: false,
              representationPreset: 'auto',
            },
          );
          if (outcome)
            outcome.then(() => {
              // populate the entry map object used for entry highlighting
              if (this.props.onStructureLoaded) {
                this.props.onStructureLoaded();
              }
              // spin/stop spinning the structure
              this.setSpin(this.props.isSpinning);
              this.applyChainIdTheme();
            });
        }
      } catch (e) {
        console.log('Molstar error', e);
      }
    });
  }

  setSpin(spinState = false) {
    if (this.viewer && this.viewer.canvas3d) {
      const trackball = this.viewer.canvas3d.props.trackball;
      const newSettings = {
        settings: { trackball: { ...trackball } },
      };
      if (spinState)
        newSettings.settings.trackball.animate = { name: 'spin', params: {} };
      PluginCommands.Canvas3D.SetSettings(this.viewer, newSettings);
    }
  }

  highlightSelections(selections: Array<Selection>) {
    if (!this.viewer) return;
    const data =
      this.viewer.managers.structure.hierarchy.current.structures[0]?.cell.obj
        ?.data;
    if (!data) return;

    this.clearSelections();
    this.viewer
      .dataTransaction(async () => {
        UniformColorThemeParams.value = ParamDefinition.Color(ColorNames.white);
        for (const s of this.viewer?.managers.structure.hierarchy.current
          .structures || []) {
          await this.viewer?.managers.structure.component.updateRepresentationsTheme(
            s.components,
            {
              color: UniformColorThemeProvider.name,
            },
          );
        }
      })
      .then(() => {
        if (!this.viewer) return;
        const molSelection = Script.getStructureSelection((MS) => {
          if (!this.viewer) return;
          const atomGroups = [];
          const positions = [];
          let ShouldColourChange = true;
          for (const selection of selections) {
            if (ShouldColourChange) {
              if (this.highlightColour !== selection.color) {
                this.highlightColour = selection.color as number;
                PluginCommands.Canvas3D.SetSettings(this.viewer, {
                  settings: (props) => {
                    props.renderer.selectColor = Color(
                      selection.color as number,
                    );
                    props.renderer.selectStrength = 0.8;
                    props.marking.enabled = false;
                  },
                });
              }
              ShouldColourChange = false;
            }

            for (let i = selection.start; i <= selection.end; i++) {
              positions.push(i);
            }
          }

          atomGroups.push(
            MS.struct.generator.atomGroups({
              'residue-test': MS.core.set.has([
                MS.set(...positions),
                MS.ammp('auth_seq_id'),
              ]),
            }),
          );

          return MS.struct.combinator.merge(atomGroups);
        }, data);

        const loci = StructureSelection.toLociWithSourceUnits(molSelection);
        this.viewer.managers.interactivity.lociSelects.select({ loci });
      });
  }

  applyChainIdTheme() {
    let colouringTheme: string;

    switch (this.props.theme) {
      case 'af':
        colouringTheme = AfConfidenceColorThemeProvider.name;
        break;
      case 'bfvd':
        colouringTheme = BFactorColorThemeProvider.name;
        break;
      case 'ted':
        colouringTheme = CustomThemeProvider.name;
        break;
      case 'repr_families':
        colouringTheme = CustomThemeProvider.name;
        break;
      case 'repr_domains':
        colouringTheme = CustomThemeProvider.name;
        break;
      default:
        colouringTheme = ChainIdColorThemeProvider.name;
    }

    // apply colouring
    this.viewer?.dataTransaction(async () => {
      for (const s of this.viewer?.managers.structure.hierarchy.current
        .structures || []) {
        await this.viewer?.managers.structure.component.updateRepresentationsTheme(
          s.components,
          {
            color: colouringTheme as typeof ChainIdColorThemeProvider.name,
            colorParams: {
              colorMap: this.props.colorMap,
            } as any,
          },
        );
      }
    });
  }

  clearSelections() {
    if (!this.viewer) return;
    const data =
      this.viewer.managers.structure.hierarchy.current.structures[0]?.cell.obj
        ?.data;
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
        className={css('viewer-resizer')}
      >
        {() => {
          return (
            <div className={css('structure-and-label')}>
              <div
                id={this.props.elementId || 'structure-viewer'}
                ref={this._structureViewer}
                className={css('structure-viewer-ref')}
              >
                <canvas ref={this._structureViewerCanvas} />
              </div>
              <Labels viewer={this.viewer} accession={this.name} />
            </div>
          );
        }}
      </ResizeObserverComponent>
    );
  }
}

export default StructureView;
