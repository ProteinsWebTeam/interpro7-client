// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import { Tooltip } from 'react-tippy';

import { foundationPartial } from 'styles/foundation';
import { OldLink } from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';
import AnimatedEntry from 'components/AnimatedEntry';

import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

import { memberDB } from 'staticData/home';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from '../styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const schemaProcessDataForDB = ({ name, version, location }) => ({
  '@type': 'Dataset',
  '@id': '@dataset',
  name,
  identifier: name,
  version,
  url: `${location.href}/entry/${name}`,
});

/*:: type Props = {
  data: {
    payload: ?Object,
  },
}; */

class ByMemberDatabase extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
  };

  render() {
    const { data: { payload } } = this.props;
    const counts = payload && payload.entries.member_databases;
    return (
      <div className={f('md-list')}>
        <AnimatedEntry className={f('row')} element="div">
          {memberDB.map(({ name, newTo, type, title, version, apiType }) => (
            <div
              className={f(
                'column',
                'small-3',
                'medium-2',
                'large-4',
                'text-center',
              )}
              key={name}
            >
              <SchemaOrgData
                data={{ name, version, location: window.location }}
                processData={schemaProcessDataForDB}
              />
              <OldLink newTo={newTo} className={name}>
                <MemberSymbol type={type} />
                <Tooltip title={title}>
                  <h6>{name}</h6>
                </Tooltip>
                <p>
                  <small>{version}</small>
                  <br />
                  <span className={f('count', { visible: payload })}>
                    {(counts && apiType && counts[apiType]) || ''}
                    {type === 'new' ? ' ' : ' entries'}
                  </span>
                </p>
              </OldLink>
            </div>
          ))}
        </AnimatedEntry>
        <OldLink
          newTo={{ description: { mainType: 'entry' } }}
          className={f('button')}
        >
          View all entries
        </OldLink>
      </div>
    );
  }
}

const mapStateToUrl = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/entry`,
    }),
);

export default loadData(mapStateToUrl)(ByMemberDatabase);
