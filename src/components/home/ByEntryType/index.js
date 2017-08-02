// @flow
import React from 'react';
import T from 'prop-types';
import { format } from 'url';
import { createSelector } from 'reselect';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';
import { InterproSymbol } from 'components/Title';
import AnimatedEntry from 'components/AnimatedEntry';

import loadData from 'higherOrder/loadData';

import { entryType } from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from '../ByMemberDatabase/styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

const ByEntryType = ({ data: { payload } }) => {
  const counts =
    payload &&
    Object.entries(payload).reduce((p, c) => {
      const out = p;
      out[c[0].toLowerCase()] = c[1];
      return out;
    }, {});
  return (
    <div>
      <AnimatedEntry className={f('row')} element="div">
        {entryType.map(({ type, title, description }) =>
          <div
            className={f('columns', 'medium-4', 'large-4', 'text-center')}
            key={type}
          >
            <Link
              newTo={{ description: { mainType: 'entry' }, search: { type } }}
            >
              <div className={f('svg-container')}>
                <InterproSymbol type={type} />
              </div>
              <h5 data-tooltip title={title}>
                {type}
                &nbsp;
                <span
                  className={f('small', 'icon', 'icon-generic')}
                  data-icon="i"
                  data-tooltip
                  title={description}
                />
              </h5>
              <p>
                <span className={f('count', { visible: payload })}>
                  {(counts && type && counts[type.toLowerCase()]) || ''}
                  {type === 'new' ? ' ' : ' entries'}
                </span>
              </p>
            </Link>
          </div>,
        )}
      </AnimatedEntry>
      <Link
        newTo={{ description: { mainType: 'entry' } }}
        className={f('button')}
      >
        View all entries
      </Link>
    </div>
  );
};
ByEntryType.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
};

const mapStateToUrl = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/entry`,
      query: { group_by: 'type' },
    }),
);

export default loadData(mapStateToUrl)(ByEntryType);
