import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import 'vis-network/styles/vis-network.css';

import { goToCustomLocation } from 'actions/creators';

import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Card from 'components/SimpleCommonComponents/Card';
import Button from 'components/SimpleCommonComponents/Button';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import LabelBy from 'components/ProteinViewer/Options/LabelBy';
import { getTextForLabel } from 'utils/text';

import { buildNodes, ClanVisNode } from './buildNodes';
import { buildEdges } from './buildEdges';
import { getIsolatedAccessions, placeIsolatedNodes } from './isolatedNodesGrid';
import Legend from './Legend';
import SizeSlider from './SizeSlider';
import EditModeToggle from './EditModeToggle';

import cssBinder from 'styles/cssBinder';
import summary from 'styles/summary.css';
import ipro from 'styles/interpro-vf.css';
import style from './style.css';

const css = cssBinder(summary, ipro, style);

const MAX_NUMBER_OF_NODES = 100;

// The whole viewer (controls included) goes full screen, not just the canvas,
// so the legend and the size slider stay reachable. FullScreenButton resolves
// this by id after mount, which is more reliable than passing a ref whose
// `.current` is still null on the first render.
const FULL_SCREEN_ID = 'clanNetworkViewerFullScreen';

const DEFAULT_LABEL: LabelUISettings = {
  accession: false,
  name: false,
  short: true,
};

type Props = {
  data: {
    metadata: SetMetadata;
  };
  db?: string | null;
  goToCustomLocation: typeof goToCustomLocation;
  loading: boolean;
  label?: LabelUISettings;
};

type ClickParams = {
  nodes: Array<string>;
  event?: { srcEvent?: MouseEvent };
};

