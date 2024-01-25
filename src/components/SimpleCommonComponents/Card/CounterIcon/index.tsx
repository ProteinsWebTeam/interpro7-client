import React from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';
import MemberSymbol from 'components/Entry/MemberSymbol';

import { toPlural } from 'utils/pages/toPlural';

import cssBinder from 'styles/cssBinder';

import local from './styles.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(local, fonts);

type Props = {
  count: number;
  endpoint: Endpoint | 'domain architecture';
  name: string;
  to?: InterProPartialLocation;
  db?: MemberDB | 'interpro';
  signature?: string;
};

const icon: Record<Endpoint | 'domain architecture', string> = {
  entry: 'icon-entries',
  protein: 'icon-proteins',
  proteome: 'icon-count-proteome',
  taxonomy: 'icon-count-species',
  structure: 'icon-structures',
  set: 'icon-count-set',
  'domain architecture': 'icon-count-ida',
};

const CounterIcon = ({ count, endpoint, name, to, db, signature }: Props) => {
  return (
    <Tooltip
      title={
        signature
          ? `${db} signature: ${signature}`
          : `${count} ${toPlural(endpoint, count, true)} matching ${name}`
      }
      className={css('icon-link')}
      style={{ display: 'flex' }}
    >
      <Link
        to={to}
        className={css(count ? null : 'ico-disabled')}
        disabled={!count || !to}
      >
        <div
          className={css(
            'icon',
            'icon-conceptual',
            'icon-wrapper',
            icon[endpoint],
          )}
        >
          {endpoint === 'entry' && (
            <div
              style={{
                // UGLY hack be better Gustavo
                position: 'relative',
                top: '7px',
                left: '-2px',
              }}
            >
              <MemberSymbol type={db || 'all'} className={css('md-small')} />
            </div>
          )}
          {count !== 0 && <div className={css('icon-over-animation')} />}
        </div>
        {!signature && <NumberComponent abbr>{count}</NumberComponent>}
      </Link>
    </Tooltip>
  );
};

export default CounterIcon;
