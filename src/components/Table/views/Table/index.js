// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Header from 'components/Table/Header';
import Body from 'components/Table/Body';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from '../../style.css';

const f = foundationPartial(styles, fonts);

class TableView extends PureComponent {
  static propTypes = {
    isStale: T.bool,
    columns: T.array,
    notFound: T.bool,
    dataTable: T.array,
  };

  render() {
    const { isStale, columns, notFound, dataTable } = this.props;
    return (
      <table className={f('table', 'light', { isStale })}>
        <Header columns={columns} notFound={notFound} />
        <Body rows={dataTable || []} columns={columns} notFound={notFound} />
      </table>
    );
  }
}

export default TableView;
