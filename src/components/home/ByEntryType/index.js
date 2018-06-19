// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { format } from 'url';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import { NumberComponent } from 'components/NumberLabel';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/load-web-component';

import { entryType } from 'staticData/home';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
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

  componentDidMount() {
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
          {entryType.map(({ type, description }) => (
            <Link
              className={f(
                'columns',
                'medium-4',
                'large-4',
                'text-center',
                'block',
              )}
              to={{
                description: {
                  main: { key: 'entry' },
                  entry: { db: 'InterPro' },
                },
                search: { type: type.toLowerCase().replace(' ', '_') },
              }}
              key={type}
            >
              <Tooltip title={description}>
                <interpro-type
                  type={type}
                  dimension="4em"
                  style={{ display: 'block', paddingTop: '1rem' }}
                />
                <h5>{type}</h5>
              </Tooltip>
              <p>
                <span
                  className={f('count', { visible: this.props.data.payload })}
                >
                  <NumberComponent
                    value={
                      (counts &&
                        type &&
                        counts[type.toLowerCase().replace(' ', '_')]) ||
                      null
                    }
                    abbr
                  />
                  {type === 'new' ? ' ' : ' entries'}
                </span>
              </p>
            </Link>
          ))}
        </AnimatedEntry>
        <Link
          to={{ description: { main: { key: 'entry' } } }}
          className={f('button', 'margin-bottom-none')}
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
      pathname: `${root}/entry/InterPro/`,
      query: { group_by: 'type' },
    }),
);

export default loadData(mapStateToUrl)(ByEntryType);
