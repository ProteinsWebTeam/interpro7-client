import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';

const f = foundationPartial(ebiGlobalStyles);

const options = new Map([
  ['1-100', 'small (1-100 AA)'],
  ['101-1000', 'medium (101-1,000 AA)'],
  ['1001-100000', 'long (1,001-100,000 AA)'],
]);

class LengthFilter extends PureComponent {
  static propTypes = {
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
  };

  componentDidMount() {
    this._handleChange({
      target: { value: this.props.customLocation.search.length },
      fromMount: true,
    });
  }

  _handleChange = ({ target: { value }, fromMount }) => {
    console.log(value);
    const { goToCustomLocation, customLocation } = this.props;
    const { page, length: _, ...search } = customLocation.search;
    if (fromMount && page) search.page = page;
    if (options.has(value)) search.length = value;
    goToCustomLocation({ ...customLocation, search }, fromMount);
  };

  render() {
    const { length } = this.props.customLocation.search;
    return (
      <div className={f('column')} style={{ display: 'block' }}>
        <label>
          <input
            type="radio"
            name="protein-length"
            onChange={this._handleChange}
            value="all"
            checked={!options.has(length)}
          />
          all
        </label>
        {Array.from(options.entries()).map(([option, label]) => (
          <label key={option}>
            <input
              type="radio"
              name="protein-length"
              value={option}
              onChange={this._handleChange}
              checked={length === option}
            />
            {label}
          </label>
        ))}
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation,
  customLocation => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(LengthFilter);
