import React, { PureComponent } from 'react';
import T from 'prop-types';

import Header from 'components/Table/Header';
import Body from 'components/Table/Body';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from '../../style.css';

const f = foundationPartial(styles, ipro, fonts);

class TableView extends PureComponent {
  static propTypes = {
    loading: T.bool,
    isStale: T.bool,
    ok: T.bool,
    status: T.number,
    columns: T.array,
    notFound: T.bool,
    dataTable: T.array,
  };

  render() {
    const {
      loading,
      isStale,
      ok,
      status,
      columns,
      notFound,
      dataTable,
    } = this.props;
    return (
      <table className={f('table', 'light', 'nolink', 'sorting')}>
        <Header columns={columns} notFound={notFound} />
        <Body
          rows={dataTable || []}
          columns={columns}
          notFound={notFound}
          loading={loading}
          isStale={isStale}
          ok={ok}
          status={status}
        />
      </table>
    );
  }
}

export default TableView;
