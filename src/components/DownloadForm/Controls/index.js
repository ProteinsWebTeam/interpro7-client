import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import ProgressButton from 'components/ProgressButton';
import { NumberComponent } from 'components/NumberLabel';

import { downloadURL, downloadDelete } from 'actions/creators';

import blockEvent from 'utils/block-event';
import { toPlural } from 'utils/pages';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

export const HARD_LIMIT = 50000;
export const SOFT_LIMIT = 10000;

export class Controls extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
    url: T.string.isRequired,
    fileType: T.string.isRequired,
    subset: T.bool.isRequired,
    entityType: T.string.isRequired,
    download: T.shape({
      progress: T.number,
      successful: T.bool,
      blobURL: T.string,
    }).isRequired,
    downloadURL: T.func.isRequired,
    downloadDelete: T.func.isRequired,
  };

  _handleGenerateClick = blockEvent(() =>
    this.props.downloadURL(
      this.props.url,
      this.props.fileType,
      this.props.subset,
    ),
  );

  _handleCancelClick = blockEvent(() =>
    this.props.downloadDelete(
      this.props.url,
      this.props.fileType,
      this.props.subset,
    ),
  );

  render() {
    const {
      data,
      fileType,
      entityType,
      download: { progress, successful, blobURL },
    } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    const count = (data.payload && data.payload.count) || 0;
    return (
      <React.Fragment>
        {count > SOFT_LIMIT && (
          <div
            className={f('callout', count > HARD_LIMIT ? 'alert' : 'warning')}
          >
            We expect this file to contain{' '}
            <NumberComponent value={count} abbr /> distinct{' '}
            {toPlural(entityType)}.{' '}
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
      </React.Fragment>
    );
  }
}

export default connect(
  undefined,
  { downloadURL, downloadDelete },
)(Controls);
