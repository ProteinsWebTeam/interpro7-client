// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import AnimatedEntry from 'components/AnimatedEntry';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import getStatusMessage from 'utils/server-message';

import local from './style.css';

/*:: type Props = {
  dataTable: Array<Object>,
  card: function,
  status: number,
} */

class GridView extends PureComponent /*:: <Props> */ {
  static propTypes = {
    dataTable: T.array,
    card: T.func,
    status: T.number,
  };

  render() {
    const { dataTable, card, status } = this.props;
    const message = getStatusMessage(status);
    if (message) return message;
    const renderer = card || (() => null);
    if (card) {
      return (
        <AnimatedEntry
          className={local['card-wrapper']}
          element="div"
          data-testid="data-grid"
        >
          {dataTable.map((data, i) => (
            <div
              key={data?.metadata?.accession || i}
              className={local['grid-card']}
              data-testid="grid-entity"
            >
              <ErrorBoundary>{renderer(data)}</ErrorBoundary>
            </div>
          ))}
        </AnimatedEntry>
      );
    }
    return null;
  }
}

export default GridView;
