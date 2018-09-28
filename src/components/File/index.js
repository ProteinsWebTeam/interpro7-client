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

import { foundationPartial } from 'styles/foundation';

import { HARD_LIMIT } from 'components/DownloadForm/Controls';

import styles from './style.css';

const f = foundationPartial(styles);

class Button extends PureComponent {
  static propTypes = {
    fileType: T.oneOf(['accession', 'fasta']).isRequired,
    url: T.string.isRequired,
    subpath: T.string.isRequired,
    count: T.number,
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
      subpath,
      count,
      name,
      progress,
      successful,
      blobURL,
      handleClick,
    } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    const failed = successful === false;
    let title = '';
    if (count > HARD_LIMIT) {
      title += 'Direct download disabled for this';
    } else if (downloading) {
      title += 'Generating';
    } else if (failed) {
      title += 'Failed generating';
    } else if (successful) {
      title += 'Download';
    } else {
      title += 'Click icon to generate';
    }
    title += ` ${fileType} file`;
    const filename =
      name || `${fileType}.${fileType === 'accession' ? 'txt' : 'fasta'}`;
    return (
      <Tooltip
        interactive
        useContext
        html={
          <div>
            <p className={f('tooltip-paragraph')}>
              <span>{title}</span>
            </p>
            <p className={f('tooltip-paragraph')}>
              <Link
                to={{
                  description: {
                    main: { key: 'job' },
                    job: { type: 'download' },
                  },
                  hash: `${subpath}|${fileType}`,
                }}
                className={f('button', 'hollow')}
              >
                See more download options
              </Link>
            </p>
          </div>
        }
      >
        <div>
          {/* there to have tooltip go higher than the button */}
          <Link
            download={filename}
            href={blobURL || url}
            disabled={downloading || count > HARD_LIMIT}
            className={f('link', { downloading, failed })}
            target="_blank"
            onClick={downloading || successful ? undefined : handleClick}
            data-url={url}
            data-type={fileType}
          >
            <ProgressButton
              downloading={downloading}
              success={successful}
              failed={failed}
              progress={progress || 0.01}
            />
          </Link>
        </div>
      </Tooltip>
    );
  }
}

const mapStateToPropsFor = (url, fileType, subset) =>
  createSelector(
    downloadSelector,
    downloads =>
      downloads[
        [url, fileType, subset && 'subset'].filter(Boolean).join('|')
      ] || {},
  );

class File extends PureComponent {
  static propTypes = {
    api: T.object.isRequired,
    entryDescription: T.object.isRequired,
    downloadURL: T.func.isRequired,
    fileType: T.oneOf(['accession', 'fasta']),
    count: T.number,
    subset: T.bool,
    name: T.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      url: null,
      fileType: null,
      subset: null,
      ConnectedButton: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const subpath = descriptionToPath(nextProps.customLocationDescription);
    const url = format({
      ...nextProps.api,
      pathname: nextProps.api.root + subpath,
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
        mapStateToPropsFor(url, nextProps.fileType, nextProps.subset),
      )(Button),
    };
  }

  _handleClick = blockEvent(() =>
    this.props.downloadURL(
      this.state.url,
      this.props.fileType,
      this.props.subset,
    ),
  );

  render() {
    const { ConnectedButton, url, subpath } = this.state;
    const { fileType, name, count } = this.props;
    return (
      <ConnectedButton
        fileType={fileType}
        url={url}
        subpath={subpath}
        name={name}
        handleClick={this._handleClick}
        count={count}
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
