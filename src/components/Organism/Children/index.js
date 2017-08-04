import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

class Child extends PureComponent {
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
      <li>
        <Link newTo={newTo}>
          {displayedText}
        </Link>
      </li>
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

class Children extends PureComponent {
  static propTypes = {
    children: T.array.isRequired,
  };

  render() {
    const { children } = this.props;
    return (
      <ul>
        Children:
        {children.length
          ? children.map(taxId => {
              const ChildWithData = loadData(getUrlFor(taxId))(Child);
              return <ChildWithData taxId={taxId} key={taxId} />;
            })
          : <li>no child</li>}
      </ul>
    );
  }
}

export default Children;
