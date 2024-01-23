// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import AnimatedEntry from 'components/AnimatedEntry';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import getStatusMessage from 'utils/server-message';

import { foundationPartial } from 'styles/foundation';

import local from './style.css';
const f = foundationPartial(local);

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
          className={f('card-wrapper')}
          element="div"
          data-testid="data-grid"
        >
          {dataTable.map((data, i) => (
            <ErrorBoundary key={data?.metadata?.accession || i}>
              {renderer(data)}
            </ErrorBoundary>
          ))}
        </AnimatedEntry>
      );
    }
    return null;
  }
}

export default GridView;
