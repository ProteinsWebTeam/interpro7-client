import React, {PropTypes as T, Component} from 'react';
import {withRouter} from 'react-router/es';
import {connect} from 'react-redux';
import TextSearchBox from 'components/SearchByText/TextSearchBox';

import f from 'styles/foundation';

class SearchByText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: (props.location.query ? props.location.query.search : ''),
      submit: false,
    };
  }

  componentWillReceiveProps({query = ''}) {
    this.setState({query});
  }

  handleClick = (event) => {
    const value = event.target.dataset.search;
    if (value) this.setState({value});
  };
  handleReset = () => this.setState({value: ''});
  handleSubmit = (event) => {
    event.preventDefault();
  };
  handleSubmitClick = () => {
    this.setState({submit: true});
    requestAnimationFrame(() => this.setState({submit: false}));
  }

  render() {
    const {value, submit} = this.state;
    return (
    <div className={f('row')}>
      <div className={f('large-12', 'columns')}>
        <form onSubmit={this.handleSubmit}>
          <fieldset className={f('fieldset')}>
            <legend>Search InterPro</legend>
            <div className={f('secondary', 'callout')}>

              <div className={f('row')}>
                <div className={f('large-12', 'columns')}>
                  <label>Sequences, family, domains or GO terms</label>
                  <TextSearchBox
                    value={value}
                    toSubmit={submit}
                    ref={(input) => {
                      this.searchInput = input;
                    }}
                  />
                </div>


              </div>

              <div className={f('row')}>
                <div className={f('large-12', 'columns', 'small', 'search-eg')}
                  onClick={this.handleClick}
                > e.g.
                  <Example value="IPR020422"/>,
                  <Example value="kinase" />,
                  <Example value="Q9ZJX4" />,
                  <Example value="PF02932" />,
                  <Example value="GO:0007165"/>
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
          </fieldset>
        </form>
      </div>
    </div>
    );}
}
SearchByText.propTypes = {
  pageSize: T.number,
  router: T.object,
  value: T.string,
  location: T.shape({
    query: T.object,
  }),
};

const Example = ({value}) => (
  <a style={{cursor: 'pointer'}} data-search={value}> {value}</a>
);
Example.propTypes = {
  value: T.string,
};

export default withRouter(
  connect(({settings: {pagination: {pageSize}}}) =>
    ({pageSize}))(SearchByText)
);

// export default SearchByText;
