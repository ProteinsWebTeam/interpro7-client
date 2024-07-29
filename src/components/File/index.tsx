import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import { askNotificationPermission } from 'utils/browser-notifications';
import { downloadSelector } from 'reducers/download';
import { downloadURL } from 'actions/creators';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import blockEvent from 'utils/block-event';

import FileButton, { SupportedExtensions } from './FileButton';

const mapStateToPropsFor = (url: string, fileType: string, subset: boolean) =>
  createSelector(
    downloadSelector,
    (downloads) =>
      downloads[
        [url, fileType, subset && 'subset'].filter(Boolean).join('|')
      ] || {},
  );

type Props = {
  api: ParsedURLServer;
  entryDescription: Object;
  customLocationDescription?: Object;
  downloadURL: typeof downloadURL;
  fileType: SupportedExtensions;
  count: number;
  subset?: boolean;
  name: string;
  search?: Record<string, string>;
  endpoint?: string;
  className?: string;
  minWidth?: number | string;
  label?: string;
  showIcon?: boolean;
};

type State = {
  url: string | null;
  fileType: string | null;
  subset: boolean | null;
  ConnectedButton: typeof FileButton | null;
  subpath: string | null;
};

export class File extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      url: null,
      fileType: null,
      subset: null,
      ConnectedButton: null,
      subpath: null,
    };
  }

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const subpath = descriptionToPath(nextProps.customLocationDescription);
    const url = format({
      ...nextProps.api,
      pathname: nextProps.api.root + subpath,
      query: nextProps.search,
    });
    if (
      prevState.url === url &&
      prevState.fileType === nextProps.fileType &&
      prevState.subset === nextProps.subset
    ) {
      return null;
    }

    return {
      url,
      subpath,
      fileType: nextProps.fileType,
      subset: nextProps.subset,
      ConnectedButton: connect(
        mapStateToPropsFor(url, nextProps.fileType, !!nextProps.subset),
      )(FileButton),
    };
  }

  _handleClick = blockEvent(() => {
    if (!this.state.url || !this.props.endpoint) return;
    // Request browser notification
    askNotificationPermission();

    this.props.downloadURL(
      this.state.url,
      this.props.fileType,
      !!this.props.subset,
      this.props.endpoint,
    );
  });

  render() {
    const { ConnectedButton, url, subpath } = this.state;
    const { fileType, name, count } = this.props;
    return ConnectedButton ? (
      <ConnectedButton
        {...this.props}
        fileType={fileType}
        url={url || ''}
        subpath={subpath || ''}
        name={name}
        handleClick={this._handleClick}
        count={count}
      />
    ) : null;
  }
}

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description.entry,
  (api: ParsedURLServer, entryDescription) => ({ api, entryDescription }),
);

export default connect(mapStateToProps, { downloadURL })(File);
