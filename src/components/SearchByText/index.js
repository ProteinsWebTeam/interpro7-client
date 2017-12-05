import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import TextSearchBox from 'components/SearchByText/TextSearchBox';
import Link from 'components/generic/Link';

import { frame } from 'timing-functions/src';

import { foundationPartial } from 'styles/foundation';

import interproTheme from 'styles/theme-interpro.css';
import s from './style.css';

const f = foundationPartial(interproTheme, s);

class Example extends PureComponent {
  static propTypes = {
    value: T.string,
  };

  render() {
    const { value } = this.props;
    return (
      <i>
        {' '}
        <Link
          to={{
            description: {
              main: { key: 'search' },
              search: { type: 'text', value },
            },
          }}
        >
          {value}
        </Link>
      </i>
    );
  }
}

class SearchByText extends PureComponent {
  static propTypes = {
    value: T.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      submit: false,
    };
  }

  componentWillReceiveProps({ value }) {
    this.setState({ value });
  }

  handleReset = () => this.setState({ value: '' });

  handleSubmit = event => {
    event.preventDefault();
  };

  handleSubmitClick = async () => {
    await new Promise(res => this.setState({ submit: true }, res));
    await frame();
    this.setState({ submit: false });
  };

  render() {
    const { value, submit } = this.state;
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <form onSubmit={this.handleSubmit}>
            <div className={f('secondary', 'callout')}>
              <div className={f('row')}>
                <div className={f('large-12', 'columns')}>
                  <label>
                    Family, domains or GO terms
                    <TextSearchBox
                      value={value}
                      toSubmit={submit}
                      ref={input => (this.searchInput = input)}
                    />
                  </label>
                </div>
              </div>

              <div className={f('row')}>
                <div className={f('large-12', 'columns', 'small', 'search-eg')}>
                  {' '}
                  e.g.
                  <Example value="IPR020422" />,
                  <Example value="kinase" />,
                  <Example value="O00167" />,
                  <Example value="PF02932" />,
                  <Example value="GO:0007165" />,
                  <Example value="1t2v" />
                </div>
              </div>

              <div className={f('row')} style={{ marginTop: '1em' }}>
                <div
                  className={f(
                    'large-12',
                    'columns',
                    'stacked-for-small',
                    'button-group',
                  )}
                >
                  <button
                    className={f('button')}
                    onClick={this.handleSubmitClick}
                    onKeyPress={this.handleSubmitClick}
                  >
                    Search
                  </button>
                  <button
                    className={f('secondary', 'hollow', 'button')}
                    onClick={this.handleReset}
                    onKeyPress={this.handleReset}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.search.value,
  value => ({ value }),
);

export default connect(mapStateToProps)(SearchByText);
