import React, {PropTypes as T, Component} from 'react';
import {connect} from 'react-redux';

import {frame} from 'timing-functions/src';

import TextSearchBox from 'components/SearchByText/TextSearchBox';

import f from 'styles/foundation';

const Example = ({value}) => (
    <a style={{cursor: 'pointer'}} data-search={value}> {value}</a>
  );
Example.propTypes = {
  value: T.string,
};

class SearchByText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.search.search || '',
      submit: false,
    };
  }

  componentWillReceiveProps({query = ''}) {
    this.setState({query});
  }

  handleExampleClick = (event) => {
    const value = event.target.dataset.search;
    if (value) this.setState({value});
  };

  handleReset = () => this.setState({value: ''});

  handleSubmit = event => {
    event.preventDefault();
  };

  handleSubmitClick = async () => {
    await new Promise(res => this.setState({submit: true}, res));
    await frame();
    this.setState({submit: false});
  };

  render() {
    const {value, submit} = this.state;
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <form onSubmit={this.handleSubmit}>
            <div className={f('secondary', 'callout')}>

              <div className={f('row')}>
                <div className={f('large-12', 'columns')}>
                  <label>Family, domains or GO terms
                    <TextSearchBox
                      value={value}
                      toSubmit={submit}
                      ref={input => this.searchInput = input}
                    />
                  </label>
                </div>
              </div>

              <div className={f('row')}>
                <div
                  className={f('large-12', 'columns', 'small', 'search-eg')}
                  onClick={this.handleExampleClick}
                > e.g.
                  <Example value="IPR020422"/>,
                  <Example value="kinase" />,
                  <Example value="O00167" />,
                  <Example value="PF02932" />,
                  <Example value="GO:0007165"/>,
                  <Example value="1t2v"/>
                </div>
              </div>

              <div className={f('row')} style={{marginTop: '1em'}}>
                <div className={f('large-12', 'columns')}>
                  <a className={f('button')}
                    onClick={this.handleSubmitClick}
                  >Search</a>
                  <a className={f('secondary', 'hollow', 'button')}
                    onClick={this.handleReset}
                  >Clear</a>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    );
  }
}
SearchByText.propTypes = {
  value: T.string,
  search: T.shape({
    search: T.string,
  }).isRequired,
};


export default connect(({location: {search}}) => ({search}))(SearchByText);
