// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';
import NumberLabel from 'components/NumberLabel';

import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

const colors = new Map([
  ['gene3d', '#a88cc3'],
  ['cdd', '#addc58'],
  ['hamap', '#2cd6d6'],
  ['panther', '#bfac92'],
  ['pfam', '#6287b1'],
  ['pirsf', '#dfafdf'],
  ['prints', '#54c75f'],
  ['prodom', '#8d99e4'],
  ['profile', '#f69f74'],
  ['prosite', '#f3c766'],
  ['sfld', '#00b1d3'],
  ['smart', '#ff7a76'],
  ['ssf', '#686868'],
  ['tigrfams', '#56b9a6'],
  ['InterPro', '#2daec1'],
]);

/* type Props = {
  children: string,
  count?: number,
  mainType: string,
  cleanName: string,
  lowGraphics: boolean,
}; */

class MemberDBTab extends PureComponent /*:: <Props> */ {
  static propTypes = {
    children: T.string.isRequired,
    count: T.number,
    mainType: T.string.isRequired,
    cleanName: T.string.isRequired,
    lowGraphics: T.bool.isRequired,
  };

  render() {
    const { children, count, mainType, cleanName, lowGraphics } = this.props;
    const newTo = ({ description, restOfLocation }) => {
      const nextLocation = {
        ...restOfLocation,
        description: {
          ...description,
        },
      };
      if (description.mainType === 'entry') {
        nextLocation.description.mainDB = cleanName;
      } else {
        const isNotAll = cleanName !== 'all';
        nextLocation.description.focusType = isNotAll ? 'entry' : null;
        nextLocation.description.focusDB = isNotAll ? cleanName : null;
      }
      return nextLocation;
    };
    return (
      <li className={f('tabs-title', { lowGraphics })}>
        <Link
          newTo={newTo}
          activeClass={f('is-active', 'is-active-tab')}
          style={{ color: colors.get(cleanName) }}
        >
          <span className={f('db-label')}>{children}&nbsp;</span>
          <NumberLabel
            value={count || 0}
            className={f('number-label')}
            title={
              count === null
                ? null
                : `${count} ${toPlural(mainType, count)} found`
            }
          />
        </Link>
      </li>
    );
  }
}

export default MemberDBTab;
