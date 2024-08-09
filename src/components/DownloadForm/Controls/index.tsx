import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';
import Callout from 'components/SimpleCommonComponents/Callout';
import { Button } from 'components/SimpleCommonComponents/Button';

import { downloadURL, downloadDelete } from 'actions/creators';

import { askNotificationPermission } from 'utils/browser-notifications';
import blockEvent from 'utils/block-event';
import { toPlural } from 'utils/pages/toPlural';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';

const css = cssBinder(styles);

export const HARD_LIMIT = 50000;
export const SOFT_LIMIT = 10000;

type Props = {
  url: string;
  fileType: DownloadFileTypes;
  subset: boolean;
  entityType: string;
  download?: DownloadProgress;
  downloadURL?: typeof downloadURL;
  downloadDelete?: typeof downloadDelete;
  isStale?: boolean;
  count: number;
  interProVersion: number;
  noData: boolean;
};

export class Controls extends PureComponent<Props> {
  _handleGenerateClick = blockEvent(() => {
    // Request browser notification
    askNotificationPermission();

    this.props.downloadURL?.(
      this.props.url,
      this.props.fileType,
      this.props.subset,
      this.props.entityType,
    );
  });

  _handleCancelClick = blockEvent(
    () =>
      this.props.downloadDelete?.(
        this.props.url,
        this.props.fileType,
        this.props.subset,
      ),
  );

  render() {
    const {
      fileType,
      entityType,
      download,
      count,
      noData,
      isStale,
      interProVersion,
    } = this.props;
    if (!download) return null;
    const { progress, successful, blobURL, version } = download;
    const downloading = Number.isFinite(progress) && !successful;
    return (
      <>
        {count > SOFT_LIMIT && !isStale && (
          <Callout type={count > HARD_LIMIT ? 'alert' : 'warning'}>
            We expect this file to contain{' '}
            <NumberComponent abbr>{count}</NumberComponent> distinct{' '}
            {toPlural(entityType)}.{' '}
            {count > HARD_LIMIT
              ? 'This file will be too large to generate within your browser'
              : 'If you encounter any problems during the creation of this file'}
            , please check the “Code snippet” section of this page for to see
            how to download the data directly onto your computer.
          </Callout>
        )}
        {count < HARD_LIMIT ? (
          <div className={css('text')}>
            Please generate the file in order to download it.
          </div>
        ) : null}
        {interProVersion > version && (
          <Callout type="alert">
            <h5>The existing download is outdated.</h5>
            <p>
              It was obtained using InterPro version <i>{version}</i>, while the
              current version is <i>{interProVersion}</i>. You need to remove
              the existing file before re-generating the download.
            </p>
            <p>
              <Link
                className={css('button', 'hollow')}
                onClick={this._handleCancelClick}
              >
                Remove the current download
              </Link>
            </p>
          </Callout>
        )}
        <div className={css('container')}>
          <Button
            onClick={this._handleGenerateClick}
            disabled={!!progress || count > HARD_LIMIT || isStale || noData}
            backgroundColor={count > SOFT_LIMIT ? 'white' : undefined}
            borderColor={count > SOFT_LIMIT ? 'orange' : undefined}
            textColor={count > SOFT_LIMIT ? 'orange' : undefined}
          >
            Generate
          </Button>
          <Link
            className={css({
              warning: count >= SOFT_LIMIT,
            })}
            buttonType="primary"
            disabled={!successful || count > HARD_LIMIT}
            href={blobURL}
            download={`export.${fileType === 'accession' ? 'txt' : fileType}`}
          >
            Download
          </Link>
          {downloading && (
            <Button type="tertiary" onClick={this._handleCancelClick}>
              Cancel
            </Button>
          )}
        </div>
      </>
    );
  }
}

export default connect(undefined, { downloadURL, downloadDelete })(Controls);
