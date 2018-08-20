import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import ProgressButton from 'components/ProgressButton';
import { NumberComponent } from 'components/NumberLabel';

import { downloadSelector } from 'reducers/download';
import { downloadURL } from 'actions/creators';

import blockEvent from 'utils/block-event';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

const HARD_LIMIT = 50000;
const SOFT_LIMIT = 10000;

export class UnconnectedControls extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
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
    const { data, fileType, progress, successful, blobURL } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    const count = (data.payload && data.payload.count) || 0;
    return (
      <React.Fragment>
        {count > SOFT_LIMIT && (
          <div
            className={f('callout', count > HARD_LIMIT ? 'alert' : 'warning')}
          >
            We expect this file to contain{' '}
            <NumberComponent value={count} abbr /> items.{' '}
            {count > HARD_LIMIT
              ? 'This file will be too large to generate within your browser'
              : 'If you encounter any problems generating this file'}
            , please check the “Code snippet” section of this page for
            alternative suggestions.
          </div>
        )}
        <div className={f('container')}>
          <button
            type="button"
            className={f('button', 'hollow', { warning: count > SOFT_LIMIT })}
            onClick={this._handleGenerateClick}
            disabled={progress || count > HARD_LIMIT}
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
            className={f('button', 'hollow', { warning: count >= SOFT_LIMIT })}
            disabled={!successful || count > HARD_LIMIT}
            href={blobURL}
            download={`export.${fileType === 'accession' ? 'txt' : fileType}`}
          >
            Download
          </Link>
        </div>
      </React.Fragment>
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
