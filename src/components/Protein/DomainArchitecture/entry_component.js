/* eslint-disable no-param-reassign */
import {
  select,
  scaleLinear,
  zoom,
  entries,
  dispatch,
  mouse,
  axisTop,
  event as d3Event,
} from 'd3';

import EntryRenderer from './entry';

import classname from 'classnames/bind';

import styles from './style.css';

const s = classname.bind(styles);

const proteinHeight = 2;
let proteinWidth = 0;
const height = 2000;
const numberOfTicks = 10;
const padding = {
  top: 20,
  bottom: 0,
  left: 10,
  right: 100,
};
const trackPadding = {
  top: 4,
  bottom: 4,
  left: 5,
  right: 5,
};
const maxZoom = 4;

class EntryComponent {
  constructor(container, protein, data) {
    const svg = (this.svg = select(container)
      .append('svg')
      .attr('width', '100%'));
    this.defs = svg.append('defs');
    const width = svg.style('width').replace('px', '');
    proteinWidth = width - padding.left - padding.right;

    this.mainG = svg.append('g').attr('class', s('domains'));
    this.x = scaleLinear()
      .domain([0, protein.length])
      .range([0, proteinWidth]);

    this.protein = protein;
    this.dispatch = dispatch('entryclick', 'entrymouseover', 'entrymouseout');

    this.data = data;
    this.addGuideRect();
    // Redraw based on the new size whenever the browser window is resized.
    window.addEventListener('resize', this.windowResizer);
  }
  set data(value) {
    this.sortedData = entries(value).sort((a, b) => {
      const firsts = ['family', 'domain'];
      const lasts = ['residues', 'features', 'predictions'];
      for (const label of firsts) {
        if (a.key.toLowerCase() === label) return 0;
        if (b.key.toLowerCase() === label) return 1;
      }
      for (const l of lasts) {
        if (a.key.toLowerCase() === l) return 1;
        if (b.key.toLowerCase() === l) return 0;
      }
      return a.key > b.key ? 1 : 0;
    });
    this.render(true);
  }
  windowResizer = () => {
    requestAnimationFrame(() => {
      const width = this.svg.style('width').replace('px', '');
      proteinWidth = width - padding.left - padding.right;
      this.x = scaleLinear()
        .domain([0, this.protein.length])
        .range([0, proteinWidth]);
      this.render();
    });
  };
  addGuideRect() {
    this.mainG
      .insert('rect', `.${s('protein')}`)
      .attr('class', s('guide'))
      .attr('x', padding.left)
      .attr('y', padding.top)
      .attr('width', 1)
      .attr('height', 1)
      // .style('stroke', 'rgb(151, 151, 168)');
      // .style('fill', 'rgba(137, 140, 77, 0.9)');
      // .style('fill', 'rgba(0, 0, 0, 0.1)');
      .style('fill', 'rgba(255, 235, 59, 0.5)');
    this.overFeature = null;
    this.mainG.on('mousemove', () => this.renderGuide());
  }
  renderGuide() {
    this.mainG
      .select(`.${s('guide')}`)
      .attr('height', this.totalHeight)
      .attr(
        'width',
        this.overFeature
          ? Math.max(this.x(this.overFeature[1] - this.overFeature[0]), 1)
          : 1,
      )
      .attr(
        'x',
        this.overFeature
          ? padding.left + this.x(this.overFeature[0])
          : Math.min(this.x(this.protein.length), mouse(this.mainG.node())[0]),
      );
  }
  render(reset = false) {
    let offsetY = 10;
    this.addAxis();
    offsetY += this.updateProtein();

    const entriesG = this.mainG
      .selectAll(`.${s('entries')}`)
      .data(this.sortedData, d => d.key);

    entriesG
      .enter()
      .append('g')
      .attr('transform', `translate(${padding.left}, ${offsetY})`)
      .attr('class', d => s('entries', d.key))
      .each(d => {
        d.value.expanded = true;
        d.value.height = 0;
      })
      .call(selection => this.updateEntriesBlock(selection, offsetY));
    // .each(d => this.addEntriesBlock(d.value, protein, offsetY, d.key))

    if (reset)
      entriesG.each(d => {
        d.value.expanded = true;
        d.value.height = 0;
      });
    entriesG.call(selection =>
      this.updateEntriesBlock(selection, offsetY, false),
    );
    this.totalHeight =
      offsetY +
      this.sortedData.reduce((acc, v) => acc + v.value.height, 0) +
      this.sortedData.length * (trackPadding.bottom + trackPadding.top);
    this.svg.transition().attr('height', this.totalHeight);
  }

