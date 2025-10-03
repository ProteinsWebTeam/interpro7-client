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
import { ColorTheme, LocationColor } from 'molstar/lib/mol-theme/color';
import { ParamDefinition as PD } from 'molstar/lib/mol-util/param-definition';
import { ThemeDataContext } from 'molstar/lib/mol-theme/theme';
import { Location as MolLocation } from 'molstar/lib/mol-model/location';

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
import {
  StructureElement,
  StructureProperties,
} from 'molstar/lib/mol-model/structure';

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
          const colors: Record<number, string> = {};

          let ShouldColourChange = true;
          for (const selection of selections) {
            if (ShouldColourChange) {
              // const hexColour = parseInt(selections[0].colour.substring(1), 16);
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

            for (let i = selection.start; i <= selection.end; i++) {
              colors[i] = selection.color as string;
            }
          }

          atomGroups.push(
            MS.struct.generator.atomGroups({
              'chain-test': MS.core.rel.eq(['A', MS.ammp('auth_asym_id')]),
              'residue-test': MS.core.set.has([
                MS.set(...positions),
                MS.ammp('auth_seq_id'),
              ]),
            }),
          );

          function hexToRgb(hex: string): { r: number; g: number; b: number } {
            try {
              // Remove the hash if present
              hex = hex.replace(/^#/, '');

              // Expand shorthand form (#F53 => #FF5533)
              if (hex.length === 3) {
                hex = hex
                  .split('')
                  .map((c) => c + c)
                  .join('');
              }

              if (hex.length !== 6) return { r: 0, g: 0, b: 0 };

              const r = parseInt(hex.slice(0, 2), 16);
              const g = parseInt(hex.slice(2, 4), 16);
              const b = parseInt(hex.slice(4, 6), 16);

              return { r, g, b };
            } catch {
              return { r: 0, g: 0, b: 0 };
            }
          }

          const CustomColorTheme = (
            ctx: ThemeDataContext,
            props: PD.Values<{}>,
          ): ColorTheme<{}> => {
            let color: LocationColor;
            color = (location: MolLocation) => {
              if (StructureElement.Location.is(location)) {
                const rgbColor = hexToRgb(
                  colors[StructureProperties.residue.auth_seq_id(location)],
                );
                console.log(rgbColor);
                return Color.fromRgb(100, 200, 200);
              }
              return Color(0);
            };
            return {
              factory: CustomColorTheme,
              granularity: 'group',
              color: color,
              props: props,
              description:
                'Assigns residue colors according to the B-factor values',
            };
          };

          const CustomResidueColorThemeProvider: ColorTheme.Provider<{}> = {
            name: 'custom-residue-colors',
            label: 'Custom Residue Colors',
            category: ColorTheme.Category.Misc,
            factory: CustomColorTheme,
            getParams: (ctx) => ({
              colors: PD.Value({}, { isHidden: true }),
            }),
            defaultValues: { colors: {} },
            isApplicable: (ctx) => true,
          };

          this.viewer.representation.structure.themes.colorThemeRegistry.add(
            CustomResidueColorThemeProvider,
          );

          return MS.struct.combinator.merge(atomGroups);
        }, data);

        const loci = StructureSelection.toLociWithSourceUnits(molSelection);
        this.applyChainIdTheme('custom-residue-colors');

        this.viewer.managers.interactivity.lociSelects.select({ loci });
      });
  }

  applyChainIdTheme(custom?: string) {
    let colouringTheme: string;
    if (!custom) {
      switch (this.props.theme) {
        case 'af':
          colouringTheme = AfConfidenceColorThemeProvider.name;
          break;
        case 'bfvd':
          colouringTheme = BFactorColorThemeProvider.name;
          break;
        default:
          colouringTheme = ChainIdColorThemeProvider.name;
      }
    } else {
      colouringTheme = custom;
    }

    // apply colouring
    this.viewer?.dataTransaction(async () => {
      for (const s of this.viewer?.managers.structure.hierarchy.current
        .structures || []) {
        await this.viewer?.managers.structure.component.updateRepresentationsTheme(
          s.components,
          {
            color: colouringTheme as typeof ChainIdColorThemeProvider.name,
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