export const ClanNetworkViewer = ({
  data,
  db,
  goToCustomLocation,
  loading,
  label,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesDataSetRef = useRef<DataSet<ClanVisNode> | null>(null);
  const editModeRef = useRef(false);

  const metadata = loading || !data.metadata ? null : data.metadata;
  const relationships = metadata?.relationships;
  const nodeCount = relationships?.nodes.length || 0;

  const [forceShow, setForceShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sizeScale, setSizeScale] = useState(1);

  const showNetwork = forceShow || nodeCount <= MAX_NUMBER_OF_NODES;
  const effectiveLabel = label || DEFAULT_LABEL;

  // Redirect off the "all" pseudo-database, same as the old ClanViewer.
  useEffect(() => {
    if (db === 'all' && metadata?.source_database) {
      goToCustomLocation({
        description: {
          main: { key: 'set' },
          set: {
            db: metadata.source_database,
            accession: metadata.accession,
          },
        },
      });
    }
  }, [db, metadata?.source_database, metadata?.accession, goToCustomLocation]);

  useEffect(() => {
    editModeRef.current = editMode;
    networkRef.current?.setOptions({ interaction: { dragNodes: editMode } });
  }, [editMode]);

  // Build (or rebuild) the network whenever the clan being viewed changes.
  useEffect(() => {
    if (!containerRef.current || !relationships || !showNetwork) {
      return undefined;
    }

    const isolated = getIsolatedAccessions(
      relationships.nodes,
      relationships.links,
    );
    const positions = placeIsolatedNodes(isolated);
    const nodes = buildNodes(
      relationships.nodes,
      metadata?.accession || '',
      effectiveLabel,
      positions,
    );
    const edges = buildEdges(relationships.links, relationships.nodes);

    const nodesDataSet = new DataSet<ClanVisNode>(nodes);
    const edgesDataSet = new DataSet(edges);
    nodesDataSetRef.current = nodesDataSet;

    const network = new Network(
      containerRef.current,
      { nodes: nodesDataSet, edges: edgesDataSet },
      {
        width: '100%',
        height: '100%',
        // vis-network's own autoResize only reacts to window resizes; the
        // ResizeObserver below covers those *and* the container changing size
        // on its own (entering/leaving full screen, layout settling).
        autoResize: false,
        nodes: {
          borderWidth: 2,
          shadow: true,
        },
        edges: {
          shadow: true,
        },
        physics: {
          stabilization: { iterations: 200 },
          barnesHut: {
            gravitationalConstant: -8000,
            centralGravity: 0.3,
            springLength: 150,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.5,
          },
        },
        interaction: {
          dragNodes: editModeRef.current,
          hover: true,
          navigationButtons: true,
          keyboard: true,
          tooltipDelay: 100,
        },
        layout: {
          improvedLayout: true,
        },
      },
    );
    networkRef.current = network;

    network.once('stabilizationIterationsDone', () => {
      network.setOptions({ physics: false });
      network.fit();
    });

    network.on('click', (params: ClickParams) => {
      if (editModeRef.current) return;
      const accession = params.nodes?.[0];
      if (!accession) return;
      const nativeEvent = params.event?.srcEvent;
      if (nativeEvent?.metaKey || nativeEvent?.ctrlKey) {
        window.open(`/interpro/entry/${db}/${accession}`, '_blank')?.focus();
      } else {
        goToCustomLocation({
          description: {
            main: { key: 'entry' },
            entry: { db: db || undefined, accession },
          },
        });
      }
    });

    return () => {
      network.destroy();
      networkRef.current = null;
      nodesDataSetRef.current = null;
    };
    // Rebuilding on every label/db change would wipe layout & physics state;
    // those are handled by the lighter-weight effects below instead.
  }, [metadata?.accession, showNetwork]);

  // Keep the canvas the same size as its container. Without this the network
  // keeps whatever pixel size it was built at, so going full screen would just
  // centre a 600px canvas in a full-screen window.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !showNetwork || typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(() => {
      const network = networkRef.current;
      if (!network || !container.clientHeight) return;
      network.setSize(
        `${container.clientWidth}px`,
        `${container.clientHeight}px`,
      );
      network.redraw();
      network.fit();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [showNetwork]);

  // Label content changed: refresh labels only, no full rebuild.
  useEffect(() => {
    const nodesDataSet = nodesDataSetRef.current;
    if (!nodesDataSet || !relationships) return;
    nodesDataSet.update(
      relationships.nodes.map((node) => ({
        id: node.accession,
        label: getTextForLabel(node, effectiveLabel),
      })),
    );
  }, [label?.accession, label?.name, label?.short]);

  // Size slider changed: rescale nodes/fonts relative to their base size.
  useEffect(() => {
    const nodesDataSet = nodesDataSetRef.current;
    if (!nodesDataSet) return;
    nodesDataSet.update(
      nodesDataSet.get().map((node) => ({
        id: node.id,
        size: node.baseSize * sizeScale,
        font: { size: node.baseFontSize * sizeScale },
      })),
    );
  }, [sizeScale]);

  if (!metadata || !relationships) return null;

  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      {!showNetwork && nodeCount > MAX_NUMBER_OF_NODES && (
        <Card title="Clan Network Viewer">
          <section>
            The selected clan has {nodeCount} member entries. Displaying more
            than {MAX_NUMBER_OF_NODES} nodes in this visualisation can affect
            the performance of your browser.
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setForceShow(true)}>Visualise it</Button>
            </div>
          </section>
        </Card>
      )}
      {showNetwork && (
        <div id={FULL_SCREEN_ID} className={css('clan-network-full-screen')}>
          <div className={css('clan-network-controls')}>
            <DropDownButton
              label="Label Content"
              extraClasses={css('protvista-menu')}
            >
              <LabelBy />
            </DropDownButton>
            <DropDownButton label="Legend">
              <Legend links={relationships.links} />
            </DropDownButton>
            <SizeSlider value={sizeScale} onChange={setSizeScale} />
            <EditModeToggle
              editMode={editMode}
              onToggle={() => setEditMode((current) => !current)}
            />
            <FullScreenButton
              element={FULL_SCREEN_ID}
              tooltip="View the clan network in full screen mode"
            />
          </div>
          <div
            ref={containerRef}
            className={css('clan-network-canvas')}
            id="clanNetworkViewerContainer"
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description.set.db,
  (state: GlobalState) => state.settings.ui,
  (db, ui) => ({ db, label: ui.labelContent }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  ClanNetworkViewer,
);
