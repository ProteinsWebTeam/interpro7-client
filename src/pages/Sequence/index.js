import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import ErrorBoundary from 'wrappers/ErrorBoundary';
import Switch from 'components/generic/Switch';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import subPages from 'subPages';
import config from 'config';

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

const subPagesForSequence = new Set();
for (const subPage of config.pages.sequence.subPages) {
  subPagesForSequence.add({
    value: subPage,
    component: subPages.get(subPage),
  });
}

class Summary extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.array,
    }).isRequired,
  };

  render() {
    const { data: { loading } } = this.props;
    if (loading) {
      return (
        <div className={f('row')}>
          <div className={f('columns')}>Loading…</div>
        </div>
      );
    }
    return (
      <ErrorBoundary>
        <Switch
          {...this.props}
          locationSelector={l =>
            l.description.mainDetail || l.description.focusType}
          indexRoute={SummaryAsync}
          childRoutes={subPagesForSequence}
        />
      </ErrorBoundary>
    );
  }
}

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
