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

import {
  buildNodes,
  ClanVisNode,
  labelFont,
  nodeFilterKeys,
} from './buildNodes';
import { ClanVisEdge, EDGE_HIGHLIGHT_COLOR } from './buildEdges';
import { createEllipseRenderer } from './ellipseNode';
import { FilterKey, isFilteredOut, toggleKeys } from './filterKeys';
import { buildEdges } from './buildEdges';
import {
  getIsolatedAccessions,
  gridCentreBeside,
  placeIsolatedNodes,
} from './isolatedNodesGrid';
import {
  getFocusAccessions,
  getHiddenAccessions,
  getUnconnectedAccessions,
  getVisibleFilterKeys,
} from './nodeVisibility';
import { dropWeakMatches } from './weakMatches';
import { drawSelectionOnTop } from './selectionLayer';
import { ClanNetworkLink, ClanNetworkNode } from './types';
import EdgePopover from './EdgePopover';
import Legend from './Legend';
import NodePopover from './NodePopover';
import NodeSearch from './NodeSearch';
import SizeControls from './SizeControls';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import summary from 'styles/summary.css';
import ipro from 'styles/interpro-vf.css';
import style from './style.css';

const css = cssBinder(summary, ipro, fonts, style);

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
  // The selection as last committed, for the click handler: that was built once
  // on mount and so cannot read the state itself. vis reports `select` before
  // `click`, and React has not applied that update by the time the click
  // arrives, so this still holds whatever was selected before the click landed.
  const selectedAccessionRef = useRef<string | null>(null);
  useEffect(() => {
    selectedAccessionRef.current = selectedAccession;
  }, [selectedAccession]);
  // The focus, for the same click handler: a click on a neighbour moves the
  // focus on to it.
  const focusAccessionRef = useRef<string | null>(null);
  useEffect(() => {
    focusAccessionRef.current = focusAccession;
  }, [focusAccession]);
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
  // What the pointer is over, if anything: one slot, so a node's details and an
  // edge's can never both be in the corner at once. Only which item -- the
  // popover always appears in the same place, so there is no position to follow
  // around.
  const [hovered, setHovered] = useState<{
    kind: 'node' | 'edge';
    id: string;
  } | null>(null);

  // Where the stabilised layout put each node. A node the filters strand can
  // then be sent to the unconnected grid and, once it is connected again, put
  // back where it belongs -- and the reset button can undo the lot.
  const layoutPositionsRef = useRef<Record<
    string,
    { x: number; y: number }
  > | null>(null);
  // What is in that grid now, so a node *leaving* it can be told from one that
  // was never in it: only the two are ever moved, and whatever the user dragged
  // elsewhere is left where they put it.
  const griddedRef = useRef<Set<string>>(new Set());
  // The layout whose grid has already been framed, so that happens once per
  // layout and not on every later filter change (see the grid effect).
  const fittedLayoutRef = useRef(0);
  // Full screen as the ResizeObserver further down sees it. That observer is
  // built once and so cannot read the state itself, and what it needs to know
  // is whether the resize it is handling came from entering or leaving full
  // screen -- the only kind worth re-framing the network for.
  const isFullScreenRef = useRef(false);
  const fittedFullScreenRef = useRef(false);
  // Bumped once the layout has settled and its positions have been recorded --
  // until then there is nowhere to put a node back to.
  const [layoutVersion, setLayoutVersion] = useState(0);
  // Bumped by the reset button, to frame the view once everything it changed
  // has actually been applied to the canvas (see the effect at the end).
  const [resetCount, setResetCount] = useState(0);

  // The browser can leave full screen without going through our button (Escape,
  // the platform's own control), so the flag follows the document, not clicks.
  useEffect(() => {
    const onChange = () => setIsFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    isFullScreenRef.current = isFullScreen;
  }, [isFullScreen]);

  const toggleFullScreen = () => {
    const element = document.getElementById(FULL_SCREEN_ID);
    if (isFullScreen) exitFullScreen();
    else if (element) requestFullScreen(element);
  };

  const showNetwork = forceShow || nodeCount <= MAX_NUMBER_OF_NODES;

  // A new tab, so the network keeps whatever the user had arranged on it.
  const openEntry = (accession: string) => {
    if (!db) return;
    window.open(`/interpro/entry/${db}/${accession}`, '_blank')?.focus();
  };

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
    // A clan the API gave no links at all is nothing but its grid, so that grid
    // is the whole picture and belongs in the middle of it.
    const positions = placeIsolatedNodes(
      isolated,
      // Nothing is on screen yet, so there is no view to read -- but the origin
      // does just as well here, since the whole network is this grid and the
      // framing done once the layout settles takes it in wherever it sits.
      isolated.length === sortedNodes.length ? { x: 0, y: 0 } : null,
    );
    // A network built from scratch: no layout recorded yet, and the grid holds
    // exactly the nodes the API never linked to anything.
    layoutPositionsRef.current = null;
    griddedRef.current = new Set(isolated);
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
          // No on-canvas navigation buttons: the wheel zooms the network while
          // the pointer is over it, dragging the background pans, and the reset
          // button re-frames the graph.
          navigationButtons: false,
          // Keyboard navigation, but only once the network itself has been
          // clicked into. vis-network binds these keys to the *window* by
          // default, and its `=` and `-` bindings then swallow the browser's
          // own zoom shortcuts for the whole page -- the network behaving as
          // though it were permanently focused, wherever the pointer is.
          keyboard: {
            enabled: true,
            bindToWindow: false,
            autoFocus: false,
          },
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
      layoutPositionsRef.current = network.getPositions();
      setLayoutVersion((current) => current + 1);
    });

    // Lifts whatever is selected above everything else (see selectionLayer.ts).
    network.on('afterDrawing', (ctx: CanvasRenderingContext2D) =>
      drawSelectionOnTop(network, ctx),
    );

    // Ctrl/cmd-click, rather than a plain click, so that dragging a node around
    // never risks navigating away from the network by accident. It is what the
    // popover tells the user to do.
    network.on('click', (params: ClickParams) => {
      const accession = params.nodes?.[0];
      if (!accession) return;
      const nativeEvent = params.event?.srcEvent;
      if (!nativeEvent?.metaKey && !nativeEvent?.ctrlKey) {
        // Already focused, clicking one of the neighbours moves the focus
        // straight on to it: while exploring a clan one entry at a time,
        // following a connection is the whole point. Only on a full click --
        // vis sends no `click` for a drag -- so grabbing a neighbour to move
        // it doesn't pull the view out from under the pointer.
        const focus = focusAccessionRef.current;
        if (focus && accession !== focus) {
          // The filters were set for the old neighbourhood (see resetting
          // them in toggleFocus).
          setFocusAccession(accession);
          setDisabledFilters(new Set());
        }
        return;
      }
      openEntry(accession);
      // vis selects whatever was clicked before it ever tells us about the
      // click, but a ctrl/cmd-click is only meant to open the entry. Putting
      // the previous selection back, rather than clearing it, leaves a
      // ctrl/cmd-click on the selected entry still selected -- and one on any
      // other entry doesn't disturb it either.
      const previous = selectedAccessionRef.current;
      if (previous && nodesDataSetRef.current?.get(previous)) {
        // Programmatic, so vis sends no `select` event of its own.
        network.selectNodes([previous]);
        setSelectedAccession(previous);
      } else {
        network.unselectAll();
        setSelectedAccession(null);
      }
    });

    // Hovering shows the details and hovering off puts them away again. The
    // blur handlers check *what* they are clearing: moving straight from one
    // item to another can deliver the blur after the new hover, which would
    // otherwise wipe the details that had just replaced it.
    network.on('hoverNode', (params: { node: string }) =>
      setHovered({ kind: 'node', id: params.node }),
    );
    network.on('blurNode', (params: { node: string }) =>
      setHovered((current) =>
        current?.kind === 'node' && current.id === params.node ? null : current,
      ),
    );
    network.on('hoverEdge', (params: { edge: string }) =>
      setHovered({ kind: 'edge', id: params.edge }),
    );
    network.on('blurEdge', (params: { edge: string }) =>
      setHovered((current) =>
        current?.kind === 'edge' && current.id === params.edge ? null : current,
      ),
    );

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

  // Everything with nothing left to connect it: never linked at all, or left
  // edgeless by the filters (see nodeVisibility.ts).
  const unconnectedAccessions = useMemo(
    () =>
      getUnconnectedAccessions(
        networkNodes,
        links,
        hiddenAccessions,
        disabledFilters,
      ),
    [networkNodes, links, hiddenAccessions, disabledFilters],
  );

  // What goes in the grid. Nothing while focused: a neighbourhood is small
  // enough that an unconnected node is best left where the layout put it, next
  // to the rest, rather than sent off to a grid on its own. Leaving focus fills
  // the grid again.
  const isFocused = focusAccession !== null;
  const gridAccessions = useMemo(
    () => (isFocused ? [] : unconnectedAccessions),
    [isFocused, unconnectedAccessions],
  );

  // Which sends them to the grid the originally-unconnected entries already sit
  // in, just outside the network, and brings back any the filters have just
  // reconnected. Straight there, with no animation: the point is that they are
  // out of the way of the graph, not how they travelled. Nodes neither entering
  // nor leaving the grid are not touched, so a node dragged somewhere
  // deliberately stays where it was put.
  useEffect(() => {
    const nodesDataSet = nodesDataSetRef.current;
    const network = networkRef.current;
    const home = layoutPositionsRef.current;
    if (!nodesDataSet || !network || !home) return;

    // What the grid has to keep clear of: everything still on the canvas that
    // the grid itself does not hold. Where those nodes have actually ended up,
    // not where they were expected to, so the grid lands the same short
    // distance away whether the clan settled tight or sprawled.
    const gridded = new Set(gridAccessions);
    const connected = networkNodes
      .map((node) => node.accession)
      .filter(
        (accession) =>
          !gridded.has(accession) && !hiddenAccessions.has(accession),
      );

    // With nothing connected left there is no network to sit beside, so the
    // block takes the middle of the view instead.
    let centre = network.getViewPosition();
    if (connected.length) {
      const points = network.getPositions(connected);
      // Where each of them will be once this effect has finished, rather than
      // where it happens to be this instant. A node the filters have just
      // reconnected is still sitting in a grid slot -- it is put back a few
      // lines below -- and measuring the network's edge from there would push
      // the grid a further gap out, and again on every filter change after
      // that, walking it off into the distance.
      const settledAt = (accession: string) =>
        griddedRef.current.has(accession)
          ? home[accession] || points[accession]
          : points[accession];
      const xs = connected.map((accession) => settledAt(accession).x);
      const ys = connected.map((accession) => settledAt(accession).y);
      centre = gridCentreBeside(
        gridAccessions.length,
        Math.min(...xs),
        (Math.min(...ys) + Math.max(...ys)) / 2,
      );
    }

    const positions = placeIsolatedNodes(gridAccessions, centre);
    const updates = gridAccessions.map((accession) => ({
      id: accession,
      ...positions[accession],
    }));
    griddedRef.current.forEach((accession) => {
      if (positions[accession] || !home[accession]) return;
      updates.push({ id: accession, ...home[accession] });
    });
    griddedRef.current = new Set(gridAccessions);
    if (updates.length) nodesDataSet.update(updates);

    // The framing done when the layout settled took in the grid at its staging
    // position, far off to the left; now that the grid has been moved in beside
    // the network, the view is framed again around what is really there. Once
    // per layout, so that filtering later never reframes the canvas underfoot.
    if (fittedLayoutRef.current !== layoutVersion) {
      fittedLayoutRef.current = layoutVersion;
      network.fit();
    }
  }, [gridAccessions, networkNodes, hiddenAccessions, layoutVersion]);

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

  // Which of the legend's entries anything left on the canvas still answers to,
  // so that it can leave the rest out (see nodeVisibility.ts). While focused,
  // that is the focused node's neighbourhood, not the whole network.
  const visibleFilterKeys = useMemo(
    () =>
      getVisibleFilterKeys(
        networkNodes,
        links,
        metadata?.accession || '',
        offCanvasAccessions,
        disabledFilters,
        focusAccession,
      ),
    [
      networkNodes,
      links,
      metadata?.accession,
      offCanvasAccessions,
      disabledFilters,
      focusAccession,
    ],
  );

  // The legend entries that can be clicked. Outside focus: whatever is on the
  // canvas, plus whatever the user has switched off -- clicking it is the only
  // way of switching it back on. While focused, a switched-off entry only stays
  // live if it applies to the focused node's neighbourhood as it would be with
  // no filters at all, so the legend describes that neighbourhood and not the
  // whole network, and still lets anything it took away be brought back.
  const availableFilterKeys = useMemo(() => {
    const disabled = Array.from(disabledFilters);
    if (!focusAccession) {
      return new Set([...Array.from(visibleFilterKeys), ...disabled]);
    }
    const clanAccession = metadata?.accession || '';
    const neighbourhood = getFocusAccessions(
      focusAccession,
      networkNodes,
      links,
      clanAccession,
      new Set(),
      new Set(),
    );
    const outside = new Set(
      networkNodes
        .map((node) => node.accession)
        .filter((accession) => !neighbourhood.has(accession)),
    );
    const neighbourhoodKeys = getVisibleFilterKeys(
      networkNodes,
      links,
      clanAccession,
      outside,
      new Set(),
      focusAccession,
    );
    return new Set([
      ...Array.from(visibleFilterKeys),
      ...disabled.filter((key) => neighbourhoodKeys.has(key)),
    ]);
  }, [
    visibleFilterKeys,
    disabledFilters,
    focusAccession,
    networkNodes,
    links,
    metadata?.accession,
  ]);

  // While focused, the focused node's own membership and type cannot be
  // filtered out: hiding it would end the focus rather than filter within it.
  const lockedFilterKeys = useMemo(() => {
    const focusNode = focusAccession
      ? networkNodes.find((node) => node.accession === focusAccession)
      : undefined;
    return new Set<FilterKey>(
      focusNode ? nodeFilterKeys(focusNode, metadata?.accession || '') : [],
    );
  }, [focusAccession, networkNodes, metadata?.accession]);

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

  // Nothing here ends the focus when the filters would hide the focused node:
  // its own membership and type are locked in the legend while focused, and
  // the edge filters stranding it (see getHiddenAccessions) just leave it on
  // its own -- getFocusAccessions always keeps it -- so the user stays where
  // they were and can bring its connections back from the legend.

  // A filter or the focus can take the hovered node off the canvas before the
  // pointer ever leaves it, which would leave its details up with nothing
  // behind them.
  useEffect(() => {
    if (hovered?.kind === 'node' && offCanvasAccessions.has(hovered.id)) {
      setHovered(null);
    }
  }, [hovered, offCanvasAccessions]);

  // The same for the selected entry, now that its details are what the corner
  // falls back to: a filter can take it off the canvas while it is still
  // selected, and its details would sit there describing something that is no
  // longer on screen.
  useEffect(() => {
    if (selectedAccession && offCanvasAccessions.has(selectedAccession)) {
      networkRef.current?.unselectAll();
      setSelectedAccession(null);
    }
  }, [selectedAccession, offCanvasAccessions]);

  // A filter set, a selection or a focus built for one clan means nothing in
  // the next one.
  useEffect(() => {
    setDisabledFilters(new Set());
    setSelectedAccession(null);
    setFocusAccession(null);
    setHovered(null);
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
      // Framing the network again is only right when the canvas has changed
      // shape because the viewer went in or out of full screen. Doing it on
      // every resize meant filtering did it too: in full screen the legend sits
      // under the canvas, so an entry leaving the legend makes the canvas
      // taller, and the user's zoom and pan were thrown away -- the network
      // flickering back to its original framing -- every time one did.
      if (fittedFullScreenRef.current === isFullScreenRef.current) return;
      fittedFullScreenRef.current = isFullScreenRef.current;
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

  // Frames the reset view. Declared last on purpose: effects run in the order
  // they are declared, so by the time this one does, the same render's effects
  // have un-hidden the filtered nodes, put the unconnected ones back in their
  // grid and restored the node sizes -- and there is a finished network to fit.
  // `resetCount` starts at 0 so this does nothing on the first render, where
  // the network is still settling and does its own fit.
  useEffect(() => {
    if (!resetCount) return;
    networkRef.current?.fit();
  }, [resetCount]);

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
  // Moving the focus on, or leaving it, starts again with no filters: they were
  // chosen for the neighbourhood being left, and carried over they would hide
  // things in the next one -- or in the whole network -- for no visible reason.
  // Entering focus keeps them, as they were chosen for what is being narrowed.
  const toggleFocus = () => {
    if (focusAccession) setDisabledFilters(new Set());
    setFocusAccession(isFocusActive ? null : selectedAccession);
  };

  const focusOnNode = (accession: string) => {
    const network = networkRef.current;
    if (!network) return;
    network.selectNodes([accession]);
    // selectNodes() is programmatic, so vis-network sends no `select` event.
    setSelectedAccession(accession);
    // Picking a result while focused moves the focus on, as clicking it would.
    if (focusAccession && accession !== focusAccession) {
      setFocusAccession(accession);
      setDisabledFilters(new Set());
    }
    network.focus(accession, {
      scale: Math.max(network.getScale(), SEARCH_FOCUS_SCALE),
      animation: { duration: 600, easingFunction: 'easeInOutQuad' },
    });
  };

  // Everything the user can change about the view, back to how the viewer
  // opened: the filters, the focus, the selection, the sizes, the popover and
  // wherever anything has been dragged to. The grid effect above re-runs on the
  // cleared filters and puts the unconnected entries back in their grid.
  const resetView = () => {
    setDisabledFilters(new Set());
    setFocusAccession(null);
    setSelectedAccession(null);
    setNodeScale(1);
    setFontScale(1);
    setHovered(null);

    const network = networkRef.current;
    const nodesDataSet = nodesDataSetRef.current;
    const home = layoutPositionsRef.current;
    if (!network) return;
    network.unselectAll();
    if (nodesDataSet && home) {
      nodesDataSet.update(
        nodesDataSet
          .get()
          .filter((node) => home[node.id])
          .map((node) => ({ id: node.id, ...home[node.id] })),
      );
    }
    // Not `network.fit()` here: clearing the filters only un-hides nodes, and
    // only moves the unconnected ones back into their grid, once React has
    // re-rendered and the effects above have run. Fitting now would frame the
    // network as it still is at this instant -- which is what made one click
    // look like it had half worked, and a second one finish the job.
    setResetCount((current) => current + 1);
  };

  if (!metadata || !relationships) return null;

  const legend = (
    <Legend
      nodes={networkNodes}
      links={links}
      disabled={disabledFilters}
      available={availableFilterKeys}
      locked={lockedFilterKeys}
      onToggle={(keys) =>
        setDisabledFilters((current) => toggleKeys(current, keys))
      }
      currentClanAccession={metadata.accession}
    />
  );

  // A hovered edge takes the corner for itself. Read straight off the DataSet,
  // which is where its details were left when the edge was built.
  const hoveredEdge =
    hovered?.kind === 'edge'
      ? edgesDataSetRef.current?.get(hovered.id) || undefined
      : undefined;

  // Otherwise the corner shows whatever entry the pointer is over, and -- with
  // the pointer over nothing at all -- falls back to the selected one, whose
  // details stay up as a reference while the network around it is explored.
  let popoverAccession: string | null = selectedAccession;
  if (hovered) popoverAccession = hovered.kind === 'node' ? hovered.id : null;
  const popoverNode = popoverAccession
    ? networkNodes.find((node) => node.accession === popoverAccession)
    : undefined;

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
            {/* All of these read the same way: `hollow` has a transparent
                border, so the boxed ones are secondary (outlined) when the
                thing they control is off, primary (filled) when it is on. */}
            <div className={css('clan-network-controls-right')}>
              {/* In full screen the legend is always shown, under the canvas. */}
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
            {/* The view's own controls, in the corner the graph and
                vis-network's pan/zoom buttons both leave free. Focus comes
                first so that the reset button keeps the corner and nothing
                shifts under the pointer when focus appears and disappears. */}
            <div className={css('clan-network-canvas-tools')}>
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
              <button
                type="button"
                className={css('clan-network-reset-button')}
                onClick={resetView}
                aria-label="Reset the view and the filters"
                title="Reset the view and the filters"
              >
                <span
                  className={css('icon', 'icon-common', 'icon-sync')}
                  aria-hidden="true"
                />
              </button>
            </div>
            {popoverNode && (
              <NodePopover
                node={popoverNode}
                currentClanAccession={metadata.accession}
              />
            )}
            {hoveredEdge && <EdgePopover edge={hoveredEdge} />}
            {!isFullScreen && showLegend && (
              <div
                id="clanNetworkLegend"
                className={css('clan-network-legend-floating')}
              >
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
