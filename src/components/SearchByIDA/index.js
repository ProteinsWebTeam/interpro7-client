// TODO: Activate Flow

import React, { PureComponent } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { goToCustomLocation } from 'actions/creators';

import DomainButton from './DomainButton';
import IdaEntry from './IdaEntry';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';
import { createSelector } from 'reselect';
import { customLocationSelector } from 'reducers/custom-location';

const f = foundationPartial(interproTheme, ipro, local);

const PanelIDA = ({
  entryList,
  ignoreList,
  isOrdered,
  removeEntryHandler,
  changeEntryHandler,
  changeIgnoreHandler,
  removeIgnoreHandler,
}) => (
  <div className={f('panels')}>
    <div className={f('ida-panel')}>
      <header>IDA</header>
      <ul className={f('ida-list', { ordered: isOrdered })}>
        {entryList &&
          entryList.map((e, i) => (
            <li key={i}>
              <IdaEntry
                entry={e}
                active={true}
                removeEntryHandler={() => removeEntryHandler(i)}
                changeEntryHandler={name => changeEntryHandler(i, name)}
              />
            </li>
          ))}
      </ul>
    </div>
    <div>
      <header>Ignore</header>
      <ul className={f('ida-list')}>
        {ignoreList &&
          ignoreList.map((e, i) => (
            <li key={i}>
              <IdaEntry
                entry={e}
                active={true}
                removeEntryHandler={() => removeIgnoreHandler(i)}
                changeEntryHandler={name => changeIgnoreHandler(i, name)}
              />
            </li>
          ))}
      </ul>
    </div>
  </div>
);
PanelIDA.propTypes = {
  entryList: T.arrayOf(T.string),
  ignoreList: T.arrayOf(T.string),
  isOrdered: T.bool,
  removeEntryHandler: T.func,
  removeIgnoreHandler: T.func,
};

class SearchByIDA extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      order: true,
      entries: [],
      ignore: [],
    };
  }
  _handleSubmit = () => {
    const { entries, order, ignore } = this.state;
    const search = {
      ida_search: entries.join(','),
      // ida_ignore: ignore.join(','),
    };
    if (order) search.ordered = true;
    if (ignore && ignore.length) search.ida_ignore = ignore.join(',');

    this.props.goToCustomLocation({
      ...this.props.customLocation,
      search,
    });
  };
  render() {
    const { entries, order, ignore } = this.state;
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns', 'margin-bottom-medium')}>
          <div
            className={f(
              'secondary',
              'callout',
              'border',
              'margin-bottom-none',
            )}
          >
            <div className={f('row')}>
              <div className={f('large-12', 'columns', 'search-input')}>
                <h3 className={f('light')}>
                  Search by choosing the InterPro entries in your architecture
                </h3>
                <div className={f('ida-workspace')}>
                  <PanelIDA
                    entryList={entries}
                    ignoreList={ignore}
                    isOrdered={order}
                    removeEntryHandler={n =>
                      this.setState({
                        entries: entries
                          .slice(0, n)
                          .concat(entries.slice(n + 1)),
                      })
                    }
                    removeIgnoreHandler={n =>
                      this.setState({
                        ignore: ignore.slice(0, n).concat(ignore.slice(n + 1)),
                      })
                    }
                    changeEntryHandler={(n, name) => {
                      const tmp = [...entries];
                      tmp[n] = name;
                      this.setState({
                        entries: tmp,
                      });
                    }}
                    changeIgnoreHandler={(n, name) => {
                      const tmp = [...ignore];
                      tmp[n] = name;
                      this.setState({
                        ignore: tmp,
                      });
                    }}
                  />
                </div>
                <div className={f('ida-controls')}>
                  <DomainButton
                    label="➕"
                    fill="#75bf40"
                    stroke="#75bf40"
                    onClick={() =>
                      this.setState({ entries: entries.concat('') })
                    }
                  />
                  <DomainButton
                    label="✖️️"
                    fill="#bf4540"
                    stroke="#bf4540"
                    onClick={() => this.setState({ ignore: ignore.concat('') })}
                  />
                  <label htmlFor="ordered">
                    <input
                      type="checkbox"
                      id="ordered"
                      checked={order}
                      onChange={event =>
                        this.setState({ order: event.target.checked })
                      }
                    />{' '}
                    Order sensitivity
                  </label>
                  <button
                    className={f('button')}
                    disabled={entries.length === 0 || entries.indexOf('') >= 0}
                    onClick={this._handleSubmit}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(SearchByIDA);
