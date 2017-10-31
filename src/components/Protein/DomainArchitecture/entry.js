/* eslint-disable no-param-reassign */
import { select } from 'd3';
import ColorHash from 'color-hash/lib/color-hash';
import classname from 'classnames/bind';

import styles from './style.css';

const s = classname.bind(styles);
const colorHash = new ColorHash();
const childrenScale = 0.7;

// TODO: refactor to have a single place for colors
const colorsByDB = {
  gene3d: '#a88cc3',
  cdd: '#addc58',
  hamap: '#2cd6d6',
  mobidblt: '#d6dc94',
  panther: '#bfac92',
  pfam: '#6287b1',
  pirsf: '#dfafdf',
  prints: '#54c75f',
  prodom: '#8d99e4',
  profile: '#f69f74',
  prosite: '#f3c766',
  sfld: '#00b1d3',
  smart: '#ff7a76',
  ssf: '#686868',
  tigrfams: '#56b9a6',
  interpro: '#2daec1',
  pdb: '#74b360',
};

export const EntryColorMode = {
  COLOR_MODE_ACCESSION: 1,
  COLOR_MODE_MEMBERDB: 2,
  COLOR_MODE_DOMAIN_RELATIONSHIP: 3,
};

class EntryRenderer {
  constructor({ trackHeight, trackPadding, padding, xScale, protein, parent }) {
    this.tPadding = trackPadding;
    this.trackHeight = trackHeight;
    this.padding = padding;
    this.protein = protein;
    this.x = xScale;
    this.parent = parent;
    this.colorMode = EntryColorMode.COLOR_MODE_DOMAIN_RELATIONSHIP;
  }
  render(
    group,
    entries,
    offsetY = 0,
    className = 'entry',
    colorMode = EntryColorMode.COLOR_MODE_DOMAIN_RELATIONSHIP,
  ) {
    this.offsetY = offsetY;
    this.group = group;
    this.entries = entries;
    this.className = className;
    this.colorMode = colorMode;
    this.childrenRender = new EntryRenderer({
      trackHeight: this.trackHeight * childrenScale,
      trackPadding: {
        bottom: this.tPadding.bottom - 1,
        top: this.tPadding.top - 2,
        left: this.tPadding.left,
        right: this.tPadding.right,
      },
      padding: this.padding,
      xScale: this.x,
      protein: this.protein,
      parent: this.parent,
    });
    this.update();
  }
  update() {
    this.innerHeight = 0;
    const interproG = this.group
      .selectAll(`.${s(this.className)}`)
      .data(this.entries, d => d.label || d.accession);
    interproG.each((d, i, c) => {
      this.updateEntry({ d, i, c });
      // this.updateInlineResidues({d, i, c});
    });
    interproG
      .enter()
      .append('g')
      .attr('class', s(this.className))
      .attr('transform', 'scale(1,0)')
      .each((d, i, c) => this.updateEntry({ d, i, c }))
      // .each((d, i, c) => this.updateInlineResidues({d, i, c}))
      .append('text')
      .attr('class', d =>
        s({
          label: true,
          link: typeof d.link !== 'undefined',
        }),
      )
      .attr('x', this.tPadding.right + this.x(this.protein.length))
      .attr('y', this.trackHeight)
      .text(d => d.label || d.accession)
      .on('click', e => this.parent.dispatch.call('entryclick', this, e));
    interproG
      .selectAll(`.${s(this.className)} .label`)
      .attr('x', this.tPadding.right + this.x(this.protein.length));

    interproG
      .exit()
      .transition()
      .attr('transform', 'scale(1,0)')
      .remove();
    this.entries.height += this.innerHeight;
  }

  updateEntry({ d, i, c }) {
    const g = select(c[i]);
    const tHeight = this.trackHeight + this.tPadding.bottom + this.tPadding.top;
    const instanceG = g
      .selectAll(`.${s(`${this.className}-instance`)}`)
      .data(d.coordinates);
    instanceG.each((data, i, c) => {
      this.updateMatch({ d: data, i, c }, d, instanceG);
    });
    instanceG
      .enter()
      .append('g')
      .attr('class', s(`${this.className}-instance`))
      .on('mouseover', (e, i, g) =>
        this.parent.dispatch.call('entrymouseover', this, {
          entry: d,
          event: { d: e, i, g },
        }),
      )
      .on('mouseout', () => this.parent.dispatch.call('entrymouseout', this, d))
      .each((data, i, c) => {
        this.updateMatch({ d: data, i, c }, d, instanceG);
        // this.updateChildrenBg(instanceG, parentNode, entry, d);
      });
    instanceG.exit().remove();

    g
      .transition()
      .attr(
        'transform',
        `scale(1,1)translate(0, ${this.offsetY + this.innerHeight})`,
      );
    this.innerHeight += tHeight;
    if (d.children) {
      this.childrenRender.render(
        g,
        d.children,
        tHeight - this.tPadding.top,
        d.signatures ? 'signature' : 'residue',
        this.colorMode,
      );
      this.innerHeight += this.childrenRender.innerHeight;
    }
    instanceG
      .enter()
      .each((data, i, c) =>
        this.updateChildrenBg({ d: data, i, c }, d, instanceG),
      );
    instanceG.each((data, i, c) =>
      this.updateChildrenBg({ d: data, i, c }, d, instanceG),
    );
  }

