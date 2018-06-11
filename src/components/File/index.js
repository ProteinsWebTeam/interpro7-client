import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import ProgressButton from 'components/ProgressButton';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { downloadSelector } from 'reducers/download';
import { downloadURL } from 'actions/creators';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import blockEvent from 'utils/block-event';

import classnames from 'classnames/bind';

import styles from './style.css';

const s = classnames.bind(styles);

class Button extends PureComponent {
  static propTypes = {
    fileType: T.oneOf(['accession', 'FASTA']).isRequired,
    url: T.string.isRequired,
    name: T.string,
    progress: T.number,
    successful: T.bool,
    blobURL: T.string,
    handleClick: T.func.isRequired,
  };

  render() {
    const {
      fileType,
      url,
      name,
      progress,
      successful,
      blobURL,
      handleClick,
    } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    const failed = successful === false;
    let title = '';
    if (downloading) {
      title += 'Generating';
    } else if (failed) {
      title += 'Failed generating';
    } else if (successful) {
      title += 'Download';
    } else {
      title += 'Generate';
    }
    title += ` ${fileType} file`;
    const filename =
      name || `${fileType}.${fileType === 'accession' ? 'txt' : 'fasta'}`;
    return (
      <Tooltip title={title}>
        <Link
          download={filename}
          href={blobURL || url}
          disabled={downloading}
          className={s('link', { downloading, failed })}
          target="_blank"
          onClick={downloading || successful ? undefined : handleClick}
          data-url={url}
          data-type={fileType}
        >
          <ProgressButton
            downloading={downloading}
            success={successful}
            failed={failed}
            progress={progress || 0}
          />
        </Link>
      </Tooltip>
    );
  }
}

const mapStateToPropFor = (url, fileType) =>
  createSelector(downloadSelector, downloads => {
    const key = `${url}|${fileType}`;
    return downloads[key] || {};
  });

class File extends PureComponent {
  static propTypes = {
    api: T.object.isRequired,
    entryDescription: T.object.isRequired,
    downloadURL: T.func.isRequired,
    fileType: T.oneOf(['accession', 'FASTA']),
    name: T.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      url: null,
      fileType: null,
      ConnectedButton: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const url = format({
      ...nextProps.api,
      pathname:
        nextProps.api.root +
        descriptionToPath(nextProps.customLocationDescription),
    });
    if (prevState.url === url && prevState.fileType === nextProps.fileType)
      return null;
    return {
      url,
      fileType: nextProps.fileType,
      ConnectedButton: connect(mapStateToPropFor(url, nextProps.fileType))(
        Button,
      ),
    };
  }

  _handleClick = blockEvent(() =>
    this.props.downloadURL(this.state.url, this.props.fileType),
  );

  render() {
    const { ConnectedButton, url } = this.state;
    const { fileType, name } = this.props;
    return (
      <ConnectedButton
        fileType={fileType}
        url={url}
        name={name}
        handleClick={this._handleClick}
      />
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.entry,
  (api, entryDescription) => ({ api, entryDescription }),
);

export default connect(
  mapStateToProps,
  { downloadURL },
)(File);
