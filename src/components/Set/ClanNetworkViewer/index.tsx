import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import 'vis-network/styles/vis-network.css';

import { goToCustomLocation } from 'actions/creators';

import Card from 'components/SimpleCommonComponents/Card';
import Button from 'components/SimpleCommonComponents/Button';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';

import { buildNodes, ClanVisNode } from './buildNodes';
import { buildEdges } from './buildEdges';
import { getIsolatedAccessions, placeIsolatedNodes } from './isolatedNodesGrid';
import { ClanNetworkLink, ClanNetworkNode } from './types';
import Legend from './Legend';
import SizeSlider from './SizeSlider';

import cssBinder from 'styles/cssBinder';
import summary from 'styles/summary.css';
import ipro from 'styles/interpro-vf.css';
import style from './style.css';

const css = cssBinder(summary, ipro, style);

const MAX_NUMBER_OF_NODES = 100;

// vis-network seeds its layout RNG with Math.random() unless told otherwise, so
// the same clan settles into a different shape on every mount. Pinning the seed
// (and feeding nodes/edges in a stable order, see sortNodes/sortLinks) makes the
// stabilised topology reproducible.
const LAYOUT_RANDOM_SEED = 42;

// The seed only pins the *starting* positions; which node gets which of them
// depends on insertion order, so the API returning the same members in a
// different order would still reshuffle the graph. Sorting by accession (and
// links by their endpoints) removes that source of variation.
const sortNodes = (nodes: Array<ClanNetworkNode>): Array<ClanNetworkNode> =>
  [...nodes].sort((a, b) => a.accession.localeCompare(b.accession));

const sortLinks = (links: Array<ClanNetworkLink>): Array<ClanNetworkLink> =>
  [...links].sort(
    (a, b) =>
      a.source.localeCompare(b.source) ||
      a.target.localeCompare(b.target) ||
      (a.method || '').localeCompare(b.method || ''),
  );

// The whole viewer (controls included) goes full screen, not just the canvas,
// so the legend and the size slider stay reachable. FullScreenButton resolves
// this by id after mount, which is more reliable than passing a ref whose
// `.current` is still null on the first render.
const FULL_SCREEN_ID = 'clanNetworkViewerFullScreen';

type Props = {
  data: {
    metadata: SetMetadata;
  };
  db?: string | null;
  goToCustomLocation: typeof goToCustomLocation;
  loading: boolean;
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
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesDataSetRef = useRef<DataSet<ClanVisNode> | null>(null);

  const metadata = loading || !data.metadata ? null : data.metadata;
  const relationships = metadata?.relationships;
  const nodeCount = relationships?.nodes.length || 0;

  const [forceShow, setForceShow] = useState(false);
  const [sizeScale, setSizeScale] = useState(1);

  const showNetwork = forceShow || nodeCount <= MAX_NUMBER_OF_NODES;

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

  // Build (or rebuild) the network whenever the clan being viewed changes.
  useEffect(() => {
    if (!containerRef.current || !relationships || !showNetwork) {
      return undefined;
    }

    const sortedNodes = sortNodes(relationships.nodes);
    const sortedLinks = sortLinks(relationships.links);

    const isolated = getIsolatedAccessions(sortedNodes, sortedLinks);
    const positions = placeIsolatedNodes(isolated);
    const nodes = buildNodes(sortedNodes, metadata?.accession || '', positions);
    const edges = buildEdges(sortedLinks, sortedNodes);

    const nodesDataSet = new DataSet<ClanVisNode>(nodes);
    const edgesDataSet = new DataSet(edges);
    nodesDataSetRef.current = nodesDataSet;

    // TEMP DEBUG -- remove once the node-count discrepancy is understood.
    const w = window as unknown as { __clanNetLog?: Array<unknown> };
    w.__clanNetLog = w.__clanNetLog || [];
    w.__clanNetLog.push({
      t: Math.round(performance.now()),
      kind: 'render',
      accession: metadata?.accession,
      propsNodes: relationships.nodes.length,
      propsLinks: relationships.links.length,
      builtNodes: nodes.length,
      inDataSet: nodesDataSet.length,
      firstFew: relationships.nodes.slice(0, 5).map((n) => n.short_name),
    });

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
          // Nodes are always draggable; navigation is on ctrl/cmd-click, so
          // repositioning and opening an entry can't be confused for each
          // other and no mode switch is needed.
          dragNodes: true,
          hover: true,
          navigationButtons: true,
          keyboard: true,
          tooltipDelay: 100,
        },
        layout: {
          improvedLayout: true,
          randomSeed: LAYOUT_RANDOM_SEED,
        },
      },
    );
    networkRef.current = network;

    network.once('stabilizationIterationsDone', () => {
      network.setOptions({ physics: false });
      network.fit();
    });

    // Ctrl/cmd-click, rather than a plain click, so that dragging a node
    // around never risks navigating away from the network by accident.
    network.on('click', (params: ClickParams) => {
      const accession = params.nodes?.[0];
      if (!accession) return;
      const nativeEvent = params.event?.srcEvent;
      if (!nativeEvent?.metaKey && !nativeEvent?.ctrlKey) return;
      window.open(`/interpro/entry/${db}/${accession}`, '_blank')?.focus();
    });

    return () => {
      network.destroy();
      networkRef.current = null;
      nodesDataSetRef.current = null;
    };
    // Rebuilding on every db change would wipe layout & physics state.
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
            <SizeSlider value={sizeScale} onChange={setSizeScale} />
            <span className={css('clan-network-hint')}>
              Drag a node to reposition it, ctrl/⌘-click it to open its entry.
            </span>
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
          <Legend
            nodes={relationships.nodes}
            links={relationships.links}
            currentClanAccession={metadata.accession}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.description.set.db,
  (db) => ({ db }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  ClanNetworkViewer,
);
