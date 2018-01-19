// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

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
  ['pirsf', '#fbbddd'],
  ['prints', '#54c75f'],
  ['prodom', '#8d99e4'],
  ['profile', '#f69f74'],
  ['prosite', '#f3c766'],
  ['sfld', '#00b1d3'],
  ['smart', '#ff8d8d'],
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
    const to = customLocation => {
      const nextLocation = {
        ...customLocation,
        description: {
          ...customLocation.description,
          entry: {},
        },
      };
      if (cleanName !== 'all') {
        nextLocation.description.entry = {
          isFilter: nextLocation.description.main.key !== 'entry',
          db: cleanName,
        };
      }
      return nextLocation;
    };
    let activeClass;
    if (cleanName === 'all') {
      activeClass = ({ description: { entry } }) =>
        !entry.db && f('is-active', 'is-active-tab', cleanName);
    } else {
      activeClass = f('is-active', 'is-active-tab', cleanName);
    }
    return (
      <li className={f('tabs-title', { lowGraphics })}>
        <Link
          to={to}
          activeClass={activeClass}
          className={f({
            special: cleanName === 'InterPro' || cleanName === 'all',
          })}
          style={{ color: colors.get(cleanName) || '#6e818a' }}
        >
          <span className={f('db-label')}>
            {children}
            {children === 'All'
              ? ` ${toPlural(mainType).toLowerCase()}`
              : ''}&nbsp;
          </span>
          <Tooltip
            title={
              count === null
                ? null
                : `${count.toLocaleString()} ${toPlural(mainType, count)} found`
            }
          >
            <NumberLabel
              value={count || 0}
              className={f('number-label')}
              abbr
            />
          </Tooltip>
        </Link>
      </li>
    );
  }
}

export default MemberDBTab;
