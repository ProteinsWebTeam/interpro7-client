import React, { PureComponent, RefObject } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import EntrySelection from './EntrySelection';
import { NO_SELECTION } from './EntrySelection';
import { EntryColorMode, getTrackColor } from 'utils/entry-color';

import ProteinViewerForStructures from './ProteinViewerForStructures';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import PictureInPicturePanel from 'components/SimpleCommonComponents/PictureInPicturePanel';
import PIPToggleButton from 'components/SimpleCommonComponents/PictureInPicturePanel/ToggleButton';

import StructureViewer from 'components/Structure/ViewerOnDemand';

import getMapper from './proteinToStructureMapper';

import fonts from 'EBI-Icon-fonts/fonts.css';

import cssBinder from 'styles/cssBinder';

import style from './style.css';
import buttonBar from './button-bar.css';
import { ScaleLinear } from 'd3-scale';

const css = cssBinder(style, buttonBar, fonts);

const RED = 0xff0000;

/*:: import type { ColorMode } from 'utils/entry-color'; */
type Props = {
  id: string;
  matches: EndpointWithMatchesPayload<EntryMetadata, StructureLinkedObject>[];
  highlight?: string;
  colorDomainsBy: unknown;
};

type Selection = {
  color: number;
  start: number;
  end: number;
  chain: string;
};
type SelectedEntry = {
  accession?: string | null;
  db?: string | null;
  chain?: string | null;
  protein?: string | null;
};
type MinimalStructureFeature = MinimalFeature & {
  chain?: string;
  color: string;
};
type EntryHit = {
  struct_asym_id: string;
  start_residue_number: number;
  end_residue_number: number;
  accession: string;
  source_database: string;
  color?: string;
};
type State = {
  entryMap: Record<
    string,
    Record<string, Record<string, Record<string, EntryHit[]>>>
  >;
  selectedEntry: string;
  selectedEntryToKeep?: SelectedEntry | null;
  isSplitScreen: boolean;
  isSpinning: boolean;
  shouldResetViewer: boolean;
  selectionsInStructure?: Array<Selection> | null;
};

class StructureView extends PureComponent<Props, State> {
  _protein2structureMappers: Record<string, ScaleLinear<number, number, never>>;
  name: string;
  _protvista: RefObject<HTMLDivElement>;
  _splitView: RefObject<HTMLDivElement>;
  splitViewStyle: Object;
  handlingSequenceHighlight?: boolean;

  constructor(props: Props) {
    super(props);

    this.state = {
      entryMap: {},
      selectedEntry: '',
      selectedEntryToKeep: null,
      isSplitScreen: false,
      isSpinning: false,
      shouldResetViewer: false,
      selectionsInStructure: null,
    };

    this._protein2structureMappers = {};
    this.name = `${this.props.id}`;

    this._protvista = React.createRef();
    this._splitView = React.createRef();
    this.splitViewStyle = {};
  }

  async componentDidMount() {
    const pdbid = this.props.id;

    this._protvista.current?.addEventListener('change', (event: Event) => {
      const {
        detail: { eventType, highlight, feature, chain, protein },
      } = event as CustomEvent;
      const {
        accession,
        source_database: sourceDB,
        type,
        chain: chainF,
        protein: proteinF,
        parent,
      }: {
        accession: string;
        source_database: string;
        type: string;
        chain: string;
        protein: string;
        parent: Record<string, unknown> & { protein: string };
      } = feature || {};
      let proteinD = proteinF;

      switch (eventType) {
        case 'sequence-chain':
          if (highlight) {
            const [start, stop] = highlight.split(':');
            const p2s =
              this._protein2structureMappers[
                `${protein}->${chain}`.toUpperCase()
              ];
            this.setState({
              selectionsInStructure: [
                {
                  color: RED,
                  start: Math.round(p2s(start)),
                  end: Math.round(p2s(stop)),
                  chain: chain,
                },
              ],
            });
            this.handlingSequenceHighlight = true;
          } else {
            this.setState({ selectionsInStructure: null });
          }
          break;
        case 'click':
          // bit of a hack to handle missing data in some entries
          if (!proteinD && parent) {
            proteinD = parent.protein;
          }
          this.setState({
            selectedEntryToKeep:
              type === 'chain'
                ? {
                    accession: pdbid,
                    db: 'pdb',
                    chain: accession,
                    protein: proteinD,
                  }
                : {
                    accession: accession,
                    db: sourceDB,
                    chain: chainF,
                    protein: proteinD,
                  },
          });
          break;
        case 'mouseover':
          if (this.handlingSequenceHighlight) {
            this.handlingSequenceHighlight = false;
            return;
          }
          if (type === 'chain')
            this.showEntryInStructure('pdb', pdbid, accession, proteinD);
          else if (type === 'secondary_structure')
            this.setSelectionsForSecondaryStructure(feature);
          else if (accession && !accession.startsWith('G3D:'))
            this.showEntryInStructure(sourceDB, accession, chainF, proteinF);
          break;
        case 'mouseout':
          if (type !== 'secondary_structure') this.showEntryInStructure();
          break;
        default:
          break;
      }
    });
  }
  componentDidUpdate() {
    if (this.state.shouldResetViewer) {
      requestAnimationFrame(() => this.setState({ shouldResetViewer: false }));
    }
  }

