import React, {Component, PropTypes as T} from 'react';

import {foundationPartial} from 'styles/foundation';
import Link from 'components/generic/Link';
import {InterproSymbol} from 'components/Title';
import loadData from 'higherOrder/loadData';

import {entryType} from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from '../ByMemberDatabase/styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

const DEFAULT_DELAY = 25;
const DEFAULT_DURATION = 250;
const DEFAULT_ANIMATION = {
  duration: DEFAULT_DURATION,
  easing: 'ease-in-out',
  fill: 'both',
};

class ByEntryType extends Component {
  static propTypes = {
    data: T.object.isRequired,
  };

  constructor(props) {
    super(props);
    this._animatables = new Set();
  }

  componentDidMount() {
    let i = 0;
    for (const node of this._animatables) {
      if (!node.animate) return;
      node.animate(
        {opacity: [0, 1]},
        {...DEFAULT_ANIMATION, delay: DEFAULT_DELAY * i++}
      );
    }
  }

  render() {
    const {data: {payload}} = this.props;
    const counts = payload && Object.entries(payload).reduce(
      (p, c) => {
        const out = p;
        out[c[0].toLowerCase()] = c[1];
        return out;
      },
      {}
    );
    return (
      <div>
        <div className={f('row')}>
          {
            entryType.map((e, i) => (
              <div
                className={f('columns', 'medium-4', 'large-4', 'text-center')}
                ref={node => {
                  this._animatables.add(node);
                }}
                key={i}
              >
                <Link to={`/entry?type=${e.type}`}>
                  <div className={f('svg-container')}>
                    <InterproSymbol type={e.type}/>
                  </div>
                  <h5 data-tooltip title={e.title}>
                    {e.type}
                    &nbsp;
                    <span
                      className={f('small', 'icon', 'icon-generic')}
                      data-icon="i" data-tooltip
                      title={e.description}
                    />
                  </h5>
                  <p>
                    <span className={f('count', {visible: payload})}>
                      {counts && e.type && counts[e.type.toLowerCase()] || ''}
                      {e.type === 'new' ? ' ' : ' entries'}
                    </span>
                  </p>
                </Link>
              </div>
            ))
          }
        </div>
        <Link to="/entry" className={f('button')}>View all entries</Link>
      </div>
    );
  }
}

const urlFromState = ({settings: {api: {protocol, hostname, port, root}}}) => (
  `${protocol}//${hostname}:${port}${root}/entry?group_by=type`
);
// const urlFromState = console.log;

export default loadData(urlFromState)(ByEntryType);
