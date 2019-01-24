// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import DomainButton from './DomainButton';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';

const f = foundationPartial(interproTheme, ipro, local);

const PanelIDA = ({
  entryList,
  ignoreList,
  isOrdered,
  removeEntryHandler,
  removeIgnoreHandler,
}) => (
  <div className={f('panels')}>
    <div className={f('ida-panel')}>
      <header>IDA</header>
      <ul className={f('ida-list', { ordered: isOrdered })}>
        {entryList &&
          entryList.map((e, i) => (
            <li key={i}>
              {e}
              <button onClick={() => removeEntryHandler(i)}> X </button>
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
              {e}
              <button onClick={() => removeIgnoreHandler(i)}> X </button>
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
                  />
                </div>
                <div className={f('ida-controls')}>
                  <DomainButton
                    label="➕"
                    fill="#75bf40"
                    stroke="#75bf40"
                    onClick={() =>
                      this.setState({ entries: entries.concat('?') })
                    }
                  />
                  <DomainButton
                    label="✖️️"
                    fill="#bf4540"
                    stroke="#bf4540"
                    onClick={() =>
                      this.setState({ ignore: ignore.concat('?') })
                    }
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
                    disabled={entries.length === 0 || entries.indexOf('?') >= 0}
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

export default SearchByIDA;
