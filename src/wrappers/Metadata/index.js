import React, { PureComponent, Children } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';
import description2path from 'utils/processLocation/description2path';

const getUrlFor = (mainType, mainDB, mainAccession) =>
  createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      `${protocol}//${hostname}:${port}${root}${description2path({
        mainType,
        mainDB,
        mainAccession,
      })}`,
  );

class Metadata extends PureComponent {
  static propTypes = {
    endpoint: T.string.isRequired,
    db: T.string.isRequired,
    accession: T.oneOfType([T.string, T.number]).isRequired,
    children: T.element.isRequired,
  };

  render() {
    const { children, ...props } = this.props;
    const child = Children.only(children);
    const getUrl = getUrlFor(props.endpoint, props.db, props.accession);
    const Element = loadData(getUrl)(child.type);
    return <Element {...child.props} {...props} />;
  }
}

export default Metadata;
