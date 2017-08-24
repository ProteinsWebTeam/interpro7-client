/* jslint browser:true */
/* global G_vmlCanvasManager, EasyScroller */
/** @license
 * HMM logo
 * https://github.com/Janelia-Farm-Xfam/hmm_logo_js
 * Copyright 2013, Jody Clements.
 * Licensed under the MIT License.
 * https://github.com/Janelia-Farm-Xfam/hmm_logo_js/blob/master/LICENSE.txt
 */

/* eslint-env node */
/* eslint-disable no-param-reassign */

import ActiveSitesAdder from './activesite_adder';
import EasyScroller from './scroller';
import classNames from 'classnames';
import styles from './logo.css';
import React from 'react';

const $ = require('./jquery');

// checking for canvas support and caching result
let canv_support = null;

let feature_height = 10,
  margin_to_features = 10,
  padding_between_tracks = 4;

function canvasSupport() {
  if (!canv_support) {
    const elem = document.createElement('canvas');
    canv_support = !!(elem.getContext && elem.getContext('2d'));
  }
  return canv_support;
}

function Letter(letter, opt) {
  const options = opt || {};
  this.value = letter;
  this.width = parseInt(options.width, 10) || 100;

  // W is 30% wider than the other letters, so need to make sure
  // it gets modified accordingly.
  if (this.value === 'W') {
    this.width += this.width * 30 / 100;
  }

  this.height = parseInt(options.height, 10) || 100;

  this.color = options.color || '#000000';
  // if the height and width are changed from the default, then
  // this will also need to be changed as it cant be calculated
  // dynamically.
  this.fontSize = options.fontSize || 138;

  this.scaled = function() {};

  this.draw = function(ext_ctx, target_height, target_width, x, y, color) {
    let h_ratio = target_height / this.height,
      w_ratio = target_width / this.width,
      prev_font = ext_ctx.font;
    ext_ctx.transform(w_ratio, 0, 0, h_ratio, x, y);
    ext_ctx.fillStyle = color || this.color;
    ext_ctx.textAlign = 'center';
    ext_ctx.font = `bold ${this.fontSize}px Arial`;

    ext_ctx.fillText(this.value, 0, 0);
    // restore the canvas settings
    ext_ctx.setTransform(1, 0, 0, 1, 0, 0);
    ext_ctx.fillStyle = '#000000';
    ext_ctx.font = prev_font;
  };
}

