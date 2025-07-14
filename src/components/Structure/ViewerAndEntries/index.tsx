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

import fonts from 'EBI-Icon-fonts/fonts.css';

import cssBinder from 'styles/cssBinder';

import style from './style.css';
import buttonBar from './button-bar.css';

const css = cssBinder(style, buttonBar, fonts);

const RED = 0xff0000;

type Props = {
  id: string;
  matches: EndpointWithMatchesPayload<EntryMetadata, StructureLinkedObject>[];
  highlight?: string;
  colorDomainsBy: unknown;
};

export type Selection = {
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
  start: number;
  end: number;
  auth_start?: number;
  auth_end?: number;
  accession: string;
  source_database: string;
  color?: string;
};
type State = {
  entryMap: Record<string, Record<string, Record<string, EntryHit[]>>>;
  selectedEntry: string;
  selectedEntryToKeep?: SelectedEntry | null;
  isReady: boolean;
  isSplitScreen: boolean;
  isSpinning: boolean;
  shouldResetViewer: boolean;
  selectionsInStructure?: Array<Selection> | null;
};

class StructureView extends PureComponent<Props, State> {
  name: string;
  _protvista: RefObject<HTMLDivElement>;
  _structureView: RefObject<HTMLDivElement>;
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
      isReady: false,
    };

    this.name = `${this.props.id}`;

    this._protvista = React.createRef();
    this._splitView = React.createRef();
    this._structureView = React.createRef();
    this.splitViewStyle = {};
  }

  async componentDidMount() {
    const pdbid = this.props.id;

    this._protvista.current?.addEventListener('change', (event: Event) => {
      const {
        detail: { eventType, highlight, feature, chain },
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
            this.setState({
              selectionsInStructure: [
                {
                  color: RED,
                  start: Math.round(start),
                  end: Math.round(stop),
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
            this.showEntryInStructure('pdb', pdbid, accession);
          else if (type === 'secondary_structure')
            this.setSelectionsForSecondaryStructure(feature);
          else if (accession && !accession.startsWith('G3D:'))
            this.showEntryInStructure(sourceDB, accession, chainF);
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

  _getChainMap(chain: string, locations: ProtVistaLocation[]) {
    const chainMap = [];
    for (const location of locations) {
      for (const { start, end, auth_start, auth_end } of location.fragments) {
        chainMap.push({
          struct_asym_id: chain,
          start: start,
          end: end,
          auth_start: auth_start,
          auth_end: auth_end,
          accession: chain,
          source_database: 'pdb',
        });
      }
    }
    return chainMap;
  }

  _mapLocations(
    map: Record<string, Array<unknown>>,
    {
      chain,
      locations,
      entry,
      db,
      match,
    }: {
      chain: string;
      locations: ProtVistaLocation[];
      entry: string;
      db: string;
      match: { metadata: { integrated: string | null } };
    },
  ) {
    for (const location of locations) {
      for (const fragment of location.fragments) {
        map[chain].push({
          struct_asym_id: chain,
          start: fragment.start,
          end: fragment.end,
          auth_start: fragment.auth_start,
          auth_end: fragment.auth_end,
          accession: entry,
          source_database: db,
          parent: match.metadata.integrated
            ? { accession: match.metadata.integrated }
            : null,
        });
      }
    }
  }

  _collateHits(database: string, accession: string, chain?: string | null) {
    let hits: Array<EntryHit> = [];
    if (database && accession) {
      if (chain) {
        hits = hits.concat(...this.state.entryMap[database][accession][chain]);
      } else {
        Object.keys(this.state.entryMap[database][accession]).forEach((c) => {
          hits = hits.concat(this.state.entryMap[database][accession][c]);
        });
      }
    }

    hits.forEach(
      (hit) => (hit.color = getTrackColor(hit, this.props.colorDomainsBy)),
    );
    return hits;
  }

  getEntryNames() {
    const accessionToName: Record<string, NameObject | string> = {};
    if (this.props.matches) {
      for (const match of this.props.matches) {
        const entryName = match.metadata.name;
        const entryAccession = match.metadata.accession;
        accessionToName[entryAccession] = entryName || entryAccession;
      }
    }
    return accessionToName;
  }

  createEntryMap() {
    const memberDBMap: Record<
      string,
      Record<string, Record<string, Array<EntryHit>>>
    > = {};

    if (this.props.matches) {
      // create matches in structure hierarchy

      for (const match of this.props.matches) {
        const entry = match.metadata.accession;
        const db = match.metadata.source_database;
        if (!memberDBMap[db]) memberDBMap[db] = {};
        if (!memberDBMap[db][entry]) memberDBMap[db][entry] = {};

        for (const structure of match.structures) {
          const chain = structure.chain;

          if (!memberDBMap[db][entry][chain])
            memberDBMap[db][entry][chain] = [];
          this._mapLocations(memberDBMap[db][entry], {
            chain,
            locations: structure.entry_structure_locations,
            entry,
            db,
            match,
          });
        }
      }
    }
    return memberDBMap;
  }

  showEntryInStructure = (
    memberDB?: string | null,
    entry?: string,
    chain?: string,
  ) => {
    const keep = this.state.selectedEntryToKeep;
    let db: null | string | undefined;
    let acc: null | string | undefined;
    let ch: null | string | undefined;

    // reset keep when 'no entry' is selected via selection input
    if (entry === NO_SELECTION && keep) {
      keep.db = null;
      keep.accession = null;
      keep.chain = null;
    } else if (memberDB !== undefined && entry !== undefined) {
      db = memberDB;
      acc = entry;
      ch = chain;
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
    }

    if (acc && acc.startsWith('Chain')) return; // Skip the keep procedure for secondary structure
    const hits = this._collateHits(db || '', acc || '', ch);
    if (hits.length > 0) {
      const selections: Array<Selection> = [];
      hits.forEach((hit) => {
        const hexColour = parseInt(hit.color?.substring(1) || '', 16);
        selections.push({
          color: hexColour,
          start: hit.auth_start || hit.start,
          end: hit.auth_end || hit.end,
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
          OtherControls={{
            top: this.props.matches ? (
              <EntrySelection
                entryMap={entryMap}
                entriesNames={this.getEntryNames()}
                updateStructure={this.showEntryInStructure}
                selectedEntry={selectedEntry}
                isReady={this.state.isReady}
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
                dataIcon="icon-columns"
                onFullScreenHook={() => this.setState({ isSplitScreen: true })}
                onExitFullScreenHook={() =>
                  this.setState({ isSplitScreen: false })
                }
              />
              <FullScreenButton
                className={css('icon', 'icon-common', 'as-link')}
                tooltip="View the structure in full screen mode"
                element={this.state.isReady ? elementId : null}
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
                this.setState({ entryMap, isReady: true });
              }
            }}
            isSpinning={isSpinning}
            shouldResetViewer={shouldResetViewer}
            selections={this.state.selectionsInStructure || []}
            onReset={() => this.setState({ selectionsInStructure: null })}
          />
        </PictureInPicturePanel>
        <div
          ref={this._protvista}
          data-testid="structure-protvista"
          className={css('protvista-container')}
        >
          <ProteinViewerForStructures structure={pdbId} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui) => ({
    colorDomainsBy: ui.colorDomainsBy || EntryColorMode.DOMAIN_RELATIONSHIP,
  }),
);

export default connect(mapStateToProps)(StructureView);
