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
        {duration: 250, easing: 'ease-in-out', delay: i++ * 25, fill: 'both'}
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
                ref={node => {this._animatables.add(node)}}
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
  `${protocol}//${hostname}:${port}${root}entry`
);
// const urlFromState = console.log;

export default loadData(urlFromState)(ByMemberDatabase);
