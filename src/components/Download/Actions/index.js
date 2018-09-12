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
            className={f('button', 'secondary', 'icon', 'icon-common')}
            href={blobURL}
            download={localID}
            disabled={!blobURL}
            aria-label="Download job"
            data-icon="&#x3d;"
            style={{ fontSize: '160%', border: 'none', color: 'white' }}
          />
        </Tooltip>
        <Tooltip title="Delete job">
          <button
            style={{ fontSize: '120%' }}
            className={f(
              'icon',
              'icon-common',
              'ico-neutral',
              'margin-left-large',
            )}
            onClick={this._handleDelete}
            data-icon="&#xf1f8;"
            aria-label="Delete job"
          />
        </Tooltip>
      </div>
    );
  }
}

export default connect(
  undefined,
  { downloadDelete },
)(Actions);