  getColor(entry) {
    switch (this.colorMode) {
      case EntryColorMode.COLOR_MODE_ACCESSION: {
        const acc = entry.accession
          .split('')
          .reverse()
          .join('');
        return colorHash.hex(acc);
      }
      case EntryColorMode.COLOR_MODE_MEMBERDB:
        return colorsByDB[entry.source_database.toLowerCase()];
      case EntryColorMode.COLOR_MODE_DOMAIN_RELATIONSHIP:
        if (entry.source_database.toLowerCase() === 'interpro')
          return colorHash.hex(
            entry.accession
              .split('')
              .reverse()
              .join(''),
          );
        if (entry.entry_integrated) {
          return colorHash.hex(
            entry.entry_integrated
              .split('')
              .reverse()
              .join(''),
          );
        }
      default:
        return '#AAAAAA';
    }
  }
  updateMatch({ d, i, c }, entry, instanceG) {
    const g = select(c[i]);
    const parentNode = instanceG.node()
      ? select(instanceG.node().parentNode)
      : null;
    const matchG = g.selectAll(`.${s(`${this.className}-match`)}`).data(d);
    // Commented out because current InterPro doesn't support Disjunctive matches.
    //
    // if (instanceG && d.length > 1) {
    //   // Line connecting Disjunctive matches of an entry
    //   instanceG.enter().append('line')
    //     .attr('class', 'full-match')
    //     .attr('x1', this.x(Math.min(...(d.map(x => x[0])))))
    //     .attr('y1', this.trackHeight / 2)
    //     .attr('x2', this.x(Math.max(...(d.map(x => x[1])))))
    //     .attr('y2', this.trackHeight / 2)
    //     .attr('stroke', this.getColor(entry));
    //   if (parentNode) {
    //     parentNode.selectAll('line.full-match')
    //       .attr('x1', this.x(Math.min(...(d.map(x => x[0])))))
    //       .attr('x2', this.x(Math.max(...(d.map(x => x[1])))));
    //   }
    // }
    matchG.attr('fill', this.getColor(entry));
    matchG.exit().remove();

    matchG
      .enter()
      .append('rect')
      .attr('class', s(`${this.className}-match`))
      .attr('width', m => this.x(Math.max(m[1] - m[0], 1)))
      .attr('height', this.trackHeight)
      .attr('x', m => this.x(m[0]))
      .attr('fill', this.getColor(entry))
      .attr('rx', 2)
      .attr('ry', 2)
      .on('click', () => {
        if (entry.children && entry.children.length) {
          entry._children = entry.children;
          entry.children = [];
        } else if (entry._children && entry._children.length) {
          entry.children = entry._children;
          entry._children = [];
        }
        this.parent.render();
      })
      .on('mouseover', d => (this.parent.overFeature = d))
      .on('mouseout', () => (this.parent.overFeature = null));
    if (parentNode) {
      parentNode
        .selectAll(`rect.${s(`${this.className}-match`)}`)
        .attr('x', m => this.x(m[0]))
        .attr('width', m => this.x(Math.max(m[1] - m[0], 1)));
    }
  }
  updateChildrenBg({ d, i, c }, entry, instanceG) {
    if (
      (entry.children && entry.children.length) ||
      (entry._children && entry._children.length)
    ) {
      const g = select(c[i]);
      const parentNode = instanceG.node()
        ? select(instanceG.node().parentNode)
        : null;
      const matchBG = g
        .selectAll(`.${s(`${this.className}-children-bg`)}`)
        .data(d);
      matchBG.exit().remove();

      matchBG
        .enter()
        .insert('rect', ':first-child')
        .attr('class', s(`${this.className}-children-bg`))
        .attr('x', m => this.x(m[0]))
        .attr('y', this.trackHeight - 1)
        .attr('height', this.childrenRender.innerHeight + this.tPadding.bottom)
        .attr('width', m => this.x(m[1] - m[0]))
        .style('fill', 'rgba(0,0,0,0.0)')
        .style('stroke', '#000')
        .attr('stroke-dasharray', '1,3');

      if (parentNode) {
        parentNode
          .selectAll(`rect.${s(`${this.className}-children-bg`)}`)
          .attr('x', m => this.x(m[0]))
          .attr('y', this.trackHeight - 1)
          .transition()
          .attr(
            'height',
            this.childrenRender.innerHeight + this.tPadding.bottom,
          )
          .attr('width', m => this.x(m[1] - m[0]));
      }
    }
  }
  updateInlineResidues({ d, i, c }) {
    const g = select(c[i]);
    if (d.residues) {
      const residuesG = g
        .selectAll(`.${s(`${this.className}-residues`)}`)
        .data([d]);
      // instanceG.each((data, i, c) => this.updateMatch({d: data, i, c}, d, instanceG));
      const resG = residuesG
        .enter()
        .append('g')
        .attr('class', s(`${this.className}-residues`));

      const residue = resG
        .selectAll(`.${s(`${this.className}-residue`)}`)
        .data(d.residues);

      residuesG
        .selectAll(`.${s(`${this.className}-residue`)}`)
        .attr('x', m => this.x(m.from))
        .attr('width', m => this.x(Math.max(m.to - m.from, 1)));
      residue
        .enter()
        .append('rect')
        .attr('class', s(`${this.className}-residue`))
        .attr('x', m => this.x(m.from))
        .attr('height', this.trackHeight)
        .attr('width', m => this.x(Math.max(m.to - m.from, 1)))
        .on('mouseover', (e, i, g) =>
          this.parent.dispatch.call('entrymouseover', this, {
            residue: e,
            event: { d: e, i, g: [g[i]] },
          }),
        )
        .on('mouseout', () =>
          this.parent.dispatch.call('entrymouseout', this, d),
        );
    }
  }
}
export default EntryRenderer;