function ConsensusColors() {
  this.grey = '#7a7a7a';

  function arbitrate(threshold, scoreref) {
    let bestclass = '.',
      bestscore = 0,
      type = null,
      a = null,
      b = null,
      classSize = {
        '.': 20,
        h: 11,
        '+': 3,
        '-': 2,
        o: 2,
        p: 2,
      };

    for (type in scoreref) {
      if (scoreref.hasOwnProperty(type)) {
        if (scoreref[type] >= threshold) {
          a = classSize[type] || 1;
          b = classSize[bestclass] || 1;

          if (a < b) {
            bestclass = type;
            bestscore = scoreref[type];
          } else if (a === b) {
            if (scoreref[type] > bestscore) {
              bestclass = type;
              bestscore = scoreref[type];
            }
          }
        }
      }
    }
    return bestclass;
  }

  this.check_PG = function(pos, consensuses, colorsRef) {
    colorsRef[pos].P = '#ffff11';
    colorsRef[pos].G = '#ff7f11';
    return 1;
  };

  this.check_R = function(pos, consensuses, colorsRef) {
    colorsRef[pos].R = this.grey;

    let red = '#FF9999',
      letters = ['Q', 'K', 'R'],
      i = 0;

    for (i = 0; i < letters.length; i++) {
      if (consensuses['0.85'][pos] === letters[i]) {
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

    let green = '#99FF99',
      letters = ['Q', 'T', 'K', 'R'],
      i = 0;

    if (
      consensuses['0.50'][pos] === 'b' ||
      consensuses['0.50'][pos] === 'E' ||
      consensuses['0.50'][pos] === 'Q'
    ) {
      colorsRef[pos].Q = green;
      return 1;
    }

    for (i = 0; i < letters.length; i++) {
      if (consensuses['0.85'][pos] === letters[i]) {
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

    const green = '#99FF99';

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

    let red = '#FF9999',
      letters = ['K', 'R', 'Q'],
      i = 0;

    if (
      consensuses['0.60'][pos] === '+' ||
      consensuses['0.60'][pos] === 'R' ||
      consensuses['0.60'][pos] === 'K'
    ) {
      colorsRef[pos].K = red;
      return 1;
    }

    for (i = 0; i < letters.length; i++) {
      if (consensuses['0.85'][pos] === letters[i]) {
        colorsRef[pos].K = red;
        return 1;
      }
    }
    return 1;
  };

  this.check_E = function(pos, consensuses, colorsRef) {
    colorsRef[pos].E = this.grey;

    let red = '#FF9999',
      letters = ['D', 'E'],
      i = 0;

    if (
      consensuses['0.60'][pos] === '+' ||
      consensuses['0.60'][pos] === 'R' ||
      consensuses['0.60'][pos] === 'K'
    ) {
      colorsRef[pos].E = red;
      return 1;
    }

    for (i = 0; i < letters.length; i++) {
      if (consensuses['0.85'][pos] === letters[i]) {
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

    let red = '#FF9999',
      letters = ['D', 'E', 'N'],
      i = 0;

    if (
      consensuses['0.60'][pos] === '+' ||
      consensuses['0.60'][pos] === 'R' ||
      consensuses['0.60'][pos] === 'K'
    ) {
      colorsRef[pos].D = red;
      return 1;
    }

    for (i = 0; i < letters.length; i++) {
      if (consensuses['0.85'][pos] === letters[i]) {
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
    let aa = ['A', 'C', 'F', 'L', 'I', 'M', 'V', 'W'],
      caa = ['A', 'C', 'F', 'H', 'I', 'L', 'M', 'V', 'W', 'Y', 'P', 'Q', 'h'],
      i = 0,
      j = 0;

    for (i = 0; i < aa.length; i++) {
      colorsRef[pos][aa[i]] = this.grey;
      for (j = 0; j < caa.length; j++) {
        if (consensuses['0.60'][pos] === caa[j]) {
          colorsRef[pos][aa[i]] = '#9999FF';
        }
      }
    }
    return 1;
  };

  this.check_ST = function(pos, consensuses, colorsRef) {
    colorsRef[pos].S = this.grey;
    colorsRef[pos].T = this.grey;

    let letters = ['A', 'C', 'F', 'H', 'I', 'L', 'M', 'V', 'W', 'Y', 'P', 'Q'],
      i = 0;

    if (
      consensuses['0.50'][pos] === 'a' ||
      consensuses['0.50'][pos] === 'S' ||
      consensuses['0.50'][pos] === 'T'
    ) {
      colorsRef[pos].S = '#99FF99';
      colorsRef[pos].T = '#99FF99';
      return 1;
    }

    for (i = 0; i < letters.length; i++) {
      if (consensuses['0.85'][pos] === letters[i]) {
        colorsRef[pos].S = '#99FF99';
        colorsRef[pos].T = '#99FF99';
        return 1;
      }
    }
  };

  this.check_HY = function(pos, consensuses, colorsRef) {
    colorsRef[pos].H = this.grey;
    colorsRef[pos].Y = this.grey;

    let letters = [
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
      ],
      i = 0,
      cyan = '#99FFFF';

    if (consensuses['0.60'][pos] === 'h') {
      colorsRef[pos].H = cyan;
      colorsRef[pos].Y = cyan;
      return 1;
    }

    for (i = 0; i < letters.length; i++) {
      if (consensuses[0.85][pos] === letters[i]) {
        colorsRef[pos].H = cyan;
        colorsRef[pos].Y = cyan;
        return 1;
      }
    }

    return 1;
  };

  this.color_map = function(probs_array) {
    let thresholds = ['0.50', '0.60', '0.80', '0.85'],
      hydro = {
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
      },
      polar = { Q: 1, N: 1 },
      positive = { K: 1, R: 1, H: 1 },
      alcohol = { S: 1, T: 1 },
      negative = { E: 1, D: 1 },
      cons = {},
      colors = [],
      i = 0,
      c = 0,
      t = 0,
      a = 0,
      aa = [],
      column = null,
      score = {},
      consensusCol = null,
      threshold = null;

    for (c = 0; c < probs_array.length; c++) {
      column = probs_array[c];
      for (t = 0; t < thresholds.length; t++) {
        threshold = thresholds[t];
        score = {
          p: 0,
          o: 0,
          '-': 0,
          '+': 0,
          h: 0,
        };
        for (a = 0; a < column.length; a++) {
          aa = [];
          aa = column[a].split(':');
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

    for (i = 0; i < probs_array.length; i++) {
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
}

function HMMLogo(element, options) {
  options = options || {};

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
    A: '#FF9966',
    C: '#009999',
    D: '#FF0000',
    E: '#CC0033',
    F: '#00FF00',
    G: '#f2f20c',
    H: '#660033',
    I: '#CC9933',
    K: '#663300',
    L: '#FF9933',
    M: '#CC99CC',
    N: '#336666',
    P: '#0099FF',
    Q: '#6666CC',
    R: '#990000',
    S: '#0000FF',
    T: '#00FFFF',
    V: '#FFCC33',
    W: '#66CC66',
    Y: '#006600',
  };

  // set the color library to use.
  this.colors = this.dna_colors;

  if (this.alphabet === 'aa') {
    this.colors = this.aa_colors;
  }

  this.canvas_width = 5000;

  let letter = null,
    probs_arr = null,
    loptions = null,
    cc = null;

  if (this.alphabet === 'aa') {
    probs_arr = this.data.probs_arr;
    if (probs_arr) {
      cc = new ConsensusColors();
      this.cmap = cc.color_map(probs_arr);
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

  function draw_small_insert(
    context,
    x,
    y,
    col_width,
    in_odds,
    in_length,
    del_odds,
    show_inserts,
  ) {
    let fill = '#ffffff';
    if (show_inserts) {
      if (in_odds > 0.1) {
        fill = '#d7301f';
      } else if (in_odds > 0.05) {
        fill = '#fc8d59';
      } else if (in_odds > 0.03) {
        fill = '#fdcc8a';
      }
      context.fillStyle = fill;
      context.fillRect(x, y + 15, col_width, 10);

      fill = '#ffffff';
      // draw insert length
      if (in_length > 9) {
        fill = '#d7301f';
      } else if (in_length > 7) {
        fill = '#fc8d59';
      } else if (in_length > 4) {
        fill = '#fdcc8a';
      }
      context.fillStyle = fill;
      context.fillRect(x, y + 30, col_width, 10);
    } else {
      y += 30;
    }

    fill = '#ffffff';
    // draw delete odds
    if (del_odds < 0.75) {
      fill = '#2171b5';
    } else if (del_odds < 0.85) {
      fill = '#6baed6';
    } else if (del_odds < 0.95) {
      fill = '#bdd7e7';
    }
    context.fillStyle = fill;
    context.fillRect(x, y, col_width, 10);
  }

  function draw_border(context, y, width) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.lineWidth = 1;
    context.strokeStyle = '#999999';
    context.stroke();
  }

  function draw_ticks(context, x, y, height, color) {
    color = color || '#999999';
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y + height);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
  }
  function draw_box(context, x, y, col_width, color, border) {
    color = color || 'rgba(100,100,100, 0.2)';
    border = border || 'rgba(100,100,100, 0.8)';
    context.fillStyle = color;
    context.strokeStyle = border;
    context.fillRect(x, y, col_width, feature_height);
    context.strokeRect(x, y, col_width, feature_height);
  }
  function draw_line(context, x1, y1, x2, y2, color) {
    color = color || 'rgba(100,100,100, 0.8)';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
  }

  function draw_rect_with_text(
    context,
    x,
    y,
    text,
    fontsize,
    col_width,
    fill,
    textfill,
  ) {
    context.font = `${fontsize}px Arial`;
    context.fillStyle = fill;
    context.fillRect(x, y - 10, col_width, 14);
    context.textAlign = 'center';
    context.fillStyle = textfill;
    context.fillText(text, x + col_width / 2, y);
  }

  function draw_insert_odds(context, x, height, col_width, text, fontsize) {
    let y = height - 20,
      fill = '#ffffff',
      textfill = '#555555';

    if (text > 0.1) {
      fill = '#d7301f';
      textfill = '#ffffff';
    } else if (text > 0.05) {
      fill = '#fc8d59';
    } else if (text > 0.03) {
      fill = '#fdcc8a';
    }

    draw_rect_with_text(
      context,
      x,
      y,
      text,
      fontsize,
      col_width,
      fill,
      textfill,
    );

    // draw vertical line to indicate where the insert would occur
    if (text > 0.03) {
      draw_ticks(context, x + col_width, height - 30, -30 - height, fill);
    }
  }

  function draw_insert_length(context, x, y, col_width, text, fontsize) {
    let fill = '#ffffff',
      textfill = '#555555';

    if (text > 9) {
      fill = '#d7301f';
      textfill = '#ffffff';
    } else if (text > 7) {
      fill = '#fc8d59';
    } else if (text > 4) {
      fill = '#fdcc8a';
    }
    draw_rect_with_text(
      context,
      x,
      y,
      text,
      fontsize,
      col_width,
      fill,
      textfill,
    );
  }

  function draw_delete_odds(
    context,
    x,
    height,
    col_width,
    text,
    fontsize,
    show_inserts,
  ) {
    let y = height - 4,
      fill = '#ffffff',
      textfill = '#555555';

    if (show_inserts) {
      y = height - 35;
    }

    if (text < 0.75) {
      fill = '#2171b5';
      textfill = '#ffffff';
    } else if (text < 0.85) {
      fill = '#6baed6';
    } else if (text < 0.95) {
      fill = '#bdd7e7';
    }

    draw_rect_with_text(
      context,
      x,
      y,
      text,
      fontsize,
      col_width,
      fill,
      textfill,
    );
  }

  function draw_column_number(
    context,
    x,
    y,
    col_width,
    col_num,
    fontsize,
    right,
  ) {
    context.font = `${fontsize}px Arial`;
    context.textAlign = right ? 'right' : 'center';
    context.fillStyle = '#666666';
    context.fillText(col_num, x + col_width / 2, y);
  }

  function attach_canvas(DOMid, height, width, id, canv_width) {
    let canvas = $(DOMid).find(`#canv_${id}`);

    if (!canvas.length) {
      $(DOMid).append(
        `<canvas className=${styles.canvas_logo} id="canv_${id}"  height="${height}" width="${width}" style="left:${canv_width *
          id}px"></canvas>`,
      );
      canvas = $(DOMid).find(`#canv_${id}`);
    }

    $(canvas).attr('width', width).attr('height', height);

    if (!canvasSupport()) {
      canvas[0] = G_vmlCanvasManager.initElement(canvas[0]);
    }

    return canvas[0];
  }

  // the main render function that draws the logo based on the provided options.
  this.render = function(options) {
    if (!this.data) {
      return;
    }
    options = options || {};
    let zoom = options.zoom || this.zoom,
      target = options.target || 1,
      scaled = options.scaled || null,
      parent_width = this.dom_element.parentNode.clientWidth,
      max_canvas_width = 1,
      end = null,
      start = null,
      i = 0;

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
    if (parent_width > this.max_width) {
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
      while (this.total_width < parent_width) {
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

    const canvas_count = Math.ceil(this.total_width / this.canvas_width);
    this.columns_per_canvas = Math.ceil(this.canvas_width / this.zoomed_column);

    if (this.previous_zoom !== this.zoom) {
      for (let canvasElement of this.dom_element.getElementsByTagName(
        'canvas',
      )) {
        canvasElement.remove();
      }
      this.previous_zoom = this.zoom;
      this.rendered = [];
    }

    this.canvases = [];
    this.contexts = [];

    for (i = 0; i < canvas_count; i++) {
      let split_start = this.columns_per_canvas * i + start,
        split_end = split_start + this.columns_per_canvas - 1;
      if (split_end > end) {
        split_end = end;
      }

      const adjusted_width = (split_end - split_start + 1) * this.zoomed_column;

      if (adjusted_width > max_canvas_width) {
        max_canvas_width = adjusted_width;
      }

      let canv_start = max_canvas_width * i,
        canv_end = canv_start + adjusted_width;

      if (
        target < canv_end + canv_end / 2 &&
        target > canv_start - canv_start / 2
      ) {
        // Check that we aren't redrawing the canvas and if not, then attach it and draw.
        if (this.rendered[i] !== 1) {
          this.canvases[i] = attach_canvas(
            this.dom_element,
            this.height,
            adjusted_width,
            i,
            max_canvas_width,
          );
          this.contexts[i] = this.canvases[i].getContext('2d');
          this.contexts[i].setTransform(1, 0, 0, 1, 0, 0);
          this.contexts[i].clearRect(0, 0, adjusted_width, this.height);
          this.contexts[i].fillStyle = '#ffffff';
          this.contexts[i].fillRect(0, 0, canv_end, this.height);

          if (this.zoomed_column > 12) {
            let fontsize = parseInt(10 * zoom, 10);
            fontsize = fontsize > 10 ? 10 : fontsize;
            if (this.debug) {
              this.render_with_rects(split_start, split_end, i, 1);
            }
            this.render_with_text(split_start, split_end, i, fontsize);
          } else {
            this.render_with_rects(split_start, split_end, i);
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
      if (canvasSupport()) {
        let logo_graphic = this.called_on.getElementsByClassName(
          styles.logo_graphic,
        )[0];
        this.scrollme = new EasyScroller(logo_graphic, {
          scrollingX: 1,
          scrollingY: 0,
          eventTarget: this.called_on,
        });
      }
    }

    if (target !== 1 && canvasSupport()) {
      this.scrollme.reflow();
    }
    return;
  };

  this.render_x_axis_label = function() {
    let label = 'Model Position';
    if (this.display_ali_map) {
      label = 'Alignment Column';
    }

    for (let xElement of this.called_on.getElementsByClassName(
      styles.logo_xaxis,
    )) {
      xElement.remove();
    }
    let axisDiv = document.createElement('div');
    axisDiv.classList.add(styles.logo_xaxis);
    let axisP = document.createElement('p');
    axisP.classList.add(styles.xaxis_text);
    axisP.innerHTML = label;
    axisDiv.appendChild(axisP);
    this.called_on.insertBefore(
      axisDiv,
      this.called_on.getElementsByClassName(styles.logo_container)[0],
    );
  };

  this.render_y_axis_label = function() {
    // attach a canvas for the y-axis
    for (let yElement of this.called_on.getElementsByClassName(
      styles.logo_yaxis,
    )) {
      yElement.remove();
    }

    for (let xAxis of this.called_on.getElementsByClassName(
      styles.logo_xaxis,
    )) {
      let canvas = document.createElement('canvas');
      canvas.classList.add(styles.logo_yaxis);
      canvas.height = 302;
      canvas.width = 55;
      xAxis.appendChild(canvas);
      let top_pix_height = 0,
        bottom_pix_height = 0,
        top_height = Math.abs(this.data.max_height),
        bottom_height = isNaN(this.data.min_height_obs)
          ? 0
          : parseInt(this.data.min_height_obs, 10),
        context = null,
        axis_label = 'Information Content (bits)';
      if (!canvasSupport()) {
        canvas = G_vmlCanvasManager.initElement(canvas);
      }

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
      context.strokeStyle = '#666666';
      context.stroke();

      // draw the label text
      context.fillStyle = '#666666';
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
        axis_label = 'Score (bits)';
      }

      context.save();
      context.translate(5, this.height / 2 - 20);
      context.rotate(-Math.PI / 2);
      context.textAlign = 'center';
      context.font = 'normal 12px Arial';
      context.fillText(axis_label, 1, 0);
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

  this.render_with_text = function(start, end, context_num, fontsize) {
    let x = 0,
      column_num = start,
      column_label = null,
      i = 0,
      top_height = Math.abs(this.data.max_height),
      bottom_height = isNaN(this.data.min_height_obs)
        ? 0
        : parseInt(this.data.min_height_obs, 10),
      total_height = top_height + Math.abs(bottom_height),
      top_percentage = Math.round(
        Math.abs(this.data.max_height) * 100 / total_height,
      ),
      // convert % to pixels
      top_pix_height = Math.round(
        this.info_content_height * top_percentage / 100,
      ),
      bottom_pix_height = this.info_content_height - top_pix_height,
      // this is used to transform the 256px high letters into the correct size
      // when displaying negative values, so that they fit above the 0 line.
      top_pix_conversion = top_pix_height / this.info_content_height,
      bottom_pix_conversion = bottom_pix_height / this.info_content_height;

    // add 3 extra columns so that numbers don't get clipped at the end of a canvas
    // that ends before a large column. DF0000830 was suffering at zoom level 0.6,
    // column 2215. This adds a little extra overhead, but is the easiest fix for now.
    if (end + 3 <= this.end) {
      end += 3;
    }

    for (i = start; i <= end; i++) {
      if (this.data.mmline && this.data.mmline[i - 1] === 1) {
        this.contexts[context_num].fillStyle = '#cccccc';
        this.contexts[context_num].fillRect(
          x,
          10,
          this.zoomed_column,
          this.height - 40,
        );
      } else {
        let column = this.data.height_arr[i - 1],
          col_positions = [];
        if (column) {
          let previous_height = 0,
            letters = column.length,
            previous_neg_height = top_pix_height,
            j = 0,
            color = null;

          for (j = 0; j < letters; j++) {
            let letter = column[j],
              values = letter.split(':', 2),
              x_pos = x + this.zoomed_column / 2,
              letter_height = null;

            // we don't render anything with a value between 0 and 0.01. These
            // letters would be too small to be meaningful on any scale, so we
            // just squash them out.
            if (values[1] > 0.01) {
              letter_height = parseFloat(values[1]) / this.data.max_height;
              let y_pos = this.info_content_height - 2 - previous_height,
                glyph_height = (this.info_content_height - 2) * letter_height;

              // The positioning in IE is off, so we need to modify the y_pos when
              // canvas is not supported and we are using VML instead.
              if (!canvasSupport()) {
                y_pos += glyph_height * (letter_height / 2);
              }

              col_positions[j] = [
                glyph_height,
                this.zoomed_column,
                x_pos,
                y_pos,
              ];
              previous_height += glyph_height;
            }
          }

          // render the letters in reverse order so that the larger letters on the top
          // don't clobber the smaller letters below them.
          for (j = letters; j >= 0; j--) {
            if (col_positions[j] && this.letters[column[j][0]]) {
              if (this.colorscheme === 'consensus') {
                color = this.cmap[i - 1][column[j][0]] || '#7a7a7a';
              } else {
                color = null;
              }
              this.letters[column[j][0]].draw(
                this.contexts[context_num],
                col_positions[j][0],
                col_positions[j][1],
                col_positions[j][2],
                col_positions[j][3],
                color,
              );
            }
          }
        }
      }

      // if ali_coordinates exist and toggle is set then display the
      // alignment coordinates and not the model coordinates.
      if (this.display_ali_map) {
        column_label = this.data.ali_map[i - 1];
      } else {
        column_label = column_num;
      }

      if (this.zoom < 0.7) {
        if (i % 5 === 0) {
          this.draw_column_divider({
            context_num,
            x,
            fontsize: 10,
            column_num: column_label,
            ralign: true,
          });
        }
      } else {
        this.draw_column_divider({
          context_num,
          x,
          fontsize,
          column_num: column_label,
        });
      }

      draw_delete_odds(
        this.contexts[context_num],
        x,
        this.height,
        this.zoomed_column,
        this.data.delete_probs[i - 1],
        fontsize,
        this.show_inserts,
      );
      // draw insert length ticks
      draw_ticks(this.contexts[context_num], x, this.height - 15, 5);
      if (this.show_inserts) {
        draw_insert_odds(
          this.contexts[context_num],
          x,
          this.height,
          this.zoomed_column,
          this.data.insert_probs[i - 1],
          fontsize,
        );
        draw_insert_length(
          this.contexts[context_num],
          x,
          this.height - 5,
          this.zoomed_column,
          this.data.insert_lengths[i - 1],
          fontsize,
        );

        // draw delete probability ticks
        draw_ticks(this.contexts[context_num], x, this.height - 45, 5);
        // draw insert probability ticks
        draw_ticks(this.contexts[context_num], x, this.height - 30, 5);
      }

      if (this.show_active_sites) {
        this.render_active_sites(context_num, i, x);
      }

      x += this.zoomed_column;
      column_num++;
    }

    // draw other dividers
    if (this.show_inserts) {
      draw_border(
        this.contexts[context_num],
        this.height - 30,
        this.total_width,
      );
      draw_border(
        this.contexts[context_num],
        this.height - 45,
        this.total_width,
      );
    }
    draw_border(this.contexts[context_num], this.height - 15, this.total_width);
    draw_border(this.contexts[context_num], 0, this.total_width);
  };

  this.draw_column_divider = function(opts) {
    let div_x = opts.ralign ? opts.x + this.zoomed_column : opts.x,
      num_x = opts.ralign ? opts.x + 2 : opts.x;
    // draw column dividers
    draw_ticks(
      this.contexts[opts.context_num],
      div_x,
      this.height - 30,
      -30 - this.height,
      '#dddddd',
    );
    // draw top ticks
    draw_ticks(this.contexts[opts.context_num], div_x, 0, 5);
    // draw column numbers
    draw_column_number(
      this.contexts[opts.context_num],
      num_x,
      10,
      this.zoomed_column,
      opts.column_num,
      opts.fontsize,
      opts.ralign,
    );
  };

  this.render_with_rects = function(start, end, context_num, borders) {
    let x = 0,
      column_num = start,
      column_label = null,
      i = 0,
      top_height = Math.abs(this.data.max_height),
      bottom_height = Math.abs(this.data.min_height_obs),
      total_height = top_height + bottom_height,
      top_percentage = Math.round(
        Math.abs(this.data.max_height) * 100 / total_height,
      ),
      // convert % to pixels
      top_pix_height = Math.round(
        this.info_content_height * top_percentage / 100,
      ),
      bottom_pix_height = this.info_content_height - top_pix_height,
      mod = 10;

    for (i = start; i <= end; i++) {
      if (this.data.mmline && this.data.mmline[i - 1] === 1) {
        this.contexts[context_num].fillStyle = '#cccccc';
        this.contexts[context_num].fillRect(
          x,
          10,
          this.zoomed_column,
          this.height - 40,
        );
      } else {
        let column = this.data.height_arr[i - 1],
          previous_height = 0,
          previous_neg_height = top_pix_height,
          letters = column.length,
          j = 0;
        for (j = 0; j < letters; j++) {
          let letter = column[j],
            values = letter.split(':', 2);
          if (values[1] > 0.01) {
            let letter_height = parseFloat(values[1]) / this.data.max_height,
              x_pos = x,
              glyph_height = (this.info_content_height - 2) * letter_height,
              y_pos =
                this.info_content_height - 2 - previous_height - glyph_height,
              color = null;

            if (this.colorscheme === 'consensus') {
              color = this.cmap[i - 1][values[0]] || '#7a7a7a';
            } else {
              color = this.colors[values[0]];
            }

            if (borders) {
              this.contexts[context_num].strokeStyle = color;
              this.contexts[context_num].strokeRect(
                x_pos,
                y_pos,
                this.zoomed_column,
                glyph_height,
              );
            } else {
              this.contexts[context_num].fillStyle = color;
              this.contexts[context_num].fillRect(
                x_pos,
                y_pos,
                this.zoomed_column,
                glyph_height,
              );
            }

            previous_height += glyph_height;
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
        draw_ticks(
          this.contexts[context_num],
          x + this.zoomed_column,
          this.height - 30,
          parseFloat(this.height),
          '#dddddd',
        );
        // draw top ticks
        draw_ticks(this.contexts[context_num], x + this.zoomed_column, 0, 5);

        // if ali_coordinates exist and toggle is set then display the
        // alignment coordinates and not the model coordinates.
        if (this.display_ali_map) {
          column_label = this.data.ali_map[i - 1];
        } else {
          column_label = column_num;
        }
        // draw column numbers
        draw_column_number(
          this.contexts[context_num],
          x - 2,
          10,
          this.zoomed_column,
          column_label,
          10,
          true,
        );
      }

      // draw insert probabilities/lengths
      draw_small_insert(
        this.contexts[context_num],
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
        draw_border(
          this.contexts[context_num],
          this.height - 45,
          this.total_width,
        );
      } else {
        draw_border(
          this.contexts[context_num],
          this.height - 15,
          this.total_width,
        );
      }

      draw_border(this.contexts[context_num], 0, this.total_width);

      if (this.show_active_sites) {
        this.render_active_sites(context_num, i, x);
      }

      x += this.zoomed_column;
      column_num++;
    }
  };
  this.render_active_sites = function(context_num, i, x) {
    let track = 1;
    for (let j = 0; j < this.active_sites.length; j++) {
      const wtd = this.active_sites[j].controller.whatShouldBeDraw(i);
      if (wtd == null) continue;
      const color = this.aa_colors[wtd.base];
      if (wtd.type == 'BLOCK') {
        draw_box(
          this.contexts[context_num],
          x + 1,
          margin_to_features +
            track * (padding_between_tracks + feature_height),
          this.zoomed_column - 2,
          color,
        );
      } else if (wtd.type == 'LINE') {
        draw_line(
          this.contexts[context_num],
          x,
          margin_to_features +
            padding_between_tracks * track +
            (track + 0.5) * feature_height,
          x + this.zoomed_column,
          margin_to_features +
            padding_between_tracks * track +
            (track + 0.5) * feature_height,
          color,
        );
      }
      if (this.multiple_tracks) track++;
    }
  };

  this.toggle_colorscheme = function(scheme) {
    // work out the current column we are on so we can return there
    const col_total = this.current_column();

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
    this.scrollToColumn(col_total + 1);
    // scroll back to the location we started at.
    this.scrollToColumn(col_total);
  };

  this.toggle_scale = function(scale) {
    // work out the current column we are on so we can return there
    const col_total = this.current_column();

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
    $(this.called_on).find('.logo_yaxis').remove();
    this.render_y_axis_label();

    // re-flow and re-render the content
    this.scrollme.reflow();
    // scroll off by one to force a render of the canvas.
    this.scrollToColumn(col_total + 1);
    // scroll back to the location we started at.
    this.scrollToColumn(col_total);
  };

  this.toggle_ali_map = function(coords) {
    // work out the current column we are on so we can return there
    const col_total = this.current_column();

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
    this.scrollToColumn(col_total + 1);
    // scroll back to the location we started at.
    this.scrollToColumn(col_total);
  };

  this.current_column = function() {
    let before_left = this.scrollme.scroller.getValues().left,
      col_width = this.column_width * this.zoom,
      col_count = before_left / col_width,
      half_visible_columns =
        this.called_on.getElementsByClassName(styles.logo_container)[0]
          .clientWidth /
        col_width /
        2,
      col_total = Math.ceil(col_count + half_visible_columns);
    return col_total;
  };

  this.change_zoom = function(options) {
    let zoom_level = 0.3,
      expected_width = null;
    if (options.target) {
      zoom_level = options.target;
    } else if (options.distance) {
      zoom_level = (parseFloat(this.zoom) -
        parseFloat(options.distance)).toFixed(1);
      if (options.direction === '+') {
        zoom_level = (parseFloat(this.zoom) +
          parseFloat(options.distance)).toFixed(1);
      }
    }

    if (zoom_level > 1) {
      zoom_level = 1;
    } else if (zoom_level < 0.1) {
      zoom_level = 0.1;
    }

    // see if we need to zoom or not
    let graphicalElement = this.called_on.getElementsByClassName(
      styles.logo_graphic,
    )[0];
    let containerElement = this.called_on.getElementsByClassName(
      styles.logo_container,
    )[0];
    expected_width = graphicalElement.clientWidth * zoom_level / this.zoom;
    if (expected_width > containerElement.clientWidth) {
      // if a center is not specified, then use the current center of the view
      if (!options.column) {
        // work out my current position
        const col_total = this.current_column();

        this.zoom = zoom_level;
        this.render({ zoom: this.zoom });
        this.scrollme.reflow();

        // scroll to previous position
        this.scrollToColumn(col_total);
      } else {
        // center around the mouse click position.
        this.zoom = zoom_level;
        this.render({ zoom: this.zoom });
        this.scrollme.reflow();

        const coords = this.coordinatesFromColumn(options.column);
        this.scrollme.scroller.scrollTo(coords - options.offset);
      }
    }
    return this.zoom;
  };

  this.columnFromCoordinates = function(x) {
    const column = Math.ceil(x / (this.column_width * this.zoom));
    return column;
  };

  this.coordinatesFromColumn = function(col) {
    let new_column = col - 1,
      x =
        new_column * (this.column_width * this.zoom) +
        this.column_width * this.zoom / 2;
    return x;
  };

  this.scrollToColumn = function(num, animate) {
    let half_view =
        this.called_on.getElementsByClassName(styles.logo_container)[0]
          .clientWidth / 2,
      new_left = this.coordinatesFromColumn(num);
    this.scrollme.scroller.scrollTo(new_left - half_view, 0, animate);
  };
}

let hmm_logo = function(logoElement, options) {
  let logo = null;
  if (canvasSupport()) {
    options = options || {};

    // add some internal divs for scrolling etc.
    let logo_graphic = document.createElement('div');
    logo_graphic.classList.add(styles.logo_graphic);

    let logo_container = document.createElement('div');
    logo_container.classList.add(styles.logo_container);

    let logo_divider = document.createElement('div');
    logo_divider.classList.add(styles.logo_divider);

    logoElement.appendChild(logo_container);
    logo_container.appendChild(logo_graphic);
    logoElement.appendChild(logo_divider);

    if (!options.data) {
      options.data = JSON.parse(logoElement.getAttribute('data-logo'));
    }

    if (options.data === null) {
      return;
    }

    options.dom_element = logo_graphic;
    options.called_on = logoElement;

    let zoom = options.zoom || 0.4;

    let fieldset = document.createElement('fieldset');

    let label = document.createElement('label');
    label.htmlFor = 'position';
    label.innerHTML = 'Column number';
    fieldset.appendChild(label);

    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.id = 'position';
    input.classList.add(styles.logo_position);
    fieldset.appendChild(input);

    let logoChangeButton = document.createElement('button');
    logoChangeButton.classList.add(styles.button);
    logoChangeButton.classList.add(styles.logo_change);
    logoChangeButton.innerHTML = 'Go';
    fieldset.appendChild(logoChangeButton);

    let form = document.createElement('form');
    form.classList.add(styles.logo_form);
    form.appendChild(fieldset);

    let controls = document.createElement('div');
    controls.classList.add(styles.logo_controls);
    form.appendChild(controls);

    let close = document.createElement('span');
    close.classList.add(styles.close);
    close.innerHTML = 'x';

    let settings = document.createElement('div');
    settings.classList.add(styles.logo_settings);
    settings.appendChild(close);
    controls.appendChild(settings);

    logo = new HMMLogo(logoElement, options);
    logo.render(options);

    if (logo.zoom_enabled) {
      let outButton = document.createElement('button');
      outButton.classList.add(styles.button);
      outButton.classList.add(styles.logo_zoomout);
      outButton.innerHTML = '-';
      let inButton = document.createElement('button');
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
      let obs_checked = '',
        theory_checked = '',
        theory_help = '',
        obs_help = '';

      if (logo.data.max_height_obs === logo.data.max_height) {
        obs_checked = 'checked';
      } else {
        theory_checked = 'checked';
      }

      /*
      if (options.help) {
        obs_help =
          '<a class="help" href="/help#scale_obs" title="Set the y-axis maximum to the maximum observed height.">' +
          '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
        theory_help =
          '<a class="help" href="/help#scale_theory" title="Set the y-axis maximum to the theoretical maximum height">' +
          '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
      }
      */

      const scale_controls =
        '<fieldset><legend>Scale</legend>' +
        `<label><input type="radio" name="scale" class="${styles.logo_scale}" value="obs" ${obs_checked}/>Maximum Observed ${obs_help}</label></br>` +
        `<label><input type="radio" name="scale" class="${styles.logo_scale}" value="theory" ${theory_checked}/>Maximum Theoretical ${theory_help}</label>` +
        '</fieldset>';

      settings.innerHTML = scale_controls;
    }

    if (
      logo.data.height_calc !== 'score' &&
      logo.data.alphabet === 'aa' &&
      logo.data.probs_arr
    ) {
      let def_color = null,
        con_color = null,
        def_help = '',
        con_help = '';

      if (logo.colorscheme === 'default') {
        def_color = 'checked';
      } else {
        con_color = 'checked';
      }

      /*
      if (options.help) {
        def_help =
          '<a class="help" href="/help#colors_default" title="Each letter receives its own color.">' +
          '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
        con_help =
          '<a class="help" href="/help#colors_consensus" title="Letters are colored as in Clustalx and Jalview, with colors depending on composition of the column.">' +
          '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
      }
      */

      const color_controls =
        '<fieldset><legend>Color Scheme</legend>' +
        `<label><input type="radio" name="color" class=${styles.logo_color}" value="default" ${def_color}/>Default ${def_help}</label></br>` +
        `<label><input type="radio" name="color" class=${styles.logo_color}" value="consensus" ${con_color}/>Consensus Colors ${con_help}</label>` +
        '</fieldset>';
      settings.innerHTML += color_controls;
    }

    if (logo.data.ali_map) {
      let mod_checked = null,
        ali_checked = null,
        mod_help = '',
        ali_help = '',
        family_accession = '';

      if (logo.display_ali_map === 0) {
        mod_checked = 'checked';
      } else {
        ali_checked = 'checked';
      }

      /*
      if (options.help) {
        mod_help =
          '<a class="help" href="/help#coords_model" title="The coordinates along the top of the plot show the model position.">' +
          '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
        ali_help =
          '<a class="help" href="/help#coords_ali" title="The coordinates along the top of the plot show the column in the alignment associated with the model">' +
          '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
      }
      */

      const ali_controls =
        '<fieldset><legend>Coordinates</legend>' +
        `<label><input type="radio" name="coords" class="${styles.logo_ali_map}" value="model" ${mod_checked}/>Model ${mod_help}</label></br>` +
        `<label><input type="radio" name="coords" class="${styles.logo_ali_map}" value="alignment" ${ali_checked}/>Alignment ${ali_help}</label>` +
        '</fieldset>';
      settings.innerHTML += ali_controls;

      if (
        logo.active_sites_sources != null &&
        typeof logo.active_sites_sources === 'object'
      ) {
        let active_sites =
          '<fieldset><legend>ActiveSites</legend>' +
          `<label>Source: <select name="member_db" class="${styles.logo_ali_map}">`;
        for (const key of Object.keys(logo.active_sites_sources)) {
          active_sites += `<option value="${key}">${key}</option> `;
        }
        active_sites +=
          '</select></label> ' + // + mod_help +
          '</br>' +
          '<label>Accession number: ' +
          `   <input type="text" name="family_accession" class="${styles.logo_ali_map}" value="${family_accession}"/>` +
          '</label><br/>' +
          '<button id="active_sites">Get Active Sites</button>' +
          '</fieldset>';

        settings.innerHTML += active_sites;
      }
    }

    if (settings.children.length > 0) {
      let settingsButton = document.createElement('button');
      settingsButton.innerHTML = 'Settings';
      settingsButton.classList.add(styles.logo_settings_switch);
      settingsButton.classList.add(styles.button);
      -controls.appendChild(settingsButton);
      controls.appendChild(settings);
    }

    form.appendChild(controls);
    logoElement.appendChild(form);

    for (let name of [
      styles.logo_settings_switch,
      styles.logo_settings,
      styles.close,
    ]) {
      for (let element of logoElement.getElementsByClassName(name)) {
        element.addEventListener('click', function(e) {
          e.preventDefault();
          if (
            settings.style.display != 'none' &&
            settings.style.display != ''
          ) {
            settings.style.display = 'none';
          } else {
            settings.style.display = 'block';
          }
        });
      }
    }
    for (let matchedElement of document.getElementsByClassName(
      styles.logo_reset,
    )) {
      matchedElement.addEventListener('click', function(e) {
        e.preventDefault();
        const hmm_logo = logo;
        hmm_logo.change_zoom({ target: hmm_logo.default_zoom });
      });
    }
    for (let matchedElement of document.getElementsByClassName(
      styles.logo_change,
    )) {
      matchedElement.addEventListener('click', function(e) {
        e.preventDefault();
      });
    }
    for (let matchedElement of document.getElementsByClassName(
      styles.logo_zoomin,
    )) {
      matchedElement.addEventListener('click', function(e) {
        e.preventDefault();
        const hmm_logo = logo;
        hmm_logo.change_zoom({ distance: 0.1, direction: '+' });
      });
    }
    for (let matchedElement of document.getElementsByClassName(
      styles.logo_zoomout,
    )) {
      matchedElement.addEventListener('click', function(e) {
        e.preventDefault();
        const hmm_logo = logo;
        hmm_logo.change_zoom({ distance: 0.1, direction: '-' });
      });
    }
    for (let matchedElement of document.getElementsByClassName(
      styles.logo_scale,
    )) {
      matchedElement.addEventListener('change', function(e) {
        const hmm_logo = logo;
        hmm_logo.toggle_scale(this.value); //MAQ pass correct argument
      });
    }
    for (let matchedElement of document.getElementsByClassName(
      styles.logo_color,
    )) {
      matchedElement.addEventListener('change', function(e) {
        const hmm_logo = logo;
        hmm_logo.toggle_colorscheme(this.value); //MAQ pass correct argument
      });
    }
    for (let matchedElement of document.getElementsByClassName(
      styles.logo_ali_map,
    )) {
      matchedElement.addEventListener('change', function(e) {
        const hmm_logo = logo;
        hmm_logo.toggle_ali_map(this.value);
      });
    }
    for (let matchedElement of document.getElementsByClassName(
      styles.logo_position,
    )) {
      matchedElement.addEventListener('change', function(e) {
        const hmm_logo = logo;
        if (!this.value.match(/^\d+$/m)) {
          return;
        }
        hmm_logo.scrollToColumn(this.value, 1);
      });
    }
    logo_graphic.addEventListener('dblclick', function(e) {
      // need to get coordinates of mouse click
      let hmm_logo = logo,
        offset = $(this).offset(),
        x = parseInt(e.pageX - offset.left, 10),
        // get mouse position in the window
        window_position = e.pageX - $(this).parent().offset().left,
        // get column number
        col = hmm_logo.columnFromCoordinates(x),
        // choose new zoom level and zoom in.
        current = hmm_logo.zoom;

      if (current < 1) {
        hmm_logo.change_zoom({
          target: 1,
          offset: window_position,
          column: col,
        });
      } else {
        hmm_logo.change_zoom({
          target: 0.3,
          offset: window_position,
          column: col,
        });
      }

      return;
    });

    if (options.column_info) {
      logo_graphic.addEventListener('click', function(e) {
        let hmm_logo = logo,
          info_tab = $('<table class="logo_col_info"></table>'),
          header = '<tr>',
          tbody = '',
          offset = $(this).offset(),
          x = parseInt(e.pageX - offset.left, 10),
          // get mouse position in the window
          window_position = e.pageX - $(this).parent().offset().left,
          // get column number
          col = hmm_logo.columnFromCoordinates(x),
          // clone the column data before reversal or the column gets messed
          // up in the logo when zoom levels change. Also stops flip-flopping
          // of the order from ascending to descending.
          col_data = [],
          info_cols = 0,
          i = 0,
          j = 0,
          height_header = 'Probability';

        if (logo.data.height_calc && logo.data.height_calc === 'score') {
          height_header = 'Score';
          col_data = logo.data.height_arr[col - 1].slice(0).reverse();
        } else {
          col_data = logo.data.probs_arr[col - 1].slice(0).reverse();
        }

        info_cols = Math.ceil(col_data.length / 5);
        // add the headers for each column.
        for (i = 0; i < info_cols; i++) {
          // using the i < info_cols - 1 check to make sure the last column doesn't
          // get marked with the odd class so we don't get a border on the edge of the table.
          if (info_cols > 1 && i < info_cols - 1) {
            header += `<th>Residue</th><th class="odd">${height_header}</th>`;
          } else {
            header += `<th>Residue</th><th>${height_header}</th>`;
          }
        }

        header += '</tr>';
        info_tab.append($(header));

        // add the data for each column
        for (i = 0; i < 5; i++) {
          tbody += '<tr>';
          j = i;
          while (col_data[j]) {
            let values = col_data[j].split(':', 2),
              color = '';
            if (logo.colorscheme === 'default') {
              color = `${logo.alphabet}_${values[0]}`;
            }
            // using the j < 15 check to make sure the last column doesn't get marked
            // with the odd class so we don't get a border on the edge of the table.
            if (info_cols > 1 && j < 15) {
              tbody += `<td class="${color}"><div></div>${values[0]}</td><td class="odd">${values[1]}</td>`;
            } else {
              tbody += `<td class="${color}"><div></div>${values[0]}</td><td>${values[1]}</td>`;
            }

            j += 5;
          }
          tbody += '</tr>';
        }

        info_tab.append($(tbody));

        $(options.column_info)
          .empty()
          .append(
            $(
              `<p> Column:${col}</p><div><p>Occupancy: ${logo.data.delete_probs[
                col - 1
              ]}</p><p>Insert Probability: ${logo.data.insert_probs[
                col - 1
              ]}</p><p>Insert Length: ${logo.data.insert_lengths[
                col - 1
              ]}</p></div>`,
            ),
          )
          .append(info_tab)
          .show();
      });
    }

    /*
    document.addEventListener(`${this.attr('id')}.scrolledTo`, (e, left, top, zoom) => {
      const hmm_logo = logo;
      hmm_logo.render({ target: left });
    });
    */
    document.addEventListener('keydown', e => {
      if (!e.ctrlKey) {
        if (e.which === 61 || e.which === 107) {
          zoom += 0.1;
          logo.change_zoom({ distance: 0.1, direction: '+' });
        }
        if (e.which === 109 || e.which === 0) {
          zoom -= 0.1;
          logo.change_zoom({ distance: 0.1, direction: '-' });
        }
      }
    });
  } else {
    document.getElementById('logo').replaceWith($('#no_canvas').html());
  }

  return logo;
};

export default hmm_logo;
