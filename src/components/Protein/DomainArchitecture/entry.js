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
      .data(this.entries, d => d.accession);
    interproG.each((d, i, c) => this.updateEntry({d, i, c}));
    interproG.enter()
      .append('g')
      .attr('class', s(this.className))
      .attr('transform', 'scale(1,0)')
      .each((d, i, c) => this.updateEntry({d, i, c}))
      .append('text')
        .attr('x', this.tPadding.right + this.x(this.protein.length))
        .attr('y', '0.5em')
        .text(d => d.accession);

    interproG.exit()
      .transition()
        .attr('transform', 'scale(1,0)')
      .remove();
  }
  updateEntry({d, i, c}){
    const g = d3.select(c[i]);
    const tHeight = this.trackHeight + this.tPadding.bottom + this.tPadding.top;
    const instanceG = g.selectAll(`.${s(`${this.className}-instance`)}`)
      .data(d.entry_protein_coordinates.coordinates);
    instanceG.each((data, i, c) => this.updateMatch({d: data, i, c}, d, instanceG));
    instanceG.enter()
      .append('g')
      .attr('class', s(`${this.className}-instance`))
      .each((data, i, c) => this.updateMatch({d: data, i, c}, d, instanceG));
    instanceG.exit().remove();
    g.transition()
      .attr('transform', `scale(1,1)translate(0, ${this.offsetY + this.innerHeight})`);
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
  getColor(entry, format = 'HEX'){
    const acc = entry.accession.split('').reverse().join('');
    if (format.toUpperCase() === 'RGB') return colorHash.rgb(acc);
    if (format.toUpperCase() === 'HEX') return colorHash.hex(acc);
    if (format.toUpperCase() === 'HSL') return colorHash.hsl(acc);
  }
  updateMatch({d, i, c}, entry, instanceG) {
    const g = d3.select(c[i]);
    const color = this.getColor(entry);
    const matchG = g.selectAll(`.${s(`${this.className}-match`)}`)
      .data(d);
    if (instanceG && d.length > 1) {
      // Line connecting Disjunctive matches of an entry
      instanceG.enter().append('line')
        .attr('x1', this.x(Math.min(...(d.map(x => x[0])))))
        .attr('y1', this.trackHeight / 2)
        .attr('x2', this.x(Math.max(...(d.map(x => x[1])))))
        .attr('y2', this.trackHeight / 2)
        .attr('stroke', color)
      ;
    }
    matchG.exit().remove();

    matchG.enter().append('rect')
      .attr('class', s(`${this.className}-match`))
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
    if (entry.signatures) {
      if (instanceG.node()) {
        const p = d3.select(instanceG.node().parentNode);
        p.selectAll('.signatures-bg')
          .attr('opacity', entry.signatures.length ? 0 : 1)
          .transition()
          .attr('opacity', entry.signatures.length ? 1 : 0);
      }
      matchG.enter().each(m => {
        instanceG.enter().append('rect')
          .attr('class', 'signatures-bg')
          .attr('x', this.x(m[0]))
          .attr('y', this.trackHeight - 1)
          .attr('height', 1 + entry.signatures.length * (
              this.signatureRender.trackHeight +
              this.signatureRender.tPadding.top +
              this.signatureRender.tPadding.bottom
            ) + (entry.signatures.length ? this.signatureRender.tPadding.bottom : 0))
          .attr('width', this.x(m[1] - m[0]))
          .style('fill', `rgba(${this.getColor(entry, 'RGB').join()},0.3)`)
          .style('stroke', this.getColor(entry))
          .attr('stroke-dasharray', '1,3');
      });
    }
  }
}
export default EntryRenderer;
