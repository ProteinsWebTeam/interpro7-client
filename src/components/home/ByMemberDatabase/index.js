import React, {Component, PropTypes as T} from 'react';

import {foundationPartial} from 'styles/foundation';
import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';
import loadData from 'higherOrder/loadData';

import {memberDB} from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

const DEFAULT_DELAY = 25;
const DEFAULT_DURATION = 250;
const DEFAULT_ANIMATION = {
  duration: DEFAULT_DURATION,
  easing: 'ease-in-out',
  fill: 'both',
};

class ByMemberDatabase extends Component {
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
    const counts = payload && payload.entries.member_databases;
    return (
      <div>
        <div className={f('row')}>
          {
            memberDB.map((e) => (
              <div
                className={f('columns', 'medium-3', 'large-3', 'text-center')}
                ref={node => {
                  this._animatables.add(node);
                }}
                key={e.name}
              >
                <Link to={e.to}>
                  <MemberSymbol type={e.type}/>
                  <h6 data-tooltip title={e.title}>
                    {e.name}
                  </h6>
                  <p>
                    <small>{e.version}</small><br/>
                    <span className={f('count', {visible: payload})}>
                      {counts && e.apiType && counts[e.apiType] || ''}
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
  `${protocol}//${hostname}:${port}${root}/entry`
);
// const urlFromState = console.log;

export default loadData(urlFromState)(ByMemberDatabase);
