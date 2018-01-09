// @flow
import React, { PureComponent, Children } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

const getUrlFor = (mainType, mainDB, mainAccession) =>
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

  constructor() {
    super();
    this.state = { child: null, element: null };
  }

  componentWillMount() {
    const { children, ...props } = this.props;
    const child = Children.only(children);
    const getUrl = getUrlFor(props.endpoint, props.db, props.accession);
    const element = loadData(getUrl)(child.type);
    this.setState({ child, element });
  }

  render() {
    const Element = this.state.element;
    return <Element {...this.state.child.props} {...this.props} />;
  }
}

export default Metadata;
