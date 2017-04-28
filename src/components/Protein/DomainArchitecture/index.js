import React, {Component} from 'react';
import T from 'prop-types';

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
  left: 20,
  right: 100,
};
const trackPadding = {
  top: 4,
  bottom: 2,
  left: 5,
  right: 5,
};

class DomainArchitecture extends Component {
  static propTypes = {
    protein: T.object,
    data: T.object,
  };
  componentDidMount(){
    const {protein, data: {family, domain}} = this.props;
    const svg = d3.select(this._container)
      .append('svg')
      .attr('width', '100%');
    const width = svg.style('width').replace('px', '');
    proteinWidth = width - padding.left - padding.right;

    this.mainG = svg.append('g')
      .attr('class', s('domains'));
    this.x = d3.scaleLinear()
      .domain([0, protein.length])
      .range([0, proteinWidth]);


    this.entryRenderer = new EntryRenderer({
      trackHeight: 0,
      trackPadding,
      padding,
      xScale: this.x,
      protein}
    );
    const panelHeight = this.drawContent(family, domain, protein);
    svg.attr('height', panelHeight);
  }
  shouldComponentUpdate(){
    return false;
  }
  drawContent(family, domain, protein){
    let offsetY = padding.top;
    this.addAxis();
    offsetY += this.addProtein(protein);
    offsetY += this.addEntriesBlock(family, protein, offsetY, 'Families');
    offsetY += trackPadding.bottom * 2;
    offsetY += this.addEntriesBlock(domain, protein, offsetY, 'Domains');
    return offsetY;
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

    this.mainG.append('rect')
      .attr('width', proteinWidth)
      .attr('height', height)
      .attr('x', padding.left)
      .attr('y', padding.top)
      .style('fill', '#DDE');

    this.mainG.append('g')
      .attr('class', s('axis'))
      .attr('transform', `translate(${padding.left}, ${padding.top})`)
      .call(customXaxis);
  }

  addProtein(protein) {
    // Protein
    const protG = this.mainG.append('g')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)
      .attr('class', s('protein'));
    protG.append('rect')
      .attr('width', this.x(protein.length))
      .attr('height', proteinHeight)
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', proteinHeight / 2)
      .attr('ry', proteinHeight / 2);

    protG.append('text')
      .attr('x', this.x(protein.length))
      // eslint-disable-next-line no-magic-numbers
      .attr('y', -3)
      .attr('text-anchor', 'middle')
      .text(protein.length);
    return proteinHeight + trackPadding.bottom * 2;
  }
  addEntriesBlock(entries, protein, offsetY, subtitle){
    const familiesG = this.mainG.append('g')
      .attr('transform', `translate(${padding.left}, ${offsetY})`)
      .attr('class', s('families'));
    const bg = familiesG.append('rect')
      .attr('class', 'bg-section')
      .attr('width', this.x(protein.length))
      .style('fill', 'rgba(255,255,255,0.4)');
    const title = familiesG.append('text')
      .attr('class', s('header-section'))
      .attr('x', padding.left + trackPadding.left)
      .attr('y', '1em')
      .attr('text-anchor', 'middle')
      .text(subtitle);
    const trackHeight = title.node().getBBox().height;
    let innerHeight = this.entryRenderer.trackHeight = trackHeight;
    this.entryRenderer.render(familiesG, entries, trackHeight);
    innerHeight +=
      this.entryRenderer.innerHeight +
      trackPadding.top +
      trackPadding.bottom;
    bg.attr('height', innerHeight);
    return innerHeight;
  }
  render(){
    return (
      <div>
        <div ref={e => this._container = e}/>
      </div>
    );
  }
}
export default DomainArchitecture;
