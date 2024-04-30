// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

import { downloadDelete } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import buttonCSS from 'components/SimpleCommonComponents/Button/style.css';

const f = foundationPartial(fonts, ipro, local, buttonCSS);

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
      <div id="dassd" style={{ whiteSpace: 'nowrap' }}>
        <Tooltip title="Download job">
          <Link
            className={f(
              'vf-button',
              'vf-button--hollow',
              'vf-button--sm',
              'icon',
              'icon-common',
              'ico-neutral',
              'icon-download',
            )}
            href={blobURL}
            download={fileName}
            disabled={!blobURL}
            aria-label="Download job"
            style={{ color: 'var(--colors-light-txt)' }}
          />
        </Tooltip>
        <Tooltip title="Delete job">
          <Button
            type="hollow"
            icon="icon-trash"
            textColor="var(--colors-light-txt)"
            className={f('margin-left-large')}
            onClick={this._handleDelete}
            aria-label="Delete job"
          />
        </Tooltip>
      </div>
    );
  }
}

export default connect(undefined, { downloadDelete })(Actions);
