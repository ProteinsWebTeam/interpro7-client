import React, { PureComponent, ReactNode } from 'react';

import AnimatedEntry from 'components/AnimatedEntry';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import getStatusMessage from 'utils/server-message';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
const css = cssBinder(local);

export type CardRenderer<RowData extends object> = (data: RowData) => ReactNode;

type Props<RowData extends object> = {
  dataTable: Array<RowData & {}>;
  card?: CardRenderer<RowData>;
  status: number;
};

class GridView<RowData extends object> extends PureComponent<Props<RowData>> {
  render() {
    const { dataTable, card, status } = this.props;
    const message = getStatusMessage(status);
    if (message) return message;
    const renderer: CardRenderer<RowData> = card || (() => null);
    if (card) {
      return (
        <AnimatedEntry
          className={css('wrapper')}
          element="div"
          data-testid="data-grid"
        >
          {dataTable.map((data, i) => (
            <ErrorBoundary
              key={
                (data as { metadata?: { accession?: string } })?.metadata
                  ?.accession || i
              }
            >
              {renderer(data) || ''}
            </ErrorBoundary>
          ))}
        </AnimatedEntry>
      );
    }
    return null;
  }
}

export default GridView;