  addAxis() {
    const xAxis = axisTop(this.x)
      .ticks(numberOfTicks)
      .tickSize(-height);
    const customXaxis = g => {
      g.call(xAxis);
      g
        .selectAll('.tick line')
        .attr('stroke', '#dddddd')
        .attr('stroke-dasharray', '4,2');
      g.select('.tick:first-of-type line').remove();
      g.select('.domain').remove();
    };
    const bg = this.mainG.selectAll('rect').data([this.protein]);
    bg
      .enter()
      .append('rect')
      .attr('width', proteinWidth)
      .attr('height', height)
      .attr('x', padding.left)
      .attr('y', padding.top)
      .style('fill', 'rgba(0,0,0,0.08)');
    bg.attr('width', proteinWidth);
    const axis = this.mainG.selectAll('g').data([this.protein]);

    axis
      .enter()
      .append('g')
      .attr('class', s('axis'))
      .attr('transform', `translate(${padding.left}, ${padding.top})`)
      .call(customXaxis);
    axis.call(customXaxis);
  }

  updateProtein() {
    const prot = this.mainG.selectAll(`.${s('protein')}`).data([this.protein]);
    const protG = prot
      .enter()
      .append('g')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)
      .attr('class', s('protein'));
    protG
      .append('rect')
      .attr('width', d => this.x(d.length))
      .attr('height', proteinHeight)
      .attr('rx', proteinHeight / 2)
      .attr('ry', proteinHeight / 2)
      .style('cursor', 'zoom-in')
      .on('mouseover', () => {
        protG
          .selectAll('rect')
          .style('cursor', d3Event.shiftKey ? 'zoom-out' : 'zoom-in');
      })
      .call(
        zoom()
          .scaleExtent([1, maxZoom])
          .on('zoom', () => {
            const evt = d3Event.transform;
            this.mainG.attr(
              'transform',
              `translate(${evt.x}, 0) scale(${evt.k}, 1)`,
            );
          }),
      );
    prot.selectAll('rect').attr('width', d => this.x(d.length));

    protG
      .append('text')
      .attr('x', d => trackPadding.right + this.x(d.length))
      // eslint-disable-next-line no-magic-numbers
      .attr('y', proteinHeight)
      .style('font-size', '0.8em')
      .text(d => `${d.length} aa`);
    prot.selectAll('text').attr('x', d => this.x(d.length));
    return proteinHeight + trackPadding.bottom * 2;
  }
  updateEntriesBlock(entriesG, offsetY, isNew = true) {
    if (isNew) {
      entriesG
        .append('rect')
        .attr('class', 'bg-section')
        .attr('width', this.x(this.protein.length))
        .style('fill', 'rgba(0,0,0,0.05)');

      entriesG
        .append('text')
        .attr('class', s('header-section'))
        .attr('x', '1em')
        .attr('y', '1em')
        .style('cursor', 'pointer')
        .on('click', d => {
          d.value.expanded = !d.value.expanded;
          this.render();
        });
    }
    entriesG
      .selectAll(`text.${s('header-section')}`)
      .text(d => `${d.value.expanded ? '▾' : '▸'} ${d.key}`);
    const trackHeight = select(`text.${s('header-section')}`)
      .node()
      .getBBox().height;
    entriesG.each((d, i, c) => {
      d.value.height = trackHeight;
      const entryRenderer = new EntryRenderer({
        trackHeight,
        trackPadding,
        padding,
        xScale: this.x,
        protein: this.protein,
        parent: this,
      });

      // if (d.key === 'residues'){
      //   entryRenderer.renderResidues(
      //     select(c[i]), d.value.expanded ? d.value : [], trackHeight
      //   );
      // } else {
      entryRenderer.render(
        select(c[i]),
        d.value.expanded ? d.value : [],
        trackHeight,
        'entry',
        this.colorMode,
      );
      // }
    });
    let x = 0;
    entriesG.transition().attr('transform', (d, i) => {
      const y =
        offsetY +
        i * (trackPadding.top + trackPadding.bottom + trackHeight) +
        x;
      x += d.value.height;
      d.value.height += trackHeight;
      return `translate(${padding.left}, ${y})`;
    });
    entriesG
      .select('.bg-section')
      .transition()
      .attr('width', this.x(this.protein.length))
      .attr('height', d => d.value.height);
  }
  destructor() {
    window.removeEventListener('resize', this.windowResizer);
  }
  collapseAll() {
    for (const entryGroup of this.sortedData) {
      for (const entry of entryGroup.value) {
        if (entry.children && entry.children.length) {
          entry._children = entry.children;
          entry.children = [];
        }
      }
    }
    this.render();
  }
  expandAll() {
    for (const entryGroup of this.sortedData) {
      for (const entry of entryGroup.value) {
        if (entry._children && entry._children.length) {
          entry.children = entry._children;
          entry._children = [];
        }
      }
    }
    this.render();
  }
  on(...args) {
    this.dispatch.on(...args);
  }
  changeColorMode(mode) {
    this.colorMode = mode;
    this.render();
  }
}
export default EntryComponent;
