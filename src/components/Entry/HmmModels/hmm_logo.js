/* eslint-disable no-param-reassign */
/* eslint-disable no-magic-numbers */
import EasyScroller from './scroller';

import styles from './logo.css';

const FEATURE_HEIGHT = 10;
const MARGIN_TO_FEATURES = 10;
const PADDING_BETWEEN_TRACKS = 4;

class Letter {
  constructor(letter, options = {}) {
    this.value = letter;
    this.width = parseInt(options.width, 10) || 100;

    // W is 30% wider than the other letters, so need to make sure
    // it gets modified accordingly.
    if (this.value === 'W') {
      this.width += this.width * 30 / 100;
    }

    this.height = parseInt(options.height, 10) || 100;

    this.color = options.color || '#000';
    // if the height and width are changed from the default, then
    // this will also need to be changed as it cant be calculated
    // dynamically.
    this.fontSize = options.fontSize || 138;
  }

  // eslint-disable-next-line max-params
  draw = (extCtx, targetHeight, targetWidth, x, y, color) => {
    const hRatio = targetHeight / this.height;
    const wRatio = targetWidth / this.width;
    const prevFont = extCtx.font;
    extCtx.transform(wRatio, 0, 0, hRatio, x, y);
    extCtx.fillStyle = color || this.color;
    extCtx.textAlign = 'center';
    extCtx.font = `bold ${this.fontSize}px Arial`;

    extCtx.fillText(this.value, 0, 0);
    // restore the canvas settings
    extCtx.setTransform(1, 0, 0, 1, 0, 0);
    extCtx.fillStyle = '#000000';
    extCtx.font = prevFont;
  };
}

const ConsensusColors = function() {
  this.grey = '#7a7a7a';

  // eslint-disable-next-line max-statements
  const arbitrate = (threshold, scoreref) => {
    let bestclass = '.';
    let bestscore = 0;
    let a = null;
    let b = null;
    const classSize = {
      '.': 20,
      h: 11,
      '+': 3,
      '-': 2,
      o: 2,
      p: 2,
    };

    for (const [type, score] of Object.entries(scoreref)) {
      if (score >= threshold) {
        a = classSize[type] || 1;
        b = classSize[bestclass] || 1;

        if (a < b) {
          bestclass = type;
          bestscore = score;
        } else if (a === b) {
          if (score > bestscore) {
            bestclass = type;
            bestscore = scoreref[type];
          }
        }
      }
    }
    return bestclass;
  };

  this.check_PG = function(pos, consensuses, colorsRef) {
    colorsRef[pos].P = '#ff1';
    colorsRef[pos].G = '#ff7f11';
    return 1;
  };

  this.check_R = function(pos, consensuses, colorsRef) {
    colorsRef[pos].R = this.grey;

    const red = '#F99';
    const letters = ['Q', 'K', 'R'];

    for (const letter of letters) {
      if (consensuses['0.85'][pos] === letter) {
        colorsRef[pos].R = red;
        return 1;
      }
    }

    if (
      consensuses['0.60'][pos] === '+' ||
      consensuses['0.60'][pos] === 'R' ||
      consensuses['0.60'][pos] === 'K'
    ) {
      colorsRef[pos].R = red;
      return 1;
    }
    return 1;
  };

  this.check_Q = function(pos, consensuses, colorsRef) {
    colorsRef[pos].Q = this.grey;

    const green = '#9F9';
    const letters = ['Q', 'T', 'K', 'R'];

    if (
      consensuses['0.50'][pos] === 'b' ||
      consensuses['0.50'][pos] === 'E' ||
      consensuses['0.50'][pos] === 'Q'
    ) {
      colorsRef[pos].Q = green;
      return 1;
    }

    for (const letter of letters) {
      if (consensuses['0.85'][pos] === letter) {
        colorsRef[pos].Q = green;
        return 1;
      }
    }

    if (
      consensuses['0.60'][pos] === '+' ||
      consensuses['0.60'][pos] === 'K' ||
      consensuses['0.50'][pos] === 'R'
    ) {
      colorsRef[pos].Q = green;
      return 1;
    }

    return 1;
  };

  this.check_N = function(pos, consensuses, colorsRef) {
    colorsRef[pos].N = this.grey;

    const green = '#9F9';

    if (consensuses['0.50'][pos] === 'N') {
      colorsRef[pos].N = green;
      return 1;
    }

    if (consensuses['0.85'][pos] === 'D') {
      colorsRef[pos].N = green;
      return 1;
    }

    return 1;
  };

  this.check_K = function(pos, consensuses, colorsRef) {
    colorsRef[pos].K = this.grey;

    const red = '#F99';
    const letters = ['K', 'R', 'Q'];

    if (
      consensuses['0.60'][pos] === '+' ||
      consensuses['0.60'][pos] === 'R' ||
      consensuses['0.60'][pos] === 'K'
    ) {
      colorsRef[pos].K = red;
      return 1;
    }

    for (const letter of letters) {
      if (consensuses['0.85'][pos] === letter) {
        colorsRef[pos].K = red;
        return 1;
      }
    }
    return 1;
  };

  this.check_E = function(pos, consensuses, colorsRef) {
    colorsRef[pos].E = this.grey;

    const red = '#F99';
    const letters = ['D', 'E'];

    if (
      consensuses['0.60'][pos] === '+' ||
      consensuses['0.60'][pos] === 'R' ||
      consensuses['0.60'][pos] === 'K'
    ) {
      colorsRef[pos].E = red;
      return 1;
    }

    for (const letter of letters) {
      if (consensuses['0.85'][pos] === letter) {
        colorsRef[pos].E = red;
        return 1;
      }
    }

    if (
      consensuses['0.50'][pos] === 'b' ||
      consensuses['0.50'][pos] === 'E' ||
      consensuses['0.50'][pos] === 'Q'
    ) {
      colorsRef[pos].E = red;
      return 1;
    }

    return 1;
  };

  this.check_D = function(pos, consensuses, colorsRef) {
    colorsRef[pos].D = this.grey;

    const red = '#F99';
    const letters = ['D', 'E', 'N'];

    if (
      consensuses['0.60'][pos] === '+' ||
      consensuses['0.60'][pos] === 'R' ||
      consensuses['0.60'][pos] === 'K'
    ) {
      colorsRef[pos].D = red;
      return 1;
    }

    for (const letter of letters) {
      if (consensuses['0.85'][pos] === letter) {
        colorsRef[pos].D = red;
        return 1;
      }
    }

    if (
      consensuses['0.50'][pos] === '-' ||
      consensuses['0.60'][pos] === 'E' ||
      consensuses['0.60'][pos] === 'D'
    ) {
      colorsRef[pos].D = red;
      return 1;
    }

    return 1;
  };

  this.check_ACFILMVW = function(pos, consensuses, colorsRef) {
    const aa = ['A', 'C', 'F', 'L', 'I', 'M', 'V', 'W'];
    const caa = [
      'A',
      'C',
      'F',
      'H',
      'I',
      'L',
      'M',
      'V',
      'W',
      'Y',
      'P',
      'Q',
      'h',
    ];

    for (const aaLetter of aa) {
      colorsRef[pos][aaLetter] = this.grey;
      for (const cssLetter of caa) {
        if (consensuses['0.60'][pos] === cssLetter) {
          colorsRef[pos][aaLetter] = '#99F';
        }
      }
    }
    return 1;
  };

  this.check_ST = function(pos, consensuses, colorsRef) {
    colorsRef[pos].S = this.grey;
    colorsRef[pos].T = this.grey;

    const letters = [
      'A',
      'C',
      'F',
      'H',
      'I',
      'L',
      'M',
      'V',
      'W',
      'Y',
      'P',
      'Q',
    ];

    if (
      consensuses['0.50'][pos] === 'a' ||
      consensuses['0.50'][pos] === 'S' ||
      consensuses['0.50'][pos] === 'T'
    ) {
      colorsRef[pos].S = '#9F9';
      colorsRef[pos].T = '#9F9';
      return 1;
    }

    for (const letter of letters) {
      if (consensuses['0.85'][pos] === letter) {
        colorsRef[pos].S = '#9F9';
        colorsRef[pos].T = '#9F9';
        return 1;
      }
    }
  };

  this.check_HY = function(pos, consensuses, colorsRef) {
    colorsRef[pos].H = this.grey;
    colorsRef[pos].Y = this.grey;

    const letters = [
      'A',
      'C',
      'F',
      'H',
      'I',
      'L',
      'M',
      'V',
      'W',
      'Y',
      'P',
      'Q',
      'h',
    ];
    const cyan = '#9FF';

    if (consensuses['0.60'][pos] === 'h') {
      colorsRef[pos].H = cyan;
      colorsRef[pos].Y = cyan;
      return 1;
    }

    for (const letter of letters) {
      if (consensuses[0.85][pos] === letter) {
        colorsRef[pos].H = cyan;
        colorsRef[pos].Y = cyan;
        return 1;
      }
    }

    return 1;
  };

  // eslint-disable-next-line complexity, max-statements
  this.color_map = function(probsArray) {
    const thresholds = ['0.50', '0.60', '0.80', '0.85'];
    const hydro = {
      W: 1,
      L: 1,
      V: 1,
      I: 1,
      M: 1,
      A: 1,
      F: 1,
      C: 1,
      Y: 1,
      H: 1,
      P: 1,
    };
    const polar = { Q: 1, N: 1 };
    const positive = { K: 1, R: 1, H: 1 };
    const alcohol = { S: 1, T: 1 };
    const negative = { E: 1, D: 1 };
    const cons = {};
    const colors = [];
    let aa = [];
    let score = {};
    let consensusCol = null;

    for (const column of probsArray) {
      for (const threshold of thresholds) {
        score = {
          p: 0,
          o: 0,
          '-': 0,
          '+': 0,
          h: 0,
        };
        for (const _aa of column) {
          aa = _aa.split(':');
          score[aa[0]] = parseFloat(aa[1], 10);
          if (polar[aa[0]]) {
            score.p += parseFloat(aa[1], 10);
            continue;
          }

          if (alcohol[aa[0]]) {
            score.o += parseFloat(aa[1], 10);
            continue;
          }

          if (negative[aa[0]]) {
            score['-'] += parseFloat(aa[1], 10);
            continue;
          }

          if (positive[aa[0]]) {
            score['+'] += parseFloat(aa[1], 10);
          }

          if (hydro[aa[0]]) {
            score.h += parseFloat(aa[1], 10);
          }
        }
        consensusCol = arbitrate(threshold, score);
        if (!cons[threshold]) {
          cons[threshold] = [];
        }
        cons[threshold].push(consensusCol);
      }
    }

    for (let i = 0; i < probsArray.length; i++) {
      colors[i] = {};
      this.check_D(i, cons, colors);
      this.check_R(i, cons, colors);
      this.check_Q(i, cons, colors);
      this.check_N(i, cons, colors);
      this.check_K(i, cons, colors);
      this.check_E(i, cons, colors);
      this.check_HY(i, cons, colors);
      this.check_ACFILMVW(i, cons, colors);
      // Colour alcohol.....
      this.check_ST(i, cons, colors);
      // Proline and Glycine get fixed colors....
      this.check_PG(i, cons, colors);
    }

    return colors;
  };
};

