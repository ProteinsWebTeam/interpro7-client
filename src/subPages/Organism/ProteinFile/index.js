import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import ProgressButton from 'components/ProgressButton';
import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import classnames from 'classnames/bind';

import styles from './style.css';

const s = classnames.bind(styles);

const getWorker = () =>
  import('webWorkers/proteinFile').then(Worker => new Worker());

const getDownloadName = createSelector(
  props => props.entryDescription.accession,
  props => props.taxId,
  props => props.type,
  (accession, taxId, type) =>
    `${accession}-${taxId}.${type === 'FASTA' ? 'fasta' : 'txt'}`,
);

const getTitle = type => {
  switch (type) {
    case 'FASTA':
      return 'FASTA file';
    case 'protein-accession':
      return 'Protein accessions';
    case 'entry-accession':
      return 'Entry accessions';
    default:
      throw new Error(`“${type}” is not a supported type`);
  }
};

class ProteinFile extends PureComponent {
  static propTypes = {
    entryDescription: T.object.isRequired,
    api: T.object.isRequired,
    taxId: T.string.isRequired,
    type: T.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      downloading: false,
      failed: false,
      success: false,
      progress: 0,
    };
  }

  // Do some clean-up
  componentWillUnmount() {
    if (this.state.href) {
      // Revoke the URL to the generated blob, so that it can be GC'ed
      URL.revokeObjectURL(this.state.href);
    }
    if (this._worker) {
      // Unhook event listener to this component's worker
      this._worker.removeEventListener('message', this._workerMessage);
      // Kill the worker
      if ('terminate' in this._worker) this._worker.terminate();
    }
  }

  _handleClick = e => {
    if (this.state.downloading || this.state.success || this.state.failed) {
      return;
    }
    e.preventDefault();
    this.setState({ downloading: true });
    getWorker().then(worker => {
      this._worker = worker;
      this._worker.addEventListener('message', this._workerMessage);
      const { entryDescription, api, taxId, type } = this.props;
      this._worker.postMessage({ entryDescription, api, taxId, type });
    });
  };

  _workerMessage = ({ data: { type, details } }) => {
    switch (type) {
      case 'progress':
        if (Number.isFinite(details) && details <= 1 && details >= 0) {
          this.setState({ progress: details });
        } else {
          console.warn(`'${String(details)}' is not a valid progress value`);
        }
        return;
      case 'failed':
        console.error(details);
        this.setState({ failed: true });
        return;
      case 'success':
        this.setState({
          downloading: false,
          success: true,
          progress: 1,
          href: details,
        });
        return;
      default:
        console.warn(`'${type}' is not a valid message type`);
    }
  };

  render() {
    const {
      taxId,
      entryDescription: { accession: entryAccession },
      type,
    } = this.props;
    const { downloading, success, failed, progress, href } = this.state;
    let title = getTitle(type);
    if (entryAccession) {
      title += ` for ${entryAccession}`;
    }
    title += ` for tax ID ${taxId}`;
    return (
      <Tooltip title={title}>
        <Link
          download={getDownloadName(this.props)}
          href={href}
          disabled={downloading}
          className={s('link', { downloading, failed })}
          target="_blank"
          onClick={this._handleClick}
        >
          <ProgressButton
            downloading={downloading}
            success={success}
            failed={failed}
            progress={progress}
          />
        </Link>
      </Tooltip>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.api,
  state => state.customLocation.description.entry,
  (api, entryDescription) => ({ api, entryDescription }),
);

export default connect(mapStateToProps)(ProteinFile);
