// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { format } from 'url';

import ProgressButton from 'components/ProgressButton';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { askNotificationPermission } from 'utils/browser-notifications';
import { downloadSelector } from 'reducers/download';
import { downloadURL } from 'actions/creators';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import blockEvent from 'utils/block-event';

import { foundationPartial } from 'styles/foundation';

import { HARD_LIMIT } from 'components/DownloadForm/Controls';

import styles from './style.css';

const f = foundationPartial(styles);

const SMALL = 0.01;

const extensions = {
  accession: 'txt',
  fasta: 'fasta',
  json: 'json',
};

const TooltipContent = (
  {
    shouldLinkToResults,
    title,
    count,
    subpath,
    fileType,
  } /*: {shouldLinkToResults: boolean, title: string, count: number, subpath?: string, fileType: string} */,
) => {
  return count === 0 ? (
    <div>
      <p className={f('tooltip-paragraph')}>
        <span>No data available</span>
      </p>
    </div>
  ) : (
    <div>
      <p className={f('tooltip-paragraph')}>
        <span>{title}</span>
      </p>
      {shouldLinkToResults && (
        <p className={f('tooltip-paragraph')}>
          <Link
            to={{
              description: {
                main: { key: 'result' },
                result: { type: 'download' },
              },
              hash: `${subpath || ''}|${fileType}`,
            }}
            className={f('button', 'hollow', 'in-popup')}
          >
            See more download options
          </Link>
        </p>
      )}
    </div>
  );
};
TooltipContent.propTypes = {
  shouldLinkToResults: T.bool,
  title: T.string,
  count: T.number,
  subpath: T.string,
  fileType: T.string,
};
/*:: type ButtonProps = {
  fileType: string,
  url: string,
  subpath?: string,
  count: number,
  name: string,
  progress: number,
  successful: boolean,
  blobURL: string,
  label?: string,
  className?: string,
  handleClick: function,
  shouldLinkToResults: boolean,
}; */

export class FileButton extends PureComponent /*:: <ButtonProps> */ {
  static propTypes = {
    fileType: T.oneOf(['accession', 'fasta', 'json', 'tsv']).isRequired,
    url: T.string.isRequired,
    subpath: T.string,
    count: T.number,
    name: T.string,
    progress: T.number,
    successful: T.bool,
    blobURL: T.string,
    label: T.string,
    className: T.string,
    handleClick: T.func.isRequired,
    shouldLinkToResults: T.bool,
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
      label,
      className,
      shouldLinkToResults = true,
    } = this.props;
    const downloading = Number.isFinite(progress) && !successful;
    const failed = successful === false;
    let stateLabel = '';
    let title = '';
    if (count > HARD_LIMIT) {
      title += 'Direct download disabled for this';
      stateLabel = 'Disabled';
    } else if (downloading) {
      title += 'Generating';
      stateLabel = 'Generating';
    } else if (failed) {
      title += 'Failed generating';
      stateLabel = 'Failed';
    } else if (successful) {
      title += 'Download';
      stateLabel = 'Download';
    } else {
      title += 'Click icon to generate';
      stateLabel = 'Generate';
    }
    title += ` ${fileType} file`;
    const labelToShow = label || stateLabel;

    // if (count === 0) {
    //   title = 'No data available to download';
    // }
    const filename = name || `${fileType}.${extensions[fileType]}`;
    return (
      <Tooltip
        interactive
        useContext
        html={
          <TooltipContent
            title={title}
            count={count}
            shouldLinkToResults={shouldLinkToResults}
            subpath={subpath}
            fileType={fileType}
          />
        }
      >
        <div>
          {/* there to have tooltip go higher than the button */}
          <Link
            download={filename}
            href={blobURL || url}
            disabled={downloading || count > HARD_LIMIT || count === 0}
            className={f('button', 'hollow', className, {
              downloading,
              failed,
            })}
            onClick={downloading || successful ? undefined : handleClick}
            data-url={url}
            data-type={fileType}
          >
            <ProgressButton
              downloading={downloading}
              success={successful}
              failed={failed}
              progress={progress || SMALL}
            />
            {labelToShow && (
              <span className={f('file-label')}>{labelToShow}</span>
            )}
          </Link>
        </div>
      </Tooltip>
    );
  }
}

const mapStateToPropsFor = (url, fileType, subset) =>
  createSelector(
    downloadSelector,
    (downloads) =>
      downloads[
        [url, fileType, subset && 'subset'].filter(Boolean).join('|')
      ] || {},
  );

/*:: type Props = {
 api: Object,
 entryDescription: Object,
 customLocationDescription?: Object,
 downloadURL: function,
 fileType: string,
 count: number,
 subset?: boolean,
 name: string,
 search?: Object,
 endpoint?: ?string,
}; */

/*:: type State = {
 url: ?string,
 fileType: ?string,
 subset: ?boolean,
 ConnectedButton: Object,
 subpath: ?string
}; */

export class File extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    api: T.object.isRequired,
    entryDescription: T.object.isRequired,
    customLocationDescription: T.object,
    downloadURL: T.func.isRequired,
    fileType: T.oneOf(['accession', 'fasta', 'json', 'tsv']),
    count: T.number,
    subset: T.bool,
    name: T.string,
    search: T.object,
    endpoint: T.string,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {
      url: null,
      fileType: null,
      subset: null,
      ConnectedButton: null,
      subpath: null,
    };
  }

  static getDerivedStateFromProps(
    nextProps /*: Props */,
    prevState /*: State */,
  ) {
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
        mapStateToPropsFor(url, nextProps.fileType, nextProps.subset),
      )(FileButton),
    };
  }

  _handleClick = blockEvent(() => {
    // Request browser notification
    askNotificationPermission();

    this.props.downloadURL(
      this.state.url,
      this.props.fileType,
      this.props.subset,
      this.props.endpoint,
    );
  });

  render() {
    const { ConnectedButton, url, subpath } = this.state;
    const { fileType, name, count } = this.props;
    return (
      <ConnectedButton
        {...this.props}
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
  (state) => state.settings.api,
  (state) => state.customLocation.description.entry,
  (api, entryDescription) => ({ api, entryDescription }),
);

export default connect(mapStateToProps, { downloadURL })(File);
