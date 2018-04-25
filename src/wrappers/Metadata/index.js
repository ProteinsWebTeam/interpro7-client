import React, { PureComponent, Children } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

const getURLFor = (mainType, mainDB, mainAccession) =>
  createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      `${protocol}//${hostname}:${port}${root}${descriptionToPath({
        main: { key: mainType },
        [mainType]: {
          db: mainDB,
          accession: mainAccession,
        },
      })}`,
  );

class Metadata extends PureComponent {
  static propTypes = {
    endpoint: T.string.isRequired,
    db: T.string.isRequired,
    accession: T.oneOfType([T.string, T.number]).isRequired,
    children: T.element.isRequired,
  };

  static getDerivedStateFromProps({ children, endpoint, db, accession }) {
    const child = Children.only(children);
    const getURL = getURLFor(endpoint, db, accession);
    return { child, element: loadData(getURL)(child.type) };
  }

  constructor(props) {
    super(props);

    this.state = {
      child: Children.only(props.children),
      element: null,
    };
  }

  render() {
    const Element = this.state.element;
    if (!Element) return null;
    return <Element {...this.state.child.props} {...this.props} />;
  }
}

export default Metadata;
