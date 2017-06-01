import React, {Component} from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import {createSelector} from 'reselect';

import loadData from 'higherOrder/loadData';

import styles from './style.css';
import {foundationPartial} from 'styles/foundation';

const f = foundationPartial(styles);

const colors = {
  gene3d: '#a88cc3',
  cdd: '#addc58',
  hamap: '#00e2e2',
  panther: '#bfac92',
  pfam: '#6287b1',
  pirsf: '#dfafdf',
  prints: '#4fd829',
  prodom: '#8d99e4',
  profile: '#ff9229',
  prosite: '#ffc300',
  sfld: '#00b1d3',
  smart: '#ff7a76',
  ssf: '#686868',
  tigrfams: '#4f9294',
  InterPro: '#2199E8',
};

class MemberDBTabs extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }),
  }
  constructor(){
    super();
    this.state = {collapsed: false};
  }
  handleExpansion = () => {
    this.setState({collapsed: !this.state.collapsed});
  }
  render() {
    const {data: {loading, payload}} = this.props;
    let tabs = [];
    if (!loading){
      tabs = [{name: 'InterPro', to: '/entry/interpro', value: payload.entries.interpro}]
        .concat(
          Object.keys(payload.entries.member_databases)
            .sort()
            .map(e => ({
              name: e,
              to: `/entry/${e}`,
              value: payload.entries.member_databases[e],
            }))
          );
    }
    return (
      <div>
        <button onClick={this.handleExpansion} className={f('expand-button')}>
          {this.state.collapsed ? '≫' : '≪'}
        </button>
        <ul className={f('vertical', 'tabs', {collapsed: this.state.collapsed})}>
          {
            tabs.map((e, i) => (
              <li className={f('tabs-title')} key={i}>
                <Link
                  to={e.to}
                  activeClass={f('is-active', 'is-active-tab')}
                  style={{borderLeftColor: e.name in colors ? colors[e.name] : null}}
                >
                  {e.name} <small>({e.value})</small>
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
    );
  }
}
// const mapStateToProps = createSelector(
//   state => state.location.pathname,
//   (pathname) => ({pathname})
// );
const getMemberDBUrl = createSelector(
  state => state.settings.api,
  state => state.location.search,
  ({protocol, hostname, port, root}) => (
    `${protocol}//${hostname}:${port}${root}/entry`
  )
);

export default loadData(getMemberDBUrl)(MemberDBTabs);
