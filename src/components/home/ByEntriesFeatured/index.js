import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import AnimatedEntry from 'components/AnimatedEntry';
import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';

import { latests } from 'staticData/home';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/load-web-component';

import { foundationPartial } from 'styles.css/foundation';

import ipro from 'styles.css/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles.css/theme-interpro.css';
import local from './styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

class LatestEntry extends PureComponent {
  static propTypes = {
    entry: T.shape({
      accession: T.string,
      type: T.string,
      name: T.string,
      counter: T.number,
      contributing: T.array,
    }),
  };

  componentDidMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }

  render() {
    const { entry } = this.props;
    return (
      <li className={f('list-item')}>
        <Tooltip title={`${entry.type} type`}>
          <interpro-type
            dimension="1.5em"
            type={entry.type}
            aria-label="Entry type"
          />
        </Tooltip>
        <div className={f('list-body')}>
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: 'InterPro',
                  accession: entry.accession,
                },
              },
            }}
          >
            <div className={f('list-title')}>
              {entry.name}
              <span>({entry.accession})</span> —{' '}
              <i>{entry.counter} proteins matched</i>
              <br />
            </div>
          </Link>
          {entry.contributing.map(c => (
            <div className={f('list-more')} key={c.accession}>
              <MemberSymbol
                type={c.source_database}
                className={f('md-small')}
              />
              <small>
                {c.source_database}:
                <Link
                  to={{
                    description: {
                      main: { key: 'entry' },
                      entry: {
                        db: c.source_database,
                        accession: c.accession,
                      },
                    },
                  }}
                  className={f('list-sign')}
                >
                  {' '}
                  {c.accession}
                </Link>
              </small>
            </div>
          ))}
        </div>
      </li>
    );
  }
}

class ByLatestEntries extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
  };

  render() {
    return (
      <div className={f('entry-list')}>
        <div className={f('row')}>
          <div className={f('columns')}>
            <h5>
              <small> Total : 29415 entries</small>
            </h5>
            <div className={f('list-vertical-scroll')}>
              <AnimatedEntry>
                {latests.map(e => <LatestEntry entry={e} key={e.accession} />)}
              </AnimatedEntry>
            </div>
            <Link
              to={{
                description: { main: { key: 'entry' } },
              }}
              className={f('button')}
            >
              View all entries
            </Link>
          </div>
        </div>
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

export default loadData(mapStateToUrl)(ByLatestEntries);
