import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import { updateJobStatus } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(fonts, local);

const TITLE = 'Manually refresh job information';

class RefreshButton extends PureComponent {
  static propTypes = {
    updateJobStatus: T.func.isRequired,
  };

  _handleClick = () => {
    if (!this._icon) return;
    if (this._icon.animate) {
      this._icon.animate(
        { transform: ['rotate(0)', 'rotate(360deg)'] },
        { duration: 1000, iterations: 3 },
      );
    }
    this.props.updateJobStatus();
  };

  render() {
    return (
      <button
        className={f('button')}
        aria-label={TITLE}
        onClick={this._handleClick}
      >
        <Tooltip title={TITLE}>
          <span
            className={f('icon', 'icon-functional')}
            data-icon="R"
            ref={node => (this._icon = node)}
          />
        </Tooltip>
      </button>
    );
  }
}

export default connect(undefined, { updateJobStatus })(RefreshButton);
