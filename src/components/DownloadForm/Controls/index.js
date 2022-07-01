// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import ProgressButton from 'components/ProgressButton';
import NumberComponent from 'components/NumberComponent';

import { downloadURL, downloadDelete } from 'actions/creators';

import { askNotificationPermission } from 'utils/browser-notifications';
import blockEvent from 'utils/block-event';
import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

export const HARD_LIMIT = 50000;
export const SOFT_LIMIT = 10000;

/*:: type Props = {
  url: string,
  fileType: string,
  subset: boolean,
  entityType: string,
  download: {
    progress: number,
    successful: boolean,
    blobURL: string,
    version: number,
  },
  downloadURL: function,
  downloadDelete: function,
  isStale?: boolean,
  count: number,
  interProVersion: number,
  noData: boolean
};*/

export class Controls extends PureComponent /*:: <Props> */ {
  static propTypes = {
    url: T.string.isRequired,
    fileType: T.string,
    subset: T.bool.isRequired,
    entityType: T.string.isRequired,
    download: T.shape({
      progress: T.number,
      successful: T.bool,
      blobURL: T.string,
      version: T.string,
    }).isRequired,
    downloadURL: T.func.isRequired,
    downloadDelete: T.func.isRequired,
    isStale: T.bool,
    count: T.number.isRequired,
    interProVersion: T.number.isRequired,
    noData: T.bool.isRequired,
  };

  _handleGenerateClick = blockEvent(() => {
    // Request browser notification
    askNotificationPermission();

    this.props.downloadURL(
      this.props.url,
      this.props.fileType,
      this.props.subset,
      this.props.entityType,
    );
  });

  _handleCancelClick = blockEvent(() =>
    this.props.downloadDelete(
      this.props.url,
      this.props.fileType,
      this.props.subset,
      this.props.entityType,
    ),
  );

  render() {
    const {
      fileType,
      entityType,
      download: { progress, successful, blobURL, version },
      count,
      noData,
      isStale,
      interProVersion,
    } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    return (
      <>
        {count > SOFT_LIMIT && !isStale && (
          <div
            className={f('callout', count > HARD_LIMIT ? 'alert' : 'warning')}
          >
            We expect this file to contain{' '}
            <NumberComponent abbr>{count}</NumberComponent> distinct{' '}
            {toPlural(entityType)}.{' '}
            {count > HARD_LIMIT
              ? 'This file will be too large to generate within your browser'
              : 'If you encounter any problems during the creation of this file'}
            , please check the “Code snippet” section of this page for to see
            how to download the data directly onto your computer.
          </div>
        )}
        {count < HARD_LIMIT ? (
          <div className={f('text')}>
            Please generate the file in order to download it.
          </div>
        ) : null}
        {interProVersion > version && (
          <div className={f('callout', 'alert', 'withicon')}>
            <h5>The existing download is outdated.</h5>
            <p>
              It was obtained using InterPro version <i>{version}</i>, while the
              current version is <i>{interProVersion}</i>. You need to remove
              the existing file before re-generating the download.
            </p>
            <p>
              <Link
                className={f('button', 'hollow')}
                onClick={this._handleCancelClick}
              >
                Remove the current download
              </Link>
            </p>
          </div>
        )}
        <div className={f('container')}>
          <button
            type="button"
            className={f('button', 'hollow', { warning: count > SOFT_LIMIT })}
            onClick={this._handleGenerateClick}
            disabled={progress || count > HARD_LIMIT || isStale || noData}
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
          {downloading && (
            <button
              type="button"
              className={f('button', 'hollow')}
              onClick={this._handleCancelClick}
            >
              Cancel
            </button>
          )}
        </div>
      </>
    );
  }
}

export default connect(undefined, { downloadURL, downloadDelete })(Controls);
