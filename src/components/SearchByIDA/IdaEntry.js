// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

// $FlowFixMe
import Select from 'react-select';
import getFetch from 'higherOrder/loadData/getFetch';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import { foundationPartial } from 'styles/foundation';
import local from './style.css';

const f = foundationPartial(local);

const fetchFun = getFetch({ method: 'GET', responseType: 'JSON' });

const getUrlForAutocomplete = (
  { protocol, hostname, port, root },
  entryDB,
  search,
) => {
  const description = {
    main: { key: 'entry' },
    entry: { db: entryDB },
  };
  return format({
    protocol,
    hostname,
    port,
    pathname: root + descriptionToPath(description),
    query: { search },
  });
};

/*:: type Props = {
  entry: string,
  draggable: boolean,
  changeEntryHandler: function,
  removeEntryHandler: function,
  handleMoveMarker: function,
  handleMoveEntry: function,
  mergeResults: function,
  options: {},
  api: {
    protocol: string,
    hostname: string,
    port: number,
    root: string,
  },
}; */
/*:: type State = {
  draggable: boolean,
}; */
/*:: type DataType = {
  ok: bool,
  payload: Object,
}; */
class IdaEntry extends PureComponent /*:: <Props, State> */ {
  /*:: container: { current: null | React$ElementRef<'div'> }; */
  /*:: startPos: number; */
  /*:: currentWidth: number; */
  static propTypes = {
    entry: T.string,
    changeEntryHandler: T.func,
    removeEntryHandler: T.func,
    handleMoveMarker: T.func,
    handleMoveEntry: T.func,
    mergeResults: T.func,
    api: T.object,
    draggable: T.bool,
    options: T.object,
  };
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.startPos = 0;
    this.currentWidth = 1;
  }
  state = {
    draggable: false,
  };
  componentDidMount() {
    if (this.props.entry) this._handleOnChange(this.props.entry);
  }

  _handleOnChange = (rawValue /*: {value: string}|string */) => {
    const value = rawValue?.value || rawValue;
    if (!value) return;
    this.props.changeEntryHandler(value);
    fetchFun(getUrlForAutocomplete(this.props.api, 'interpro', value)).then((
      data /*: DataType */,
    ) => {
      this.props.mergeResults(data);
    });

    fetchFun(getUrlForAutocomplete(this.props.api, 'pfam', value)).then((
      data /*: DataType */,
    ) => {
      this.props.mergeResults(data);
    });
  };

  _getDeltaFromDragging = (event) => {
    let delta = Math.floor(
      (event.pageX - (this.startPos || 0)) / this.currentWidth,
    );
    if (delta <= 0) delta++;
    return delta;
  };
  _handleStartDragging = (event) => {
    this.currentWidth = this.container?.current?.offsetWidth || 1;
    this.startPos = event.pageX;
  };
  _handleDragging = (event) => {
    this.props.handleMoveMarker(this._getDeltaFromDragging(event));
  };
  _handleEndDragging = (event) => {
    let delta = this._getDeltaFromDragging(event);
    this.props.handleMoveMarker(null);
    if (delta > 0) delta--;
    if (delta !== 0) {
      this.props.handleMoveEntry(delta);
    }
    this.currentWidth = 1;
    this.startPos = 0;
  };
  render() {
    const {
      entry,
      removeEntryHandler,
      draggable = false,
      options = {},
    } = this.props;
    const style = options[this.props.entry]
      ? {
          background: getTrackColor(
            { accession: this.props.entry, source_database: '' },
            EntryColorMode.ACCESSION,
          ),
        }
      : {};
    return (
      <div
        className={f('ida-entry')}
        draggable={this.state.draggable}
        onDragStart={this._handleStartDragging}
        onDragEnd={this._handleEndDragging}
        onDragCapture={this._handleDragging}
        ref={this.container}
        style={style}
      >
        <Select
          options={
            // prettier-ignore
            (Object.values(options) /*: any */)
            .map((
              { accession, name } /*: { accession: string, name: string } */,
            ) => ({
              value: accession,
              label: name,
            }))
          }
          onInputChange={this._handleOnChange}
          onChange={this._handleOnChange}
          className={f('react-select-container')}
          value={{
            value: entry,
            label: options?.[entry]?.name,
          }}
          styles={{
            menuList: (provided) => ({
              ...provided,
              background: 'white',
            }),
            menu: (provided) => ({
              ...provided,
              top: null,
              width: 'var(--entry-width)',
              marginTop: 0,
            }),
            control: (provided) => ({
              ...provided,
              background: 'transparent',
              border: 0,
              boxShadow: null,
            }),
            input: (provided) => ({
              ...provided,
              color: 'white',
            }),
          }}
          formatOptionLabel={({ value, label }, { context }) => {
            return (
              <div
                style={{
                  color: context === 'menu' ? 'black' : 'white',
                  cursor: context === 'menu' ? 'pointer' : 'text',
                }}
                className={f('react-select-labels')}
                key={value}
              >
                <div className={f('react-select-label-header')}>{value}</div>
                {label && (
                  <div className={f('react-select-label-body')}>{label}</div>
                )}
              </div>
            );
          }}
        />
        {draggable && (
          <button
            className={f('drag', { nodata: !options[entry] })}
            onMouseEnter={() => this.setState({ draggable: true })}
            onMouseLeave={() => this.setState({ draggable: false })}
          >
            |||
          </button>
        )}
        <button className={f('close')} onClick={removeEntryHandler}>
          ✖
        </button>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.settings.api,
  (api) => ({ api }),
);
export default connect(mapStateToProps)(IdaEntry);
