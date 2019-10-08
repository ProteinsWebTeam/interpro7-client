import React, { useRef, useEffect } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import ClipboardJS from 'clipboard';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { addToast } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, fonts);
const TTL = 1000;

const CopyToClipboard = ({ textToCopy, tooltipText, addToast }) => {
  const button = useRef(null);
  let _clipboard = null;
  useEffect(() => {
    _clipboard = new ClipboardJS(button.current, {
      text: () => textToCopy,
    });
    _clipboard.on('success', () =>
      addToast(
        {
          title: 'Copy successful',
          ttl: TTL,
        },
        'clipboard',
      ),
    );
  });
  return (
    <button type="button" ref={button}>
      <Tooltip title={tooltipText}>
        {' '}
        <span
          className={f('icon', 'icon-common', 'ico-neutral')}
          data-icon="&#xf0c5;"
          aria-label={tooltipText}
        />
      </Tooltip>
    </button>
  );
};
CopyToClipboard.propTypes = {
  textToCopy: T.string,
  tooltipText: T.string,
  addToast: T.func,
};
export default connect(
  undefined,
  { addToast },
)(CopyToClipboard);
