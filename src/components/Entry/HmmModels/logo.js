(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == 'function' && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw ((f.code = 'MODULE_NOT_FOUND'), f);
      }
      var l = (n[o] = { exports: {} });
      t[o][0].call(
        l.exports,
        function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        l,
        l.exports,
        e,
        t,
        n,
        r,
      );
    }
    return n[o].exports;
  }
  var i = typeof require == 'function' && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function(require, module, exports) {
        'use strict';

        var ActiveSites;

        var isNumeric = function(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        };
        ActiveSites = function(options) {
          // All this coordinates start in 1
          options = options || {};
          this.name = options.name || '';
          this.sites = options.active_sites || 1;
          this.proteins = options.proteins || 0;
          this.source = options.source || 0;
          this.over = -1;
        };

        //ActiveSites.prototype.isOver = function(){
        //    if (!this.over){
        //
        //    }
        //    this.over=true;
        //}
        ActiveSites.prototype.whatShouldBeDraw = function(column) {
          for (var i = 0; i < this.sites.length; i++) {
            if (this.sites[i].column == column) {
              this.sites[i].type = 'BLOCK';
              return this.sites[i];
            }
          }
          if (
            this.sites[0].column < column &&
            column < this.sites[this.sites.length - 1].column
          ) {
            this.sites[0].type = 'LINE';
            return this.sites[0];
          }
          return null;
        };
        ActiveSites.prototype.sortSites = function(columns) {
          this.sites = this.sites.sort(function(a, b) {
            if (typeof a.column == 'undefined') return -1;
            if (typeof b.column == 'undefined') return 1;
            return a.column - b.column;
          });
        };
        ActiveSites.prototype.getSitesHTML = function(column) {
          var html = '<ul>';
          for (var i = 0; i < this.sites.length; i++) {
            var site = this.sites[i],
              css = column == site.column ? 'current_site' : '';

            html +=
              "<li class='" +
              css +
              "'><i>Column " +
              site.column +
              ':</i>' +
              site.base +
              '</li>';
          }
          return html + '</ul>';
        };

        ActiveSites.prototype.getProteinsHTML = function(column) {
          var html = '<ul>';
          for (var i = 0; i < this.proteins.length; i++) {
            var p = this.proteins[i];
            html +=
              "<li><a target='_blank' href='http://www.uniprot.org/uniprot/" +
              p +
              "'>" +
              p +
              '</a></li>';
          }
          return html + '</ul>';
        };
        if (typeof module != 'undefined') module.exports = ActiveSites;
      },
      {},
    ],
    2: [
      function(require, module, exports) {
        'use strict';

        var ActiveSites = require('./ActiveSites.js'),
          ActiveSitesPanel = require('./ActiveSitesPanel.js');

        var ActiveSitesAdder;

        ActiveSitesAdder = function(data, hmm_logo) {
          this.data = data;
          this.hmm_logo = hmm_logo;
          this.panel = null;

          this.resetData = function(data) {
            this.data = data;
            this.panel = null;
          };

          this.process = function() {
            for (var i = 0; i < this.data.length; i++) {
              //for each pattern
              var x = new ActiveSites(this.data[i]);
              this.data[i].controller = x;
              //for (var j=0;j< this.data[i].residues.length;j++) { // for each residue
              //    var col = x.getColumnFromResidue(this.data[i].residues[j].residue);
              //    if (col > 0 ) {
              //        this.data[i].residues[j].column = col;
              //        this.data[i].residues[j].base = x.sequence[this.data[i].residues[j].residue-1];
              //    }
              //}
              x.sortSites();
            }
          };

          this.setDrawingOptions = function(options) {
            options.hmm_logo = this.hmm_logo;
            options.data = this.data;
            if (this.panel == null) this.panel = new ActiveSitesPanel(options);
          };
        };

        if (typeof module != 'undefined') module.exports = ActiveSitesAdder;
      },
      { './ActiveSites.js': 1, './ActiveSitesPanel.js': 3 },
    ],
    3: [
      function(require, module, exports) {
        'use strict';

        var CanvasButton = require('../components/canvas_button.js');

        var ActiveSitesPanel;

        ActiveSitesPanel = function(options) {
          var self = this;
          this.margin_to_features = options.margin_to_features || 0;
          this.padding_between_tracks = options.padding_between_tracks || 0;
          this.feature_height = options.feature_height || 10;

          this.hmm_logo = options.hmm_logo || null;
          this.data = options.data || null;

          this.canvas = null;
          this.context = null;
          this.components = [];

          var top =
              1 +
              this.margin_to_features +
              this.padding_between_tracks +
              this.feature_height / 2,
            w = this.feature_height * 2,
            h = this.feature_height * 6;

          this.offsetY = 0;
          this.top_limit = 0;
          this.bottom_limit = h - 2 * this.feature_height;

          this.addedEvents = false;

          var up_button = new CanvasButton({
              x: 3,
              y: top + 2,
              w: w - 6,
              h: w - 6,
            }),
            down_button = new CanvasButton({
              x: 3,
              y: top + h - w + 2,
              w: w - 6,
              h: w - 6,
            });

          this.components.push(up_button);
          this.components.push(down_button);

          // create an empty <span>
          var dragImgEl = document.createElement('span');
          dragImgEl.setAttribute(
            'style',
            'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;',
          );
          document.body.appendChild(dragImgEl);

          up_button.draw = function(context) {
            draw_polygone(
              context,
              [
                [this.x + this.w / 2, this.y],
                [this.x, this.y + this.h],
                [this.x + this.w, this.y + this.h],
              ],
              this.getState() == this.STATE_NORMAL
                ? 'rgba(255,100,10, 0.3)'
                : 'rgba(255,100,10, 1)',
            );
          };
          down_button.draw = function(context) {
            draw_polygone(
              context,
              [
                [this.x + this.w / 2, this.y + this.h],
                [this.x, this.y],
                [this.x + this.w, this.y],
              ],
              this.getState() == this.STATE_NORMAL
                ? 'rgba(255,100,10, 0.3)'
                : 'rgba(255,100,10, 1)',
            );
          };

          up_button.onClick = function() {
            self.offsetY =
              self.offsetY <= self.bottom_limit
                ? self.bottom_limit
                : self.offsetY - 1;
            self.hmm_logo.refresh();
          };
          down_button.onClick = function() {
            self.offsetY =
              self.offsetY >= self.top_limit
                ? self.top_limit
                : self.offsetY + 1;
            self.hmm_logo.refresh();
          };

          this.getMouse = function(e) {
            var element = this.canvas,
              offsetX = 0,
              offsetY = 0,
              mx,
              my;

            // Compute the total offset
            if (element.offsetParent !== undefined) {
              do {
                offsetX += element.offsetLeft;
                offsetY += element.offsetTop;
              } while ((element = element.offsetParent));
            }

            // Add padding and border style widths to offset
            // Also add the offsets in case there's a position:fixed bar
            offsetX +=
              getAmountFromStyle(this.canvas, 'paddingLeft') +
              getAmountFromStyle(this.canvas, 'borderLeft') +
              getAmountFromStyle(this.canvas, 'left');
            offsetY +=
              getAmountFromStyle(this.canvas, 'paddingTop') +
              getAmountFromStyle(this.canvas, 'borderTop') +
              getAmountFromStyle(this.canvas, 'top');

            mx = e.pageX - offsetX;
            my = e.pageY - offsetY;

            // We return a simple javascript object (a hash) with x and y defined
            return { x: mx, y: my };
          };
          this.initialize_2nd_axis = function(second_axis) {
            second_axis = this.hmm_logo.render_2nd_y_axis_label();
            return second_axis;
          };
          this.addEvents = function(second_axis, logo_canvas) {
            second_axis.addEventListener('mousemove', function(e) {
              var mouse = self.getMouse(e),
                refresh = false;

              for (var i = 0; i < self.components.length; i++) {
                var previous = self.components[i].getState();
                self.components[i].mousemove(mouse);
                if (previous != self.components[i].getState()) refresh = true;
              }
              if (refresh) self._paint_2nd_axis();
            });
            second_axis.addEventListener('click', function(e) {
              var mouse = self.getMouse(e);
              //            for (var i=0;i<self.components.length;i++)
              //                self.components[i].click(mouse);
            });
            second_axis.addEventListener('mousedown', function(e) {
              var mouse = self.getMouse(e);
              self.timer = setInterval(function() {
                for (var i = 0; i < self.components.length; i++)
                  self.components[i].click(mouse);
              }, 20);
            });
            second_axis.addEventListener('mouseup', function(e) {
              var mouse = self.getMouse(e);
              clearInterval(self.timer);
              for (var i = 0; i < self.components.length; i++)
                self.components[i].click(mouse);
            });
            var y_axis = document.getElementsByClassName('logo_yaxis')[0],
              prevY = null;

            y_axis.addEventListener('dragstart', function(e) {
              //e.dataTransfer.setDragImage(null,0,0);

              e.dataTransfer.setDragImage(dragImgEl, 0, 0);
              var mouse = self.getMouse(e);
              if (top < mouse.y && mouse.y < top + h - self.feature_height) {
                prevY = mouse.y;
              }
            });

            y_axis.addEventListener('drag', function(e) {
              var mouse = self.getMouse(e);
              if (top < mouse.y && mouse.y < top + h - self.feature_height) {
                if (prevY != null) {
                  var deltaY = mouse.y - prevY;
                  if (self.offsetY + deltaY >= self.top_limit) {
                    self.offsetY = self.top_limit;
                  } else if (self.offsetY + deltaY <= self.bottom_limit) {
                    self.offsetY = self.bottom_limit;
                  } else self.offsetY = self.offsetY + deltaY;

                  self.hmm_logo.refresh();
                }
                prevY = mouse.y;
              }
            });
            y_axis.addEventListener('dragstart', function(e) {
              prevY = null;
            });

            logo_canvas.addEventListener('mousemove', function(evt) {
              var mouse = self.getMouse(evt),
                box = this.getBoundingClientRect(),
                offset =
                  box.left +
                  window.pageXOffset -
                  document.documentElement.clientLeft,
                x = parseInt(evt.pageX - offset, 10),
                col = self.hmm_logo.columnFromCoordinates(x),
                track = self.get_track_from_y(mouse.y),
                refresh = false,
                clear = false;
              if (top < mouse.y && mouse.y < top + h) {
                if (
                  typeof self.active_sites_in_canvas[col] != 'undefined' &&
                  typeof self.active_sites_in_canvas[col][track] != 'undefined'
                ) {
                  var site = self.active_sites_in_canvas[col][track];
                  if (site.controller.over == -1) {
                    for (var i in self.active_sites_in_canvas)
                      for (var j in self.active_sites_in_canvas[i])
                        self.active_sites_in_canvas[i][j].controller.over = -1;
                    refresh = true;
                    site.controller.over = col;
                  }
                } else clear = true;
              } else clear = true;
              if (clear)
                for (var i in self.active_sites_in_canvas)
                  for (var j in self.active_sites_in_canvas[i]) {
                    if (self.active_sites_in_canvas[i][j].controller.over != -1)
                      refresh = true;
                    self.active_sites_in_canvas[i][j].controller.over = -1;
                  }
              if (refresh) self.hmm_logo.refresh();
            });
            logo_canvas.addEventListener('click', function(evt) {
              for (var i in self.active_sites_in_canvas)
                for (var j in self.active_sites_in_canvas[i]) {
                  var controller = self.active_sites_in_canvas[i][j].controller;
                  if (controller.over != -1) {
                    var site_e = document.getElementById('active_site_info');
                    if (site_e != null)
                      site_e.innerHTML =
                        '<h2>Active Site Pattern</h2>' +
                        '<ul>' +
                        '   <li><b>Name:</b>' +
                        controller.name +
                        '</li>' +
                        '   <li><b>Source:</b>' +
                        controller.source +
                        '</li>' +
                        '   <li><b>Sites:</b>' +
                        controller.getSitesHTML(controller.over) +
                        '</li>' +
                        '   <li><b>Reported Proteins:</b>' +
                        controller.getProteinsHTML(controller.over) +
                        '</li>' +
                        '</ul>';
                  }
                }
            });
            this.bottom_limit =
              h -
              (Object.keys(self.data).length + 0.5) *
                (this.feature_height + this.padding_between_tracks);
            this.addedEvents = true;
          };
          this.get_track_from_y = function(y) {
            return Math.floor(
              (y - self.offsetY - this.margin_to_features) /
                (this.padding_between_tracks + this.feature_height),
            );
          };
          this.active_sites_in_canvas = {};
          this.paint = function(context_num, start, end) {
            var second_axis = document.getElementById('second_y_axis');
            if (second_axis == null) second_axis = this.initialize_2nd_axis();
            this.canvas = second_axis;

            this._paint_2nd_axis(second_axis.getContext('2d'));

            this._paint_background(this.hmm_logo.contexts[context_num]);
            this.active_sites_in_canvas = {};
            for (var i = start, x = 0; i <= end; i++) {
              this._paint_column(context_num, i, x);
              x += this.hmm_logo.zoomed_column;
            }

            this.hmm_logo.paint_y_axis_label();

            if (!this.addedEvents)
              this.addEvents(
                second_axis,
                document.getElementsByClassName('logo_graphic')[0],
              );
          };

          this._paint_2nd_axis = function(context) {
            context = context || self.context;
            self.context = context;
            context.clearRect(0, top, w, h);
            // var offset = (mode_button.mode==self.MODE_MULTIPLE)?0:w;

            draw_box(
              context,
              0,
              top,
              w,
              h,
              'rgba(100,100,100, 0.2)',
              'rgba(100,100,100, 0.0)',
            );
            for (var i = 0; i < self.components.length; i++)
              self.components[i].draw(context);
          };
          this._paint_column = function(context_num, i, x) {
            var track = 0;
            for (var j = 0; j < this.data.length; j++) {
              track++;
              var wtd = this.data[j].controller.whatShouldBeDraw(i);
              if (wtd == null) continue;
              var color = this.hmm_logo.aa_colors[wtd.base],
                y1 =
                  self.offsetY +
                  this.margin_to_features +
                  track * (this.padding_between_tracks + this.feature_height);

              if (top < y1 && y1 < top + h - this.feature_height) {
                if (wtd.type == 'BLOCK') {
                  if (typeof this.active_sites_in_canvas[i] == 'undefined')
                    this.active_sites_in_canvas[i] = {};
                  this.active_sites_in_canvas[i][track] = this.data[j];
                  draw_box(
                    this.hmm_logo.contexts[context_num],
                    x + 1,
                    self.offsetY +
                      this.margin_to_features +
                      track *
                        (this.padding_between_tracks + this.feature_height),
                    this.hmm_logo.zoomed_column - 2,
                    this.feature_height,
                    color,
                    this.data[j].controller.over == i ? '#000' : '#AAA0AF',
                  );
                } else if (wtd.type == 'LINE') {
                  draw_line(
                    this.hmm_logo.contexts[context_num],
                    x,
                    self.offsetY +
                      this.margin_to_features +
                      this.padding_between_tracks * track +
                      (track + 0.5) * this.feature_height,
                    x + this.hmm_logo.zoomed_column,
                    self.offsetY +
                      this.margin_to_features +
                      this.padding_between_tracks * track +
                      (track + 0.5) * this.feature_height,
                    '#AAA0AF',
                  );
                }
              }
            }
          };
          this._paint_background = function(context) {
            draw_box(
              context,
              0,
              top - 1,
              context.canvas.width,
              h,
              'rgba(100,100,100, 0.2)',
              'rgba(100,100,100, 0.0)',
            );
          };
          this.paintLabels = function(context) {
            draw_box(
              context,
              0,
              top,
              context.canvas.width,
              h,
              'rgba(100,100,100, 0.2)',
              'rgba(100,100,100, 0.0)',
            );
            context.fillStyle = '#666666';
            context.strokeStyle = '#666666';
            context.textAlign = 'right';
            var track = 0;
            for (var j = 0; j < this.data.length; j++) {
              track++;
              var y1 =
                self.offsetY +
                this.margin_to_features +
                track * (this.padding_between_tracks + this.feature_height);
              if (top < y1 && y1 < top + h - this.feature_height) {
                var y2 =
                  self.offsetY +
                  this.margin_to_features +
                  this.padding_between_tracks * track +
                  (track + 0.5) * this.feature_height;
                var fs = 12 - 4 * Math.abs(1 - (y2 - top) / (h / 2));
                context.font = 'bold ' + fs + 'px Arial';
                context.fillText(this.data[j].name, 53, y2);
              }
            }
            context.font = 'bold 10px Arial';
          };
          function draw_box(context, x, y, width, height, color, border) {
            color = color || 'rgba(100,100,100, 0.2)';
            border = border || 'rgba(100,100,100, 0.8)';
            context.fillStyle = color;
            context.strokeStyle = border;
            context.fillRect(x, y, width, height);
            context.strokeRect(x, y, width, height);
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
          function draw_polygone(context, points, color) {
            context.fillStyle = color;
            context.strokeStyle = color;
            context.beginPath();
            context.moveTo(points[0][0], points[0][1]);
            for (var i = 1; i < points.length; i++)
              context.lineTo(points[i][0], points[i][1]);
            context.fill();
          }
          function draw_circle(context, x, y, radius, color) {
            context.fillStyle = color;
            context.strokeStyle = color;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2, true);
            context.fill();
          }
        };

        function getAmountFromStyle(element, attribute) {
          var value = parseInt(element.style[attribute]);
          return isNaN(value) ? 0 : value;
        }

        if (typeof module != 'undefined') module.exports = ActiveSitesPanel;
      },
      { '../components/canvas_button.js': 4 },
    ],
    4: [
      function(require, module, exports) {
        /**
   * Created by gsalazar on 05/01/2016.
   */
        'use strict';

        var CanvasButton;

        CanvasButton = function(options) {
          options = options || {};
          this.x = options.x || 0;
          this.y = options.y || 0;
          this.w = options.w || 10;
          this.h = options.h || 10;
          this.color = options.color || '#000000';
          this.hover_color = options.hover_color || '#882222';

          this.STATE_NORMAL = 0;
          this.STATE_CLICKED = 1;
          this.STATE_MOUSE_OVER = 2;

          var state = this.STATE_NORMAL;

          this.getState = function() {
            return state;
          };
          this.draw = function(context) {
            context.fillStyle =
              state == this.STATE_NORMAL ? this.color : this.hover_color;
            context.fillRect(this.x, this.y, this.w, this.h);
          };

          this.mousemove = function(mouse) {
            switch (state) {
              case this.STATE_NORMAL:
                if (
                  mouse.x > this.x &&
                  mouse.x < this.x + this.w &&
                  mouse.y > this.y &&
                  mouse.y < this.y + this.h
                )
                  state = this.STATE_MOUSE_OVER;
                break;
              case this.STATE_MOUSE_OVER:
                if (
                  mouse.x < this.x ||
                  mouse.x > this.x + this.w ||
                  mouse.y < this.y ||
                  mouse.y > this.y + this.h
                )
                  state = this.STATE_NORMAL;
                break;
            }
          };
          this.click = function(mouse) {
            if (state == this.STATE_MOUSE_OVER) {
              this.onClick(mouse);
            }
          };
          this.onClick = function(mouse) {};
          this.onActionPerformed = function() {
            state = this.STATE_NORMAL;
          };
          this.onMouseOver = function() {};
          this.onMouseOut = function() {
            state = this.STATE_NORMAL;
          };
        };

        if (typeof module != 'undefined') module.exports = CanvasButton;
      },
      {},
    ],
    5: [
      function(require, module, exports) {
        // checking for canvas support and caching result
        var canv_support = null;

        function canvasSupport() {
          if (!canv_support) {
            var elem = document.createElement('canvas');
            canv_support = !!(elem.getContext && elem.getContext('2d'));
          }
          return canv_support;
        }

        if (typeof module != 'undefined') module.exports = canvasSupport;
      },
      {},
    ],
    6: [
      function(require, module, exports) {
        function ConsensusColors() {
          this.grey = '#7a7a7a';

          function arbitrate(threshold, scoreref) {
            var bestclass = '.',
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

            var red = '#FF9999',
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

            var green = '#99FF99',
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

            var green = '#99FF99';

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

            var red = '#FF9999',
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

            var red = '#FF9999',
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

            var red = '#FF9999',
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
            var aa = ['A', 'C', 'F', 'L', 'I', 'M', 'V', 'W'],
              caa = [
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

            var letters = [
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
              ],
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

            var letters = [
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
            var thresholds = ['0.50', '0.60', '0.80', '0.85'],
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
                    score.p = score.p + parseFloat(aa[1], 10);
                    continue;
                  }

                  if (alcohol[aa[0]]) {
                    score.o = score.o + parseFloat(aa[1], 10);
                    continue;
                  }

                  if (negative[aa[0]]) {
                    score['-'] = score['-'] + parseFloat(aa[1], 10);
                    continue;
                  }

                  if (positive[aa[0]]) {
                    score['+'] = score['+'] + parseFloat(aa[1], 10);
                  }

                  if (hydro[aa[0]]) {
                    score.h = score.h + parseFloat(aa[1], 10);
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
              //Colour alcohol.....
              this.check_ST(i, cons, colors);
              //Proline and Glycine get fixed colors....
              this.check_PG(i, cons, colors);
            }

            return colors;
          };
        }

        if (typeof module != 'undefined') module.exports = ConsensusColors;
      },
      {},
    ],
    7: [
      function(require, module, exports) {
        if (typeof module != 'undefined')
          var Letter = require('./letter.js'),
            canvasSupport = require('./canvas_support.js'),
            ConsensusColors = require('./consensus_colors.js');

        var feature_height = 10,
          margin_to_features = 10,
          padding_between_tracks = 4;

        function HMMLogo(options) {
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
          this.dom_element = options.dom_element || $('body');
          this.called_on = options.called_on || null;
          this.start = options.start || 1;
          this.end = options.end || this.data.height_arr.length;
          this.zoom = parseFloat(options.zoom) || 0.4;
          this.default_zoom = this.zoom;

          this.active_sites_sources = options.active_sites_sources || null;
          this.show_active_sites = false;
          this.active_sites_adder = null;

          // turn off the insert rows if the hmm used the observed or weighted processing flags.
          if (
            this.data.processing &&
            /^observed|weighted/.test(this.data.processing)
          ) {
            this.show_inserts = 0;
            this.info_content_height = 286;
          } else {
            this.show_inserts = 1;
            this.info_content_height = 256;
          }
          this.column_hover = -1;
          this.column_clicked = -1;

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

          var letter = null,
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

          //build the letter canvases
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

          function draw_box(context, x, y, width, height, color, border) {
            color = color || 'rgba(100,100,100, 0.2)';
            border = border || 'rgba(100,100,100, 0.8)';
            context.fillStyle = color;
            context.strokeStyle = border;
            context.fillRect(x, y, width, height);
            context.strokeRect(x, y, width, height);
          }
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
            var fill = '#ffffff';
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
              y = y + 30;
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
            context.font = fontsize + 'px Arial';
            context.fillStyle = fill;
            context.fillRect(x, y - 10, col_width, 14);
            context.textAlign = 'center';
            context.fillStyle = textfill;
            context.fillText(text, x + col_width / 2, y);
          }

          function draw_insert_odds(
            context,
            x,
            height,
            col_width,
            text,
            fontsize,
          ) {
            var y = height - 20,
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

            //draw vertical line to indicate where the insert would occur
            if (text > 0.03) {
              draw_ticks(
                context,
                x + col_width,
                height - 30,
                -30 - height,
                fill,
              );
            }
          }

          function draw_insert_length(
            context,
            x,
            y,
            col_width,
            text,
            fontsize,
          ) {
            var fill = '#ffffff',
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
            var y = height - 4,
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
            context.font = fontsize + 'px Arial';
            context.textAlign = right ? 'right' : 'center';
            context.fillStyle = '#666666';
            context.fillText(col_num, x + col_width / 2, y);
          }

          function attach_canvas(DOMid, height, width, id, canv_width) {
            var canvas = $(DOMid).find('#canv_' + id);

            if (!canvas.length) {
              $(DOMid).append(
                '<canvas class="canvas_logo" id="canv_' +
                  id +
                  '"  height="' +
                  height +
                  '" width="' +
                  width +
                  '" style="left:' +
                  canv_width * id +
                  'px"></canvas>',
              );
              canvas = $(DOMid).find('#canv_' + id);
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
            var zoom = options.zoom || this.zoom,
              target = options.target || 1,
              scaled = options.scaled || null,
              parent_width = $(this.dom_element).parent().width(),
              max_canvas_width = 1,
              end = null,
              start = null,
              i = 0;

            if (target === this.previous_target) {
              return;
            }

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
            end =
              end > this.data.height_arr.length
                ? this.data.height_arr.length
                : end;
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
            $(this.dom_element)
              .attr({ width: this.total_width + 'px' })
              .css({ width: this.total_width + 'px' });

            var canvas_count = Math.ceil(this.total_width / this.canvas_width);
            this.columns_per_canvas = Math.ceil(
              this.canvas_width / this.zoomed_column,
            );

            if (this.previous_zoom !== this.zoom) {
              $(this.dom_element).find('canvas').remove();
              this.previous_zoom = this.zoom;
              this.rendered = [];
            }

            this.canvases = [];
            this.contexts = [];

            for (i = 0; i < canvas_count; i++) {
              var split_start = this.columns_per_canvas * i + start,
                split_end = split_start + this.columns_per_canvas - 1;
              if (split_end > end) {
                split_end = end;
              }

              var adjusted_width =
                (split_end - split_start + 1) * this.zoomed_column;

              if (adjusted_width > max_canvas_width) {
                max_canvas_width = adjusted_width;
              }

              var canv_start = max_canvas_width * i,
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
                    var fontsize = parseInt(10 * zoom, 10);
                    fontsize = fontsize > 10 ? 10 : fontsize;
                    if (this.debug) {
                      this.render_with_rects(split_start, split_end, i, 1);
                    }
                    this.render_with_text(split_start, split_end, i, fontsize);
                  } else {
                    this.render_with_rects(split_start, split_end, i);
                  }
                  if (
                    this.show_active_sites &&
                    this.active_sites_adder != null
                  ) {
                    this.active_sites_adder.setDrawingOptions({
                      margin_to_features: margin_to_features,
                      padding_between_tracks: padding_between_tracks,
                      feature_height: feature_height,
                    });
                    this.active_sites_adder.panel.paint(
                      i,
                      split_start,
                      split_end,
                    );
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
                this.scrollme = new EasyScroller($(this.dom_element)[0], {
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
            var label = 'Model Position';
            if (this.display_ali_map) {
              label = 'Alignment Column';
            }
            $(this.called_on).find('.logo_xaxis').remove();
            $(this.called_on).prepend(
              '<div class="logo_xaxis" class="centered" style="margin-left:40px"><p class="xaxis_text" style="width:10em;margin:1em auto">' +
                label +
                '</p></div>',
            );
          };

          this.render_y_axis_label = function() {
            //attach a canvas for the y-axis
            $(this.dom_element)
              .parent()
              .before(
                '<canvas class="logo_yaxis" height="302" width="55" draggable="true"></canvas>',
              );
            this.paint_y_axis_label();
          };

          this.paint_y_axis_label = function() {
            var canvas = $(this.called_on).find('.logo_yaxis'),
              context,
              moveTitle = 0;
            if (!canvasSupport()) {
              canvas[0] = G_vmlCanvasManager.initElement(canvas[0]);
            }
            context = canvas[0].getContext('2d');

            var axis_label = 'Information Content (bits)';
            context.clearRect(0, 0, 55, 300);

            //draw min/max tick marks
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

            //draw the label text
            context.fillStyle = '#666666';
            context.textAlign = 'right';
            context.font = 'bold 10px Arial';

            // draw the max label
            context.textBaseline = 'top';
            context.fillText(
              parseFloat(this.data.max_height).toFixed(1),
              38,
              0,
            );
            context.textBaseline = 'middle';

            // draw the midpoint labels
            context.fillText(
              parseFloat(this.data.max_height / 2).toFixed(1),
              38,
              this.info_content_height / 2,
            );
            // draw the min label
            context.fillText('0', 38, this.info_content_height);

            if (this.show_active_sites && this.active_sites_adder != null) {
              this.active_sites_adder.panel.paintLabels(context);
              moveTitle = 40;
            }

            // draw the axis label
            if (this.data.height_calc === 'score') {
              axis_label = 'Score (bits)';
            }

            context.save();
            context.translate(5, this.height / 2 - 20 + moveTitle);
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
          };

          this.render_2nd_y_axis_label = function() {
            //attach a canvas for the y-axis
            $(this.dom_element)
              .parent()
              .after(
                '<canvas id ="second_y_axis" class="second_yaxis" height="302" width="55" draggable="true"></canvas>',
              );
            var canvas = $(this.called_on).find('.second_yaxis'),
              top_pix_height = 0,
              bottom_pix_height = 0,
              top_height = Math.abs(this.data.max_height),
              bottom_height = isNaN(this.data.min_height_obs)
                ? 0
                : parseInt(this.data.min_height_obs, 10),
              context = null,
              axis_label = 'Information Content (bits)';
            if (!canvasSupport()) {
              canvas[0] = G_vmlCanvasManager.initElement(canvas[0]);
            }

            return canvas[0];
          };

          this.render_with_text = function(start, end, context_num, fontsize) {
            var x = 0,
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
              //convert % to pixels
              top_pix_height = Math.round(
                this.info_content_height * top_percentage / 100,
              ),
              bottom_pix_height = this.info_content_height - top_pix_height,
              // this is used to transform the 256px high letters into the correct size
              // when displaying negative values, so that they fit above the 0 line.
              top_pix_conversion = top_pix_height / this.info_content_height,
              bottom_pix_conversion =
                bottom_pix_height / this.info_content_height;

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
                var column = this.data.height_arr[i - 1],
                  col_positions = [];
                if (column) {
                  var previous_height = 0,
                    letters = column.length,
                    previous_neg_height = top_pix_height,
                    j = 0,
                    color = null;
                  if (i == this.column_clicked) {
                    this.contexts[context_num].fillStyle = '#ffdede';
                    this.contexts[context_num].fillRect(
                      x,
                      0,
                      this.zoomed_column,
                      this.height,
                    );
                    this.contexts[context_num].strokeStyle = '#ff8888';
                    this.contexts[context_num].strokeRect(
                      x,
                      0,
                      this.zoomed_column,
                      this.height,
                    );
                  }
                  if (i == this.column_hover) {
                    this.contexts[context_num].fillStyle = '#ffeeee';
                    this.contexts[context_num].fillRect(
                      x,
                      0,
                      this.zoomed_column,
                      this.height,
                    );
                  }

                  for (j = 0; j < letters; j++) {
                    var letter = column[j],
                      values = letter.split(':', 2),
                      x_pos = x + this.zoomed_column / 2,
                      letter_height = null;

                    // we don't render anything with a value between 0 and 0.01. These
                    // letters would be too small to be meaningful on any scale, so we
                    // just squash them out.
                    if (values[1] > 0.01) {
                      letter_height =
                        parseFloat(values[1]) / this.data.max_height;
                      var y_pos =
                          this.info_content_height - 2 - previous_height,
                        glyph_height =
                          (this.info_content_height - 2) * letter_height;

                      // The positioning in IE is off, so we need to modify the y_pos when
                      // canvas is not supported and we are using VML instead.
                      if (!canvasSupport()) {
                        y_pos = y_pos + glyph_height * (letter_height / 2);
                      }

                      col_positions[j] = [
                        glyph_height,
                        this.zoomed_column,
                        x_pos,
                        y_pos,
                      ];
                      previous_height = previous_height + glyph_height;
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
                    context_num: context_num,
                    x: x,
                    fontsize: 10,
                    column_num: column_label,
                    ralign: true,
                  });
                }
              } else {
                this.draw_column_divider({
                  context_num: context_num,
                  x: x,
                  fontsize: fontsize,
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
              //draw insert length ticks
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
            draw_border(
              this.contexts[context_num],
              this.height - 15,
              this.total_width,
            );
            draw_border(this.contexts[context_num], 0, this.total_width);
          };

          this.draw_column_divider = function(opts) {
            var div_x = opts.ralign ? opts.x + this.zoomed_column : opts.x,
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
            var x = 0,
              column_num = start,
              column_label = null,
              i = 0,
              top_height = Math.abs(this.data.max_height),
              bottom_height = Math.abs(this.data.min_height_obs),
              total_height = top_height + bottom_height,
              top_percentage = Math.round(
                Math.abs(this.data.max_height) * 100 / total_height,
              ),
              //convert % to pixels
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
                var column = this.data.height_arr[i - 1],
                  previous_height = 0,
                  previous_neg_height = top_pix_height,
                  letters = column.length,
                  j = 0;
                for (j = 0; j < letters; j++) {
                  var letter = column[j],
                    values = letter.split(':', 2);
                  if (values[1] > 0.01) {
                    var letter_height =
                        parseFloat(values[1]) / this.data.max_height,
                      x_pos = x,
                      glyph_height =
                        (this.info_content_height - 2) * letter_height,
                      y_pos =
                        this.info_content_height -
                        2 -
                        previous_height -
                        glyph_height,
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

                    previous_height = previous_height + glyph_height;
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
                draw_ticks(
                  this.contexts[context_num],
                  x + this.zoomed_column,
                  0,
                  5,
                );

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

              x += this.zoomed_column;
              column_num++;
            }
          };

          this.toggle_colorscheme = function(scheme) {
            // work out the current column we are on so we can return there
            var col_total = this.current_column();

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

            this.refresh();
          };

          this.toggle_scale = function(scale) {
            // work out the current column we are on so we can return there
            var col_total = this.current_column();

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
            //update the y-axis
            $(this.called_on).find('.logo_yaxis').remove();
            this.render_y_axis_label();

            this.refresh();
          };

          this.toggle_ali_map = function(coords) {
            // work out the current column we are on so we can return there
            var col_total = this.current_column();

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

            this.refresh();
          };

          this.current_column = function() {
            var before_left = this.scrollme.scroller.getValues().left,
              col_width = this.column_width * this.zoom,
              col_count = before_left / col_width,
              half_visible_columns =
                $(this.called_on).find('.logo_container').width() /
                col_width /
                2,
              col_total = Math.ceil(col_count + half_visible_columns);
            return col_total;
          };

          this.change_zoom = function(options) {
            var zoom_level = 0.3,
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
            expected_width =
              $(this.called_on).find('.logo_graphic').width() *
              zoom_level /
              this.zoom;
            if (
              expected_width > $(this.called_on).find('.logo_container').width()
            ) {
              // if a center is not specified, then use the current center of the view
              if (!options.column) {
                //work out my current position
                var col_total = this.current_column();

                this.zoom = zoom_level;
                this.render({ zoom: this.zoom });
                this.scrollme.reflow();

                //scroll to previous position
                this.scrollToColumn(col_total);
              } else {
                // center around the mouse click position.
                this.zoom = zoom_level;
                this.render({ zoom: this.zoom });
                this.scrollme.reflow();

                var coords = this.coordinatesFromColumn(options.column);
                this.scrollme.scroller.scrollTo(coords - options.offset);
              }
            }
            return this.zoom;
          };

          this.columnFromCoordinates = function(x) {
            var column = Math.ceil(x / (this.column_width * this.zoom));
            return column;
          };

          this.coordinatesFromColumn = function(col) {
            var new_column = col - 1,
              x =
                new_column * (this.column_width * this.zoom) +
                this.column_width * this.zoom / 2;
            return x;
          };

          this.scrollToColumn = function(num, animate) {
            var half_view =
                $(this.called_on).find('.logo_container').width() / 2,
              new_left = this.coordinatesFromColumn(num);
            this.scrollme.scroller.scrollTo(new_left - half_view, 0, animate);
          };
          this.refresh = function() {
            this.rendered = [];
            this.scrollme.reflow();
            this.scrollToColumn(this.current_column() + 1);
            this.scrollToColumn(this.current_column() - 1);
          };
        }

        if (typeof module != 'undefined') module.exports = HMMLogo;
      },
      {
        './canvas_support.js': 5,
        './consensus_colors.js': 6,
        './letter.js': 8,
      },
    ],
    8: [
      function(require, module, exports) {
        function Letter(letter, options) {
          options = options || {};
          this.value = letter;
          this.width = parseInt(options.width, 10) || 100;

          //W is 30% wider than the other letters, so need to make sure
          //it gets modified accordingly.
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

          this.draw = function(
            ext_ctx,
            target_height,
            target_width,
            x,
            y,
            color,
          ) {
            var h_ratio = target_height / this.height,
              w_ratio = target_width / this.width,
              prev_font = ext_ctx.font;
            ext_ctx.transform(w_ratio, 0, 0, h_ratio, x, y);
            ext_ctx.fillStyle = color || this.color;
            ext_ctx.textAlign = 'center';
            ext_ctx.font = 'bold ' + this.fontSize + 'px Arial';

            ext_ctx.fillText(this.value, 0, 0);
            //restore the canvas settings
            ext_ctx.setTransform(1, 0, 0, 1, 0, 0);
            ext_ctx.fillStyle = '#000000';
            ext_ctx.font = prev_font;
          };
        }

        if (typeof module != 'undefined') module.exports = Letter;
      },
      {},
    ],
    9: [
      function(require, module, exports) {
        /*jslint browser:true */
        /*global G_vmlCanvasManager, EasyScroller */
        /** @license
   * HMM logo
   * https://github.com/Janelia-Farm-Xfam/hmm_logo_js
   * Copyright 2013, Jody Clements.
   * Licensed under the MIT License.
   * https://github.com/Janelia-Farm-Xfam/hmm_logo_js/blob/master/LICENSE.txt
   */
        if (typeof module != 'undefined')
          var canvasSupport = require('./components/canvas_support.js'),
            HMMLogo = require('./components/hmm_logo_canvas'),
            ActiveSitesAdder = require('./ActiveSites/ActiveSitesAdder.js');

        (function($) {
          'use strict';

          $.fn.hmm_logo = function(options) {
            var logo = null,
              logo_graphic = $('<div class="logo_graphic">');
            var self = this;
            if (canvasSupport()) {
              options = options || {};

              // add some internal divs for scrolling etc.
              $(this).append(
                $('<div class="logo_container">')
                  .append(logo_graphic)
                  .append('<div class="logo_divider">'),
              );

              options.data = $(this).data('logo');

              if (options.data === null) {
                return;
              }

              options.dom_element = logo_graphic;
              options.called_on = this;

              var zoom = options.zoom || 0.4,
                form = $(
                  '<form class="logo_form"><fieldset><label for="position">Column number</label>' +
                    '<input type="text" name="position" class="logo_position" />' +
                    '<button class="button logo_change">Go</button></fieldset>' +
                    '</form>',
                ),
                controls = $('<div class="logo_controls">'),
                settings = $('<div class="logo_settings">');

              settings.append('<span class="close">x</span>');

              logo = new HMMLogo(options);
              logo.render_x_axis_label();
              logo.render_y_axis_label();
              logo.render(options);

              if (logo.zoom_enabled) {
                controls.append(
                  '<button class="logo_zoomout button">-</button>' +
                    '<button class="logo_zoomin button">+</button>',
                );
              }

              /* we don't want to toggle if the max height_obs is greater than max theoretical
         * as letters will fall off the top.
         */
              if (
                logo.scale_height_enabled &&
                logo.data.max_height_obs < logo.data.max_height_theory
              ) {
                var obs_checked = '',
                  theory_checked = '',
                  theory_help = '',
                  obs_help = '';

                if (logo.data.max_height_obs === logo.data.max_height) {
                  obs_checked = 'checked';
                } else {
                  theory_checked = 'checked';
                }

                if (options.help) {
                  obs_help =
                    '<a class="help" href="/help#scale_obs" title="Set the y-axis maximum to the maximum observed height.">' +
                    '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
                  theory_help =
                    '<a class="help" href="/help#scale_theory" title="Set the y-axis maximum to the theoretical maximum height">' +
                    '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
                }

                var scale_controls =
                  '<fieldset><legend>Scale</legend>' +
                  '<label><input type="radio" name="scale" class="logo_scale" value="obs" ' +
                  obs_checked +
                  '/>Maximum Observed ' +
                  obs_help +
                  '</label></br>' +
                  '<label><input type="radio" name="scale" class="logo_scale" value="theory" ' +
                  theory_checked +
                  '/>Maximum Theoretical ' +
                  theory_help +
                  '</label>' +
                  '</fieldset>';

                settings.append(scale_controls);
              }

              if (
                logo.data.height_calc !== 'score' &&
                logo.data.alphabet === 'aa' &&
                logo.data.probs_arr
              ) {
                var def_color = null,
                  con_color = null,
                  def_help = '',
                  con_help = '';

                if (logo.colorscheme === 'default') {
                  def_color = 'checked';
                } else {
                  con_color = 'checked';
                }

                if (options.help) {
                  def_help =
                    '<a class="help" href="/help#colors_default" title="Each letter receives its own color.">' +
                    '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
                  con_help =
                    '<a class="help" href="/help#colors_consensus" title="Letters are colored as in Clustalx and Jalview, with colors depending on composition of the column.">' +
                    '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
                }

                var color_controls =
                  '<fieldset><legend>Color Scheme</legend>' +
                  '<label><input type="radio" name="color" class="logo_color" value="default" ' +
                  def_color +
                  '/>Default ' +
                  def_help +
                  '</label></br>' +
                  '<label><input type="radio" name="color" class="logo_color" value="consensus" ' +
                  con_color +
                  '/>Consensus Colors ' +
                  con_help +
                  '</label>' +
                  '</fieldset>';
                settings.append(color_controls);
              }

              if (logo.data.ali_map) {
                var mod_checked = null,
                  ali_checked = null,
                  mod_help = '',
                  ali_help = '',
                  familiy_accession = '';

                if (logo.display_ali_map === 0) {
                  mod_checked = 'checked';
                } else {
                  ali_checked = 'checked';
                }

                if (options.help) {
                  mod_help =
                    '<a class="help" href="/help#coords_model" title="The coordinates along the top of the plot show the model position.">' +
                    '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
                  ali_help =
                    '<a class="help" href="/help#coords_ali" title="The coordinates along the top of the plot show the column in the alignment associated with the model">' +
                    '<span aria-hidden="true" data-icon="?"></span><span class="reader-text">help</span></a>';
                }

                var ali_controls =
                  '<fieldset><legend>Coordinates</legend>' +
                  '<label><input type="radio" name="coords" class="logo_ali_map" value="model" ' +
                  mod_checked +
                  '/>Model ' +
                  mod_help +
                  '</label></br>' +
                  '<label><input type="radio" name="coords" class="logo_ali_map" value="alignment" ' +
                  ali_checked +
                  '/>Alignment ' +
                  ali_help +
                  '</label>' +
                  '</fieldset>';
                settings.append(ali_controls);
              }

              if (settings.children().length > 0) {
                controls.append(
                  '<button class="logo_settings_switch button">Settings</button>',
                );
                controls.append(settings);
              }

              form.append(controls);
              $(this).append(form);

              $(this)
                .find('.logo_settings_switch, .logo_settings .close')
                .bind('click', function(e) {
                  e.preventDefault();
                  $('.logo_settings').toggle();
                });

              $(this).find('.logo_reset').bind('click', function(e) {
                e.preventDefault();
                var hmm_logo = logo;
                hmm_logo.change_zoom({ target: hmm_logo.default_zoom });
              });

              $(this).find('.logo_change').bind('click', function(e) {
                e.preventDefault();
              });

              $(this).find('.logo_zoomin').bind('click', function(e) {
                e.preventDefault();
                var hmm_logo = logo;
                hmm_logo.change_zoom({ distance: 0.1, direction: '+' });
              });

              $(this).find('.logo_zoomout').bind('click', function(e) {
                e.preventDefault();
                var hmm_logo = logo;
                hmm_logo.change_zoom({ distance: 0.1, direction: '-' });
              });

              $(this).find('.logo_scale').bind('change', function(e) {
                var hmm_logo = logo;
                hmm_logo.toggle_scale(this.value);
              });

              $(this).find('.logo_color').bind('change', function(e) {
                var hmm_logo = logo;
                hmm_logo.toggle_colorscheme(this.value);
              });

              $(this).find('.logo_ali_map').bind('change', function(e) {
                var hmm_logo = logo;
                hmm_logo.toggle_ali_map(this.value);
              });

              $(this).find('.logo_position').bind('change', function() {
                var hmm_logo = logo;
                if (!this.value.match(/^\d+$/m)) {
                  return;
                }
                hmm_logo.scrollToColumn(this.value, 1);
              });

              logo_graphic.bind('dblclick', function(e) {
                // need to get coordinates of mouse click
                var hmm_logo = logo,
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
                logo_graphic.bind('click', function(e) {
                  var hmm_logo = logo,
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
                  hmm_logo.column_clicked = col;
                  hmm_logo.refresh();

                  if (
                    logo.data.height_calc &&
                    logo.data.height_calc === 'score'
                  ) {
                    height_header = 'Score';
                    col_data = logo.data.height_arr[col - 1].slice(0).reverse();
                  } else {
                    col_data = logo.data.probs_arr[col - 1].slice(0).reverse();
                  }

                  info_cols = Math.ceil(col_data.length / 5);
                  //add the headers for each column.
                  for (i = 0; i < info_cols; i++) {
                    // using the i < info_cols - 1 check to make sure the last column doesn't
                    // get marked with the odd class so we don't get a border on the edge of the table.
                    if (info_cols > 1 && i < info_cols - 1) {
                      header +=
                        '<th>Residue</th><th class="odd">' +
                        height_header +
                        '</th>';
                    } else {
                      header +=
                        '<th>Residue</th><th>' + height_header + '</th>';
                    }
                  }

                  header += '</tr>';
                  info_tab.append($(header));

                  // add the data for each column
                  for (i = 0; i < 5; i++) {
                    tbody += '<tr>';
                    j = i;
                    while (col_data[j]) {
                      var values = col_data[j].split(':', 2),
                        color = '';
                      if (logo.colorscheme === 'default') {
                        color = logo.alphabet + '_' + values[0];
                      }
                      // using the j < 15 check to make sure the last column doesn't get marked
                      // with the odd class so we don't get a border on the edge of the table.
                      if (info_cols > 1 && j < 15) {
                        tbody +=
                          '<td class="' +
                          color +
                          '"><div></div>' +
                          values[0] +
                          '</td><td class="odd">' +
                          values[1] +
                          '</td>';
                      } else {
                        tbody +=
                          '<td class="' +
                          color +
                          '"><div></div>' +
                          values[0] +
                          '</td><td>' +
                          values[1] +
                          '</td>';
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
                        '<p> Column:' +
                          col +
                          '</p><div><p>Occupancy: ' +
                          logo.data.delete_probs[col - 1] +
                          '</p><p>Insert Probability: ' +
                          logo.data.insert_probs[col - 1] +
                          '</p><p>Insert Length: ' +
                          logo.data.insert_lengths[col - 1] +
                          '</p></div>',
                      ),
                    )
                    .append(info_tab)
                    .show();
                });
              }

              logo_graphic.bind('mousemove', function(e) {
                var hmm_logo = logo,
                  offset = $(this).offset(),
                  x = parseInt(e.pageX - offset.left, 10),
                  col = hmm_logo.columnFromCoordinates(x);

                if (hmm_logo.column_hover != col) {
                  hmm_logo.column_hover = col;
                  hmm_logo.refresh();
                }
              });

              $(document).bind(this.attr('id') + '.scrolledTo', function(
                e,
                left,
                top,
                zoom,
              ) {
                var hmm_logo = logo;
                hmm_logo.render({ target: left });
              });

              $(document).keydown(function(e) {
                if (!e.ctrlKey) {
                  if (e.which === 61 || e.which === 107) {
                    zoom += 0.1;
                    logo.change_zoom({ distance: 0.1, direction: '+' });
                  }
                  if (e.which === 109 || e.which === 0) {
                    zoom = zoom - 0.1;
                    logo.change_zoom({ distance: 0.1, direction: '-' });
                  }
                }
              });

              // ACTIVE SITES PANEL
              if (
                logo.active_sites_sources != null &&
                typeof logo.active_sites_sources == 'object'
              ) {
                var active_sites =
                  '<fieldset><legend>ActiveSites</legend>' +
                  '<label>Source: <select name="member_db" class="logo_ali_map">';
                for (var key in logo.active_sites_sources) {
                  active_sites +=
                    '<option value="' + key + '">' + key + '</option> ';
                }
                active_sites +=
                  '</select></label> ' + // + mod_help +
                  '</br>' +
                  '<label>Accession number: ' +
                  '   <input type="text" name="familiy_accession" class="logo_ali_map" value="PF00199"/>' +
                  '</label><br/>' +
                  '<button id="active_sites">Get Active Sites</button>' +
                  '</fieldset>';

                settings.append(active_sites);
              }

              $(this).find('#active_sites').bind('click', function(e) {
                e.preventDefault();
                var hmm_logo = logo;
                var source = $('select[name=member_db]').val(),
                  url = hmm_logo.active_sites_sources[source],
                  acc = $('input[name=familiy_accession]').val();
                if ('' != acc.trim()) {
                  url = url.replace('[ACCESSION]', acc);
                  $.getJSON(url, function(data) {
                    if (hmm_logo.active_sites_adder == null)
                      hmm_logo.active_sites_adder = new ActiveSitesAdder(
                        data,
                        hmm_logo,
                      );
                    else {
                      hmm_logo.active_sites_adder.resetData(data);
                    }
                    hmm_logo.active_sites_adder.process();
                    hmm_logo.show_active_sites = true;
                    hmm_logo.refresh();
                  });
                }
              });
            } else {
              $('#logo').replaceWith($('#no_canvas').html());
            }

            return logo;
          };
        })(jQuery);
      },
      {
        './ActiveSites/ActiveSitesAdder.js': 2,
        './components/canvas_support.js': 5,
        './components/hmm_logo_canvas': 7,
      },
    ],
  },
  {},
  [9],
);
