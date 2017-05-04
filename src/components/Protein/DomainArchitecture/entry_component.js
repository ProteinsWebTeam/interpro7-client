/* eslint-disable no-param-reassign */
import * as d3 from 'd3';

import EntryRenderer from './entry';

import classname from 'classnames/bind';
import styles from './style.css';
const s = classname.bind(styles);

const proteinHeight = 10;
let proteinWidth = 0;
const height = 2000;
const numberOfTicks = 10;
const padding = {
  top: 30,
  bottom: 0,
  left: 10,
  right: 100,
};
const trackPadding = {
  top: 4,
  bottom: 2,
  left: 5,
  right: 5,
};
const maxZoom = 4;

class EntryComponent {
  constructor(container, protein, data){
    const svg = this.svg = d3.select(container)
      .append('svg')
      .attr('width', '100%');
    this.defs = svg.append('defs');
    const width = svg.style('width').replace('px', '');
    proteinWidth = width - padding.left - padding.right;

    this.mainG = svg.append('g')
      .attr('class', s('domains'));
    this.x = d3.scaleLinear()
      .domain([0, protein.length])
      .range([0, proteinWidth]);
    this.data = data;
    this.sortedData = d3.entries(this.data).sort((a, b) => {
      if (a.key.toLowerCase() === 'family') return 0;
      if (b.key.toLowerCase() === 'family') return 1;
      if (a.key.toLowerCase() === 'domain') return 0;
      if (b.key.toLowerCase() === 'domain') return 1;
      return (a.key > b.key) ? 1 : 0;
    });

    this.protein = protein;
    this.dispatch = d3.dispatch('entryclick', 'entrymouseover', 'entrymouseout');

    this.render();
    // Redraw based on the new size whenever the browser window is resized.
    window.addEventListener('resize', this.windowResizer);
  }
  windowResizer = () => {
    requestAnimationFrame(() => {
      const width = this.svg.style('width').replace('px', '');
      proteinWidth = width - padding.left - padding.right;
      this.x = d3.scaleLinear()
        .domain([0, this.protein.length])
        .range([0, proteinWidth]);
      this.render();
    });
  };
  render(){
    let offsetY = padding.top;
    this.addAxis();
    offsetY += this.updateProtein();

    const entriesG = this.mainG.selectAll(`.${s('entries')}`)
      .data(this.sortedData, d => d.key);

    entriesG.enter()
      .append('g')
      .attr('transform', `translate(${padding.left}, ${offsetY})`)
      .attr('class', s('entries'))
      .each(d => {
        d.value.expanded = true;
        d.value.height = 0;
      })
      .call(selection => this.updateEntriesBlock(selection, offsetY))
      // .each(d => this.addEntriesBlock(d.value, protein, offsetY, d.key))
    ;

    entriesG
      .call(selection => this.updateEntriesBlock(selection, offsetY, false));

    this.svg.transition()
      .attr('height', offsetY +
      this.sortedData.reduce((acc, v) => acc + v.value.height, 0) +
      this.sortedData.length * (trackPadding.bottom + trackPadding.top)
    );
  }

  addAxis(){
    const xAxis = d3.axisTop(this.x)
      .ticks(numberOfTicks)
      .tickSize(-height);
    const customXaxis = g => {
      g.call(xAxis);
      g.selectAll('.tick line')
        .attr('stroke', '#BBB')
        .attr('stroke-dasharray', '4,2');
      g.select('.tick:first-of-type line').remove();
      g.select('.domain').remove();
    };
    const bg = this.mainG.selectAll('rect')
      .data([this.protein]);
    bg.enter()
        .append('rect')
        .attr('width', proteinWidth)
        .attr('height', height)
        .attr('x', padding.left)
        .attr('y', padding.top)
        .style('fill', '#DDE');
    bg.attr('width', proteinWidth);
    const axis = this.mainG.selectAll('g')
      .data([this.protein]);

    axis.enter()
      .append('g')
        .attr('class', s('axis'))
        .attr('transform', `translate(${padding.left}, ${padding.top})`)
        .call(customXaxis);
    axis.call(customXaxis);
  }

