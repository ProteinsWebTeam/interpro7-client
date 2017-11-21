import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import { BrowseTabsWithoutData } from 'components/BrowseTabs';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';

import { Loading } from 'components/SimpleCommonComponents';
import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import global from 'styles/global.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(fonts, global, pageStyle, ipro, styles);

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-summary" */ 'components/IPScan/Summary'),
});

const EntrySubPage = loadable({
  loader: () =>
    import(/* webpackChunkName: "ips-entry-subpage" */ 'components/IPScan/EntrySubPage'),
});

const SequenceSubPage = loadable({
  loader: () =>
    import(/* webpackChunkName: "sequence-subpage" */ 'subPages/Sequence'),
});

const subPagesForSequence = new Set([
  { value: 'entry', component: EntrySubPage },
  { value: 'sequence', component: SequenceSubPage },
]);

class _Summary extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        results: T.array,
      }),
    }).isRequired,
    accession: T.string.isRequired,
  };

  render() {
    const { data: { loading, payload }, accession } = this.props;
    if (loading) {
      return <Loading />;
    }
    const entries =
      payload.results[0].matches.length +
      new Set(
        payload.results[0].matches.map(
          m => (m.signature.entry || {}).accession,
        ),
      ).size;
    return [
      <ErrorBoundary key="browse">
        <BrowseTabsWithoutData
          key="browse"
          mainType="sequence"
          mainDB=""
          mainAccession={accession}
          data={{
            loading: false,
            payload: { metadata: { counters: { entries } } },
          }}
        />
      </ErrorBoundary>,
      <ErrorBoundary key="switch">
        <Switch
          {...this.props}
          locationSelector={l =>
            l.description.mainDetail || l.description.focusType
          }
          indexRoute={SummaryAsync}
          childRoutes={subPagesForSequence}
        />
      </ErrorBoundary>,
    ];
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainAccession,
  accession => ({ accession }),
);

const Summary = connect(mapStateToProps)(_Summary);

const IPScanResult = props => (
  <ErrorBoundary>
    <Switch
      {...props}
      locationSelector={l => l.description.mainAccession}
      indexRoute={() => null}
      catchAll={Summary}
    />
  </ErrorBoundary>
);

const mapStateToUrl = createSelector(
  state => state.settings.ipScan,
  state => state.newLocation.description.mainAccession,
  ({ protocol, hostname, port, root }, mainAccession) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/result/${mainAccession}/json`,
    }),
);

export default loadData(mapStateToUrl)(IPScanResult);
