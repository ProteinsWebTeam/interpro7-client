import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadData from 'higherOrder/loadData';

import { BrowseTabsWithoutData } from 'components/BrowseTabs';
import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';

import Loading from 'components/SimpleCommonComponents/Loading';
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

const subPagesForSequence = new Map([
  ['entry', EntrySubPage],
  ['sequence', SequenceSubPage],
]);

const locationSelector = createSelector(customLocation => {
  const { key } = customLocation.description.main;
  return (
    customLocation.description[key].detail ||
    (Object.entries(customLocation.description).find(
      ([_key, value]) => value.isFilter,
    ) || [])[0]
  );
}, value => value);

class IPScanResult extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        results: T.array,
      }),
    }).isRequired,
    matched: T.string.isRequired,
  };

  render() {
    const { data: { loading, payload }, matched } = this.props;
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
    return (
      <Fragment>
        <ErrorBoundary>
          <div className={f('row')}>
            <div className={f('large-12', 'columns')}>
              <BrowseTabsWithoutData
                key="browse"
                mainType="sequence"
                mainDB=""
                mainAccession={matched}
                data={{
                  loading: false,
                  payload: { metadata: { counters: { entries } } },
                }}
              />
            </div>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <Switch
            {...this.props}
            locationSelector={locationSelector}
            indexRoute={SummaryAsync}
            childRoutes={subPagesForSequence}
          />
        </ErrorBoundary>
      </Fragment>
    );
  }
}

const mapStateToUrl = createSelector(
  state => state.settings.ipScan,
  state => state.customLocation.description.job.accession,
  ({ protocol, hostname, port, root }, accession) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/result/${accession}/json`,
    }),
);

export default loadData(mapStateToUrl)(IPScanResult);
