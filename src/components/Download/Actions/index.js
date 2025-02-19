// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';
// $FlowFixMe
import { downloadDelete } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import { toPublicAPI } from 'utils/url';

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
      <div id="dassd" style={{ whiteSpace: 'nowrap' }}>
        <Link
          buttonType="hollow"
          href={blobURL}
          download={fileName}
          disabled={!blobURL}
          aria-label="Download results"
          style={{ color: 'var(--colors-light-txt)' }}
        >
          <span
            className={f('icon', 'icon-common', 'icon-download')}
            data-icon="&#xf019;"
          />{' '}
          Download
        </Link>
        <Link
          buttonType="hollow"
          href={toPublicAPI(localID.split('|')[0])}
          aria-label="Browsable API"
          style={{ color: 'var(--colors-light-txt)' }}
        >
          <span
            className={f('icon', 'icon-common', 'icon-code')}
            data-icon="&#xf121;"
          />{' '}
          API
        </Link>
        <Button
          type="hollow"
          icon="icon-trash"
          textColor="var(--colors-light-txt)"
          onClick={this._handleDelete}
          aria-label="Delete results"
        >
          <span>Delete</span>
        </Button>
      </div>
    );
  }
}

export default connect(undefined, { downloadDelete })(Actions);
