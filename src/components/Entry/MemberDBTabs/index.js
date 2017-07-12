import React, { Component, PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import AnimatedEntry from 'components/AnimatedEntry';
import NumberLabel from 'components/NumberLabel';
import Link from 'components/generic/Link';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';
import styles from './style.css';

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

class MemberDBTab extends PureComponent {
  static propTypes = {
    newTo: T.oneOfType([T.object, T.func]).isRequired,
    name: T.string.isRequired,
    value: T.number.isRequired,
  };

  render() {
    const { newTo, name, value } = this.props;
    const style = { color: colors[name] ? colors[name] : null };
    return (
      <li className={f('tabs-title')}>
        <Link
          newTo={newTo}
          activeClass={f('is-active', 'is-active-tab')}
          style={style}
        >
          <span>
            {name}&nbsp;
          </span>
          <NumberLabel value={value} className={f('number-label')} />
        </Link>
      </li>
    );
  }
}

let tabs;

class MemberDBTabs extends Component {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }),
    location: T.shape({
      description: T.shape({
        mainType: T.string,
      }).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { collapsed: false };
  }

  _handleExpansion = () => {
    this.setState(({ collapsed }) => ({ collapsed: !collapsed }));
  };

  render() {
    const {
      data: { loading, payload },
      location: { description: { mainType } },
    } = this.props;
    const { collapsed } = this.state;
    const mainOrFocus = mainType === 'entry' ? 'main' : 'focus';
    if (!loading && !tabs) {
      tabs = [
        {
          name: 'InterPro',
          newTo(location) {
            return {
              ...location,
              description: {
                ...location.description,
                [`${mainOrFocus}Type`]: 'entry',
                [`${mainOrFocus}DB`]: 'InterPro',
                mainIntegration: null,
              },
            };
          },
          value: payload.entries.interpro,
        },
        ...Object.keys(payload.entries.member_databases).sort().map(e => ({
          name: e,
          newTo(location) {
            return {
              ...location,
              description: {
                ...location.description,
                [`${mainOrFocus}Type`]: 'entry',
                [`${mainOrFocus}DB`]: e,
              },
              search: {
                ...location.search,
                signature_in: undefined,
              },
            };
          },
          value: payload.entries.member_databases[e],
        })),
      ];
    }
    return (
      <div>
        <button onClick={this._handleExpansion} className={f('expand-button')}>
          {collapsed ? '≫' : '≪'}
        </button>
        {tabs &&
          <AnimatedEntry className={f('vertical', 'tabs', { collapsed })}>
            {tabs.map(e => <MemberDBTab key={e.name} {...e} />)}
          </AnimatedEntry>}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location }),
);

const getMemberDBUrl = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    `${protocol}//${hostname}:${port}${root}/entry`,
);

export default connect(mapStateToProps)(loadData(getMemberDBUrl)(MemberDBTabs));
