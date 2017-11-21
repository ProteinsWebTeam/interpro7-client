import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import { Tooltip } from 'react-tippy';

import AnimatedEntry from 'components/AnimatedEntry';
import Link from 'components/generic/Link';
import MemberSymbol from 'components/Entry/MemberSymbol';

import { latests } from 'staticData/home';

import loadData from 'higherOrder/loadData';
import loadWebComponent from 'utils/loadWebComponent';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
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

  componentWillMount() {
    loadWebComponent(() =>
      import(/* webpackChunkName: "interpro-components" */ 'interpro-components').then(
        m => m.InterproType,
      ),
    ).as('interpro-type');
  }

  render() {
    const { entry } = this.props;
    return (
      <Tooltip title="Domain entry">
        <li className={f('list-item')}>
          <interpro-type type={entry.type} />
          <div className={f('list-body')}>
            <Link
              newTo={{
                description: {
                  mainType: 'entry',
                  mainDB: 'InterPro',
                  mainAccession: entry.accession,
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
                    newTo={{
                      description: {
                        mainType: 'entry',
                        mainDB: 'interpro',
                        mainMemberDB: c.source_database,
                        mainMemberDBAccession: c.accession,
                      },
                    }}
                    className={f('list-sign')}
                  >
                    {c.accession}
                  </Link>{' '}
                  ({entry.contributing.length} contributing signature{entry
                    .contributing.length > 1
                    ? 's'
                    : ''})
                </small>
              </div>
            ))}
          </div>
        </li>
      </Tooltip>
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
              newTo={{ description: { mainType: 'entry' } }}
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
