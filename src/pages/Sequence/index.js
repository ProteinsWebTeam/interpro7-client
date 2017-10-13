import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import { BrowseTabsWithoutData } from 'components/BrowseTabs';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import { foundationPartial } from 'styles/foundation';

import styles from 'styles/blocks.css';
import pageStyle from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(fonts, pageStyle, ipro, styles);

const SummaryAsync = loadable({
  loader: () =>
    import(/* webpackChunkName: "protein-summary" */ 'components/IPScan/Summary'),
});

const EntrySubPage = loadable({
  loader: () =>
    import(/* webpackChunkName: "ips-entry-subpage" */ 'components/IPScan/EntrySubPage'),
});

const DomainArchitectureWithoutData = loadable({
  loader: () =>
    import(/* webpackChunkName: "domain-architecture-subpage" */ 'components/Protein/DomainArchitecture'),
});

class DomainArchitecture extends PureComponent {
  static propTypes = {
    data: T.object.isRequired,
  };

  render() {
    const payload = this.props.data.payload[0];
    const protein = {
      length: payload.sequenceLength,
    };
    const data = {
      unintegrated: payload.matches
        .map(m => ({
          accession: m.signature.accession,
          source_database: m.signature.signatureLibraryRelease.library,
          protein_length: payload.sequenceLength,
          coordinates: [m.locations.map(l => [l.start, l.end])],
          score: m.score,
        }))
        .sort((m1, m2) => m2.score - m1.score),
    };
    return <DomainArchitectureWithoutData protein={protein} data={data} />;
  }
}

const subPagesForSequence = new Set([
  { value: 'entry', component: EntrySubPage },
  { value: 'domain_architecture', component: DomainArchitecture },
]);

class _Summary extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.array,
    }).isRequired,
    accession: T.string.isRequired,
  };

  render() {
    const { data: { loading, payload }, accession } = this.props;
    if (loading) {
      return (
        <div className={f('row')}>
          <div className={f('columns')}>Loading…</div>
        </div>
      );
    }
    const entries =
      payload[0].matches.length +
      new Set(payload[0].matches.map(m => (m.signature.entry || {}).accession))
        .size;
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
            l.description.mainDetail || l.description.focusType}
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
