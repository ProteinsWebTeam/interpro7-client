import { IdType, Network } from 'vis-network';

// vis-network paints in fixed layers -- every edge, then every node -- so a
// selected node's edges run underneath unrelated nodes and underneath any edge
// drawn after them, which makes it hard to see what the selection is actually
// connected to. There is no option to change that order, so the selection is
// painted a second time, on top, from the `afterDrawing` hook: its edges, then
// its shapes, then its labels -- above every other node, edge and label,
// neighbours included. The edges therefore run into the neighbours they reach
// rather than stopping at their outlines: redrawing the neighbours on top to
// hide that would put their shapes and labels back over the selection.
//
// This reaches into vis-network's internal `body` -- the same Node and Edge
// objects its own renderer draws -- as the public API has no per-item draw.

type DrawableNode = {
  draw: (ctx: CanvasRenderingContext2D) => { drawExternalLabel?: () => void };
};

type DrawableEdge = {
  draw: (ctx: CanvasRenderingContext2D) => void;
};

type NetworkBody = {
  nodes: Record<string, DrawableNode>;
  edges: Record<string, DrawableEdge>;
  // Exactly what is on the canvas: vis-network leaves hidden nodes out, and
  // hidden edges along with any edge ending at a hidden node.
  nodeIndices: Array<IdType>;
  edgeIndices: Array<IdType>;
};

export const drawSelectionOnTop = (
  network: Network,
  ctx: CanvasRenderingContext2D,
) => {
  const selectedNodes = network.getSelectedNodes();
  const selectedEdges = network.getSelectedEdges();
  if (!selectedNodes.length && !selectedEdges.length) return;

  const { body } = network as unknown as { body: NetworkBody };
  const visibleNodes = new Set(body.nodeIndices);
  const visibleEdges = new Set(body.edgeIndices);

  // With vis-network's default `selectConnectedEdges`, selecting a node
  // selects its edges too, so these are the selected node's edges.
  selectedEdges
    .filter((id) => visibleEdges.has(id))
    .forEach((id) => body.edges[id].draw(ctx));

  // Labels after every shape, as vis-network does, so one selected node
  // never covers another's label.
  selectedNodes
    .filter((id) => visibleNodes.has(id))
    .map((id) => body.nodes[id])
    .map((node) => node.draw(ctx).drawExternalLabel)
    .forEach((drawLabel) => drawLabel?.());
};
