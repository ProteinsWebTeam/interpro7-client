/* eslint-disable no-param-reassign */
import * as d3 from 'd3';
import classname from 'classnames/bind';
import styles from './style.css';
import ColorHash from 'color-hash/lib/color-hash';

const s = classname.bind(styles);
const colorHash = new ColorHash();

class EntryRenderer {
  constructor({trackHeight, trackPadding, padding, xScale, protein}){
    this.tPadding = trackPadding;
    this.trackHeight = trackHeight;
    this.padding = padding;
    this.protein = protein;
    this.x = xScale;
  }
  render(group, entries, offsetY = 0, className = 'entry') {
    this.offsetY = offsetY;
    this.group = group;
    this.entries = entries;
    this.className = className;
    this.signatureRender = new EntryRenderer({
      trackHeight: this.trackHeight / 2,
      trackPadding: {
        bottom: this.tPadding.bottom - 1,
        top: this.tPadding.top - 2,
        left: this.tPadding.left,
        right: this.tPadding.right,
      },
      padding: this.padding,
      xScale: this.x,
      protein: this.protein,
    });
    this.update();
  }
  update() {
    this.innerHeight = 0;
    const interproG = this.group.selectAll(`.${s(this.className)}`)
      .data(this.entries);
    interproG.each((d, i, c) => this.updateEntry(d, i, c));
    interproG.enter()
      .append('g')
      .attr('class', s(this.className))
      .each((d, i, c) => this.updateEntry(d, i, c));
  }
  updateEntry(d, i, c){
    const g = d3.select(c[i]);
    const tHeight = this.trackHeight + this.tPadding.bottom + this.tPadding.top;
    const instanceG = g.selectAll(`.${s('entry-instance')}`)
      .data(d.entry_protein_coordinates.coordinates);
    instanceG.each((data, i, c) => this.updateMatch(data, i, c, d));
    instanceG.enter()
      .append('g')
      .attr('class', s('entry-instance'))
      .each((data, i, c) => this.updateMatch(data, i, c, d));
    instanceG.exit().remove();
    g.append('text')
      .attr('x', this.tPadding.right + this.x(this.protein.length))
      .attr('y', '0.5em')
      .text(d => d.accession);
    g.attr('transform', `translate(0, ${this.offsetY + this.innerHeight})`);
    this.innerHeight += tHeight;
    if (d.signatures){
      this.signatureRender.render(g,
        d.signatures,
        tHeight - this.tPadding.top,
        'signature'
      );
      this.innerHeight += this.signatureRender.innerHeight;
    }
  }
  getColor(entry){
    return colorHash.hex(entry.accession.split('').reverse().join(''));
  }
  updateMatch(d, i, c, entry) {
    const g = d3.select(c[i]);
    const color = this.getColor(entry);
    const matchG = g.selectAll(`.${s('entry-match')}`)
      .data(d);
    if (d.length > 1) {
      // Line connecting Disjunctive matches of an entry
      g.append('line')
        .attr('x1', this.x(Math.min(...(d.map(x => x[0])))))
        .attr('y1', this.trackHeight / 2)
        .attr('x2', this.x(Math.max(...(d.map(x => x[1])))))
        .attr('y2', this.trackHeight / 2)
        .attr('stroke', color)
      ;
    }
    matchG.exit().remove();

    matchG.enter().append('rect')
      .attr('class', s('entry-match'))
      .attr('width', m => this.x(m[1] - m[0]))
      .attr('height', this.trackHeight)
      .attr('x', m => this.x(m[0]))
      .attr('fill', color)
      .attr('rx', 2)
      .attr('ry', 2)
      .on('click', () => {
        if (entry.signatures && entry.signatures.length) {
          entry._signatures = entry.signatures;
          entry.signatures = [];
        } else if (entry._signatures && entry._signatures.length) {
          entry.signatures = entry._signatures;
          entry._signatures = [];
        }
        this.update();
        console.log('toggle', entry);
      });
    const opacity = 0.3;
    if (entry.signatures) {
      matchG.enter().append('rect')
        .attr('x', m => this.x(m[0]))
        .attr('y', this.trackHeight)
        .attr('height', entry.signatures.length * (
          this.signatureRender.trackHeight +
          this.signatureRender.tPadding.top +
          this.signatureRender.tPadding.bottom
        ) + (entry.signatures.length ? this.signatureRender.tPadding.bottom : 0))
        .attr('width', m => this.x(m[1] - m[0]))
        .style('fill', this.getColor(entry))
        .style('opacity', opacity);
    }
  }
}
export default EntryRenderer;
