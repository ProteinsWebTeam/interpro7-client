import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import ProgressButton from 'components/ProgressButton';

import { downloadSelector } from 'reducers/download';
import { downloadURL } from 'actions/creators';

import blockEvent from 'utils/block-event';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

export class UnconnectedControls extends PureComponent {
  static propTypes = {
    url: T.string.isRequired,
    fileType: T.string.isRequired,
    progress: T.number,
    successful: T.bool,
    blobURL: T.string,
    downloadURL: T.func.isRequired,
  };

  _handleGenerateClick = blockEvent(() =>
    this.props.downloadURL(this.props.url, this.props.fileType),
  );

  render() {
    const { fileType, progress, successful, blobURL } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    return (
      <div className={f('container')}>
        <button
          type="button"
          className={f('button', 'hollow')}
          onClick={this._handleGenerateClick}
          disabled={progress}
        >
          Generate
        </button>
        <ProgressButton
          downloading={downloading}
          success={successful}
          failed={successful === false}
          progress={progress || 0}
        />
        <Link
          type="button"
          className={f('button', 'hollow')}
          disabled={!successful}
          href={blobURL}
          download={`export.${fileType === 'accession' ? 'txt' : fileType}`}
        >
          Download
        </Link>
      </div>
    );
  }
}

const mapStateToPropsFor = (url, fileType) =>
  createSelector(
    downloadSelector,
    downloads => downloads[`${url}|${fileType}`] || {},
  );

export default class Controls extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      url: null,
      fileType: null,
      ConnectedControls: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.url === prevState.url &&
      nextProps.fileType === prevState.fileType
    ) {
      return null;
    }

    return {
      url: nextProps.url,
      fileType: nextProps.fileType,
      ConnectedControls: connect(
        mapStateToPropsFor(nextProps.url, nextProps.fileType),
        { downloadURL },
      )(UnconnectedControls),
    };
  }

  render() {
    const { ConnectedControls } = this.state;
    return <ConnectedControls {...this.props} />;
  }
}
