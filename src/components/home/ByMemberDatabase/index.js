import React from 'react';
import T from 'prop-types';
import {format} from 'url';

import {foundationPartial} from 'styles/foundation';
import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';
import AnimatedEntry from 'components/AnimatedEntry';

import loadData from 'higherOrder/loadData';

import {memberDB} from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

const ByMemberDatabase = ({data: {payload}}) => {
  const counts = payload && payload.entries.member_databases;
  return (
    <div>
      <AnimatedEntry className={f('row')} element="div">
        {
          memberDB.map((e) => (
            <div
              className={f('columns', 'medium-3', 'large-3', 'text-center')}
              key={e.name}
            >
              <Link to={e.to}>
                <MemberSymbol type={e.type}/>
                <h6 data-tooltip title={e.title}>
                  {e.name}
                </h6>
                <p>
                  <small>{e.version}</small><br/>
                  <span className={f('count', {visible: payload})}>
                      {counts && e.apiType && counts[e.apiType] || ''}
                    {e.type === 'new' ? ' ' : ' entries'}
                    </span>
                </p>
              </Link>
            </div>
          ))
        }
      </AnimatedEntry>
      <Link to="/entry" className={f('button')}>View all entries</Link>
    </div>
  );
};
ByMemberDatabase.propTypes = {
  data: T.shape({
    payload: T.object,
  }).isRequired,
};

const urlFromState = (
  {settings: {api: {protocol, hostname, port, root}}}
) => format({
  protocol,
  hostname,
  port,
  pathname: `${root}/entry`,
});

export default loadData(urlFromState)(ByMemberDatabase);
