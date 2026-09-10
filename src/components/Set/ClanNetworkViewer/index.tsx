import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import 'vis-network/styles/vis-network.css';

import { goToCustomLocation } from 'actions/creators';

import Card from 'components/SimpleCommonComponents/Card';
import Button from 'components/SimpleCommonComponents/Button';
import { requestFullScreen, exitFullScreen } from 'utils/fullscreen';

import { buildNodes, ClanVisNode, labelFont } from './buildNodes';
import { ClanVisEdge, EDGE_HIGHLIGHT_COLOR } from './buildEdges';
import { createEllipseRenderer } from './ellipseNode';
import { FilterKey, isFilteredOut, toggleKeys } from './filterKeys';
import { buildEdges } from './buildEdges';
import { getIsolatedAccessions, placeIsolatedNodes } from './isolatedNodesGrid';
import { getFocusAccessions, getHiddenAccessions } from './nodeVisibility';
import { dropWeakMatches } from './weakMatches';
import { drawSelectionOnTop } from './selectionLayer';
import { ClanNetworkLink, ClanNetworkNode } from './types';
import HintPopover from './HintPopover';
import Legend from './Legend';
import NodeSearch from './NodeSearch';
import SizeControls from './SizeControls';

import cssBinder from 'styles/cssBinder';
import summary from 'styles/summary.css';
import ipro from 'styles/interpro-vf.css';
import style from './style.css';

const css = cssBinder(summary, ipro, style);

const MAX_NUMBER_OF_NODES = 100;

// Picking a search result zooms in on that node. Held to a modest scale (and
// never zooming *out* of a closer view) so selecting an entry reads as "take me
// there" rather than resetting how far in the user already was.
const SEARCH_FOCUS_SCALE = 1.2;