  setSelectionsForSecondaryStructure(feature: MinimalStructureFeature) {
    const hits: Array<{ color: string; start: number; end: number }> = [];
    if (feature.locations) {
      for (const loc of feature.locations) {
        for (const frag of loc.fragments) {
          hits.push({
            color: feature.color,
            start: frag.start,
            end: frag.end,
          });
        }
      }
    }

    if (hits.length > 0) {
      const selections: Array<Selection> = [];
      hits.forEach((hit) => {
        const hexColour = parseInt(hit.color.substring(1), 16);
        selections.push({
          color: hexColour,
          start: hit.start,
          end: hit.end,
          chain: feature.chain || '',
        });
      });
      this.setState({ selectionsInStructure: selections });
    } else {
      this.setState({ selectionsInStructure: null });
    }
  }

  _getChainMap(
    chain: string,
    locations: ProtVistaLocation[],
    p2s: ScaleLinear<number, number, never>
  ) {
    const chainMap = [];
    for (const location of locations) {
      for (const { start, end } of location.fragments) {
        chainMap.push({
          struct_asym_id: chain,
          start_residue_number: p2s(start),
          end_residue_number: p2s(end),
          accession: chain,
          source_database: 'pdb',
        });
      }
    }
    return chainMap;
  }

  _mapLocations(
    map: Record<string, Record<string, Array<unknown>>>,
    {
      chain,
      protein,
      locations,
      entry,
      db,
      match,
    }: {
      chain: string;
      protein: string;
      locations: ProtVistaLocation[];
      entry: string;
      db: string;
      match: { metadata: { integrated: string | null } };
    },
    p2s: ScaleLinear<number, number, never>
  ) {
    for (const location of locations) {
      for (const fragment of location.fragments) {
        map[chain][protein].push({
          struct_asym_id: chain,
          start_residue_number: Math.round(p2s(fragment.start)),
          end_residue_number: Math.round(p2s(fragment.end)),
          accession: entry,
          source_database: db,
          parent: match.metadata.integrated
            ? { accession: match.metadata.integrated }
            : null,
        });
      }
    }
  }

  _collateHits(
    database: string,
    accession: string,
    chain?: string | null,
    protein?: string | null
  ) {
    let hits: Array<EntryHit> = [];
    if (database && accession) {
      if (chain && protein) {
        hits = hits.concat(
          this.state.entryMap[database][accession][chain][protein]
        );
      } else if (chain) {
        Object.keys(this.state.entryMap[database][accession][chain]).forEach(
          (p) => {
            hits = hits.concat(
              this.state.entryMap[database][accession][chain][p]
            );
          }
        );
      } else {
        Object.keys(this.state.entryMap[database][accession]).forEach((c) => {
          Object.keys(this.state.entryMap[database][accession][c]).forEach(
            (p) => {
              hits = hits.concat(
                this.state.entryMap[database][accession][c][p]
              );
            }
          );
        });
      }
    }

    hits.forEach(
      (hit) => (hit.color = getTrackColor(hit, this.props.colorDomainsBy))
    );
    return hits;
  }

  createEntryMap() {
    const memberDBMap: Record<
      string,
      Record<string, Record<string, Record<string, Array<EntryHit>>>>
    > = { pdb: {} };

    if (this.props.matches) {
      // create matches in structure hierarchy
      for (const match of this.props.matches) {
        const entry = match.metadata.accession;
        const db = match.metadata.source_database;
        if (!memberDBMap[db]) memberDBMap[db] = {};
        if (!memberDBMap[db][entry]) memberDBMap[db][entry] = {};

        for (const structure of match.structures) {
          const chain = structure.chain;
          const protein = structure.protein;
          const p2s = getMapper(structure.protein_structure_mapping[chain]);
          this._protein2structureMappers[`${protein}->${chain}`.toUpperCase()] =
            p2s;
          if (!memberDBMap[db][entry][chain])
            memberDBMap[db][entry][chain] = {};
          if (!memberDBMap[db][entry][chain][protein])
            memberDBMap[db][entry][chain][protein] = [];
          this._mapLocations(
            memberDBMap[db][entry],
            {
              chain,
              protein,
              locations: structure.entry_protein_locations,
              entry,
              db,
              match,
            },
            p2s
          );
          // create PDB chain mapping
          if (!memberDBMap.pdb[structure.accession])
            memberDBMap.pdb[structure.accession] = {};
          if (!memberDBMap.pdb[structure.accession][chain]) {
            memberDBMap.pdb[structure.accession][chain] = {};
          }
          if (!memberDBMap.pdb[structure.accession][chain][structure.protein]) {
            memberDBMap.pdb[structure.accession][chain][structure.protein] =
              this._getChainMap(
                chain,
                structure.structure_protein_locations,
                p2s
              );
          }
        }
      }
    }
    return memberDBMap;
  }

