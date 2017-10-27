// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { format } from 'url';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/loadWebComponent';

import { entryType } from 'staticData/home';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import byX from '../styles.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, byX, local);

/*:: type Props = {
  data: {
    payload: ?Object,
  },
}; */

class ByEntryType extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
  };

  componentWillMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }

  render() {
    const counts =
      this.props.data.payload &&
      Object.entries(this.props.data.payload).reduce((p, c) => {
        const out = p;
        out[c[0].toLowerCase()] = c[1];
        return out;
      }, {});
    return (
      <div className={f('entry-type')}>
        <AnimatedEntry className={f('row')} element="div">
          {entryType.map(({ type, title, description }) => (
            <div
              className={f('columns', 'medium-4', 'large-4', 'text-center')}
              key={type}
            >
              <Link
                newTo={{
                  description: { mainType: 'entry', mainDB: 'InterPro' },
                  search: { type },
                }}
              >
                <interpro-type type={type} size="4em" />
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
                  <span
                    className={f('count', { visible: this.props.data.payload })}
                  >
                    {(counts && type && counts[type.toLowerCase()]) || ''}
                    {type === 'new' ? ' ' : ' entries'}
                  </span>
                </p>
              </Link>
            </div>
          ))}
        </AnimatedEntry>
        <Link
          newTo={{ description: { mainType: 'entry' } }}
          className={f('button')}
        >
          View all entries
        </Link>
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
      query: { group_by: 'type' },
    }),
);

export default loadData(mapStateToUrl)(ByEntryType);