// Entering or leaving focus on a node reframes the view; animated so the user
// can follow where the rest of the network went.
const FOCUS_ANIMATION = {
  duration: 600,
  easingFunction: 'easeInOutQuad' as const,
};

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
  const edgesDataSetRef = useRef<DataSet<ClanVisEdge> | null>(null);

  const metadata = loading || !data.metadata ? null : data.metadata;
  const relationships = metadata?.relationships;

  // Weak matches, and the nodes that had nothing else, are dropped before
  // anything is built: from here on the graph, the legend, the search box and
  // the node count all describe the same, trustworthy set.
  const { nodes: networkNodes, links } = useMemo(
    () =>
      dropWeakMatches(
        relationships?.nodes || [],
        relationships?.links || [],
        metadata?.accession || '',
      ),
    [relationships?.nodes, relationships?.links, metadata?.accession],
  );
  const nodeCount = networkNodes.length;

  const [forceShow, setForceShow] = useState(false);
  const [nodeScale, setNodeScale] = useState(1);
  const [fontScale, setFontScale] = useState(1);
  // The custom ellipse shape draws its own label, so it needs the current font
  // size at draw time -- a ref, because vis-network holds on to the renderer it
  // was given when the node was created.
  const fontSizeRef = useRef(0);
  // The node selected on the canvas, and the node the view is focused on (only
  // it and its direct connections shown). Kept apart so that, while focused,
  // the user can select one of the neighbours and move the focus on to it.
  const [selectedAccession, setSelectedAccession] = useState<string | null>(
    null,
  );
  const [focusAccession, setFocusAccession] = useState<string | null>(null);
  // Legend entries the user has switched off. Nodes and edges carrying a
  // disabled key are hidden rather than removed, so the layout the network
  // stabilised into survives filtering and un-filtering.
  const [disabledFilters, setDisabledFilters] = useState<Set<FilterKey>>(
    () => new Set(),
  );
  // Outside full screen the legend is a panel opened from the toolbar; in full
  // screen there is no room beside the viewer, so it goes back to being laid
  // out under the canvas and the toolbar button disappears with it.
  const [showLegend, setShowLegend] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // The browser can leave full screen without going through our button (Escape,
  // the platform's own control), so the flag follows the document, not clicks.
  useEffect(() => {
    const onChange = () => setIsFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullScreen = () => {
    const element = document.getElementById(FULL_SCREEN_ID);
    if (isFullScreen) exitFullScreen();
    else if (element) requestFullScreen(element);
  };

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

    const sortedNodes = sortNodes(networkNodes);
    const sortedLinks = sortLinks(links);

    const isolated = getIsolatedAccessions(sortedNodes, sortedLinks);
    const positions = placeIsolatedNodes(isolated);
    const nodes = buildNodes(
      sortedNodes,
      metadata?.accession || '',
      positions,
      createEllipseRenderer(() => fontSizeRef.current),
    );
    fontSizeRef.current = nodes[0]?.baseFontSize || 0;
    const edges = buildEdges(sortedLinks, sortedNodes);

    const nodesDataSet = new DataSet<ClanVisNode>(nodes);
    const edgesDataSet = new DataSet<ClanVisEdge>(edges);
    nodesDataSetRef.current = nodesDataSet;
    edgesDataSetRef.current = edgesDataSet;

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

      isolated.forEach((nodeId) => {
        nodesDataSet.update({
          id: nodeId,
          fixed: false,
        });
      });
      network.fit();
    });

    // Lifts whatever is selected above everything else (see selectionLayer.ts).
    network.on('afterDrawing', (ctx: CanvasRenderingContext2D) =>
      drawSelectionOnTop(network, ctx),
    );

    // Ctrl/cmd-click, rather than a plain click, so that dragging a node
    // around never risks navigating away from the network by accident.
    network.on('click', (params: ClickParams) => {
      const accession = params.nodes?.[0];
      if (!accession) return;
      const nativeEvent = params.event?.srcEvent;
      if (!nativeEvent?.metaKey && !nativeEvent?.ctrlKey) return;
      window.open(`/interpro/entry/${db}/${accession}`, '_blank')?.focus();
    });

    // Follows the selection for the focus button. Dragging an unselected node
    // selects it through `dragStart` rather than `select`, so that is
    // followed too.
    network.on('select', (params: { nodes: Array<string> }) =>
      setSelectedAccession(params.nodes[0] || null),
    );
    network.on('dragStart', (params: { nodes: Array<string> }) => {
      if (params.nodes.length) setSelectedAccession(params.nodes[0]);
    });

    return () => {
      network.destroy();
      networkRef.current = null;
      nodesDataSetRef.current = null;
      edgesDataSetRef.current = null;
    };
    // Rebuilding on every db change would wipe layout & physics state.
  }, [metadata?.accession, showNetwork]);

  // Which nodes the current filters take off the canvas -- their own keys, or,
  // outside this clan, being stranded with no edges left (see
  // nodeVisibility.ts). Computed from the API's own nodes/links rather than
  // from the DataSets so the search box below can share the answer.
  const hiddenAccessions = useMemo(
    () =>
      getHiddenAccessions(
        networkNodes,
        links,
        metadata?.accession || '',
        disabledFilters,
      ),
    [networkNodes, links, metadata?.accession, disabledFilters],
  );

  // While focused on a node: that node and its neighbours, filtered (see
  // getFocusAccessions).
  const focusedAccessions = useMemo(
    () =>
      focusAccession
        ? getFocusAccessions(
            focusAccession,
            networkNodes,
            links,
            metadata?.accession || '',
            hiddenAccessions,
            disabledFilters,
          )
        : null,
    [
      focusAccession,
      networkNodes,
      links,
      metadata?.accession,
      hiddenAccessions,
      disabledFilters,
    ],
  );

  // Everything off the canvas: what the filters hide or, while focused on a
  // node, everything outside its (filtered) neighbourhood.
  const offCanvasAccessions = useMemo(
    () =>
      focusedAccessions
        ? new Set(
            networkNodes
              .map((node) => node.accession)
              .filter((accession) => !focusedAccessions.has(accession)),
          )
        : hiddenAccessions,
    [focusedAccessions, hiddenAccessions, networkNodes],
  );

  // Legend filters and focus: hide whatever carries a switched-off key, and
  // whatever focus leaves out -- for edges, any not touching the focused node,
  // which drops the ones running between two of its neighbours. vis-network
  // hides a hidden node's edges for us. While focused, the focused node stays
  // selected, so its edges would all turn the selection black: they keep their
  // own colour instead (see EDGE_HIGHLIGHT_COLOR).
  useEffect(() => {
    const nodesDataSet = nodesDataSetRef.current;
    const edgesDataSet = edgesDataSetRef.current;
    if (!nodesDataSet || !edgesDataSet) return;
    nodesDataSet.update(
      nodesDataSet.get().map((node) => ({
        id: node.id,
        hidden: offCanvasAccessions.has(node.id),
      })),
    );
    edgesDataSet.update(
      edgesDataSet.get().map((edge) => ({
        id: edge.id as string,
        hidden:
          isFilteredOut(edge.filterKeys, disabledFilters) ||
          (focusAccession !== null &&
            edge.from !== focusAccession &&
            edge.to !== focusAccession),
        color: {
          color: edge.baseColor,
          highlight: focusAccession ? edge.baseColor : EDGE_HIGHLIGHT_COLOR,
        },
      })),
    );
  }, [
    offCanvasAccessions,
    disabledFilters,
    focusAccession,
    showNetwork,
    metadata?.accession,
  ]);

  // Entering, moving or leaving focus frames what is now on the canvas.
  // Declared after the effect above so the nodes are already shown or hidden
  // by the time fit() measures them. Skips the first run, where the network is
  // still settling and does its own fit.
  const previousFocusRef = useRef<string | null>(null);
  useEffect(() => {
    if (previousFocusRef.current === focusAccession) return;
    previousFocusRef.current = focusAccession;
    // `nodes` is left out, not set to undefined, when leaving focus:
    // vis-network rejects the key unless it holds an array.
    networkRef.current?.fit(
      focusedAccessions
        ? { nodes: Array.from(focusedAccessions), animation: FOCUS_ANIMATION }
        : { animation: FOCUS_ANIMATION },
    );
  }, [focusAccession, focusedAccessions]);

  // A filter that hides the focused node itself ends the focus, rather than
  // leaving an empty canvas with nothing to explain it.
  useEffect(() => {
    if (focusAccession && hiddenAccessions.has(focusAccession)) {
      setFocusAccession(null);
    }
  }, [focusAccession, hiddenAccessions]);

  // A filter set, a selection or a focus built for one clan means nothing in
  // the next one.
  useEffect(() => {
    setDisabledFilters(new Set());
    setSelectedAccession(null);
    setFocusAccession(null);
  }, [metadata?.accession]);

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

  // Size sliders: rescale nodes/labels relative to their base size.
  useEffect(() => {
    const nodesDataSet = nodesDataSetRef.current;
    if (!nodesDataSet) return;
    nodesDataSet.update(
      nodesDataSet.get().map((node) => ({
        id: node.id,
        size: node.baseSize * nodeScale,
        // The whole font object, not just its size: replacing it with `{ size }`
        // alone would drop the white halo the labels are built with.
        font: labelFont(node.baseFontSize * fontScale),
      })),
    );
    fontSizeRef.current =
      (nodesDataSet.get()[0]?.baseFontSize || 0) * fontScale;
  }, [nodeScale, fontScale]);

  // Only what is actually on the canvas is findable: offering a hidden entry
  // would zoom to empty space.
  const searchableNodes = useMemo(
    () =>
      networkNodes.filter((node) => !offCanvasAccessions.has(node.accession)),
    [networkNodes, offCanvasAccessions],
  );

  // Focused, with the focused node still selected (or nothing selected), the
  // button leads back out to the whole network; with another node selected it
  // moves the focus on to that one.
  const isFocusActive =
    focusAccession !== null &&
    (selectedAccession === null || selectedAccession === focusAccession);
  const focusButtonLabel = isFocusActive
    ? 'Show the whole network'
    : 'Show only this entry and its connections';
  const toggleFocus = () =>
    setFocusAccession(isFocusActive ? null : selectedAccession);

  const focusOnNode = (accession: string) => {
    const network = networkRef.current;
    if (!network) return;
    network.selectNodes([accession]);
    // selectNodes() is programmatic, so vis-network sends no `select` event.
    setSelectedAccession(accession);
    network.focus(accession, {
      scale: Math.max(network.getScale(), SEARCH_FOCUS_SCALE),
      animation: { duration: 600, easingFunction: 'easeInOutQuad' },
    });
  };

  if (!metadata || !relationships) return null;

  const legend = (
    <Legend
      nodes={networkNodes}
      links={links}
      disabled={disabledFilters}
      onToggle={(keys) =>
        setDisabledFilters((current) => toggleKeys(current, keys))
      }
      onReset={() => setDisabledFilters(new Set())}
      currentClanAccession={metadata.accession}
    />
  );

  return (
    <div className={css('vf-stack', 'vf-stack--400', 'clan-network-viewer')}>
      {!showNetwork && nodeCount > MAX_NUMBER_OF_NODES && (
        <h4 className={css('clan-network-title')}>Clan Network Viewer</h4>
      )}
      {!showNetwork && nodeCount > MAX_NUMBER_OF_NODES && (
        <Card>
          <section>
            This network has {nodeCount} nodes. The clan network viewer will not
            be loaded automatically for performance reasons.
            <div>
              <Button onClick={() => setForceShow(true)}>
                Click to load the clan viewer
              </Button>
            </div>
          </section>
        </Card>
      )}
      {showNetwork && (
        <div id={FULL_SCREEN_ID} className={css('clan-network-full-screen')}>
          <div className={css('clan-network-controls')}>
            <h4 className={css('clan-network-title')}>Clan Network Viewer</h4>
            {/* All three read the same way: `hollow` has a transparent border,
                so the boxed pair is secondary (outlined) when the thing they
                control is off, primary (filled) when it is on. */}
            <div className={css('clan-network-controls-right')}>
              {!isFullScreen && (
                <Button
                  type={showLegend ? 'primary' : 'secondary'}
                  onClick={() => setShowLegend((current) => !current)}
                  aria-pressed={showLegend}
                  aria-controls="clanNetworkLegend"
                >
                  {showLegend
                    ? 'Hide Interactive Legend'
                    : 'Show Interactive Legend'}
                </Button>
              )}
              <SizeControls
                nodeScale={nodeScale}
                onNodeScaleChange={setNodeScale}
                fontScale={fontScale}
                onFontScaleChange={setFontScale}
              />
              <Button
                type={isFullScreen ? 'primary' : 'secondary'}
                onClick={toggleFullScreen}
                aria-pressed={isFullScreen}
                title="View the clan network in full screen mode"
              >
                {isFullScreen ? 'Exit full screen' : 'Full screen'}
              </Button>
            </div>
          </div>
          <div className={css('clan-network-container')}>
            <div
              ref={containerRef}
              className={css('clan-network-canvas')}
              id="clanNetworkViewerContainer"
            />
            <NodeSearch nodes={searchableNodes} onSelect={focusOnNode} />
            <HintPopover label="How to use this network">
              Drag a node to reposition it, ctrl/⌘-click it to open its entry.
            </HintPopover>
            {(selectedAccession || focusAccession) && (
              <button
                type="button"
                className={css('clan-network-focus-button', {
                  'clan-network-focus-button-active': isFocusActive,
                })}
                onClick={toggleFocus}
                aria-pressed={isFocusActive}
                aria-label={focusButtonLabel}
                title={focusButtonLabel}
              >
                {/* A hub and its spokes: one node and what it connects to. */}
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  aria-hidden="true"
                >
                  <g stroke="currentColor" strokeWidth="1.5">
                    <line x1="12" y1="12" x2="4.5" y2="4.5" />
                    <line x1="12" y1="12" x2="19.5" y2="4.5" />
                    <line x1="12" y1="12" x2="4.5" y2="19.5" />
                    <line x1="12" y1="12" x2="19.5" y2="19.5" />
                  </g>
                  <g fill="currentColor">
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="4" cy="4" r="2.5" />
                    <circle cx="20" cy="4" r="2.5" />
                    <circle cx="4" cy="20" r="2.5" />
                    <circle cx="20" cy="20" r="2.5" />
                  </g>
                </svg>
              </button>
            )}
            {!isFullScreen && showLegend && (
              <div
                id="clanNetworkLegend"
                className={css('clan-network-legend-floating')}
              >
                <button
                  type="button"
                  className={css('clan-network-legend-close')}
                  onClick={() => setShowLegend(false)}
                  aria-label="Close the legend"
                  title="Close the legend"
                >
                  ×
                </button>
                {legend}
              </div>
            )}
          </div>
          {isFullScreen && legend}
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