  showEntryInStructure = (
    memberDB?: string | null,
    entry?: string,
    chain?: string,
    protein?: string
  ) => {
    const keep = this.state.selectedEntryToKeep;
    let db: null | string | undefined;
    let acc: null | string | undefined;
    let ch: null | string | undefined;
    let prot: null | string | undefined;

    // reset keep when 'no entry' is selected via selection input
    if (entry === NO_SELECTION && keep) {
      keep.db = null;
      keep.accession = null;
      keep.chain = null;
      keep.protein = null;
    } else if (memberDB !== undefined && entry !== undefined) {
      db = memberDB;
      acc = entry;
      ch = chain;
      prot = protein;
    } else if (
      keep &&
      keep.db !== null &&
      keep.accession !== null &&
      keep.chain !== null &&
      keep.protein !== null
    ) {
      db = keep.db;
      acc = keep.accession;
      ch = keep.chain;
      prot = keep.protein;
    }

    if (acc && acc.startsWith('Chain')) return; // Skip the keep procedure for secondary structure
    const hits = this._collateHits(db || '', acc || '', ch, prot);
    if (hits.length > 0) {
      const selections: Array<Selection> = [];
      hits.forEach((hit) => {
        const hexColour = parseInt(hit.color?.substring(1) || '', 16);
        selections.push({
          color: hexColour,
          start: hit.start_residue_number,
          end: hit.end_residue_number,
          chain: hit.struct_asym_id,
        });
      });

      this.setState({ selectionsInStructure: selections });
    } else {
      this.setState({ selectionsInStructure: null });
    }

    this.setState({ selectedEntry: acc || '' });
  };

  render() {
    const {
      entryMap,
      selectedEntry,
      isSpinning,
      isSplitScreen,
      shouldResetViewer,
    } = this.state;
    const pdbId = this.props.id;
    const elementId = `structure-${pdbId}`;

    return (
      <div
        ref={this._splitView}
        className={css({ 'split-view': isSplitScreen })}
      >
        <PictureInPicturePanel
          className={css('structure-viewer')}
          testid="structure-3d-viewer"
          // @ts-ignore
          OtherControls={{
            top: this.props.matches ? (
              <EntrySelection
                entryMap={entryMap}
                updateStructure={this.showEntryInStructure}
                selectedEntry={selectedEntry}
              />
            ) : null,
          }}
          OtherButtons={
            <div
              style={{
                display: isSplitScreen ? 'none' : 'block',
              }}
              className={css('button-bar')}
            >
              <Link
                className={css('control')}
                href={`https://www.ebi.ac.uk/pdbe/entry-files/download/pdb${pdbId}.ent`}
                download={`${pdbId || 'download'}.model.pdb.ent`}
              >
                <span
                  className={css('icon', 'icon-common', 'icon-download')}
                  data-icon="&#xf019;"
                />
                &nbsp;PDB file
              </Link>
              <Link
                className={css('control')}
                href={`https://www.ebi.ac.uk/pdbe/entry-files/download/${pdbId}.cif`}
                download={`${pdbId || 'download'}.model.cif`}
              >
                <span
                  className={css('icon', 'icon-common', 'icon-download')}
                  data-icon="&#xf019;"
                />
                &nbsp;mmCIF file
              </Link>

              <button
                className={css('icon', 'icon-common', 'as-link')}
                onClick={() => {
                  this.setState({ isSpinning: !isSpinning });
                }}
                data-icon={isSpinning ? '' : 'v'}
                title={isSpinning ? 'Stop spinning' : 'Spin structure'}
              />
              <button
                className={css('icon', 'icon-common', 'as-link')}
                onClick={() => this.setState({ shouldResetViewer: true })}
                data-icon="}"
                title="Reset image"
              />
              <FullScreenButton
                element={this._splitView.current}
                className={css('icon', 'icon-common', 'as-link')}
                tooltip="Split full screen"
                dataIcon={'\uF0DB'}
                onFullScreenHook={() => this.setState({ isSplitScreen: true })}
                onExitFullScreenHook={() =>
                  this.setState({ isSplitScreen: false })
                }
              />
              <FullScreenButton
                className={css('icon', 'icon-common', 'as-link')}
                tooltip="View the structure in full screen mode"
                element={elementId}
              />
              <PIPToggleButton
                className={css('icon', 'icon-common', 'as-link')}
              />
            </div>
          }
        >
          <StructureViewer
            id={pdbId}
            elementId={elementId}
            onStructureLoaded={() => {
              if (this.props.matches) {
                const entryMap = this.createEntryMap();
                this.setState({ entryMap });
              }
            }}
            isSpinning={isSpinning}
            shouldResetViewer={shouldResetViewer}
            selections={this.state.selectionsInStructure}
            onReset={() => {
              this.setState({ selectionsInStructure: null });
            }}
          />
        </PictureInPicturePanel>
        <div
          ref={this._protvista}
          data-testid="structure-protvista"
          className={css('protvista-container')}
        >
          <ProteinViewerForStructures />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui) => ({
    colorDomainsBy: ui.colorDomainsBy || EntryColorMode.DOMAIN_RELATIONSHIP,
  })
);

export default connect(mapStateToProps)(StructureView);