// eslint-disable-next-line complexity, max-statements
const HMMLogo = function(element, options = {}) {
  this.column_width = options.column_width || 34;
  this.height = options.height || 300;
  this.data = options.data || null;
  this.debug = options.debug || null;
  this.scale_height_enabled = options.height_toggle || null;
  if (options.zoom_buttons && options.zoom_buttons === 'disabled') {
    this.zoom_enabled = null;
  } else {
    this.zoom_enabled = true;
  }

  this.colorscheme = options.colorscheme || 'default';

  // never show the alignment coordinates by default as that would get
  // really confusing.
  this.display_ali_map = 0;

  this.alphabet = options.data.alphabet || 'dna';
  this.dom_element =
    options.dom_element || document.getElementsByName('body')[0];
  this.called_on = options.called_on || element;
  this.start = options.start || 1;
  this.end = options.end || this.data.height_arr.length;
  this.zoom = parseFloat(options.zoom) || 0.4;
  this.default_zoom = this.zoom;

  this.active_sites_sources = options.active_sites_sources || null;
  this.show_active_sites = false;
  this.active_sites = [];
  this.multiple_tracks = true;

  // turn off the insert rows if the hmm used the observed or weighted processing flags.
  if (this.data.processing && /^observed|weighted/.test(this.data.processing)) {
    this.show_inserts = 0;
    this.info_content_height = 286;
  } else {
    this.show_inserts = 1;
    this.info_content_height = 256;
  }

  if (options.scaled_max) {
    this.data.max_height =
      options.data.max_height_obs || this.data.max_height || 2;
  } else {
    this.data.max_height =
      options.data.max_height_theory || this.data.max_height || 2;
  }

  this.dna_colors = {
    A: '#cbf751',
    C: '#5ec0cc',
    G: '#ffdf59',
    T: '#b51f16',
    U: '#b51f16',
  };

  this.aa_colors = {
    A: '#F96',
    C: '#099',
    D: '#F00',
    E: '#C03',
    F: '#0F0',
    G: '#f2f20c',
    H: '#603',
    I: '#C93',
    K: '#630',
    L: '#F93',
    M: '#C9C',
    N: '#366',
    P: '#09F',
    Q: '#66C',
    R: '#900',
    S: '#00F',
    T: '#0FF',
    V: '#FC3',
    W: '#6C6',
    Y: '#060',
  };

  // set the color library to use.
  this.colors = this.dna_colors;

  if (this.alphabet === 'aa') {
    this.colors = this.aa_colors;
  }

  this.canvas_width = 5000;

  let letter = null;
  let probsArr = null;
  let loptions = null;
  let cc = null;

  if (this.alphabet === 'aa') {
    probsArr = this.data.probs_arr;
    if (probsArr) {
      cc = new ConsensusColors();
      this.cmap = cc.color_map(probsArr);
    }
  }

  // build the letter canvases
  this.letters = {};

  for (letter in this.colors) {
    if (this.colors.hasOwnProperty(letter)) {
      loptions = { color: this.colors[letter] };
      this.letters[letter] = new Letter(letter, loptions);
    }
  }

  // this needs to be set to null here so that we can initialise it after
  // the render function has fired and the width determined.
  this.scrollme = null;

  this.previous_target = 0;
  // keeps track of which canvas elements have been drawn and which ones haven't.
  this.rendered = [];
  this.previous_zoom = 0;

  // eslint-disable-next-line complexity, max-statements, max-params
  const drawSmallInsert = (
    context,
    x,
    y,
    colWidth,
    inOdds,
    inLength,
    delOdds,
    showInserts,
  ) => {
    let fill = '#fff';
    if (showInserts) {
      if (inOdds > 0.1) {
        fill = '#d7301f';
      } else if (inOdds > 0.05) {
        fill = '#fc8d59';
      } else if (inOdds > 0.03) {
        fill = '#fdcc8a';
      }
      context.fillStyle = fill;
      context.fillRect(x, y + 15, colWidth, 10);

      fill = '#fff';
      // draw insert length
      if (inLength > 9) {
        fill = '#d7301f';
      } else if (inLength > 7) {
        fill = '#fc8d59';
      } else if (inLength > 4) {
        fill = '#fdcc8a';
      }
      context.fillStyle = fill;
      context.fillRect(x, y + 30, colWidth, 10);
    } else {
      y += 30;
    }

    fill = '#fff';
    // draw delete odds
    if (delOdds < 0.75) {
      fill = '#2171b5';
    } else if (delOdds < 0.85) {
      fill = '#6baed6';
    } else if (delOdds < 0.95) {
      fill = '#bdd7e7';
    }
    context.fillStyle = fill;
    context.fillRect(x, y, colWidth, 10);
  };

  const drawBorder = (context, y, width) => {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.lineWidth = 1;
    context.strokeStyle = '#999';
    context.stroke();
  };

  const drawTicks = (context, x, y, height, color) => {
    color = color || '#999';
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y + height);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
  };

  // eslint-disable-next-line max-params
  const drawBox = (context, x, y, colWidth, color, border) => {
    color = color || 'rgba(100, 100, 100, 0.2)';
    border = border || 'rgba(100, 100, 100, 0.8)';
    context.fillStyle = color;
    context.strokeStyle = border;
    context.fillRect(x, y, colWidth, FEATURE_HEIGHT);
    context.strokeRect(x, y, colWidth, FEATURE_HEIGHT);
  };

  // eslint-disable-next-line max-params
  const drawLine = (context, x1, y1, x2, y2, color) => {
    color = color || 'rgba(100, 100, 100, 0.8)';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
  };

  // eslint-disable-next-line max-params
  const drawRectWithText = (
    context,
    x,
    y,
    text,
    fontsize,
    colWidth,
    fill,
    textfill,
  ) => {
    context.font = `${fontsize}px Arial`;
    context.fillStyle = fill;
    context.fillRect(x, y - 10, colWidth, 14);
    context.textAlign = 'center';
    context.fillStyle = textfill;
    context.fillText(text, x + colWidth / 2, y);
  };

  // eslint-disable-next-line max-params
  const drawInsertOdds = (context, x, height, colWidth, text, fontsize) => {
    const y = height - 20;
    let fill = '#fff';
    let textfill = '#555';

    if (text > 0.1) {
      fill = '#d7301f';
      textfill = '#fff';
    } else if (text > 0.05) {
      fill = '#fc8d59';
    } else if (text > 0.03) {
      fill = '#fdcc8a';
    }

    drawRectWithText(context, x, y, text, fontsize, colWidth, fill, textfill);

    // draw vertical line to indicate where the insert would occur
    if (text > 0.03) {
      drawTicks(context, x + colWidth, height - 30, -30 - height, fill);
    }
  };

  // eslint-disable-next-line max-params
  const drawInsertLength = (context, x, y, colWidth, text, fontsize) => {
    let fill = '#fff';
    let textfill = '#555';

    if (text > 9) {
      fill = '#d7301f';
      textfill = '#fff';
    } else if (text > 7) {
      fill = '#fc8d59';
    } else if (text > 4) {
      fill = '#fdcc8a';
    }
    drawRectWithText(context, x, y, text, fontsize, colWidth, fill, textfill);
  };

  // eslint-disable-next-line max-params
  const drawDeleteOdds = (
    context,
    x,
    height,
    colWidth,
    text,
    fontsize,
    showInserts,
  ) => {
    let y = height - 4;
    let fill = '#fff';
    let textfill = '#555';

    if (showInserts) {
      y = height - 35;
    }

    if (text < 0.75) {
      fill = '#2171b5';
      textfill = '#fff';
    } else if (text < 0.85) {
      fill = '#6baed6';
    } else if (text < 0.95) {
      fill = '#bdd7e7';
    }

    drawRectWithText(context, x, y, text, fontsize, colWidth, fill, textfill);
  };

  // eslint-disable-next-line max-params
  const drawColumnNumber = (
    context,
    x,
    y,
    colWidth,
    colNum,
    fontsize,
    right,
  ) => {
    context.font = `${fontsize}px Arial`;
    context.textAlign = right ? 'right' : 'center';
    context.fillStyle = '#666';
    context.fillText(colNum, x + colWidth / 2, y);
  };

  const attachCanvas = (DOMid, height, width, id, canvWidth) => {
    let canvas = DOMid.querySelector(`#canv_${id}`);

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = `canv_${id}`;
      canvas.classList.add(styles.canvas_logo);
      canvas.style.left = `${canvWidth * id}px`;
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);

      DOMid.innerHTML = `
        <canvas
          className=${styles.canvas_logo}
          id="canv_${id}"
          height="${height}"
          width="${width}"
          style="left: ${canvWidth * id}px;"
        ></canvas>
      `;

      // DOMid.appendChild(canvas); //TODO remove the final reference to jquery above
      canvas = DOMid.querySelector(`#canv_${id}`);
    }

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    return canvas;
  };

  // the main render function that draws the logo based on the provided options.
  // eslint-disable-next-line complexity, max-statements
  this.render = function(options = {}) {
    if (!this.data) return;
    let zoom = options.zoom || this.zoom;
    let target = options.target || 1;
    const parentWidth = this.dom_element.parentNode.clientWidth;
    let maxCanvasWidth = 1;
    let end = null;
    let start = null;

    /*
    TODO not sure about what the behaviour this section is intended to achieve
    if (target === this.previous_target) {
      return;
    }
    */

    this.previous_target = target;

    if (options.start) {
      this.start = options.start;
    }
    if (options.end) {
      this.end = options.end;
    }

    if (zoom <= 0.1) {
      zoom = 0.1;
    } else if (zoom >= 1) {
      zoom = 1;
    }

    this.zoom = zoom;

    end = this.end || this.data.height_arr.length;
    start = this.start || 1;
    end = end > this.data.height_arr.length ? this.data.height_arr.length : end;
    end = end < start ? start : end;

    start = start > end ? end : start;
    start = start > 1 ? start : 1;

    this.y = this.height - 20;
    // Check to see if the logo will fit on the screen at full zoom.
    this.max_width = this.column_width * (end - start + 1);
    // If it fits then zoom out and disable zooming.
    if (parentWidth > this.max_width) {
      zoom = 1;
      this.zoom_enabled = false;
    }
    this.zoom = zoom;

    this.zoomed_column = this.column_width * zoom;
    this.total_width = this.zoomed_column * (end - start + 1);

    // If zoom is not maxed and we still aren't filling the window
    // then ramp up the zoom level until it fits, then disable zooming.
    // Then we get a decent logo with out needing to zoom in or out.
    if (zoom < 1) {
      while (this.total_width < parentWidth) {
        this.zoom += 0.1;
        this.zoomed_column = this.column_width * this.zoom;
        this.total_width = this.zoomed_column * (end - start + 1);
        this.zoom_enabled = false;
        if (zoom >= 1) {
          break;
        }
      }
    }

    if (target > this.total_width) {
      target = this.total_width;
    }
    this.dom_element.setAttribute('width', this.total_width);
    this.dom_element.style.width = this.total_width;

    const canvasCount = Math.ceil(this.total_width / this.canvas_width);
    this.columns_per_canvas = Math.ceil(this.canvas_width / this.zoomed_column);

    if (this.previous_zoom !== this.zoom) {
      for (const canvasElement of this.dom_element.getElementsByTagName(
        'canvas',
      )) {
        canvasElement.remove();
      }
      this.previous_zoom = this.zoom;
      this.rendered = [];
    }

    this.canvases = [];
    this.contexts = [];

    for (let i = 0; i < canvasCount; i++) {
      const splitStart = this.columns_per_canvas * i + start;
      let splitEnd = splitStart + this.columns_per_canvas - 1;
      if (splitEnd > end) {
        splitEnd = end;
      }

      const adjustedWidth = (splitEnd - splitStart + 1) * this.zoomed_column;

      if (adjustedWidth > maxCanvasWidth) {
        maxCanvasWidth = adjustedWidth;
      }

      const canvStart = maxCanvasWidth * i;
      const canvEnd = canvStart + adjustedWidth;

      if (
        target < canvEnd + canvEnd / 2 &&
        target > canvStart - canvStart / 2
      ) {
        // Check that we aren't redrawing the canvas and if not, then attach it and draw.
        if (this.rendered[i] !== 1) {
          this.canvases[i] = attachCanvas(
            this.dom_element,
            this.height,
            adjustedWidth,
            i,
            maxCanvasWidth,
          );
          this.contexts[i] = this.canvases[i].getContext('2d');
          this.contexts[i].setTransform(1, 0, 0, 1, 0, 0);
          this.contexts[i].clearRect(0, 0, adjustedWidth, this.height);
          this.contexts[i].fillStyle = '#ffffff';
          this.contexts[i].fillRect(0, 0, canvEnd, this.height);

          if (this.zoomed_column > 12) {
            let fontsize = parseInt(10 * zoom, 10);
            fontsize = fontsize > 10 ? 10 : fontsize;
            if (this.debug) {
              this.render_with_rects(splitStart, splitEnd, i, 1);
            }
            this.render_with_text(splitStart, splitEnd, i, fontsize);
          } else {
            this.render_with_rects(splitStart, splitEnd, i);
          }
          this.rendered[i] = 1;
        }
      }
    }

    // check if the scroller object has been initialised and if not then do so.
    // we do this here as opposed to at object creation, because we need to
    // make sure the logo has been rendered and the width is correct, otherwise
    // we get a weird initial state where the canvas will bounce back to the
    // beginning the first time it is scrolled, because it thinks it has a
    // width of 0.
    if (!this.scrollme) {
      const logoGraphic = this.called_on.getElementsByClassName(
        styles.logo_graphic,
      )[0];
      this.scrollme = new EasyScroller(logoGraphic, {
        scrollingX: 1,
        scrollingY: 0,
        eventTarget: this.called_on,
      });
    }

    if (target !== 1) this.scrollme.reflow();
  };

  this.render_x_axis_label = function() {
    let label = 'Model Position';
    if (this.display_ali_map) {
      label = 'Alignment Column';
    }

    for (const xElement of this.called_on.getElementsByClassName(
      styles.logo_xaxis,
    )) {
      xElement.remove();
    }
    const axisDiv = document.createElement('div');
    axisDiv.classList.add(styles.logo_xaxis);
    const axisP = document.createElement('p');
    axisP.classList.add(styles.xaxis_text);
    axisP.innerHTML = label;
    axisDiv.appendChild(axisP);
    this.called_on.insertBefore(
      axisDiv,
      this.called_on.getElementsByClassName(styles.logo_container)[0],
    );
  };

  // eslint-disable-next-line max-statements
  this.render_y_axis_label = function() {
    // attach a canvas for the y-axis
    for (const yElement of this.called_on.getElementsByClassName(
      styles.logo_yaxis,
    )) {
      yElement.remove();
    }

    for (const xAxis of this.called_on.getElementsByClassName(
      styles.logo_xaxis,
    )) {
      const canvas = document.createElement('canvas');
      canvas.classList.add(styles.logo_yaxis);
      canvas.height = 302;
      canvas.width = 55;
      xAxis.appendChild(canvas);
      let context = null;
      let axisLabel = 'Information Content (bits)';

      context = canvas.getContext('2d');
      // draw min/max tick marks
      context.beginPath();
      context.moveTo(55, 1);
      context.lineTo(40, 1);

      context.moveTo(55, this.info_content_height);
      context.lineTo(40, this.info_content_height);

      context.moveTo(55, this.info_content_height / 2);
      context.lineTo(40, this.info_content_height / 2);
      context.lineWidth = 1;
      context.strokeStyle = '#666';
      context.stroke();

      // draw the label text
      context.fillStyle = '#666';
      context.textAlign = 'right';
      context.font = 'bold 10px Arial';

      // draw the max label
      context.textBaseline = 'top';
      context.fillText(parseFloat(this.data.max_height).toFixed(1), 38, 0);
      context.textBaseline = 'middle';

      // draw the midpoint labels
      context.fillText(
        parseFloat(this.data.max_height / 2).toFixed(1),
        38,
        this.info_content_height / 2,
      );
      // draw the min label
      context.fillText('0', 38, this.info_content_height);

      // draw the axis label
      if (this.data.height_calc === 'score') {
        axisLabel = 'Score (bits)';
      }

      context.save();
      context.translate(5, this.height / 2 - 20);
      context.rotate(-Math.PI / 2);
      context.textAlign = 'center';
      context.font = 'normal 12px Arial';
      context.fillText(axisLabel, 1, 0);
      context.restore();

      // draw the insert row labels
      context.fillText('occupancy', 55, this.info_content_height + 7);
      if (this.show_inserts) {
        context.fillText('ins. prob.', 50, 280);
        context.fillText('ins. len.', 46, 296);
      }
    }
  };

  this.render_x_axis_label();
  this.render_y_axis_label();

  // eslint-disable-next-line complexity, max-statements
  this.render_with_text = function(start, end, contextNum, fontsize) {
    let x = 0;
    let columnNum = start;
    let columnLabel = null;

    // add 3 extra columns so that numbers don't get clipped at the end of a
    // canvas that ends before a large column. DF0000830 was suffering at zoom
    // level 0.6, column 2215. This adds a little extra overhead, but is the
    // easiest fix for now.
    if (end + 3 <= this.end) {
      end += 3;
    }

    for (let i = start; i <= end; i++) {
      if (this.data.mmline && this.data.mmline[i - 1] === 1) {
        this.contexts[contextNum].fillStyle = '#cccccc';
        this.contexts[contextNum].fillRect(
          x,
          10,
          this.zoomed_column,
          this.height - 40,
        );
      } else {
        const column = this.data.height_arr[i - 1];
        const colPositions = [];
        if (column) {
          let previousHeight = 0;
          const letters = column.length;
          let color = null;

          for (let j = 0; j < letters; j++) {
            const letter = column[j];
            const values = letter.split(':', 2);
            const xPos = x + this.zoomed_column / 2;
            let letterHeight = null;

            // we don't render anything with a value between 0 and 0.01. These
            // letters would be too small to be meaningful on any scale, so we
            // just squash them out.
            // eslint-disable-next-line max-depth
            if (values[1] > 0.01) {
              letterHeight = parseFloat(values[1]) / this.data.max_height;
              const yPos = this.info_content_height - 2 - previousHeight;
              const glyphHeight = (this.info_content_height - 2) * letterHeight;

              colPositions[j] = [glyphHeight, this.zoomed_column, xPos, yPos];
              previousHeight += glyphHeight;
            }
          }

          // render the letters in reverse order so that the larger letters on the top
          // don't clobber the smaller letters below them.
          for (let j = letters; j >= 0; j--) {
            // eslint-disable-next-line max-depth
            if (colPositions[j] && this.letters[column[j][0]]) {
              // eslint-disable-next-line max-depth
              if (this.colorscheme === 'consensus') {
                color = this.cmap[i - 1][column[j][0]] || '#7a7a7a';
              } else {
                color = null;
              }
              this.letters[column[j][0]].draw(
                this.contexts[contextNum],
                colPositions[j][0],
                colPositions[j][1],
                colPositions[j][2],
                colPositions[j][3],
                color,
              );
            }
          }
        }
      }

      // if ali_coordinates exist and toggle is set then display the
      // alignment coordinates and not the model coordinates.
      if (this.display_ali_map) {
        columnLabel = this.data.ali_map[i - 1];
      } else {
        columnLabel = columnNum;
      }

      if (this.zoom < 0.7) {
        if (i % 5 === 0) {
          this.draw_column_divider({
            contextNum,
            x,
            fontsize: 10,
            column_num: columnLabel,
            ralign: true,
          });
        }
      } else {
        this.draw_column_divider({
          contextNum,
          x,
          fontsize,
          column_num: columnLabel,
        });
      }

      drawDeleteOdds(
        this.contexts[contextNum],
        x,
        this.height,
        this.zoomed_column,
        this.data.delete_probs[i - 1],
        fontsize,
        this.show_inserts,
      );
      // draw insert length ticks
      drawTicks(this.contexts[contextNum], x, this.height - 15, 5);
      if (this.show_inserts) {
        drawInsertOdds(
          this.contexts[contextNum],
          x,
          this.height,
          this.zoomed_column,
          this.data.insert_probs[i - 1],
          fontsize,
        );
        drawInsertLength(
          this.contexts[contextNum],
          x,
          this.height - 5,
          this.zoomed_column,
          this.data.insert_lengths[i - 1],
          fontsize,
        );

        // draw delete probability ticks
        drawTicks(this.contexts[contextNum], x, this.height - 45, 5);
        // draw insert probability ticks
        drawTicks(this.contexts[contextNum], x, this.height - 30, 5);
      }

      if (this.show_active_sites) {
        this.render_active_sites(contextNum, i, x);
      }

      x += this.zoomed_column;
      columnNum++;
    }

    // draw other dividers
    if (this.show_inserts) {
      drawBorder(this.contexts[contextNum], this.height - 30, this.total_width);
      drawBorder(this.contexts[contextNum], this.height - 45, this.total_width);
    }
    drawBorder(this.contexts[contextNum], this.height - 15, this.total_width);
    drawBorder(this.contexts[contextNum], 0, this.total_width);
  };

  this.draw_column_divider = function(opts) {
    const divX = opts.ralign ? opts.x + this.zoomed_column : opts.x;
    const numX = opts.ralign ? opts.x + 2 : opts.x;
    // draw column dividers
    drawTicks(
      this.contexts[opts.contextNum],
      divX,
      this.height - 30,
      -30 - this.height,
      '#dddddd',
    );
    // draw top ticks
    drawTicks(this.contexts[opts.contextNum], divX, 0, 5);
    // draw column numbers
    drawColumnNumber(
      this.contexts[opts.contextNum],
      numX,
      10,
      this.zoomed_column,
      opts.column_num,
      opts.fontsize,
      opts.ralign,
    );
  };

  // eslint-disable-next-line complexity, max-statements
  this.render_with_rects = function(start, end, contextNum, borders) {
    let x = 0;
    let columnNum = start;
    let columnLabel = null;
    let mod = 10;

    for (let i = start; i <= end; i++) {
      if (this.data.mmline && this.data.mmline[i - 1] === 1) {
        this.contexts[contextNum].fillStyle = '#ccc';
        this.contexts[contextNum].fillRect(
          x,
          10,
          this.zoomed_column,
          this.height - 40,
        );
      } else {
        const column = this.data.height_arr[i - 1];
        let previousHeight = 0;
        const letters = column.length;
        for (let j = 0; j < letters; j++) {
          const letter = column[j];
          const values = letter.split(':', 2);
          if (values[1] > 0.01) {
            const letterHeight = parseFloat(values[1]) / this.data.max_height;
            const xPos = x;
            const glyphHeight = (this.info_content_height - 2) * letterHeight;
            const yPos =
              this.info_content_height - 2 - previousHeight - glyphHeight;
            let color = null;

            // eslint-disable-next-line max-depth
            if (this.colorscheme === 'consensus') {
              color = this.cmap[i - 1][values[0]] || '#7a7a7a';
            } else {
              color = this.colors[values[0]];
            }

            // eslint-disable-next-line max-depth
            if (borders) {
              this.contexts[contextNum].strokeStyle = color;
              this.contexts[contextNum].strokeRect(
                xPos,
                yPos,
                this.zoomed_column,
                glyphHeight,
              );
            } else {
              this.contexts[contextNum].fillStyle = color;
              this.contexts[contextNum].fillRect(
                xPos,
                yPos,
                this.zoomed_column,
                glyphHeight,
              );
            }

            previousHeight += glyphHeight;
          }
        }
      }

      if (this.zoom < 0.2) {
        mod = 20;
      } else if (this.zoom < 0.3) {
        mod = 10;
      }

      if (i % mod === 0) {
        // draw column dividers
        drawTicks(
          this.contexts[contextNum],
          x + this.zoomed_column,
          this.height - 30,
          parseFloat(this.height),
          '#ddd',
        );
        // draw top ticks
        drawTicks(this.contexts[contextNum], x + this.zoomed_column, 0, 5);

        // if ali_coordinates exist and toggle is set then display the
        // alignment coordinates and not the model coordinates.
        if (this.display_ali_map) {
          columnLabel = this.data.ali_map[i - 1];
        } else {
          columnLabel = columnNum;
        }
        // draw column numbers
        drawColumnNumber(
          this.contexts[contextNum],
          x - 2,
          10,
          this.zoomed_column,
          columnLabel,
          10,
          true,
        );
      }

      // draw insert probabilities/lengths
      drawSmallInsert(
        this.contexts[contextNum],
        x,
        this.height - 42,
        this.zoomed_column,
        this.data.insert_probs[i - 1],
        this.data.insert_lengths[i - 1],
        this.data.delete_probs[i - 1],
        this.show_inserts,
      );

      // draw other dividers
      if (this.show_inserts) {
        drawBorder(
          this.contexts[contextNum],
          this.height - 45,
          this.total_width,
        );
      } else {
        drawBorder(
          this.contexts[contextNum],
          this.height - 15,
          this.total_width,
        );
      }

      drawBorder(this.contexts[contextNum], 0, this.total_width);

      if (this.show_active_sites) {
        this.render_active_sites(contextNum, i, x);
      }

      x += this.zoomed_column;
      columnNum++;
    }
  };
  this.render_active_sites = function(contextNum, i, x) {
    let track = 1;
    for (let j = 0; j < this.active_sites.length; j++) {
      const wtd = this.active_sites[j].controller.whatShouldBeDraw(i);
      if (!wtd) continue;
      const color = this.aa_colors[wtd.base];
      if (wtd.type === 'BLOCK') {
        drawBox(
          this.contexts[contextNum],
          x + 1,
          MARGIN_TO_FEATURES +
            track * (PADDING_BETWEEN_TRACKS + FEATURE_HEIGHT),
          this.zoomed_column - 2,
          color,
        );
      } else if (wtd.type === 'LINE') {
        drawLine(
          this.contexts[contextNum],
          x,
          MARGIN_TO_FEATURES +
            PADDING_BETWEEN_TRACKS * track +
            (track + 0.5) * FEATURE_HEIGHT,
          x + this.zoomed_column,
          MARGIN_TO_FEATURES +
            PADDING_BETWEEN_TRACKS * track +
            (track + 0.5) * FEATURE_HEIGHT,
          color,
        );
      }
      if (this.multiple_tracks) track++;
    }
  };

  this.toggle_colorscheme = function(scheme) {
    // work out the current column we are on so we can return there
    const colTotal = this.current_column();

    if (scheme) {
      if (scheme === 'default') {
        this.colorscheme = 'default';
      } else {
        this.colorscheme = 'consensus';
      }
    } else {
      if (this.colorscheme === 'default') {
        this.colorscheme = 'consensus';
      } else {
        this.colorscheme = 'default';
      }
    }

    // reset the rendered counter so that each section will re-render
    // with the new heights
    this.rendered = [];

    // re-flow and re-render the content
    this.scrollme.reflow();
    // scroll off by one to force a render of the canvas.
    this.scrollToColumn(colTotal + 1);
    // scroll back to the location we started at.
    this.scrollToColumn(colTotal);
  };

  this.toggle_scale = function(scale) {
    // work out the current column we are on so we can return there
    const colTotal = this.current_column();

    if (scale) {
      if (scale === 'obs') {
        this.data.max_height = this.data.max_height_obs;
      } else {
        this.data.max_height = this.data.max_height_theory;
      }
    } else {
      // toggle the max height
      if (this.data.max_height === this.data.max_height_obs) {
        this.data.max_height = this.data.max_height_theory;
      } else {
        this.data.max_height = this.data.max_height_obs;
      }
    }
    // reset the rendered counter so that each section will re-render
    // with the new heights
    this.rendered = [];
    // update the y-axis
    for (const element of this.called_on.getElementsByClassNames(
      styles.logo_yaxis,
    )) {
      element.remove();
    }
    this.render_y_axis_label();

    // re-flow and re-render the content
    this.scrollme.reflow();
    // scroll off by one to force a render of the canvas.
    this.scrollToColumn(colTotal + 1);
    // scroll back to the location we started at.
    this.scrollToColumn(colTotal);
  };

  this.toggle_ali_map = function(coords) {
    // work out the current column we are on so we can return there
    const colTotal = this.current_column();

    if (coords) {
      if (coords === 'model') {
        this.display_ali_map = 0;
      } else {
        this.display_ali_map = 1;
      }
    } else {
      // toggle the max height
      if (this.display_ali_map === 1) {
        this.display_ali_map = 0;
      } else {
        this.display_ali_map = 1;
      }
    }
    this.render_x_axis_label();

    // reset the rendered counter so that each section will re-render
    // with the new heights
    this.rendered = [];

    // re-flow and re-render the content
    this.scrollme.reflow();
    // scroll off by one to force a render of the canvas.
    this.scrollToColumn(colTotal + 1);
    // scroll back to the location we started at.
    this.scrollToColumn(colTotal);
  };

  this.current_column = function() {
    const beforeLeft = this.scrollme.scroller.getValues().left;
    const colWidth = this.column_width * this.zoom;
    const colCount = beforeLeft / colWidth;
    const halfVisibleColumns =
      this.called_on.getElementsByClassName(styles.logo_container)[0]
        .clientWidth /
      colWidth /
      2;
    return Math.ceil(colCount + halfVisibleColumns);
  };

  // eslint-disable-next-line max-statements
  this.change_zoom = function(options) {
    let zoomLevel = 0.3;
    if (options.target) {
      zoomLevel = options.target;
    } else if (options.distance) {
      zoomLevel = (parseFloat(this.zoom) - parseFloat(options.distance)
      ).toFixed(1);
      if (options.direction === '+') {
        zoomLevel = (parseFloat(this.zoom) + parseFloat(options.distance)
        ).toFixed(1);
      }
    }

    if (zoomLevel > 1) {
      zoomLevel = 1;
    } else if (zoomLevel < 0.1) {
      zoomLevel = 0.1;
    }

    // see if we need to zoom or not
    const graphicalElement = this.called_on.getElementsByClassName(
      styles.logo_graphic,
    )[0];
    const containerElement = this.called_on.getElementsByClassName(
      styles.logo_container,
    )[0];
    const expectedWidth = graphicalElement.clientWidth * zoomLevel / this.zoom;
    if (expectedWidth > containerElement.clientWidth) {
      // if a center is not specified, then use the current center of the view
      if (options.column) {
        // center around the mouse click position.
        this.zoom = zoomLevel;
        this.render({ zoom: this.zoom });
        this.scrollme.reflow();

        const coords = this.coordinatesFromColumn(options.column);
        this.scrollme.scroller.scrollTo(coords - options.offset);
      } else {
        // work out my current position
        const colTotal = this.current_column();

        this.zoom = zoomLevel;
        this.render({ zoom: this.zoom });
        this.scrollme.reflow();

        // scroll to previous position
        this.scrollToColumn(colTotal);
      }
    }
    return this.zoom;
  };

  this.columnFromCoordinates = function(x) {
    return Math.ceil(x / (this.column_width * this.zoom));
  };

  this.coordinatesFromColumn = function(col) {
    const newColumn = col - 1;

    return (
      newColumn * (this.column_width * this.zoom) +
      this.column_width * this.zoom / 2
    );
  };

  this.scrollToColumn = function(num, animate) {
    const halfView =
      this.called_on.getElementsByClassName(styles.logo_container)[0]
        .clientWidth / 2;
    const newLeft = this.coordinatesFromColumn(num);
    this.scrollme.scroller.scrollTo(newLeft - halfView, 0, animate);
  };
};

