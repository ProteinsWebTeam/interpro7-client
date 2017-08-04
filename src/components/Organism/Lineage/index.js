import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

class LineageItem extends PureComponent {
  static propTypes = {
    taxId: T.string.isRequired,
    data: T.object.isRequired,
  };

  render() {
    const { taxId, data } = this.props;
    const displayedText =
      (data.payload &&
        data.payload.metadata &&
        data.payload.metadata.scientific_name) ||
      taxId;
    const newTo = {
      description: {
        mainType: 'organism',
        mainDB: 'taxonomy',
        mainAccession: taxId.toString(),
      },
    };
    return (
      <span>
        {' '}→ <Link newTo={newTo}>{displayedText}</Link>
      </span>
    );
  }
}

const getUrlFor = taxId =>
  createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      `${protocol}//${hostname}:${port}${root}${description2path({
        mainType: 'organism',
        mainDB: 'taxonomy',
        mainAccession: taxId.toString(),
      })}`,
  );

class Lineage extends PureComponent {
  static propTypes = {
    lineage: T.string.isRequired,
  };

  render() {
    const lineage = this.props.lineage.trim().split(' ');
    return (
      <div>
        Lineage:
        {lineage.map(taxId => {
          const LineageItemWithData = loadData(getUrlFor(taxId))(LineageItem);
          return <LineageItemWithData taxId={taxId} key={taxId} />;
        })}
      </div>
    );
  }
}

export default Lineage;
