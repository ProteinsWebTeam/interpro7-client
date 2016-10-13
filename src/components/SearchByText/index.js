import React, {PropTypes as T, Component} from 'react';
import {withRouter} from 'react-router/es6';
import {connect} from 'react-redux';

import f from 'styles/foundation';

class SearchByText extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
  }

  handleChange = (event) => {
    this.setState({value: event.target.value});
  };
  handleClick = (event) => {
    const value=event.target.dataset.search;
    if (value)
      this.setState({value});
  };
  handleReset = () => this.setState({value: ''});

  render() {
    const {value} = this.state;
    return (
    <div className={f("row")}>
      <div className={f("large-12", "columns")}>
        <form>
          <fieldset className={f("fieldset")}>
            <legend>Search InterPro</legend>
            <div className={f("secondary", "callout")}>

              <div className={f("row")}>
                <div className={f("large-12", "columns")}>
                  <label>Sequences, family, domains or GO terms</label>
                  <input
                    type="text"
                    onChange={this.handleChange}
                    value={value}
                    placeholder="Enter your search"/>
                </div>


              </div>

              <div className={f("row")}>
                <div className={f("large-12", "columns", "small", "search-eg")} onClick={this.handleClick}> e.g.
                  <Example value="IPR020422"/>,
                  <Example value="kinase" />,
                  <Example value="P51587" />,
                  <Example value="PF02932" />,
                  <Example value="GO:0007165"/>
                </div>
              </div>

              <div className={f("row")} style={{marginTop: "1em"}}>
                <div className={f("large-12", "columns")}>
                  <a href="#" className={f("button")}>Search</a>
                  <a className={f("secondary", "hollow", "button")}
                     onClick={this.handleReset}
                  >Clear</a>
                </div>
              </div>

            </div>
          </fieldset>
        </form>
      </div>
    </div>
    )};
}
const Example = ({value})=> (
  <a style={{cursor: "pointer"}} data-search={value}> {value}</a>
);
export default withRouter(
  connect(({settings: {pagination: {pageSize}}}) => ({pageSize}))(SearchByText)
);

// export default SearchByText;