// eslint-disable-next-line complexity, max-statements
const hmmLogo = function(logoElement, options = {}) {
  // add some internal divs for scrolling etc.
  const logoGraphic = document.createElement('div');
  logoGraphic.classList.add(styles.logo_graphic);

  const logoContainer = document.createElement('div');
  logoContainer.classList.add(styles.logo_container);

  const logoDivider = document.createElement('div');
  logoDivider.classList.add(styles.logo_divider);

  logoElement.appendChild(logoContainer);
  logoContainer.appendChild(logoGraphic);
  logoElement.appendChild(logoDivider);

  if (options.data === null) return;

  options.dom_element = logoGraphic;
  options.called_on = logoElement;

  const fieldset = document.createElement('fieldset');

  const label = document.createElement('label');
  label.htmlFor = 'position';
  label.innerHTML = 'Column number';
  fieldset.appendChild(label);

  const input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.id = 'position';
  input.classList.add(styles.logo_position);
  fieldset.appendChild(input);

  const logoChangeButton = document.createElement('button');
  logoChangeButton.classList.add(styles.button);
  logoChangeButton.classList.add(styles.logo_change);
  logoChangeButton.innerHTML = 'Go';
  fieldset.appendChild(logoChangeButton);

  const form = document.createElement('form');
  form.classList.add(styles.logo_form);
  form.appendChild(fieldset);

  const controls = document.createElement('div');
  controls.classList.add(styles.logo_controls);
  form.appendChild(controls);

  const close = document.createElement('span');
  close.classList.add(styles.close);
  close.innerHTML = 'x';

  const settings = document.createElement('div');
  settings.classList.add(styles.logo_settings);
  settings.appendChild(close);
  controls.appendChild(settings);

  const logo = new HMMLogo(logoElement, options);
  logo.render(options);

  if (logo.zoom_enabled) {
    const outButton = document.createElement('button');
    outButton.classList.add(styles.button);
    outButton.classList.add(styles.logo_zoomout);
    outButton.innerHTML = '-';
    const inButton = document.createElement('button');
    inButton.classList.add(styles.button);
    inButton.classList.add(styles.logo_zoomin);
    inButton.innerHTML = '+';
    controls.appendChild(outButton);
    controls.appendChild(inButton);
  }

  /* we don't want to toggle if the max height_obs is greater than max theoretical
     * as letters will fall off the top.
     */
  if (
    logo.scale_height_enabled &&
    logo.data.max_height_obs < logo.data.max_height_theory
  ) {
    let obsChecked = '';
    let theoryChecked = '';
    const theoryHelp = '';
    const obsHelp = '';

    if (logo.data.max_height_obs === logo.data.max_height) {
      obsChecked = 'checked';
    } else {
      theoryChecked = 'checked';
    }

    /*
    if (options.help) {
      obsHelp =
        '<a class="help" href="/help#scale_obs" title="Set the y-axis maximum to the maximum observed height.">' +
        '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
      theoryHelp =
        '<a class="help" href="/help#scale_theory" title="Set the y-axis maximum to the theoretical maximum height">' +
        '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
    }
    */

    const scaleControls =
      '<fieldset><legend>Scale</legend>' +
      `<label><input type="radio" name="scale" class="${styles.logo_scale}" value="obs" ${obsChecked}/>Maximum Observed ${obsHelp}</label></br>` +
      `<label><input type="radio" name="scale" class="${styles.logo_scale}" value="theory" ${theoryChecked}/>Maximum Theoretical ${theoryHelp}</label>` +
      '</fieldset>';

    settings.innerHTML = scaleControls;
  }

  if (
    logo.data.height_calc !== 'score' &&
    logo.data.alphabet === 'aa' &&
    logo.data.probs_arr
  ) {
    let defColor = null;
    let conColor = null;

    if (logo.colorscheme === 'default') {
      defColor = 'checked';
    } else {
      conColor = 'checked';
    }

    settings.innerHTML += `
      <fieldset><legend>Color Scheme</legend>
        <label><input type="radio" name="color" class=${styles.logo_color}" value="default" ${defColor}/>Default</label></br>
        <label><input type="radio" name="color" class=${styles.logo_color}" value="consensus" ${conColor}/>Consensus Colors</label>
      </fieldset>
    `;
  }

  if (logo.data.ali_map) {
    let modChecked = null;
    let aliChecked = null;

    if (logo.display_ali_map === 0) {
      modChecked = 'checked';
    } else {
      aliChecked = 'checked';
    }

    const aliControls =
      '<fieldset><legend>Coordinates</legend>' +
      `<label><input type="radio" name="coords" class="${styles.logo_ali_map}" value="model" ${modChecked}/>Model</label></br>` +
      `<label><input type="radio" name="coords" class="${styles.logo_ali_map}" value="alignment" ${aliChecked}/>Alignment</label>` +
      '</fieldset>';
    settings.innerHTML += aliControls;

    if (
      logo.active_sites_sources !== null &&
      typeof logo.active_sites_sources === 'object'
    ) {
      let activeSites =
        '<fieldset><legend>ActiveSites</legend>' +
        `<label>Source: <select name="member_db" class="${styles.logo_ali_map}">`;
      for (const key of Object.keys(logo.active_sites_sources)) {
        activeSites += `<option value="${key}">${key}</option> `;
      }
      activeSites +=
        '</select></label> ' + // + modHelp +
        '</br>' +
        '<label>Accession number: ' +
        `  <input type="text" name="family_accession" class="${styles.logo_ali_map}" value=""/>` +
        '</label><br/>' +
        '<button id="active_sites">Get Active Sites</button>' +
        '</fieldset>';

      settings.innerHTML += activeSites;
    }
  }

  if (settings.children.length > 0) {
    const settingsButton = document.createElement('button');
    settingsButton.innerHTML = 'Settings';
    settingsButton.classList.add(styles.logo_settings_switch);
    settingsButton.classList.add(styles.button);
    -controls.appendChild(settingsButton);
    controls.appendChild(settings);
  }

  form.appendChild(controls);
  logoElement.appendChild(form);

  for (const name of [
    styles.logo_settings_switch,
    styles.logo_settings,
    styles.close,
  ]) {
    for (const element of logoElement.getElementsByClassName(name)) {
      element.addEventListener('click', e => {
        e.preventDefault();
        if (settings.style.display !== 'none' && settings.style.display) {
          settings.style.display = 'none';
        } else {
          settings.style.display = 'block';
        }
      });
    }
  }
  for (const matchedElement of document.getElementsByClassName(
    styles.logo_reset,
  )) {
    matchedElement.addEventListener('click', e => {
      e.preventDefault();
      logo.change_zoom({ target: logo.default_zoom });
    });
  }
  for (const matchedElement of document.getElementsByClassName(
    styles.logo_change,
  )) {
    matchedElement.addEventListener('click', e => {
      e.preventDefault();
    });
  }
  for (const matchedElement of document.getElementsByClassName(
    styles.logo_zoomin,
  )) {
    matchedElement.addEventListener('click', e => {
      e.preventDefault();
      logo.change_zoom({ distance: 0.1, direction: '+' });
    });
  }
  for (const matchedElement of document.getElementsByClassName(
    styles.logo_zoomout,
  )) {
    matchedElement.addEventListener('click', e => {
      e.preventDefault();
      logo.change_zoom({ distance: 0.1, direction: '-' });
    });
  }
  for (const matchedElement of document.getElementsByClassName(
    styles.logo_scale,
  )) {
    matchedElement.addEventListener('change', function() {
      logo.toggle_scale(this.value); // MAQ pass correct argument
    });
  }
  for (const matchedElement of document.getElementsByClassName(
    styles.logo_color,
  )) {
    matchedElement.addEventListener('change', function() {
      logo.toggle_colorscheme(this.value); // MAQ pass correct argument
    });
  }
  for (const matchedElement of document.getElementsByClassName(
    styles.logo_ali_map,
  )) {
    matchedElement.addEventListener('change', function() {
      logo.toggle_ali_map(this.value);
    });
  }
  for (const matchedElement of document.getElementsByClassName(
    styles.logo_position,
  )) {
    matchedElement.addEventListener('change', function() {
      if (!this.value.match(/^\d+$/m)) {
        return;
      }
      logo.scrollToColumn(this.value, 1);
    });
  }
  logoGraphic.addEventListener('dblclick', function(e) {
    if (logo.zoom < 1) {
      logo.change_zoom({
        target: 1,
        offset: e.pageX - this.parentNode.offsetLeft,
        column: logo.columnFromCoordinates(
          parseInt(e.pageX - this.offsetLeft, 10),
        ),
      });
    } else {
      logo.change_zoom({
        target: 0.3,
        offset: e.pageX - this.parentNode.offsetLeft,
        column: logo.columnFromCoordinates(
          parseInt(e.pageX - this.offsetLeft, 10),
        ),
      });
    }
  });

  if (options.column_info) {
    // eslint-disable-next-line max-statements
    logoGraphic.addEventListener('click', function(e) {
      const infoTab = document.createElement('table');
      infoTab.classList.add(styles.logo_col_info);
      infoTab.classList.add(styles.logo_col_hmm);
      const hmmLogo = logo;
      let header = '<tr>';
      let tbody = '';
      const offset = {
        top: this.offsetTop,
        left: this.offsetLeft,
      };
      const x = parseInt(e.pageX - offset.left, 10);
      // get column number
      const col = hmmLogo.columnFromCoordinates(x);
      // clone the column data before reversal or the column gets messed
      // up in the logo when zoom levels change. Also stops flip-flopping
      // of the order from ascending to descending.
      let colData = [];
      let infoCols = 0;
      let heightHeader = 'Probability';

      if (logo.data.height_calc && logo.data.height_calc === 'score') {
        heightHeader = 'Score';
        colData = logo.data.height_arr[col - 1].slice(0).reverse();
      } else {
        colData = logo.data.probs_arr[col - 1].slice(0).reverse();
      }

      infoCols = Math.ceil(colData.length / 5);
      // add the headers for each column.
      for (let i = 0; i < infoCols; i++) {
        // using the i < infoCols - 1 check to make sure the last column doesn't
        // get marked with the odd class so we don't get a border on the edge of the table.
        if (infoCols > 1 && i < infoCols - 1) {
          header += `<th>Residue</th><th class="odd">${heightHeader}</th>`;
        } else {
          header += `<th>Residue</th><th>${heightHeader}</th>`;
        }
      }

      header += '</tr>';
      infoTab.innerHTML = header;

      // add the data for each column
      for (let i = 0; i < 5; i++) {
        tbody += '<tr>';
        let j = i;
        while (colData[j]) {
          const values = colData[j].split(':', 2);
          let color = '';
          if (logo.colorscheme === 'default') {
            color = `${logo.alphabet}_${values[0]}`;
          }
          // using the j < 15 check to make sure the last column doesn't get marked
          // with the odd class so we don't get a border on the edge of the table.
          if (infoCols > 1 && j < 15) {
            tbody += `<td class="${styles[
              color
            ]}"><div></div>${values[0]}</td><td class="odd">${values[1]}</td>`;
          } else {
            tbody += `<td class="${styles[
              color
            ]}"><div></div>${values[0]}</td><td>${values[1]}</td>`;
          }

          j += 5;
        }
        tbody += '</tr>';
      }

      infoTab.innerHTML += tbody;

      const columnInfo = document.createElement('div');
      columnInfo.id = 'logo_column_info';
      columnInfo.innerHTML = `<div style="text-align: center;"><span>Column:${col} &nbsp;</span>
      <span>Occupancy: ${logo.data.delete_probs[col - 1]}  &nbsp;</span>
      <span>Insert Probability: ${logo.data.insert_probs[col - 1]} &nbsp;</span>
      <span>Insert Length: ${logo.data.insert_lengths[
        col - 1
      ]}  &nbsp;</span></div>`;
      columnInfo.appendChild(infoTab);
      const existingColumnInfo = logoElement.querySelector('#logo_column_info');
      if (existingColumnInfo) {
        existingColumnInfo.remove();
      }
      logoElement.appendChild(columnInfo);
    });
  }

  return logo;
};

export default hmmLogo;
