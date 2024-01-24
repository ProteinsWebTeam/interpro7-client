import React from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';

import { toPlural } from 'utils/pages/toPlural';

import cssBinder from 'styles/cssBinder';

import local from './styles.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(local, fonts);

type Props = {
  count: number;
  endpoint: Endpoint;
  name: string;
  to: InterProPartialLocation;
};

// TODO: change to endpoint
const style: Record<
  string,
  {
    className: string;
    icon: string;
  }
> = {
  protein: {
    className: 'count-proteins',
    icon: 'icon-proteins',
  },
  taxonomy: {
    className: 'count-taxonomy',
    icon: 'icon-count-species',
  },
  structure: {
    className: 'count-structure',
    icon: 'icon-structures',
  },
  set: {
    className: 'count-set',
    icon: 'icon-count-set',
  },
  'domain architecture': {
    className: 'count-architectures',
    icon: 'icon-count-ida',
  },
};

const CounterIcon = ({ count, endpoint, name, to }: Props) => {
  return (
    <Tooltip
      title={`${count} ${toPlural(endpoint, count, true)} matching ${name}`}
      className={css('icon-link', style[endpoint].className)}
      style={{ display: 'flex' }}
    >
      <Link to={to} className={css(count ? null : 'ico-disabled')}>
        <div
          className={css(
            'icon',
            'icon-conceptual',
            'icon-wrapper',
            style[endpoint].icon,
          )}
        >
          {count !== 0 && <div className={css('icon-over-animation')} />}
        </div>
        <NumberComponent abbr>{count}</NumberComponent>
      </Link>
    </Tooltip>
  );
};

export default CounterIcon;
