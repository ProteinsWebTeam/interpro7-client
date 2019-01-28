import React, { PureComponent } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Autocomplete from 'react-autocomplete';
import getFetch from 'higherOrder/loadData/getFetch';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { foundationPartial } from 'styles/foundation';
import local from './style.css';

const f = foundationPartial(local);

const fetchFun = getFetch({ method: 'GET', responseType: 'JSON' });

const getUrlForAutocomplete = ({ protocol, hostname, port, root }, search) => {
  const description = {
    main: { key: 'entry' },
    entry: { db: 'interpro' },
  };
  return format({
    protocol,
    hostname,
    port,
    pathname: root + descriptionToPath(description),
    query: { search },
  });
};

class IdaEntry extends PureComponent {
  state = {
    options: {},
  };
  _handleOnChenge = (evt, value) => {
    this.props.changeEntryHandler(value);
    fetchFun(getUrlForAutocomplete(this.props.api, evt.target.value)).then(
      data => {
        if (!data || !data.ok) return;
        const options = { ...this.state.options };
        for (const e of data.payload.results) {
          options[e.metadata.accession] = e.metadata;
        }
        this.setState({ options });
      },
    );
  };
  render() {
    const {
      entry,
      active,
      changeEntryHandler,
      removeEntryHandler,
    } = this.props;
    return (
      <div className={f('ida-entry')}>
        <Autocomplete
          inputProps={{ id: 'entries-autocomplete' }}
          getItemValue={item => item.accession}
          items={Object.values(this.state.options)}
          renderItem={(item, isHighlighted) => (
            <div
              style={{ background: isHighlighted ? 'lightgray' : 'white' }}
              key={item.accession}
            >
              <div style={{ fontWeight: 'bold' }}>{item.accession}</div>
              <div style={{ fontSize: '0.7em', marginTop: '-0.5em' }}>
                {item.name}
              </div>
            </div>
          )}
          value={entry}
          onChange={this._handleOnChenge}
          onSelect={val => changeEntryHandler(val)}
          shouldItemRender={({ accession, name }, value) =>
            accession.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
            name.toLowerCase().indexOf(value.toLowerCase()) !== -1
          }
        />
        <button onClick={removeEntryHandler}> X </button>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.api,
  api => ({ api }),
);
export default connect(mapStateToProps)(IdaEntry);
