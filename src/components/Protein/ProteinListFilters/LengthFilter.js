// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// $FlowFixMe
import { goToCustomLocation } from 'actions/creators';
// $FlowFixMe
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles);

const options = new Map([
  ['1-100', 'small (1-100 AA)'],
  ['101-1000', 'medium (101-1,000 AA)'],
  ['1001-100000', 'long (1,001-100,000 AA)'],
]);

/*:: type Props = {
  goToCustomLocation: function,
  customLocation: {
    description: Object,
    search: Object
  }
}; */
class LengthFilter extends PureComponent /*:: <Props> */ {
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
    const { goToCustomLocation, customLocation } = this.props;
    const { page, length: _, ...search } = customLocation.search;
    if (fromMount && page) search.page = page;
    if (options.has(value)) search.length = value;
    goToCustomLocation({ ...customLocation, search }, fromMount);
  };

  render() {
    const { length } = this.props.customLocation.search;
    return (
      <div className={f('column', 'list-length')} style={{ display: 'block' }}>
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
  customLocationSelector,
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(LengthFilter);
