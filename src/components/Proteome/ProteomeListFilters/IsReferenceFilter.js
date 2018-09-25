import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import NumberLabel from 'components/NumberLabel';
import Loading from 'components/SimpleCommonComponents/Loading';

import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';
import { customLocationSelector } from 'reducers/custom-location';

import { foundationPartial } from 'styles/foundation';

import style from 'components/FiltersPanel/style.css';

const f = foundationPartial(style);

const labels = new Map([
  ['true', 'Reference Proteomes'],
  ['false', 'Non-reference Proteomes'],
  ['both', 'All Proteomes'],
]);

class IsReferenceFilter extends PureComponent {
  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.any,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
  };

  _handleSelection = ({ target: { value } }) => {
    const { goToCustomLocation, customLocation } = this.props;
    const { page, proteome_is_reference: _, ...search } = customLocation.search;
    if (labels.has(value) && (value === 'true' || value === 'false')) {
      search.is_reference = value;
    } else if (search.has('is_reference')) {
      delete search.is_reference;
    }
    goToCustomLocation({ ...customLocation, search });
  };

  render() {
    const {
      data: { loading, payload },
      customLocation: { search },
    } = this.props;

    const isReference =
      loading || !payload ? {} : payload.proteome_is_reference;
    if (!loading) {
      isReference.both = isReference.true + isReference.false;
    }

    const selectedValue = search.is_reference || 'both';
    console.log(`Selected value ${selectedValue}`);
    return (
      <div className={f('list-proteome-is-reference')}>
        {Object.entries(isReference).map(([key, value]) => (
          <div key={key} className={f('column')}>
            <label className={f('row', 'filter-button')}>
              <input
                type="radio"
                name="proteome_is_reference_filter"
                value={key}
                checked={selectedValue === key}
                onChange={this._handleSelection}
                style={{ margin: '0.25em' }}
              />
              <span>{labels.get(key)}</span>
              <NumberLabel
                value={value}
                loading={loading}
                className={f('filter-label')}
                abbr
              />
            </label>
          </div>
        ))}
      </div>
    );
  }
}

const getUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    // transform description
    const _description = {
      ...description,
      proteome: { db: 'UniProt' },
    };
    // omit from search
    const { search: _, is_reference: __, ..._search } = search;
    // add to search
    _search.group_by = 'proteome_is_reference';
    // build URL
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(_description),
      query: _search,
    });
  },
);

const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default loadData({
  getUrl,
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(IsReferenceFilter);
