import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
// $FlowFixMe
import Button from 'components/SimpleCommonComponents/Button';

import { updateJobStatus } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css'; /* needed for custom button color*/

const f = foundationPartial(interproTheme, fonts, local, ipro);

const TITLE = 'Manually refresh job information';

/*:: type Props = {
  updateJobStatus: function
}; */

export class RefreshButton extends PureComponent /*:: <Props> */ {
  /* ::
    _ref: { current: null | React$ElementRef<'span'> };
  */
  static propTypes = {
    updateJobStatus: T.func.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this._ref = React.createRef();
  }

  _handleClick = () => {
    if (!this._ref.current) return;
    if (this._ref.current.animate) {
      this._ref.current.animate(
        { transform: ['rotate(0)', 'rotate(360deg)'] },
        { duration: 500, iterations: 2 },
      );
    }
    this.props.updateJobStatus();
  };

  render() {
    return (
      <Button aria-label={TITLE} onClick={this._handleClick}>
        <Tooltip title={TITLE}>
          <span
            className={f('icon', 'icon-common')}
            data-icon="&#xf2f9;"
            ref={this._ref}
          />
        </Tooltip>
      </Button>
    );
  }
}

export default connect(undefined, { updateJobStatus })(RefreshButton);