  updateProtein() {
    const prot = this.mainG.selectAll(`.${s('protein')}`)
      .data([this.protein]);
    const protG = prot.enter()
      .append('g')
        .attr('transform', `translate(${padding.left}, ${padding.top})`)
        .attr('class', s('protein'));
    protG.append('rect')
      .attr('width', d => this.x(d.length))
      .attr('height', proteinHeight)
      .attr('rx', proteinHeight / 2)
      .attr('ry', proteinHeight / 2)
      .style('cursor', 'zoom-in')
      .on('mouseover', () => {
        protG.selectAll('rect')
          .style('cursor', d3.event.shiftKey ? 'zoom-out' : 'zoom-in');
      })
      .call(d3.zoom()
        .scaleExtent([1, maxZoom])
        .on('zoom', () => {
          const evt = d3.event.transform;
          this.mainG.attr('transform', `translate(${evt.x}, 0) scale(${evt.k}, 1)`);
        }));
    prot.selectAll('rect')
      .attr('width', d => this.x(d.length));

    protG.append('text')
      .attr('x', d => trackPadding.right + this.x(d.length))
      // eslint-disable-next-line no-magic-numbers
      .attr('y', proteinHeight)
      .style('font-size', '0.8em')
      .text(d => d.length);
    prot.selectAll('text')
      .attr('x', d => this.x(d.length));
    return proteinHeight + trackPadding.bottom * 2;
  }
  updateEntriesBlock(entriesG, offsetY, isNew = true){
    if (isNew){
      entriesG.append('rect')
        .attr('class', 'bg-section')
        .attr('width', this.x(this.protein.length))
        .style('fill', 'rgba(255,255,255,0.4)');

      entriesG.append('text')
        .attr('class', s('header-section'))
        .attr('x', '1em')
        .attr('y', '1em')
        .style('cursor', 'pointer').on('click', (d) => {
          d.value.expanded = !d.value.expanded;
          this.render();
        });
    }
    entriesG.selectAll(`text.${s('header-section')}`)
      .text(d => `${d.value.expanded ? '-' : '+'} ${d.key}`);
    const trackHeight = d3.select(`text.${s('header-section')}`).node().getBBox().height;
    entriesG.each((d, i, c) => {
      d.value.height = trackHeight;
      const entryRenderer = new EntryRenderer({
        trackHeight,
        trackPadding,
        padding,
        xScale: this.x,
        protein: this.protein,
        parent: this,
      }
      );
      entryRenderer.render(d3.select(c[i]), d.value.expanded ? d.value : [], trackHeight);
    });
    let x = 0;
    entriesG.transition().attr('transform', (d, i) => {
      const y = offsetY + i * (trackPadding.top + trackPadding.bottom + trackHeight) + x;
      x += d.value.height;
      d.value.height += trackHeight;
      return `translate(${padding.left}, ${y})`;
    });
    entriesG.select('.bg-section')
      .transition()
      .attr('width', this.x(this.protein.length))
      .attr('height', d => d.value.height);
  }
  destructor(){
    window.removeEventListener('resize', this.windowResizer);
  }
  collapseAll(){
    for (const entryGroup of this.sortedData){
      for (const entry of entryGroup.value){
        if (entry.signatures && entry.signatures.length) {
          entry._signatures = entry.signatures;
          entry.signatures = [];
        }
      }
    }
    this.render();
  }
  expandAll(){
    for (const entryGroup of this.sortedData){
      for (const entry of entryGroup.value){
        if (entry._signatures && entry._signatures.length) {
          entry.signatures = entry._signatures;
          entry._signatures = [];
        }
      }
    }
    this.render();
  }
  on(...args){
    this.dispatch.on(...args);
  }
}
export default EntryComponent;
