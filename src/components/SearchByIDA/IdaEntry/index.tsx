import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Select, { CSSObjectWithLabel } from 'react-select';

import getFetch from 'higherOrder/loadData/getFetch';
import { format } from 'url';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';

import cssBinder from 'styles/cssBinder';
import local from '../style.css';
import { DebouncedFunc, debounce } from 'lodash-es';

const css = cssBinder(local);

export const DEBOUNCE_RATE = 300;

const fetchFun = getFetch({ method: 'GET', responseType: 'JSON' });

const getUrlForAutocomplete = (
  { protocol, hostname, port, root }: ParsedURLServer,
  entryDB: string,
  search: string,
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

type Props = {
  entry: string;
  draggable?: boolean;
  changeEntryHandler: (value: string) => void;
  removeEntryHandler: (event: React.FormEvent) => void;
  handleMoveMarker?: (delta: number | null) => void;
  handleMoveEntry?: (delta: number) => void;
  mergeResults: (
    data: RequestedData<PayloadList<{ metadata: EntryMetadata }>>,
  ) => void;
  options: Record<string, { accession: string; name: string }>;
  api: ParsedURLServer;
};
type State = {
  draggable: boolean;
  loadingPfamOptions: boolean;
  loadingInterProOptions: boolean;
};

class IdaEntry extends PureComponent<Props, State> {
  container: React.RefObject<HTMLDivElement>;
  startPos: number;
  currentWidth: number;
  debouncedFetchOptions: DebouncedFunc<(value: string) => void>;

  constructor(props: Props) {
    super(props);
    this.container = React.createRef();
    this.startPos = 0;
    this.currentWidth = 1;
    this.debouncedFetchOptions = debounce(this.fetchOptions, DEBOUNCE_RATE);
  }
  state = {
    draggable: false,
    loadingPfamOptions: false,
    loadingInterProOptions: false,
  };
  componentDidMount() {
    if (this.props.entry) this._handleOnChange(this.props.entry);
  }

  _handleOnChange = (rawValue: unknown) => {
    const value =
      (rawValue as { value: string })?.value || (rawValue as string);
    if (!value) return;
    this.props.changeEntryHandler(value);
  };

  _handleOnInputChange = (rawValue: { value: string } | string) => {
    const value =
      (rawValue as { value: string })?.value || (rawValue as string);
    if (!value) return;
    this.debouncedFetchOptions(value);
  };

  fetchOptions = (value: string) => {
    this.setState({
      loadingPfamOptions: true,
      loadingInterProOptions: true,
    });
    fetchFun(getUrlForAutocomplete(this.props.api, 'interpro', value)).then(
      (data) => {
        this.props.mergeResults(
          data as unknown as RequestedData<
            PayloadList<{ metadata: EntryMetadata }>
          >,
        );
        this.setState({
          loadingInterProOptions: false,
        });
      },
    );

    fetchFun(getUrlForAutocomplete(this.props.api, 'pfam', value)).then(
      (data) => {
        this.props.mergeResults(
          data as unknown as RequestedData<
            PayloadList<{ metadata: EntryMetadata }>
          >,
        );
        this.setState({
          loadingPfamOptions: false,
        });
      },
    );
  };

  _getDeltaFromDragging = (event: React.DragEvent) => {
    let delta = Math.floor(
      (event.pageX - (this.startPos || 0)) / this.currentWidth,
    );
    if (delta <= 0) delta++;
    return delta;
  };
  _handleStartDragging = (event: React.DragEvent) => {
    this.currentWidth = this.container?.current?.offsetWidth || 1;
    this.startPos = event.pageX;
  };
  _handleDragging = (event: React.DragEvent) => {
    this.props.handleMoveMarker?.(this._getDeltaFromDragging(event));
  };
  _handleEndDragging = (event: React.DragEvent) => {
    let delta = this._getDeltaFromDragging(event);
    this.props.handleMoveMarker?.(null);
    if (delta > 0) delta--;
    if (delta !== 0) {
      this.props.handleMoveEntry?.(delta);
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
    const style: Record<string, { background?: string }> = options[
      this.props.entry
    ]
      ? {
          background: getTrackColor(
            { accession: this.props.entry, source_database: '' },
            EntryColorMode.ACCESSION,
          ),
        }
      : {};
    return (
      <div
        className={css('ida-entry')}
        draggable={this.state.draggable}
        onDragStart={this._handleStartDragging}
        onDragEnd={this._handleEndDragging}
        onDragCapture={this._handleDragging}
        ref={this.container}
        style={style}
      >
        <Select
          options={Object.values(options).map(({ accession, name }) => ({
            value: accession,
            label: name,
          }))}
          isLoading={
            this.state.loadingInterProOptions || this.state.loadingPfamOptions
          }
          onInputChange={this._handleOnInputChange}
          onChange={this._handleOnChange}
          className={css('react-select-container')}
          value={{
            value: entry,
            label: options?.[entry]?.name,
          }}
          styles={{
            menuList: (provided: CSSObjectWithLabel) =>
              ({
                ...provided,
                background: 'white',
              }) as CSSObjectWithLabel,
            menu: (provided: CSSObjectWithLabel) =>
              ({
                ...provided,
                top: undefined,
                width: 'var(--entry-width)',
                marginTop: 0,
              }) as CSSObjectWithLabel,
            control: (provided: CSSObjectWithLabel) =>
              ({
                ...provided,
                background: 'transparent',
                border: 0,
                boxShadow: undefined,
              }) as CSSObjectWithLabel,
            input: (provided: CSSObjectWithLabel) =>
              ({
                ...provided,
                color: 'white',
              }) as CSSObjectWithLabel,
          }}
          formatOptionLabel={({ value, label }, { context }) => {
            return (
              <div
                style={{
                  color: context === 'menu' ? 'black' : 'white',
                  cursor: context === 'menu' ? 'pointer' : 'text',
                }}
                className={css('react-select-labels')}
                key={value}
              >
                <div className={css('react-select-label-header')}>{value}</div>
                {label && (
                  <div className={css('react-select-label-body')}>{label}</div>
                )}
              </div>
            );
          }}
        />
        {draggable && (
          <button
            className={css('drag', { nodata: !options[entry] })}
            onMouseEnter={() => this.setState({ draggable: true })}
            onMouseLeave={() => this.setState({ draggable: false })}
          >
            |||
          </button>
        )}
        <button className={css('close')} onClick={removeEntryHandler}>
          ✖
        </button>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.api,
  (api) => ({ api }),
);
export default connect(mapStateToProps)(IdaEntry);
