// vis-network's built-in `ellipse` cannot be driven by `size`: it fits itself
// around its label, and `heightConstraint` only accepts a `minimum` (there is
// no `maximum`), so the label's own height sets the floor. Every coiled-coil
// node would come out the same height, ignoring its score, and would grow with
// the font slider while the other shapes stayed put.
//
// A `custom` shape goes through the same ShapeBase as dot/square/hexagon, which
// sizes from `2 * size` and hangs the label underneath, so drawing the ellipse
// ourselves is what actually keeps coiled-coils consistent with every other
// node -- and lets the drawn ellipse match the legend swatch exactly.

// Width : height of the drawn ellipse. Must stay in step with the `ellipse`
// swatch in Legend/index.tsx (rx 7.5 / ry 5).
export const ELLIPSE_ASPECT_RATIO = 1.5;

// vis-network's defaults for node labels, which every other node here inherits.
const LABEL_COLOR = '#343434';
const LABEL_FACE = 'arial';
const LABEL_GAP = 2;

type RendererArgs = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  style: {
    color: string;
    borderColor: string;
    borderWidth: number;
    size: number;
  };
  label: string;
};

type RendererResult = {
  drawNode: () => void;
  nodeDimensions: { width: number; height: number };
  drawExternalLabel: () => void;
};

export type EllipseRenderer = (args: RendererArgs) => RendererResult;

// vis keeps borders and label strokes a constant width on screen by dividing by
// the view scale. ctxRenderer isn't handed that scale, but the context is
// already transformed by it (times the device pixel ratio), so recover it here
// rather than letting coiled-coil borders thicken as you zoom in.
const getViewScale = (ctx: CanvasRenderingContext2D): number => {
  if (typeof ctx.getTransform !== 'function') return 1;
  const scale = ctx.getTransform().a / (window.devicePixelRatio || 1);
  return scale > 0.01 ? scale : 1;
};

// `getFontSize` is read at draw time rather than captured: vis-network only
// rebuilds a CustomShape when the shape *name* changes, so a renderer handed a
// new font size on a later update would simply be ignored.
export const createEllipseRenderer =
  (getFontSize: () => number): EllipseRenderer =>
  ({ ctx, x, y, style, label }) => {
    // Height matches a `dot` of the same size (both are 2 * size across), so
    // the score scale reads the same whatever shape a node happens to be.
    const height = 2 * style.size;
    const width = height * ELLIPSE_ASPECT_RATIO;
    const scale = getViewScale(ctx);

    return {
      nodeDimensions: { width, height },
      drawNode: () => {
        ctx.beginPath();
        ctx.ellipse(x, y, width / 2, height / 2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = style.color;
        ctx.fill();
        ctx.lineWidth = style.borderWidth / scale;
        ctx.strokeStyle = style.borderColor;
        ctx.stroke();
      },
      drawExternalLabel: () => {
        if (!label) return;
        const fontSize = getFontSize();
        const baseline = y + height / 2 + LABEL_GAP;
        ctx.font = `${fontSize}px ${LABEL_FACE}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        // Same white halo the other nodes get from font.strokeWidth.
        ctx.lineWidth = 3 / scale;
        ctx.strokeStyle = '#ffffff';
        ctx.lineJoin = 'round';
        ctx.strokeText(label, x, baseline);
        ctx.fillStyle = LABEL_COLOR;
        ctx.fillText(label, x, baseline);
      },
    };
  };
