import React, { PureComponent } from 'react';
import T from 'prop-types';

import AnimatedEntry from 'components/AnimatedEntry';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import local from './style.css';

class GridView extends PureComponent {
  static propTypes = {
    dataTable: T.array,
    card: T.func,
  };

  render() {
    const { dataTable, card } = this.props;
    const renderer = card || (() => null);
    if (card) {
      return (
        <AnimatedEntry className={local['card-wrapper']}>
          {dataTable.map((data, i) => (
            <li
              key={data.metadata.accession || i}
              className={local['card-flex-container']}
            >
              <ErrorBoundary>{renderer(data)}</ErrorBoundary>
            </li>
          ))}
        </AnimatedEntry>
      );
    }
  }
}

export default GridView;
