// @flow
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

/*:: type Props = {
  localID: string,
  blobURL: string,
  downloadDelete: function
};*/

class Actions extends PureComponent /*:: <Props> */ {
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

    // Attempts to remove the host and the port
    const matches = localID.match(/.+:\d+\/(.+)$/);

    /**
     * Replaces slashes by underscores,
     * and pipe by period (so the file has a correct extension)
     */
    const fileName = (matches === null ? localID : matches[1])
      .replace(/[\/?]+/g, '_')
      .replace(/\|(.+)$/, '.$1');

    return (
      <div>
        <Tooltip title="Download job">
          <Link
            className={f('icon', 'icon-common', 'ico-neutral')}
            href={blobURL}
            download={fileName}
            disabled={!blobURL}
            aria-label="Download job"
            data-icon="&#x3d;"
            style={{ fontSize: '160%', border: 'none' }}
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
