// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import BrowseTabs from 'components/BrowseTabs';

import { foundationPartial } from 'styles/foundation';

import style from './style.css';

const f = foundationPartial(style);

/*:: type Props = {
  className: ?string,
  children: ?any,
  mainAccession: ?string,
  mainType: ?string,
}; */

class SingleEntityMenu extends PureComponent /*:: <Props> */ {
  static propTypes = {
    className: T.string,
    children: T.any,
    mainAccession: T.string,
    mainType: T.string,
  };

  render() {
    const { className, children } = this.props;
    return (
      <BrowseTabs className={f(className, 'single-entity-menu', 'tabs')}>
        {children}
      </BrowseTabs>
    );
  }
}

export default SingleEntityMenu;
