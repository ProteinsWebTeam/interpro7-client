import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { downloadDelete } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(fonts, ipro, local);

class Actions extends PureComponent {
  static propTypes = {
    localID: T.string.isRequired,
    blobURL: T.string,
    downloadDelete: T.func.isRequired,
  };

  _handleDelete = () => {
    const { localID, downloadDelete } = this.props;
    const [url, fileType] = localID.split('|');
    downloadDelete(url, fileType);
  };

  render() {
    const { localID, blobURL } = this.props;
    return (
      <div>
        <Tooltip title="Download job">
          <Link
            className={f('button', 'secondary')}
            href={blobURL}
            download={localID}
            disabled={!blobURL}
            aria-label="Download job"
          >
            ⬇
          </Link>
        </Tooltip>
        <Tooltip title="Delete job">
          <button
            className={f('button', 'alert')}
            type="button"
            onClick={this._handleDelete}
            aria-label="Delete job"
          >
            ✖
          </button>
        </Tooltip>
      </div>
    );
  }
}

export default connect(
  undefined,
  { downloadDelete },
)(Actions);
