// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { format } from 'url';
import { createSelector } from 'reselect';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';
import NumberComponent from 'components/NumberComponent';

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

export class ByEntryType extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
  };

  componentDidMount() {
    loadWebComponent(() =>
      import(
        /* webpackChunkName: "interpro-components" */ 'interpro-components'
      ).then((m) => m.InterproType),
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
      <div className={f('entry-type')} data-testid="by-entry-type-box">
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
              data-testid={`entry-${type.toLowerCase().replace(/\s+/g, '_')}`}
            >
              <Tooltip title={description}>
                <interpro-type
                  type={type}
                  dimension="4em"
                  role="listitem"
                  aria-label="Entry type"
                  style={{ display: 'block', paddingTop: '1rem' }}
                >
                  {
                    // IE11 fallback for icons
                  }
                  <span
                    className={f('icon-type', {
                      ['icon-family']: type === 'Family',
                      ['icon-domain']: type === 'Domain',
                      ['icon-repeat']: type === 'Repeat',
                      ['icon-hh']: type === 'Homologous Superfamily',
                      ['icon-site']:
                        type === 'Binding Site' ||
                        type === 'Active Site' ||
                        type === 'Conserved Site' ||
                        type === 'PTM',
                    })}
                  >
                    {type === 'Family' ? 'F' : null}
                    {type === 'Domain' ? 'D' : null}
                    {type === 'Repeat' ? 'R' : null}
                    {type === 'Homologous Superfamily' ? 'H' : null}
                    {type === 'Binding Site' ||
                    type === 'Active Site' ||
                    type === 'Conserved Site' ||
                    type === 'PTM'
                      ? 'S'
                      : null}
                  </span>
                </interpro-type>
                <span className={f('title')}>{type}</span>
              </Tooltip>
              <p>
                <span
                  className={f('count', { visible: this.props.data.payload })}
                >
                  <NumberComponent abbr>
                    {(counts &&
                      type &&
                      counts[type.toLowerCase().replace(' ', '_')]) ||
                      null}
                  </NumberComponent>
                  {type === 'new' ? ' ' : ' entries'}
                </span>
              </p>
            </Link>
          ))}
        </AnimatedEntry>
      </div>
    );
  }
}

const mapStateToUrl = createSelector(
  (state) => state.settings.api,
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
