// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Autocomplete from 'react-autocomplete';
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
  position: number,
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
    position: T.number,
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
    // options: {},
    draggable: false,
  };
  componentDidMount() {
    if (this.props.entry) this._handleOnChange(null, this.props.entry);
  }
  _handleOnChange = (_evt, value) => {
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

  _getDeltaFromDragging = event => {
    let delta = Math.floor(
      (event.pageX - (this.startPos || 0)) / this.currentWidth,
    );
    if (delta <= 0) delta++;
    return delta;
  };
  _handleStartDragging = event => {
    this.currentWidth = this.container?.current?.offsetWidth || 1;
    this.startPos = event.pageX;
  };
  _handleDragging = event => {
    this.props.handleMoveMarker(this._getDeltaFromDragging(event));
  };
  _handleEndDragging = event => {
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
      changeEntryHandler,
      removeEntryHandler,
      position,
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
        <Autocomplete
          inputProps={{ id: 'entries-autocomplete' }}
          getItemValue={item => item.accession}
          items={Object.values(options)}
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
          onChange={this._handleOnChange}
          onSelect={val => changeEntryHandler(val)}
          shouldItemRender={({ accession, name }, value) =>
            accession.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
            name.toLowerCase().indexOf(value.toLowerCase()) !== -1
          }
          renderInput={props => (
            <>
              <input
                {...props}
                id={props.id + position}
                placeholder={'Search entry'}
              />
              {options[props.value] && (
                <label
                  htmlFor={props.id + position}
                  className={f('entry-name')}
                >
                  {options[props.value].name}
                </label>
              )}
            </>
          )}
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
  state => state.settings.api,
  api => ({ api }),
);
export default connect(mapStateToProps)(IdaEntry);
